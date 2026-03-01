import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
    baseURL: (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/v1').replace(/\/$/, '') + '/',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

// Helper: read token from persisted Zustand store in localStorage
function getStoredToken() {
    try {
        const raw = localStorage.getItem('thephonehub-auth');
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        return parsed?.state?.token || null;
    } catch {
        return null;
    }
}

// Helper: clear persisted auth state and redirect only if on a protected page
function clearAuthAndMaybeRedirect() {
    try {
        const raw = localStorage.getItem('thephonehub-auth');
        if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed?.state) {
                parsed.state.token = null;
                parsed.state.user = null;
                parsed.state.isAuthenticated = false;
                localStorage.setItem('thephonehub-auth', JSON.stringify(parsed));
            }
        }
    } catch { /* ignore */ }

    const protectedPaths = ['/account', '/checkout', '/orders'];
    const isAdmin = window.location.pathname.startsWith('/admin');
    const isProtected = protectedPaths.some(p => window.location.pathname.startsWith(p));

    if (isAdmin || isProtected) {
        window.location.href = '/login';
    }
}

// Helper: update token in persisted store after refresh
function updateStoredToken(newToken) {
    try {
        const raw = localStorage.getItem('thephonehub-auth');
        if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed?.state) {
                parsed.state.token = newToken;
                localStorage.setItem('thephonehub-auth', JSON.stringify(parsed));
            }
        }
    } catch { /* ignore */ }
}

// ------- Request interceptor: attach JWT token -------
api.interceptors.request.use(
    (config) => {
        const token = getStoredToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ------- Response interceptor: silent refresh + error toasts -------
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Handle 401 Unauthorized (expired token)
        if (error.response?.status === 401 && !originalRequest._retry) {
            // If the refresh call itself failed, just logout
            if (originalRequest.url?.includes('auth/refresh')) {
                clearAuthAndMaybeRedirect();
                return Promise.reject(error);
            }

            originalRequest._retry = true;
            try {
                const response = await api.post('auth/refresh');
                const { access_token } = response.data.data;

                // Persist new token
                updateStoredToken(access_token);

                // Retry the original request with the new token
                originalRequest.headers.Authorization = `Bearer ${access_token}`;
                return api(originalRequest);
            } catch (refreshError) {
                // Refresh failed → clear auth, redirect only if protected
                clearAuthAndMaybeRedirect();
                return Promise.reject(refreshError);
            }
        }

        // Toast errors for non-401 responses
        if (error.response) {
            const message =
                error.response.data?.message ||
                error.response.data?.error ||
                'Something went wrong';
            if (error.response.status !== 401) {
                toast.error(message);
            }
        } else if (!axios.isCancel(error)) {
            toast.error('Network Error: Please check your connection.');
        }

        return Promise.reject(error);
    }
);

export default api;
