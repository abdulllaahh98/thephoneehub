import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Search } from 'lucide-react';
import useCartStore from '../../store/useCartStore';
import useAuthStore from '../../store/useAuthStore';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const items = useCartStore((state) => state.items);
    const { isAuthenticated, user, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleSearch = (e) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
            setIsMenuOpen(false);
        }
    };

    return (
        <nav className="sticky top-0 z-50 bg-[#1A3A5C] text-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/" className="text-xl md:text-2xl font-bold text-white tracking-tight">
                            Phone<span className="text-[#E84118]">HubX</span>
                        </Link>
                    </div>

                    {/* Desktop Search Bar */}
                    <div className="hidden md:flex flex-1 justify-center px-8">
                        <div className="relative w-full max-w-lg">
                            <input
                                type="text"
                                placeholder="Search for smartphones..."
                                className="w-full bg-[#2A4A6C] text-white px-4 py-2 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E84118]"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleSearch}
                            />
                            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="hidden md:flex items-center space-x-6">
                        {isAuthenticated ? (
                            <div className="relative group">
                                <Link to="/account" className="flex items-center hover:text-[#E84118] transition-colors">
                                    <div className="w-8 h-8 rounded-full bg-orange flex items-center justify-center text-xs font-bold mr-2">
                                        {user?.name?.charAt(0) || 'U'}
                                    </div>
                                    <span className="max-w-[100px] truncate">{user?.name || 'Account'}</span>
                                </Link>
                                <div className="absolute right-0 top-full w-48 pt-2 hidden group-hover:block z-50">
                                    <div className="bg-white rounded-xl shadow-xl border border-gray-100 py-2 overflow-hidden">
                                        <Link to="/account" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-bold uppercase tracking-widest">Profile</Link>
                                        <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-bold uppercase tracking-widest">Orders</Link>
                                        {(user?.role === 'admin' || user?.role === 'superadmin') && (
                                            <Link to="/admin" className="block px-4 py-2 text-sm text-orange hover:bg-gray-50 font-bold uppercase tracking-widest border-t border-gray-50 underline decoration-orange decoration-2 underline-offset-4">Admin Panel</Link>
                                        )}
                                        <button
                                            onClick={logout}
                                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 font-bold uppercase tracking-widest border-t border-gray-50"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link to="/login" className="text-sm font-bold uppercase tracking-widest hover:text-orange transition-colors">Sign In</Link>
                                <Link to="/register" className="bg-orange text-white px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-widest hover:scale-105 transition-all">Sign Up</Link>
                            </div>
                        )}
                        <Link to="/cart" className="relative flex items-center hover:text-[#E84118] transition-colors">
                            <ShoppingCart className="h-6 w-6" />
                            {items.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-[#E84118] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                    {items.length}
                                </span>
                            )}
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 rounded-md hover:bg-[#2A4A6C] focus:outline-none"
                        >
                            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-[#1A3A5C] border-t border-[#2A4A6C] pb-4">
                    <div className="px-4 py-3">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-full bg-[#2A4A6C] text-white px-4 py-2 pl-10 rounded-lg focus:outline-none"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        </div>
                    </div>
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        {isAuthenticated ? (
                            <>
                                <div className="px-3 py-2 text-xs font-black text-gray-400 border-b border-[#2A4A6C] mb-2 uppercase tracking-widest">Welcome, {user?.name}</div>
                                <Link
                                    to="/account"
                                    className="block px-3 py-2 rounded-md text-base font-medium hover:bg-[#2A4A6C]"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    My Profile
                                </Link>
                                <Link
                                    to="/orders"
                                    className="block px-3 py-2 rounded-md text-base font-medium hover:bg-[#2A4A6C]"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    My Orders
                                </Link>
                                <button
                                    onClick={() => { logout(); setIsMenuOpen(false); }}
                                    className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-400 hover:bg-[#2A4A6C]"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <div className="grid grid-cols-2 gap-4 p-2">
                                <Link
                                    to="/account"
                                    className="text-center py-3 rounded-xl border border-white/20 text-sm font-black uppercase tracking-widest hover:bg-white/10"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/account"
                                    className="text-center py-3 rounded-xl bg-orange text-sm font-black uppercase tracking-widest hover:bg-orange/90"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                        <Link
                            to="/cart"
                            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-[#2A4A6C]"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Cart ({items.length})
                        </Link>
                        <Link
                            to="/products"
                            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-[#2A4A6C]"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            All Products
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
