import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,

            setAuth: (user, token) => set({
                user,
                token,
                isAuthenticated: !!user
            }),

            logout: () => {
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false
                });
                // Clear any other auth-related items if necessary
            },

            updateUser: (userData) => set((state) => ({
                user: state.user ? { ...state.user, ...userData } : null
            })),
        }),
        {
            name: 'thephonehub-auth',
        }
    )
);

export default useAuthStore;
