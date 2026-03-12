import React, { useState } from 'react';
import { CheckCircle2, Package, Download, MapPin, Calendar, ExternalLink, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const OrderSuccess = ({ orderData }) => {
    const { order_id, order_number, address, total, items, method } = orderData;
    const edd = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    const [invoiceLoading, setInvoiceLoading] = useState(false);

    const handleDownloadInvoice = async () => {
        setInvoiceLoading(true);
        try {
            const response = await api.get(`auth/orders/${order_id}/invoice`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `ThePhoneHub-Invoice-${order_number || order_id}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (e) {
            toast.error('Failed to generate invoice. You can download it from My Orders.');
        } finally {
            setInvoiceLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-12 px-4 text-center">
            {/* Success Banner */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 lg:p-16 space-y-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-500 rounded-full blur-[100px] opacity-10"></div>

                <div className="relative z-10">
                    <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce transition-all duration-1000">
                        <CheckCircle2 className="h-12 w-12 text-green-600" />
                    </div>

                    <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tighter">Order Placed Successfully!</h1>
                    <p className="text-gray-500 font-bold mt-4 max-w-lg mx-auto leading-relaxed">
                        Thank you for shopping with ThePhoneHub.in. Your order <strong>{order_id}</strong> has been confirmed and is being prepared for dispatch.
                    </p>
                </div>

                {/* Order Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left pt-8 border-t border-gray-50">
                    <div className="space-y-6">
                        <div className="flex items-start space-x-4">
                            <div className="bg-blue-50 p-2 rounded-xl mt-1">
                                <Calendar className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Estimated Delivery</p>
                                <p className="font-bold text-gray-900">{edd}</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4">
                            <div className="bg-orange/10 p-2 rounded-xl mt-1">
                                <MapPin className="h-5 w-5 text-orange" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Shipping To</p>
                                <p className="font-bold text-gray-900 leading-tight">{address.fullName}</p>
                                <p className="text-xs text-gray-500 mt-1">{address.line1}, {address.city}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 space-y-4">
                        <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest text-gray-500">
                            <span>Payment Summary</span>
                            <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded leading-none">{method === 'online' ? 'PAID' : 'COD'}</span>
                        </div>
                        <div className="flex justify-between items-center font-black">
                            <span className="text-gray-400">Amount to {method === 'online' ? 'Paid' : 'Pay'}</span>
                            <span className="text-2xl text-orange">₹{total.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="pt-2">
                            <button
                                onClick={handleDownloadInvoice}
                                className="w-full flex items-center justify-center space-x-2 text-xs font-black uppercase tracking-widest text-navy bg-white border border-gray-200 py-3 rounded-xl hover:bg-gray-50 transition-all"
                            >
                                <Download className="h-4 w-4" />
                                <span>Download Invoice</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 pt-8">
                    <Link
                        to={`/orders/${order_id}`}
                        className="flex-grow bg-navy text-white px-8 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-[#244A6C] shadow-lg shadow-navy/20 active:scale-95 transition-all group flex items-center justify-center"
                    >
                        <Package className="mr-3 h-5 w-5" />
                        Track Your Order
                        <ExternalLink className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                    <Link
                        to="/"
                        className="flex-grow px-8 py-5 rounded-2xl font-black uppercase tracking-widest text-gray-400 border border-gray-200 hover:bg-gray-50 transition-all"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccess;
