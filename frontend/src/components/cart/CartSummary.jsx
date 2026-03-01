import React, { useState } from 'react';
import { Tag, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import useCartStore from '../../store/useCartStore';

const CartSummary = ({ items, currentTotal }) => {
    const { appliedCoupon, setCoupon, clearCoupon } = useCartStore();
    const [couponCode, setCouponCode] = useState(appliedCoupon?.code || '');
    const [couponMsg, setCouponMsg] = useState({ text: '', type: '' });
    const [couponLoading, setCouponLoading] = useState(false);

    const discount = appliedCoupon?.discount_amount || 0;

    const subtotal = currentTotal;
    const shipping = 0; // Free shipping
    const gst = Math.round(subtotal * 0.18);
    const grandTotal = subtotal + gst - discount;

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) return;
        setCouponLoading(true);
        setCouponMsg({ text: '', type: '' });
        try {
            const response = await api.post('auth/coupons/validate', {
                code: couponCode.trim(),
                cart_subtotal: subtotal,
            });
            const result = response.data.data;
            const amount = result?.discount_amount || 0;
            setCoupon({ code: couponCode.trim(), discount_amount: amount });
            setCouponMsg({ text: response.data.message || `Saved ₹${amount}!`, type: 'success' });
        } catch (error) {
            setCouponMsg({ text: error.response?.data?.message || 'Invalid coupon code.', type: 'error' });
            clearCoupon();
        } finally {
            setCouponLoading(false);
        }
    };

    const handleRemoveCoupon = () => {
        clearCoupon();
        setCouponCode('');
        setCouponMsg({ text: '', type: '' });
    };

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8 space-y-6 sticky top-24">
                <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight pb-4 border-b border-gray-100">Order Summary</h2>

                <div className="space-y-3">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Apply Promo Code</label>
                    {appliedCoupon ? (
                        <div className="flex items-center justify-between bg-green-50 border border-green-200 px-4 py-3 rounded-xl">
                            <span className="text-sm font-black text-green-700 uppercase tracking-widest">{appliedCoupon.code} Applied ✓</span>
                            <button onClick={handleRemoveCoupon} className="text-xs font-black text-red-400 hover:text-red-600 uppercase">Remove</button>
                        </div>
                    ) : (
                        <div className="flex gap-2">
                            <div className="relative flex-grow">
                                <input
                                    type="text"
                                    placeholder="PROMO2026"
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange/50 text-sm font-bold uppercase transition-all"
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                    onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                                />
                                <Tag className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                            </div>
                            <button
                                onClick={handleApplyCoupon}
                                disabled={couponLoading}
                                className="bg-navy text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#244A6C] transition-all disabled:opacity-60"
                            >
                                {couponLoading ? '...' : 'Apply'}
                            </button>
                        </div>
                    )}
                    {couponMsg.text && (
                        <p className={`text-[11px] font-bold ${couponMsg.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
                            {couponMsg.text}
                        </p>
                    )}
                </div>


                {/* Totals */}
                <div className="space-y-4 pt-2">
                    <div className="flex justify-between text-sm font-bold text-gray-500 uppercase tracking-widest">
                        <span>Subtotal</span>
                        <span>₹{subtotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-gray-500 uppercase tracking-widest">
                        <span>GST (18%)</span>
                        <span>+ ₹{gst.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-green-600 uppercase tracking-widest">
                        <span>Shipping</span>
                        <span className="text-[10px] bg-green-100 px-2 py-0.5 rounded leading-none">FREE</span>
                    </div>
                    {discount > 0 && (
                        <div className="flex justify-between text-sm font-bold text-green-600 uppercase tracking-widest">
                            <span>Discount</span>
                            <span>- ₹{discount.toLocaleString('en-IN')}</span>
                        </div>
                    )}

                    <div className="pt-4 border-t border-gray-100 flex justify-between items-center mt-4">
                        <span className="text-lg font-black text-gray-900 uppercase tracking-tight">Grand Total</span>
                        <span className="text-3xl font-black text-orange">₹{grandTotal.toLocaleString('en-IN')}</span>
                    </div>
                </div>

                {/* Checkout Button */}
                <Link
                    to="/checkout"
                    className="w-full bg-orange text-white py-4 rounded-xl flex items-center justify-center font-black text-lg uppercase tracking-widest shadow-lg shadow-orange/20 hover:shadow-xl active:scale-95 transition-all group"
                >
                    Checkout
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>

                {/* Trust Badges */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-2">
                        <ShieldCheck className="h-5 w-5 text-green-600" />
                        <span className="text-[10px] font-bold text-gray-400 uppercase leading-tight">Secure Payment</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Truck className="h-5 w-5 text-navy" />
                        <span className="text-[10px] font-bold text-gray-400 uppercase leading-tight">Fast Delivery</span>
                    </div>
                </div>
            </div>

            <div className="text-center">
                <Link to="/products" className="text-xs font-black text-gray-400 uppercase tracking-widest hover:text-orange transition-colors">
                    Continue Shopping
                </Link>
            </div>
        </div>
    );
};

export default CartSummary;
