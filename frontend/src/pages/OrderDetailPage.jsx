import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Package, MapPin, CreditCard, Clock, Download, XCircle, ExternalLink, ShieldCheck, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import api from '../api/axios';
import toast from 'react-hot-toast';

<<<<<<< HEAD
=======
const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1')
    .replace('/api/v1', '');

>>>>>>> a45f52b (payment-integrated)
const OrderDetailPage = () => {
    const { id } = useParams();
    const [invoiceLoading, setInvoiceLoading] = useState(false);

<<<<<<< HEAD
=======
    // Helper function to convert image URL
    const getImageUrl = (item) => {
        const direct = item?.product?.image_url || item?.product?.image;
        if (direct) return direct.startsWith('http') ? direct : `${BASE_URL}/storage/${direct}`;

        const primary = item?.product?.product_images?.find(i => i.is_primary) || item?.product?.product_images?.[0];
        const path = primary?.image_url || primary?.image_path;
        if (!path) return '/placeholder.png';
        return path.startsWith('http') ? path : `${BASE_URL}/storage/${path}`;
    };

>>>>>>> a45f52b (payment-integrated)
    const { data: order, isLoading, isError } = useQuery({
        queryKey: ['order', id],
        queryFn: async () => {
            const response = await api.get(`auth/orders/${id}`);
            return response.data.data;
        }
    });

    const handleDownloadInvoice = async () => {
        setInvoiceLoading(true);
        try {
            const response = await api.get(`auth/orders/${id}/invoice`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
            const link = document.createElement('a');
            link.href = url;
<<<<<<< HEAD
            link.setAttribute('download', `ThePhoneHub-Invoice-${order?.order_number || id}.pdf`);
=======
            link.setAttribute('download', `PhoneHubX-Invoice-${order?.order_number || id}.pdf`);
>>>>>>> a45f52b (payment-integrated)
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            toast.error('Could not generate invoice. Please try again.');
        } finally {
            setInvoiceLoading(false);
        }
    };

    if (isLoading) return <div className="max-w-7xl mx-auto px-4 py-20 text-center uppercase font-black text-gray-400 animate-pulse">Initializing Order Details...</div>;
    if (isError || !order) return <div className="max-w-7xl mx-auto px-4 py-20 text-center uppercase font-black text-red-500">Failed to load order info.</div>;

    const steps = [
        { label: 'Order Placed', status: order.status === 'pending' || order.status === 'processing' || order.status === 'shipped' || order.status === 'out_for_delivery' || order.status === 'delivered' ? 'completed' : 'upcoming', date: order.created_at },
        { label: 'Processing', status: order.status === 'processing' ? 'current' : (['shipped', 'out_for_delivery', 'delivered'].includes(order.status) ? 'completed' : 'upcoming'), date: null },
        { label: 'Shipped', status: order.status === 'shipped' ? 'current' : (['out_for_delivery', 'delivered'].includes(order.status) ? 'completed' : 'upcoming'), date: null },
        { label: 'Out for Delivery', status: order.status === 'out_for_delivery' ? 'current' : (order.status === 'delivered' ? 'completed' : 'upcoming'), date: null },
        { label: 'Delivered', status: order.status === 'delivered' ? 'completed' : 'upcoming', date: null },
    ];

    return (
        <div className="bg-gray-50 min-h-screen py-12 lg:py-20">
            <Helmet>
                <title>Order #{order.order_number} | Details</title>
            </Helmet>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link to="/orders" className="inline-flex items-center text-xs font-black uppercase text-gray-400 hover:text-orange transition-colors mb-12">
                    <ChevronLeft className="h-4 w-4 mr-1" /> Back to Orders
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    {/* Main Info Column */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Order Header */}
                        <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-sm border border-gray-100">
                            <div className="flex flex-col md:flex-row justify-between gap-6 mb-10">
                                <div className="space-y-2">
                                    <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Order {order.order_number}</h1>
                                    <div className="flex items-center space-x-3">
                                        <span className="text-xs font-bold text-gray-400 italic">Placed on {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                        <span className="bg-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-4">
                                    <button
                                        onClick={handleDownloadInvoice}
                                        disabled={invoiceLoading}
                                        className="flex-grow md:flex-grow-0 inline-flex items-center justify-center space-x-2 bg-gray-50 text-navy px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-xs border border-gray-100 hover:bg-gray-100 transition-all shadow-sm disabled:opacity-60"
                                    >
                                        {invoiceLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                                        <span>{invoiceLoading ? 'Generating...' : 'Download Invoice'}</span>
                                    </button>
                                    {order.status === 'pending' && (
                                        <button
                                            onClick={async () => { if (confirm('Cancel order?')) { await api.delete(`auth/orders/${order.id}`); window.location.reload(); } }}
                                            className="flex-grow md:flex-grow-0 inline-flex items-center justify-center space-x-2 bg-red-50 text-red-600 px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-xs border border-red-100 hover:bg-red-100 transition-all shadow-sm">
                                            <XCircle className="h-4 w-4" />
                                            <span>Cancel</span>
                                        </button>
                                    )}
                                    <Link to={`/warranty/${order.order_id}`} className="flex-grow md:flex-grow-0 inline-flex items-center justify-center space-x-2 bg-orange text-white px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-orange/20 hover:scale-105 active:scale-95 transition-all">
                                        <ShieldCheck className="h-4 w-4" />
                                        <span>Warranty</span>
                                    </Link>
                                </div>
                            </div>
                            {/* ... Rest of the component with field fixes ... */}

                            {/* Tracking Stepper */}
                            <div className="relative pt-8 pb-12 overflow-x-auto">
                                <div className="min-w-[700px] relative">
                                    {/* Grey line bg */}
                                    <div className="absolute top-5 left-0 w-full h-1 bg-gray-100 rounded-full"></div>
                                    {/* Active line */}
                                    <div className="absolute top-5 left-0 w-[25%] h-1 bg-orange rounded-full"></div>

                                    <div className="flex justify-between relative z-10">
                                        {steps.map((step, idx) => (
                                            <div key={idx} className="flex flex-col items-center w-32">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 ${step.status === 'completed' ? 'bg-orange border-white text-white shadow-md' :
                                                    step.status === 'current' ? 'bg-white border-orange text-orange shadow-lg animate-pulse' :
                                                        'bg-white border-gray-100 text-gray-300'
                                                    }`}>
                                                    {step.status === 'completed' ? <Package className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                                                </div>
                                                <div className="mt-4 text-center">
                                                    <p className={`text-[10px] font-black uppercase tracking-widest ${step.status === 'upcoming' ? 'text-gray-300' : 'text-gray-900'}`}>{step.label}</p>
                                                    {step.date && <p className="text-[9px] font-bold text-gray-400 mt-1 uppercase">{new Date(step.date).toLocaleDateString()}</p>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {order.awb_number && (
                                <div className="bg-orange/5 border border-orange/10 p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-orange/60">Airway Bill (Tracking ID)</p>
                                        <p className="text-xl font-black text-navy mt-1 tracking-tight">{order.awb_number}</p>
                                        {order.courier && <p className="text-[10px] font-bold text-gray-400 uppercase mt-1">Carrier: {order.courier}</p>}
                                    </div>
                                    {order.tracking_url && (
                                        <a href={order.tracking_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center space-x-2 text-xs font-black uppercase text-orange border-b-2 border-orange/20 pb-1 hover:border-orange transition-all">
                                            Track Shipment <ExternalLink className="h-4 w-4" />
                                        </a>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Items List */}
                        <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-sm border border-gray-100">
                            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-8">Items in Order</h3>
                            <div className="space-y-6">
                                {order.order_items?.map(item => (
                                    <div key={item.id} className="flex items-center gap-6 p-4 bg-gray-50 rounded-2xl group">
                                        <div className="w-20 h-20 bg-white rounded-xl p-2 border border-gray-100 flex-shrink-0">
<<<<<<< HEAD
                                            <img src={item.product?.image_url || '/placeholder.png'} alt={item.product_name} className="w-full h-full object-contain" />
=======
                                            <img src={getImageUrl(item)} alt={item.product_name} className="w-full h-full object-contain" />
>>>>>>> a45f52b (payment-integrated)
                                        </div>
                                        <div className="flex-grow">
                                            <h4 className="font-black text-gray-900 uppercase tracking-tight">{item.product_name}</h4>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{item.storage} • {item.colour} • {item.condition}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-bold text-gray-400 mb-1">Qty: {item.quantity}</p>
                                            <p className="text-lg font-black text-orange">₹{parseFloat(item.unit_price).toLocaleString('en-IN')}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Siderbar Area */}
                    <div className="space-y-8">
                        {/* Delivery Address */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="bg-blue-50 p-2 rounded-xl text-blue-600"><MapPin className="h-5 w-5" /></div>
                                <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">Delivery Address</h3>
                            </div>
                            <p className="font-black text-gray-900 text-sm uppercase">{order.address?.name || order.address?.fullName}</p>
                            <div className="text-sm font-bold text-gray-400 mt-2 space-y-1">
                                <p>{order.address?.line1}</p>
                                <p>{order.address?.city}, {order.address?.state} - {order.address?.pin}</p>
                            </div>
                            <p className="text-sm font-black text-navy mt-4">{order.address?.phone || order.address?.mobile}</p>
                        </div>

                        {/* Payment Details */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="bg-orange/10 p-2 rounded-xl text-orange"><CreditCard className="h-5 w-5" /></div>
                                <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">Payment Summary</h3>
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-gray-400">
                                    <span>Method</span>
                                    <span className="text-gray-900">{order.payment_method?.toUpperCase() || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-gray-400">
                                    <span>Subtotal</span>
                                    <span className="text-gray-900">₹{parseFloat(order.subtotal).toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-gray-400">
                                    <span>GST Amount</span>
                                    <span className="text-gray-900">₹{parseFloat(order.gst_amount).toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-gray-400">
                                    <span>Discount</span>
                                    <span className="text-green-600">-₹{parseFloat(order.discount).toLocaleString('en-IN')}</span>
                                </div>
                                <div className="pt-4 border-t border-gray-50 flex justify-between items-center">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-900">Paid Amount</span>
                                    <span className="text-2xl font-black text-orange">₹{parseFloat(order.grand_total).toLocaleString('en-IN')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailPage;
