import React from 'react';
import { ShoppingBag, ChevronRight, Package, Calendar, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import api from '../api/axios';

const OrdersPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const response = await api.get('auth/orders');
      return response.data.data;
    }
  });
  // Backend returns { orders: [...], meta: {...} }
  const orders = data?.orders ?? data ?? [];

  const getStatusStyle = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'processing': return 'bg-blue-100 text-blue-700';
      case 'shipped': return 'bg-orange/10 text-orange';
      case 'cancelled': return 'bg-red-100 text-red-600';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-500';
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12 lg:py-20">
      <Helmet>
        <title>Order History | PhoneHubX</title>
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-4 mb-12">
          <div className="bg-orange/10 p-3 rounded-2xl">
            <ShoppingBag className="h-8 w-8 text-orange" />
          </div>
          <div>
            <h1 className="text-3xl lg:text-4xl font-black text-gray-900 uppercase tracking-tighter">My Orders</h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Track and manage your purchases</p>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => <div key={i} className="h-32 bg-white rounded-3xl animate-pulse" />)}
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link
                key={order.order_id || order.id}
                to={`/orders/${order.order_id || order.id}`}
                className="block bg-white rounded-3xl p-6 lg:p-8 border border-gray-100 hover:border-orange/20 hover:shadow-xl hover:shadow-orange/5 transition-all group"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex-grow space-y-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-xs font-black text-gray-900 uppercase tracking-tight">{order.order_number}</span>
                      <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${getStatusStyle(order.status)}`}>
                        {order.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-6">
                      <div className="flex items-center text-gray-400 space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span className="text-xs font-bold">{new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center text-gray-400 space-x-2">
                        <Package className="h-4 w-4" />
                        <span className="text-xs font-bold uppercase tracking-widest">{order.items_count} {order.items_count > 1 ? 'Items' : 'Item'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end md:space-x-8">
                    <div className="text-right">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Grand Total</p>
                      <p className="text-2xl font-black text-navy tracking-tight">₹{parseFloat(order.grand_total).toLocaleString('en-IN')}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-2xl group-hover:bg-orange group-hover:text-white transition-all shadow-sm">
                      <ChevronRight className="h-5 w-5" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}

            {orders.length === 0 && (
              <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
                <ShoppingBag className="h-16 w-16 text-gray-100 mx-auto mb-6" />
                <h3 className="text-xl font-black text-gray-900 uppercase">No orders yet</h3>
                <p className="text-gray-400 font-bold mt-2">Looks like you haven't bought anything yet.</p>
                <Link to="/products" className="inline-block mt-8 bg-orange text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-orange/20">Start Shopping</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
