import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
    baseURL: (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/v1').replace(/\/$/, '') + '/',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

<<<<<<< HEAD
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
=======
import useAuthStore from '../store/useAuthStore';

// Helper: read token from persisted Zustand store in localStorage
function getStoredToken() {
    return useAuthStore.getState().token;
>>>>>>> a45f52b (payment-integrated)
}

// Helper: clear persisted auth state and redirect only if on a protected page
function clearAuthAndMaybeRedirect() {
<<<<<<< HEAD
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
=======
    // Use the store's logout to ensure in-memory state and localStorage are synced
    useAuthStore.getState().logout();

    const protectedPaths = ['/account', '/checkout', '/orders'];
    const currentPath = window.location.pathname;
    const isAdmin = currentPath.startsWith('/admin');
    const isProtected = protectedPaths.some(p => currentPath.startsWith(p));

    // Only redirect if we are not already on the login page and we are on a protected route
    if ((isAdmin || isProtected) && currentPath !== '/login') {
>>>>>>> a45f52b (payment-integrated)
        window.location.href = '/login';
    }
}

// Helper: update token in persisted store after refresh
function updateStoredToken(newToken) {
<<<<<<< HEAD
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
=======
    const user = useAuthStore.getState().user;
    useAuthStore.getState().setAuth(user, newToken);
>>>>>>> a45f52b (payment-integrated)
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
<<<<<<< HEAD
=======
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

>>>>>>> a45f52b (payment-integrated)
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Handle 401 Unauthorized (expired token)
        if (error.response?.status === 401 && !originalRequest._retry) {
<<<<<<< HEAD
=======
            if (isRefreshing) {
                return new Promise(function (resolve, reject) {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return api(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

>>>>>>> a45f52b (payment-integrated)
            // If the refresh call itself failed, just logout
            if (originalRequest.url?.includes('auth/refresh')) {
                clearAuthAndMaybeRedirect();
                return Promise.reject(error);
            }

            originalRequest._retry = true;
<<<<<<< HEAD
=======
            isRefreshing = true;

>>>>>>> a45f52b (payment-integrated)
            try {
                const response = await api.post('auth/refresh');
                const { access_token } = response.data.data;

                // Persist new token
                updateStoredToken(access_token);
<<<<<<< HEAD
=======
                processQueue(null, access_token);
>>>>>>> a45f52b (payment-integrated)

                // Retry the original request with the new token
                originalRequest.headers.Authorization = `Bearer ${access_token}`;
                return api(originalRequest);
            } catch (refreshError) {
<<<<<<< HEAD
                // Refresh failed → clear auth, redirect only if protected
                clearAuthAndMaybeRedirect();
                return Promise.reject(refreshError);
=======
                processQueue(refreshError, null);
                clearAuthAndMaybeRedirect();
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
>>>>>>> a45f52b (payment-integrated)
            }
        }

        // Toast errors for non-401 responses
        if (error.response) {
<<<<<<< HEAD
            const message =
                error.response.data?.message ||
                error.response.data?.error ||
                'Something went wrong';
=======
            const data = error.response.data;
            let message = data?.message || data?.error || 'Something went wrong';

            // If there are validation errors, pick the first one
            if (data?.errors) {
                message = typeof data.errors === 'string'
                    ? data.errors
                    : Object.values(data.errors).flat()[0];
            }

>>>>>>> a45f52b (payment-integrated)
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
