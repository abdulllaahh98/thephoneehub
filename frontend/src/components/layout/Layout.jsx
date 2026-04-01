import React, { useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import useAuthStore from '../../store/useAuthStore';
import useCartStore from '../../store/useCartStore';

const Layout = ({ children }) => {
    const { isAuthenticated } = useAuthStore();
    const { fetchCart } = useCartStore();

    // Re-hydrate cart from server on every page load/refresh
    useEffect(() => {
        if (isAuthenticated) {
            fetchCart();
        }
    }, [isAuthenticated]);

    return (
        <div className="flex flex-col min-h-screen font-sans">
            <Navbar />
            <main className="flex-grow bg-gray-50">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
