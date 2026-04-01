import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Clock, ArrowRight, ShoppingBag } from 'lucide-react';
import api from '../api/axios';
import Layout from '../components/layout/Layout';

const PaymentStatus = () => {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('order_id');
    const [status, setStatus] = useState('loading'); // loading, success, failed, pending
    const [order, setOrder] = useState(null);

    useEffect(() => {
        if (orderId) {
            verifyPayment();
        }
    }, [orderId]);

    const verifyPayment = async () => {
        try {
            const { data: response } = await api.post('auth/checkout/verify', {
                order_number: orderId
            });

            if (response.success) {
                setStatus('success');
                setOrder(response.data);
            } else {
                setStatus('pending');
            }
        } catch (error) {
            console.error('Payment verification failed:', error);
            setStatus('failed');
        }
    };

    const renderContent = () => {
        switch (status) {
            case 'loading':
                return (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange mb-4"></div>
                        <h2 className="text-xl font-bold uppercase tracking-widest text-gray-900">Verifying Payment...</h2>
                    </div>
                );
            case 'success':
                return (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="bg-green-100 p-6 rounded-full mb-8">
                            <CheckCircle className="h-20 w-20 text-green-500" />
                        </div>
                        <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tight mb-4">Payment Successful!</h1>
                        <p className="text-gray-600 mb-8 max-w-md mx-auto">
                            Thank you for your purchase. Your order <span className="font-bold text-gray-900">#{orderId}</span> has been placed successfully and is being processed.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                to="/orders"
                                className="bg-navy text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center hover:shadow-lg transition-all"
                            >
                                View My Orders <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                            <Link
                                to="/products"
                                className="bg-gray-100 text-gray-900 px-8 py-4 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center hover:bg-gray-200 transition-all"
                            >
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                );
            case 'failed':
                return (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="bg-red-100 p-6 rounded-full mb-8">
                            <XCircle className="h-20 w-20 text-red-500" />
                        </div>
                        <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tight mb-4">Payment Failed</h1>
                        <p className="text-gray-600 mb-8 max-w-md mx-auto">
                            We couldn't process your payment for order <span className="font-bold text-gray-900">#{orderId}</span>. Please try again or contact support if the issue persists.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                to="/checkout"
                                className="bg-orange text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center hover:shadow-lg transition-all"
                            >
                                Retry Payment
                            </Link>
                            <Link
                                to="/cart"
                                className="bg-gray-100 text-gray-900 px-8 py-4 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center hover:bg-gray-200 transition-all"
                            >
                                Back to Cart
                            </Link>
                        </div>
                    </div>
                );
            case 'pending':
                return (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="bg-yellow-100 p-6 rounded-full mb-8">
                            <Clock className="h-20 w-20 text-yellow-500" />
                        </div>
                        <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tight mb-4">Payment Pending</h1>
                        <p className="text-gray-600 mb-8 max-w-md mx-auto">
                            Your payment status for order <span className="font-bold text-gray-900">#{orderId}</span> is still pending. We will update you once the payment is confirmed.
                        </p>
                        <Link
                            to="/orders"
                            className="bg-navy text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center hover:shadow-lg transition-all"
                        >
                            Check Order History
                        </Link>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <Layout>
            <div className="max-w-4xl mx-auto px-4 py-12">
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 lg:p-12">
                    {renderContent()}
                </div>
            </div>
        </Layout>
    );
};

export default PaymentStatus;
