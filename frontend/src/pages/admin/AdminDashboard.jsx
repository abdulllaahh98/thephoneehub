import React from 'react';
import { Link } from 'react-router-dom';
import {
    TrendingUp,
    ShoppingBag,
    Smartphone,
    ShieldAlert,
    ArrowUpRight,
    ArrowDownRight,
    Clock,
    AlertCircle,
    RefreshCw,
    Loader2
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '../../api/axios';

// Format currency in Indian style
function formatINR(val) {
    const num = parseFloat(val) || 0;
    if (num >= 100000) return '₹' + (num / 100000).toFixed(1) + 'L';
    if (num >= 1000) return '₹' + (num / 1000).toFixed(1) + 'K';
    return '₹' + num.toFixed(0);
}

const STATUS_COLORS = {
    pending: 'bg-yellow-50 text-yellow-600',
    processing: 'bg-blue-50 text-blue-600',
    shipped: 'bg-purple-50 text-purple-600',
    out_for_delivery: 'bg-cyan-50 text-cyan-600',
    delivered: 'bg-green-50 text-green-600',
    cancelled: 'bg-red-50 text-red-500',
};

const AdminDashboard = () => {
    const { data, isLoading, isError, refetch, isFetching } = useQuery({
        queryKey: ['admin-dashboard'],
        queryFn: async () => {
            const res = await api.get('admin/reports/dashboard');
            return res.data.data; // flat object: { total_revenue, today_orders, ... }
        },
        refetchInterval: 30000,
        staleTime: 0,
        gcTime: 0,
        refetchOnWindowFocus: true,
    });

    // API returns flat keys directly on data object
    const totalRevenue = parseFloat(data?.total_revenue ?? 0);
    const ordersToday = data?.today_orders ?? 0;
    const ordersYesterday = data?.orders_yesterday ?? 0;
    const lowStockCount = data?.low_stock_count ?? 0;
    const pendingClaims = data?.pending_warranty_claims ?? 0;
    const recentOrders = data?.recent_orders ?? [];
    const lowStockItems = data?.low_stock_items ?? [];

    const statCards = [
        {
            label: 'Total Revenue',
            value: formatINR(totalRevenue),
            trend: 'All-time',
            up: true,
            icon: TrendingUp,
            color: 'text-green-600',
            bg: 'bg-green-50',
        },
        {
            label: 'Orders Today',
            value: ordersToday,
            trend: ordersYesterday > 0
                ? (ordersToday > ordersYesterday ? '+' : '') + (ordersToday - ordersYesterday) + ' vs yesterday'
                : ordersToday > 0 ? '+' + ordersToday + ' today' : 'No orders yet',
            up: ordersToday >= ordersYesterday,
            icon: ShoppingBag,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
        },
        {
            label: 'Low Stock',
            value: lowStockCount,
            trend: lowStockCount > 0 ? 'Action Needed' : 'All Good',
            up: lowStockCount === 0,
            icon: Smartphone,
            color: 'text-orange',
            bg: 'bg-orange/10',
        },
        {
            label: 'Pending Claims',
            value: String(pendingClaims).padStart(2, '0'),
            trend: pendingClaims > 0 ? 'Needs Review' : 'Clear',
            up: pendingClaims === 0,
            icon: ShieldAlert,
            color: 'text-red-600',
            bg: 'bg-red-50',
        },
    ];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-10 w-10 text-orange animate-spin" />
                <span className="ml-4 font-black uppercase text-gray-400 tracking-widest">Loading Dashboard...</span>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <AlertCircle className="h-12 w-12 text-red-400" />
                <p className="font-black uppercase text-red-500 tracking-widest">Failed to load dashboard</p>
                <button onClick={() => refetch()} className="bg-orange text-white px-6 py-3 rounded-xl font-black uppercase text-xs">Retry</button>
            </div>
        );
    }

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Dashboard Overview</h1>
<<<<<<< HEAD
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Real-time stats for ThePhoneHub.in</p>
=======
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Real-time stats for PhoneHubX</p>
>>>>>>> a45f52b (payment-integrated)
                </div>
                <button
                    onClick={() => refetch()}
                    className="flex items-center space-x-2 bg-white border border-gray-100 rounded-2xl px-4 py-2 shadow-sm hover:bg-gray-50 transition-all"
                >
                    <RefreshCw className={`h-4 w-4 text-gray-400 ${isFetching ? 'animate-spin' : ''}`} />
                    <span className="text-[10px] font-black uppercase text-gray-500">
                        {isFetching ? 'Refreshing...' : 'Refresh Data'}
                    </span>
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div key={stat.label} className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all group">
                            <div className="flex justify-between items-start mb-6">
                                <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl group-hover:scale-110 transition-transform`}>
                                    <Icon className="h-6 w-6" />
                                </div>
                                <div className={`flex items-center space-x-1 text-[10px] font-black uppercase tracking-widest ${stat.up ? 'text-green-600' : 'text-red-500'}`}>
                                    <span>{stat.trend}</span>
                                    {stat.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                                </div>
                            </div>
                            <div>
                                <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                                <p className="text-3xl font-black text-gray-900 tracking-tighter">{stat.value}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Recent Orders Table */}
                <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                        <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Recent Orders</h2>
                        <Link to="/admin/orders" className="text-[10px] font-black text-orange uppercase tracking-widest hover:underline">View All</Link>
                    </div>
                    {recentOrders.length === 0 ? (
                        <div className="p-12 text-center text-gray-400 font-bold uppercase text-xs">No orders yet</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50/50 text-left">
                                        <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Order ID</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Customer</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Amount</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {recentOrders.map((order, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50/30 transition-colors">
                                            <td className="px-8 py-5 text-xs font-black text-gray-900">{order.id}</td>
                                            <td className="px-8 py-5 text-xs font-bold text-gray-500">{order.customer}</td>
                                            <td className="px-8 py-5 text-xs font-black text-navy text-right">₹{order.amount}</td>
                                            <td className="px-8 py-5 text-center">
                                                <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${STATUS_COLORS[order.status?.toLowerCase()] || 'bg-gray-100 text-gray-500'}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Low Stock Alerts */}
                <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Inventory Alerts</h2>
                        <div className="bg-red-50 text-red-600 p-2 rounded-xl">
                            <AlertCircle className="h-5 w-5" />
                        </div>
                    </div>
                    {lowStockItems.length === 0 ? (
                        <div className="py-12 text-center text-green-500 font-bold uppercase text-xs">✓ All products have sufficient stock</div>
                    ) : (
                        <div className="space-y-6">
                            {lowStockItems.map((item) => (
                                <div key={item.id} className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl border border-gray-100">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-gray-400">
                                            <Smartphone className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-gray-900 uppercase tracking-tight">{item.brand} {item.model}</p>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase">{item.stock_qty === 0 ? 'Out of Stock' : `${item.stock_qty} units left`}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`text-xs font-black uppercase tracking-widest ${item.stock_qty === 0 ? 'text-red-500' : 'text-orange'}`}>
                                            {item.stock_qty === 0 ? 'Out of Stock' : `${item.stock_qty} Left`}
                                        </p>
                                        <div className="mt-1 h-1 w-24 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${item.stock_qty === 0 ? 'bg-red-500' : 'bg-orange'}`}
                                                style={{ width: `${Math.min(item.stock_qty * 20, 100)}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
