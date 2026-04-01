import React, { useState, useEffect } from 'react';
import { Banknote, ShieldCheck, Loader2, AlertCircle, CreditCard } from 'lucide-react';
import api from '../../api/axios';
import useCartStore from '../../store/useCartStore';

const PaymentStep = ({ onNext, onBack, orderData }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const { clearCart, appliedCoupon, clearCoupon } = useCartStore();

    // Load Cashfree Script
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
        script.async = true;
        document.body.appendChild(script);
        return () => {
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, []);

    const handlePayment = async () => {
        setIsLoading(true);
        setError('');
        try {
            // 1. Create Order on Backend
            const { data: orderResp } = await api.post('auth/orders', {
                address_id: orderData.address.id,
                payment_method: paymentMethod,
                coupon_code: appliedCoupon?.code || undefined,
            });
            const order = orderResp.data || orderResp;

            if (paymentMethod === 'cod') {
                clearCart();
                clearCoupon();
                onNext({ method: 'cod', order_id: order.order_id, order_number: order.order_number });
            } else {
                // 2. Initialize Cashfree Checkout
                if (!window.Cashfree) {
                    throw new Error('Cashfree SDK not loaded. Please refresh and try again.');
                }
                if (!order.payment_session_id) {
                    throw new Error('Payment session not created. Please try again.');
                }

                const rawMode = (import.meta.env.VITE_CASHFREE_ENV || 'test').toLowerCase();
                const mode = rawMode === 'production' || rawMode === 'prod' ? 'production' : 'sandbox';
                const cashfree = window.Cashfree({
                    mode,
                });

                const checkoutOptions = {
                    paymentSessionId: order.payment_session_id,
                    redirectTarget: "_modal",
                    mode,
                };

                cashfree.checkout(checkoutOptions).then(async (result) => {
                    if (result.error) {
                        setError(result.error.message || 'Payment failed to initialize.');
                        setIsLoading(false);
                    } else if (result.redirect) {
                        // This handles the redirect if modal is not used or if user closes it
                        console.log("Redirected to Cashfree");
                    } else {
                        // Modal closed or payment completed (need to verify on backend)
                        try {
                            setIsLoading(true);
                            await api.post('auth/checkout/verify', {
                                order_number: order.order_number,
                            });
                            clearCart();
                            clearCoupon();
                            onNext({ method: 'cashfree', order_id: order.order_id, order_number: order.order_number });
                        } catch (err) {
                            setError('Payment verification failed. Please check your order history.');
                        } finally {
                            setIsLoading(false);
                        }
                    }
                });
            }
        } catch (e) {
            setError(e.response?.data?.message || 'Order creation failed. Please try again.');
        } finally {
            if (paymentMethod === 'cod') setIsLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 lg:p-10">
            <div className="flex items-center space-x-3 mb-8">
                <div className="bg-orange/10 p-2 rounded-xl">
                    <Banknote className="h-6 w-6 text-orange" />
                </div>
                <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Select Payment Method</h2>
            </div>

            <div className="space-y-4 mb-10">
                {/* Online Payment */}
                <button
                    onClick={() => setPaymentMethod('cashfree')}
                    className={`w-full flex items-center p-6 rounded-2xl border-2 transition-all ${paymentMethod === 'cashfree' ? 'border-orange bg-orange/5' : 'border-gray-100 hover:border-gray-200 bg-white'}`}
                >
                    <div className={`p-4 rounded-xl ${paymentMethod === 'cashfree' ? 'bg-orange text-white' : 'bg-gray-100 text-gray-400'}`}>
                        <CreditCard className="h-6 w-6" />
                    </div>
                    <div className="ml-6 flex-grow text-left">
                        <h3 className="font-black text-gray-900 uppercase tracking-tight">Cashfree Payment</h3>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">UPI, Cards, Netbanking</p>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'cashfree' ? 'border-orange' : 'border-gray-200'}`}>
                        {paymentMethod === 'cashfree' && <div className="w-3 h-3 bg-orange rounded-full"></div>}
                    </div>
                </button>

                {/* COD */}
                <button
                    onClick={() => setPaymentMethod('cod')}
                    className={`w-full flex items-center p-6 rounded-2xl border-2 transition-all ${paymentMethod === 'cod' ? 'border-orange bg-orange/5' : 'border-gray-100 hover:border-gray-200 bg-white'}`}
                >
                    <div className={`p-4 rounded-xl ${paymentMethod === 'cod' ? 'bg-orange text-white' : 'bg-gray-100 text-gray-400'}`}>
                        <Banknote className="h-6 w-6" />
                    </div>
                    <div className="ml-6 flex-grow text-left">
                        <h3 className="font-black text-gray-900 uppercase tracking-tight">Cash on Delivery (COD)</h3>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Pay when you receive the device</p>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'cod' ? 'border-orange' : 'border-gray-200'}`}>
                        {paymentMethod === 'cod' && <div className="w-3 h-3 bg-orange rounded-full"></div>}
                    </div>
                </button>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center mb-8 border border-red-100 italic">
                    <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0" />
                    <p className="text-sm font-bold uppercase tracking-tight">{error}</p>
                </div>
            )}

            <div className="bg-gray-50 p-6 rounded-2xl flex items-center justify-center space-x-6 border border-gray-100 mb-8">
                <div className="flex items-center text-gray-400 space-x-2">
                    <ShieldCheck className="h-5 w-5" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Secure Gateway</span>
                </div>
                <div className="h-4 w-px bg-gray-200"></div>
                <div className="flex items-center text-gray-400 space-x-2">
                    <ShieldCheck className="h-5 w-5" />
                    <span className="text-[10px] font-black uppercase tracking-widest">7 Days Replacement</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <button
                    onClick={onBack}
                    disabled={isLoading}
                    className="py-4 rounded-2xl font-black text-gray-400 uppercase tracking-widest border border-gray-100 hover:bg-gray-50 transition-all text-xs lg:text-sm"
                >
                    Back to Address
                </button>
                <button
                    onClick={handlePayment}
                    disabled={isLoading}
                    className="bg-navy text-white py-4 rounded-2xl font-black text-xs lg:text-lg uppercase tracking-widest shadow-lg shadow-navy/20 hover:shadow-xl active:scale-[0.98] transition-all flex items-center justify-center"
                >
                    {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : paymentMethod === 'cashfree' ? 'Pay with Cashfree' : 'Confirm Order'}
                </button>
            </div>
        </div>
    );
};

export default PaymentStep;
