import React from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const EmptyCart = () => {
    return (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 py-16 px-6 text-center max-w-2xl mx-auto my-12">
            <div className="bg-orange/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce transition-all duration-1000">
                <ShoppingBag className="h-10 w-10 text-orange" />
            </div>

            <h2 className="text-3xl font-black text-gray-900 mb-4 uppercase tracking-tighter">Your cart is empty</h2>
            <p className="text-gray-500 font-bold mb-10 max-w-sm mx-auto leading-relaxed">
                It looks like you haven't added any products to your cart yet. Browse our collection of certified refurbished smartphones!
            </p>

            <Link
                to="/products"
                className="inline-flex items-center bg-navy text-white px-10 py-4 rounded-xl font-black uppercase tracking-widest hover:bg-[#244A6C] shadow-lg shadow-navy/20 active:scale-95 transition-all group"
            >
                Start Shopping
                <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
        </div>
    );
};

export default EmptyCart;
