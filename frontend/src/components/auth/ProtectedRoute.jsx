import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';

const ProtectedRoute = ({ children, roleRequired }) => {
    const location = useLocation();
    const { isAuthenticated, user } = useAuthStore();

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (roleRequired) {
        const isAdminRoute = roleRequired === 'admin';
        const hasAccess = isAdminRoute
            ? (user?.role === 'admin' || user?.role === 'superadmin')
            : user?.role === roleRequired;

        if (!hasAccess) {
            return <Navigate to="/" replace />;
        }
    }

    return children;
};

export default ProtectedRoute;
