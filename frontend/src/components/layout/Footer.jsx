import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-[#1A3A5C] text-white pt-12 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-1">
                        <Link to="/" className="text-2xl font-bold">ThePhoneHub.in</Link>
                        <p className="mt-4 text-gray-300 text-sm">
                            Your trusted destination for certified refurbished smartphones. Quality you can trust, prices you'll love.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-gray-300 text-sm">
                            <li><Link to="/products" className="hover:text-orange transition-colors">Shop Catalog</Link></li>
                            <li><Link to="/about" className="hover:text-orange transition-colors">Our Story</Link></li>
                            <li><Link to="/contact" className="hover:text-orange transition-colors">Contact Us</Link></li>
                            <li><Link to="/orders" className="hover:text-orange transition-colors">My Orders</Link></li>
                            <li><Link to="/track-order" className="hover:text-orange transition-colors">Track Order</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4">Support</h3>
                        <ul className="space-y-2 text-gray-300 text-sm">
                            <li><Link to="/support#faq" className="hover:text-orange transition-colors">FAQs</Link></li>
                            <li><Link to="/support#privacy" className="hover:text-orange transition-colors">Privacy Policy</Link></li>
                            <li><Link to="/support#terms" className="hover:text-orange transition-colors">Terms of Service</Link></li>
                            <li><Link to="/support#shipping" className="hover:text-orange transition-colors">Shipping Policy</Link></li>
                            <li><Link to="/support#returns" className="hover:text-orange transition-colors">Return & Refund</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
                        <p className="text-gray-300 text-sm">
                            Email: support@thephonehub.in<br />
                            Phone: +91 12345 67890<br />
                            Address: Mumbai, India
                        </p>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-700 text-center text-gray-400 text-sm">
                    <p>© 2026 ThePhoneHub.in. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
