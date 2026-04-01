import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-[#1A3A5C] text-white pt-12 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-1">
<<<<<<< HEAD
                        <Link to="/" className="text-2xl font-bold">ThePhoneHub.in</Link>
                        <p className="mt-4 text-gray-300 text-sm">
                            Your trusted destination for certified refurbished smartphones. Quality you can trust, prices you'll love.
=======
                        <Link to="/" className="text-2xl font-bold">PhoneHubX</Link>
                        <p className="mt-4 text-gray-400 text-sm leading-relaxed">
                            Your trusted destination for certified refurbished smartphones. Quality tested, warranty backed, and planet friendly.
>>>>>>> a45f52b (payment-integrated)
                        </p>
                    </div>

                    <div>
<<<<<<< HEAD
                        <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-gray-300 text-sm">
                            <li><Link to="/products" className="hover:text-orange transition-colors">Shop Catalog</Link></li>
                            <li><Link to="/about" className="hover:text-orange transition-colors">Our Story</Link></li>
                            <li><Link to="/contact" className="hover:text-orange transition-colors">Contact Us</Link></li>
                            <li><Link to="/orders" className="hover:text-orange transition-colors">My Orders</Link></li>
                            <li><Link to="/track-order" className="hover:text-orange transition-colors">Track Order</Link></li>
=======
                        <h4 className="font-bold uppercase tracking-widest text-xs mb-6">Quick Links</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li><Link to="/products" className="hover:text-white transition-colors">All Smartphones</Link></li>
                            <li><Link to="/about" className="hover:text-white transition-colors">Our Story</Link></li>
                            <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                            <li><Link to="/track-order" className="hover:text-white transition-colors">Track Order</Link></li>
>>>>>>> a45f52b (payment-integrated)
                        </ul>
                    </div>

                    <div>
<<<<<<< HEAD
                        <h3 className="text-lg font-semibold mb-4">Support</h3>
                        <ul className="space-y-2 text-gray-300 text-sm">
                            <li><Link to="/support#faq" className="hover:text-orange transition-colors">FAQs</Link></li>
                            <li><Link to="/support#privacy" className="hover:text-orange transition-colors">Privacy Policy</Link></li>
                            <li><Link to="/support#terms" className="hover:text-orange transition-colors">Terms of Service</Link></li>
                            <li><Link to="/support#shipping" className="hover:text-orange transition-colors">Shipping Policy</Link></li>
                            <li><Link to="/support#returns" className="hover:text-orange transition-colors">Return & Refund</Link></li>
=======
                        <h4 className="font-bold uppercase tracking-widest text-xs mb-6">Support</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li><Link to="/support#faq" className="hover:text-white transition-colors">FAQs</Link></li>
                            <li><Link to="/support#warranty" className="hover:text-white transition-colors">Warranty Policy</Link></li>
                            <li><Link to="/support#shipping" className="hover:text-white transition-colors">Shipping Info</Link></li>
                            <li><Link to="/support#privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
>>>>>>> a45f52b (payment-integrated)
                        </ul>
                    </div>

                    <div>
<<<<<<< HEAD
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
=======
                        <h4 className="font-bold uppercase tracking-widest text-xs mb-6">Connect</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li>
                                Email: support@phonehubx.com<br />
                                Tel: +91 98765 43210
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="mt-16 pt-8 border-t border-white/5 text-center text-xs text-gray-500 font-medium uppercase tracking-widest">
                    <p>© 2026 PhoneHubX. All rights reserved.</p>
>>>>>>> a45f52b (payment-integrated)
                </div>
            </div>
        </footer>
    );
};

export default Footer;
