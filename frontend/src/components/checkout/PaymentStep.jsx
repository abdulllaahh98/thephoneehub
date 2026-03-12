import React, { useState, useEffect } from 'react';
import { Banknote, ShieldCheck, Loader2, AlertCircle, CreditCard } from 'lucide-react';
import api from '../../api/axios';
import useCartStore from '../../store/useCartStore';

const PaymentStep = ({ onNext, onBack, orderData }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const { clearCart, appliedCoupon, clearCoupon } = useCartStore();

    // Load Razorpay Script
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
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
                // 2. Initialize Razorpay Checkout
                const options = {
                    key: import.meta.env.VITE_RAZORPAY_KEY || 'rzp_test_mockkey', // Use env variable
                    amount: order.grand_total * 100, // Razorpay works in paise
                    currency: "INR",
                    name: "ThePhoneHub.in",
                    description: `Order #${order.order_number}`,
                    order_id: order.razorpay_order_id,
                    handler: async function (response) {
                        try {
                            // 3. Verify Payment on Backend
                            await api.post('auth/checkout/verify', {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature
                            });
                            clearCart();
                            onNext({ method: 'online', order_id: order.order_number });
                        } catch (err) {
                            setError('Payment verification failed. Please contact support.');
                        }
                    },
                    prefill: {
                        name: order.user?.name,
                        email: order.user?.email,
                        contact: order.user?.phone
                    },
                    theme: {
                        color: "#1A3A5C"
                    }
                };
                const rzp = new window.Razorpay(options);
                rzp.on('payment.failed', function (response) {
                    setError(response.error.description);
                });
                rzp.open();
            }
        } catch (e) {
            setError(e.response?.data?.message || 'Order creation failed. Please try again.');
        } finally {
            setIsLoading(false);
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
                    onClick={() => setPaymentMethod('online')}
                    className={`w-full flex items-center p-6 rounded-2xl border-2 transition-all ${paymentMethod === 'online' ? 'border-orange bg-orange/5' : 'border-gray-100 hover:border-gray-200 bg-white'}`}
                >
                    <div className={`p-4 rounded-xl ${paymentMethod === 'online' ? 'bg-orange text-white' : 'bg-gray-100 text-gray-400'}`}>
                        <CreditCard className="h-6 w-6" />
                    </div>
                    <div className="ml-6 flex-grow text-left">
                        <h3 className="font-black text-gray-900 uppercase tracking-tight">Online Payment</h3>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">UPI, Cards, Netbanking</p>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'online' ? 'border-orange' : 'border-gray-200'}`}>
                        {paymentMethod === 'online' && <div className="w-3 h-3 bg-orange rounded-full"></div>}
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
                    {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : paymentMethod === 'online' ? 'Pay Securely' : 'Confirm Order'}
                </button>
            </div>
        </div>
    );
};

export default PaymentStep;
