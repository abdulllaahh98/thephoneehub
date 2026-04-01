import React from 'react';
<<<<<<< HEAD
import { ShoppingBag, MapPin, CreditCard, ChevronRight } from 'lucide-react';
import useCartStore from '../../store/useCartStore';

=======
import { ShoppingBag, MapPin, CreditCard, ChevronRight, Eye, ShieldCheck } from 'lucide-react';
import useCartStore from '../../store/useCartStore';

const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1')
    .replace('/api/v1', '');

>>>>>>> a45f52b (payment-integrated)
const CheckoutReview = ({ onNext, onBack, orderData }) => {
    const { address, items, paymentInfo, total } = orderData;
    const { appliedCoupon } = useCartStore();
    const discount = appliedCoupon?.discount_amount || 0;
    const gst = Math.round((total - discount) * 0.18);
    const grandTotal = total - discount + gst;

<<<<<<< HEAD
=======
    // Helper function to convert image URL
    const getImageUrl = (imagePath) => {
        if (!imagePath) return null;
        if (imagePath.startsWith('http')) return imagePath;
        return `${BASE_URL}/storage/${imagePath}`;
    };

>>>>>>> a45f52b (payment-integrated)
    return (
        <div className="space-y-6">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 lg:p-10">
                <div className="flex items-center space-x-3 mb-8">
                    <div className="bg-orange/10 p-2 rounded-xl">
                        <Eye className="h-6 w-6 text-orange" />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Review Order</h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Address Summary */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2 text-xs font-black text-gray-400 uppercase tracking-widest">
                            <MapPin className="h-4 w-4" />
                            <span>Delivery Address</span>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                            <p className="font-black text-gray-900">{address.fullName}</p>
                            <p className="text-sm font-bold text-gray-500 mt-2">{address.line1}, {address.line2}</p>
                            <p className="text-sm font-bold text-gray-500">{address.city}, {address.state} - {address.pincode}</p>
                            <p className="text-sm font-black text-orange mt-3">{address.mobile}</p>
                        </div>
                    </div>

                    {/* Payment Summary */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2 text-xs font-black text-gray-400 uppercase tracking-widest">
                            <CreditCard className="h-4 w-4" />
                            <span>Payment Option</span>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                            <p className="font-black text-gray-900 uppercase">
<<<<<<< HEAD
                                {paymentInfo.method === 'online' ? 'Online Payment (Prepaid)' : 'Cash on Delivery'}
                            </p>
                            <p className="text-xs font-bold text-gray-400 mt-2">
                                {paymentInfo.method === 'online' ? `Transaction ID: ${paymentInfo.payment_id}` : 'Pay at the time of delivery'}
=======
                                {paymentInfo.method === 'cashfree' ? 'Cashfree Payment (Prepaid)' : 'Cash on Delivery'}
                            </p>
                            <p className="text-xs font-bold text-gray-400 mt-2">
                                {paymentInfo.method === 'cashfree' ? `Cashfree Order: ${paymentInfo.order_number || 'Pending'}` : 'Pay at the time of delivery'}
>>>>>>> a45f52b (payment-integrated)
                            </p>
                            <div className="mt-4 flex items-center text-green-600">
                                <ShieldCheck className="h-4 w-4 mr-1" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Verified Payment Method</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Item Summary */}
                <div className="mt-10 border-t border-gray-50 pt-10">
                    <div className="flex items-center space-x-2 text-xs font-black text-gray-400 uppercase tracking-widest mb-6">
                        <ShoppingBag className="h-4 w-4" />
                        <span>Items in Order</span>
                    </div>
                    <div className="space-y-4">
                        {items.map((item) => (
                            <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-white rounded-lg p-1 border border-gray-100 flex-shrink-0">
<<<<<<< HEAD
                                        <img src={item.image_url} alt={item.model} className="w-full h-full object-contain" />
=======
                                        <img src={getImageUrl(item.image || item.image_url)} alt={item.model} className="w-full h-full object-contain" />
>>>>>>> a45f52b (payment-integrated)
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-gray-900">{item.model}</p>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase">{item.brand} • {item.storage}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-black text-orange">₹{item.price.toLocaleString('en-IN')} x {item.quantity}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bill Details & Confirm */}
            <div className="bg-navy text-white rounded-3xl p-8 lg:p-10 shadow-xl shadow-navy/20">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="w-full md:w-auto grid grid-cols-3 gap-8 text-center md:text-left">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-blue-300 mb-1">Subtotal</p>
                            <p className="text-xl font-black">₹{total.toLocaleString('en-IN')}</p>
                        </div>
                        {discount > 0 && (
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-green-300 mb-1">Discount ({appliedCoupon?.code})</p>
                                <p className="text-xl font-black text-green-300">-₹{discount.toLocaleString('en-IN')}</p>
                            </div>
                        )}
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-blue-300 mb-1">GST (18%)</p>
                            <p className="text-xl font-black">₹{gst.toLocaleString('en-IN')}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-orange mb-1">Net Pay</p>
                            <p className="text-xl font-black text-orange">₹{grandTotal.toLocaleString('en-IN')}</p>
                        </div>
                    </div>

                    <div className="flex w-full md:w-auto gap-4">
                        <button
                            onClick={onBack}
                            className="flex-grow md:flex-grow-0 px-8 py-4 rounded-2xl font-black uppercase tracking-widest border border-white/10 hover:bg-white/5 transition-all"
                        >
                            Back
                        </button>
                        <button
                            onClick={onNext}
                            className="flex-grow md:flex-grow-0 bg-orange text-white px-10 py-4 rounded-2xl font-black text-lg uppercase tracking-widest shadow-xl shadow-orange/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center group"
                        >
                            Confirm Order
                            <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-all" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutReview;
