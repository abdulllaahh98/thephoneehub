import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    ChevronLeft,
    Package,
    MapPin,
    CreditCard,
    ExternalLink,
    Truck,
    RefreshCw,
    Save,
    AlertCircle,
    CheckCircle2,
    Clock,
    FileText
} from 'lucide-react';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const AdminOrderDetail = () => {
    const { id } = useParams();
    const queryClient = useQueryClient();
    const [status, setStatus] = useState('');
    const [courier, setCourier] = useState('Shiprocket');
    const [awb, setAwb] = useState('');
    const [internalNote, setInternalNote] = useState('');

    // Modal states
    const [showRefundModal, setShowRefundModal] = useState(false);
    const [refundReason, setRefundReason] = useState('');
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [newPaymentStatus, setNewPaymentStatus] = useState('paid');

    const { data: order, isLoading } = useQuery({
        queryKey: ['admin-order', id],
        queryFn: async () => {
            const response = await api.get(`admin/orders/${id}`);
            const data = response.data.data;
            setStatus(data.status);
            setCourier(data.courier || 'Shiprocket');
            setAwb(data.awb_number || '');
            setNewPaymentStatus(data.payment_status || 'paid');
            return data;
        }
    });

    const updateMutation = useMutation({
        mutationFn: (updateData) => api.patch(`admin/orders/${id}/status`, updateData),
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-order', id]);
            toast.success('Order updated');
        },
        onError: (err) => toast.error(err.response?.data?.message || 'Failed to update order')
    });

    const refundMutation = useMutation({
        mutationFn: (data) => api.post(`admin/orders/${id}/refund`, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-order', id]);
            setShowRefundModal(false);
            setRefundReason('');
            toast.success('Refund initiated successfully');
        },
        onError: (err) => toast.error(err.response?.data?.message || 'Failed to initiate refund')
    });

    const paymentMutation = useMutation({
        mutationFn: (data) => api.patch(`admin/orders/${id}/payment`, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-order', id]);
            setShowPaymentModal(false);
            toast.success('Payment status updated');
        },
        onError: (err) => toast.error(err.response?.data?.message || 'Failed to update payment')
    });

    if (isLoading) return <div className="p-20 text-center font-black uppercase text-gray-400 animate-pulse">Scanning Order Intel...</div>;
    if (!order) return <div className="p-20 text-center font-black uppercase text-red-400">Order Not Found</div>;

    return (
        <div className="space-y-10">
            {/* Refund Modal */}
            {showRefundModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
                        <h3 className="text-xl font-black uppercase tracking-tight text-gray-900 mb-2">Initiate Refund</h3>
                        <p className="text-xs font-bold text-red-500 uppercase tracking-widest mb-6">This will cancel the order and mark payment as refunded.</p>
                        <textarea
                            value={refundReason}
                            onChange={(e) => setRefundReason(e.target.value)}
                            placeholder="Reason for refund (optional)..."
                            className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl font-bold text-sm min-h-[100px] outline-none focus:ring-2 focus:ring-red-200 mb-6"
                        />
                        <div className="flex space-x-3">
                            <button onClick={() => setShowRefundModal(false)} className="flex-1 bg-gray-100 text-gray-600 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gray-200 transition-all">Cancel</button>
                            <button
                                onClick={() => refundMutation.mutate({ reason: refundReason })}
                                disabled={refundMutation.isPending}
                                className="flex-1 bg-red-500 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-red-600 shadow-lg shadow-red-200 transition-all disabled:opacity-70"
                            >
                                {refundMutation.isPending ? 'Processing...' : 'Confirm Refund'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Update Payment Modal */}
            {showPaymentModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
                        <h3 className="text-xl font-black uppercase tracking-tight text-gray-900 mb-6">Update Payment Status</h3>
                        <select
                            value={newPaymentStatus}
                            onChange={(e) => setNewPaymentStatus(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-100 px-5 py-4 rounded-2xl font-bold outline-none mb-6"
                        >
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                            <option value="failed">Failed</option>
                            <option value="refunded">Refunded</option>
                        </select>
                        <div className="flex space-x-3">
                            <button onClick={() => setShowPaymentModal(false)} className="flex-1 bg-gray-100 text-gray-600 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gray-200 transition-all">Cancel</button>
                            <button
                                onClick={() => paymentMutation.mutate({ payment_status: newPaymentStatus })}
                                disabled={paymentMutation.isPending}
                                className="flex-1 bg-orange text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-orange/90 shadow-lg shadow-orange/20 transition-all disabled:opacity-70"
                            >
                                {paymentMutation.isPending ? 'Saving...' : 'Update Payment'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex items-center justify-between">
                <div>
                    <Link to="/admin/orders" className="inline-flex items-center text-[10px] font-black uppercase text-gray-400 hover:text-orange transition-colors mb-4">
                        <ChevronLeft className="h-4 w-4 mr-1" /> Back to Orders
                    </Link>
                    <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Order {order.id}</h1>
                </div>
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => setShowRefundModal(true)}
                        className="bg-red-50 text-red-600 border border-red-100 px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-red-100 transition-all">
                        Refund Order
                    </button>
                    <button
                        onClick={() => setShowPaymentModal(true)}
                        className="bg-orange text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-lg shadow-orange/20 hover:scale-105 active:scale-95 transition-all">
                        Update Payment
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Main Column */}
                <div className="lg:col-span-2 space-y-10">
                    {/* Items */}
                    <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Order Items</h2>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{order.order_items?.length} Product(s)</span>
                        </div>
                        <div className="p-8 space-y-6">
                            {order.order_items?.map(item => (
                                <div key={item.id} className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl border border-gray-100">
                                    <div className="flex items-center space-x-6">
                                        <div className="w-16 h-16 bg-white rounded-xl border border-gray-100 flex items-center justify-center">
                                            <Package className="h-8 w-8 text-gray-200" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-gray-900 uppercase tracking-tight">{item.product_name}</p>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase">{item.storage} • {item.colour}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-bold text-gray-400">Qty: {item.quantity}</p>
                                        <p className="text-lg font-black text-orange">₹{parseFloat(item.price).toLocaleString('en-IN')}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Shipment Control */}
                    <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-8">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center space-x-4">
                                <div className="bg-orange/10 p-4 rounded-2xl text-orange">
                                    <Truck className="h-6 w-6" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Logistics Orchestration</h2>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Configure courier and tracking details</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Courier Partner</label>
                                <select
                                    className="w-full bg-gray-50 border border-gray-100 px-5 py-4 rounded-2xl font-bold outline-none"
                                    value={courier}
                                    onChange={(e) => setCourier(e.target.value)}
                                >
                                    <option value="Shiprocket">Shiprocket</option>
                                    <option value="Delhivery">Delhivery</option>
                                    <option value="Bluedart">Bluedart</option>
                                </select>
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">AWB Number</label>
                                <input
                                    type="text"
                                    value={awb}
                                    onChange={(e) => setAwb(e.target.value)}
                                    placeholder="Tracking ID"
                                    className="w-full bg-gray-50 border border-gray-100 px-5 py-4 rounded-2xl font-bold outline-none"
                                />
                            </div>
                            <div className="md:col-span-2 flex justify-end">
                                <button
                                    onClick={() => updateMutation.mutate({ status, courier, awb_number: awb })}
                                    className="bg-navy text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-lg shadow-navy/20 active:scale-95 transition-all"
                                >
                                    Update Logistics
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Internal Notes */}
                    <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-8">
                        <div className="flex items-center space-x-3 mb-6">
                            <FileText className="h-5 w-5 text-gray-400" />
                            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Internal Operations Notes</h2>
                        </div>
                        <textarea
                            value={internalNote}
                            onChange={(e) => setInternalNote(e.target.value)}
                            placeholder="Only visible to admin team..."
                            className="w-full bg-gray-50 border border-gray-100 p-6 rounded-3xl font-bold text-sm min-h-[120px] outline-none focus:ring-2 focus:ring-orange/20 transition-all"
                        />
                        <div className="mt-6 flex justify-end">
                            <button className="flex items-center space-x-2 text-[11px] font-black uppercase tracking-widest text-navy bg-white border border-gray-100 px-6 py-3 rounded-xl hover:bg-gray-50 transition-all shadow-sm">
                                <Save className="h-4 w-4" />
                                <span>Save Notes</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sidebar Column */}
                <div className="space-y-10">
                    {/* Status Panel */}
                    <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-8">
                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6">Execution Status</h3>
                        <div className="space-y-6">
                            <select
                                value={status}
                                onChange={(e) => {
                                    setStatus(e.target.value);
                                    updateMutation.mutate({ status: e.target.value });
                                }}
                                className="w-full bg-blue-50 border border-blue-100 text-blue-700 px-5 py-4 rounded-2xl font-black uppercase tracking-widest text-xs outline-none"
                            >
                                <option value="pending">Pending</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="out_for_delivery">Out for Delivery</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                            <p className="text-[9px] font-bold text-red-400 uppercase tracking-widest flex items-center">
                                <AlertCircle className="h-3 w-3 mr-1" /> Customer will be notified via WhatsApp & Email
                            </p>
                        </div>
                    </div>

                    {/* Customer Summary */}
                    <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-8">
                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6">Customer Intel</h3>
                        <div className="space-y-6">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 rounded-xl bg-orange/10 flex items-center justify-center text-orange font-black">
                                    {order.user?.name?.substring(0, 2).toUpperCase()}
                                </div>
                                <div>
                                    <p className="text-sm font-black text-gray-900 uppercase tracking-tight">{order.user?.name}</p>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase">{order.user?.email}</p>
                                </div>
                            </div>
                            <div className="pt-6 border-t border-gray-50 space-y-4">
                                <div className="flex items-start space-x-3">
                                    <MapPin className="h-4 w-4 text-gray-400 mt-1 shrink-0" />
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Shipping Details</p>
                                        <p className="text-xs font-bold text-gray-500 uppercase leading-relaxed">
                                            {order.address?.line1}, {order.address?.city}, {order.address?.state} - {order.address?.pin}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <CreditCard className="h-4 w-4 text-gray-400 mt-1 shrink-0" />
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Transaction</p>
                                        <p className="text-xs font-bold text-gray-900 uppercase">{order.payment_method} • {order.payment_status}</p>
                                        <p className="text-[9px] font-bold text-blue-400 uppercase mt-1 flex items-center">
                                            ID: {order.razorpay_payment_id || 'N/A'} <ExternalLink className="h-2 h-2 ml-1" />
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminOrderDetail;
