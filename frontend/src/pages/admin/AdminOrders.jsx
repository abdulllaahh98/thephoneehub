import React, { useState } from 'react';
import {
    Search,
    Calendar,
    ChevronRight,
    MoreVertical,
    ArrowRight,
    Package,
    Truck,
    CheckCircle2,
    Clock,
    XCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

import { useQuery } from '@tanstack/react-query';
import api from '../../api/axios';

const AdminOrders = () => {
    const [activeTab, setActiveTab] = useState('All');
    const tabs = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

    const { data: apiResponse, isLoading } = useQuery({
        queryKey: ['admin-orders', activeTab],
        queryFn: async () => {
            const status = activeTab === 'All' ? '' : activeTab.toLowerCase();
            const response = await api.get('admin/orders', { params: { status } });
            return response.data.data;
        }
    });

    const orders = apiResponse?.data || [];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-100 text-yellow-700';
            case 'Processing': return 'bg-blue-100 text-blue-700';
            case 'Shipped': return 'bg-orange/10 text-orange';
            case 'Delivered': return 'bg-green-100 text-green-700';
            case 'Cancelled': return 'bg-red-100 text-red-600';
            default: return 'bg-gray-100 text-gray-500';
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Order Orchestration</h1>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Manage processing, shipments, and refunds</p>
                </div>
                <div className="flex items-center gap-3 bg-white border border-gray-100 p-2 rounded-2xl shadow-sm">
                    <div className="p-2 border-r border-gray-100">
                        <Calendar className="h-4 w-4 text-gray-400" />
                    </div>
                    <span className="text-[10px] font-black uppercase text-gray-600 px-4">Last 30 Days</span>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="bg-white p-2 rounded-[28px] border border-gray-100 shadow-sm flex flex-wrap gap-1">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-grow md:flex-grow-0 px-6 py-3 rounded-[20px] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab
                            ? 'bg-[#1A3A5C] text-white shadow-lg'
                            : 'text-gray-400 hover:text-navy hover:bg-gray-50'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50/50 text-left">
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Order ID & Date</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Customer</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Items</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Total</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
                                <th className="px-8 py-6"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {isLoading ? (
                                <tr><td colSpan="6" className="py-20 text-center uppercase font-black text-gray-400 animate-pulse">Synchronizing Orders...</td></tr>
                            ) : orders.map((o) => (
                                <tr key={o.id} className="hover:bg-gray-50/30 transition-colors group">
                                    <td className="px-8 py-6">
                                        <p className="text-xs font-black text-gray-900 group-hover:text-orange transition-colors">{o.order_number}</p>
                                        <p className="text-[9px] font-bold text-gray-400 uppercase mt-1">{new Date(o.created_at).toLocaleDateString()}</p>
                                    </td>
                                    <td className="px-8 py-6 text-xs font-bold text-gray-500 uppercase tracking-tight">{o.user?.name}</td>
                                    <td className="px-8 py-6 text-center">
                                        <span className="text-[10px] font-black text-navy px-3 py-1 bg-gray-100 rounded-full">{o.items_count}</span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <p className="text-sm font-black text-navy uppercase tracking-tight">₹{parseFloat(o.grand_total).toLocaleString('en-IN')}</p>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${getStatusColor(o.status.charAt(0).toUpperCase() + o.status.slice(1))}`}>
                                            {o.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <Link
                                            to={`/admin/order/${o.id}`}
                                            className="p-3 rounded-2xl bg-gray-50 text-gray-400 hover:text-white hover:bg-orange transition-all inline-flex items-center shadow-sm"
                                        >
                                            <ArrowRight className="h-4 w-4" />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminOrders;
