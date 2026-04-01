import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Package, Search, Truck, CheckCircle, Clock, AlertCircle, ArrowRight } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const StatusStep = ({ status, activeStatus, time, note }) => {
  const statuses = ['pending', 'processing', 'shipped', 'delivered'];
  const currentIndex = statuses.indexOf(activeStatus.toLowerCase());
  const stepIndex = statuses.indexOf(status.toLowerCase());
  const isCompleted = stepIndex < currentIndex || activeStatus.toLowerCase() === 'delivered';
  const isActive = status.toLowerCase() === activeStatus.toLowerCase();

  return (
    <div className="flex items-start space-x-4 relative">
      <div className="flex flex-col items-center">
<<<<<<< HEAD
        <div className={`z-10 flex items-center justify-center w-6 h-6 rounded-full border-2 transition-all ${
          isCompleted ? 'bg-green-500 border-green-500 text-white' : 
          isActive ? 'bg-blue-600 border-blue-600 text-white animate-pulse' : 
          'bg-white border-gray-200 text-gray-300'
        }`}>
=======
        <div className={`z-10 flex items-center justify-center w-6 h-6 rounded-full border-2 transition-all ${isCompleted ? 'bg-green-500 border-green-500 text-white' :
            isActive ? 'bg-blue-600 border-blue-600 text-white animate-pulse' :
              'bg-white border-gray-200 text-gray-300'
          }`}>
>>>>>>> a45f52b (payment-integrated)
          {isCompleted ? <CheckCircle className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
        </div>
        <div className={`w-0.5 h-full absolute top-6 left-3 -ml-[1px] ${isCompleted ? 'bg-green-500' : 'bg-gray-100'}`}></div>
      </div>
      <div className="pb-8">
        <p className={`text-sm font-black uppercase tracking-widest ${isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-400'}`}>
          {status}
        </p>
        {isActive && note && <p className="text-xs text-gray-500 mt-1 font-medium">{note}</p>}
        {time && <p className="text-[10px] text-gray-400 mt-1 font-bold">{new Date(time).toLocaleString()}</p>}
      </div>
    </div>
  );
};

const TrackOrderPage = () => {
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [orderData, setOrderData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleTrack = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setOrderData(null);

    try {
<<<<<<< HEAD
      const response = await api.post('orders/track', { 
        order_number: orderNumber, 
        email: email 
=======
      const response = await api.post('orders/track', {
        order_number: orderNumber,
        email: email
>>>>>>> a45f52b (payment-integrated)
      });
      setOrderData(response.data.data);
      toast.success('Order found!');
    } catch (error) {
      console.error('Tracking error', error);
      toast.error(error.response?.data?.message || 'Order not found. Please check details.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-32 pb-20">
      <Helmet>
<<<<<<< HEAD
        <title>Track Your Order | ThePhoneHub.in</title>
=======
        <title>Track Your Order | PhoneHubX</title>
>>>>>>> a45f52b (payment-integrated)
      </Helmet>

      <div className="max-w-xl mx-auto px-4">
        <div className="text-center mb-10">
          <div className="bg-blue-100 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Truck className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Track Your Order</h1>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-2">Enter details to see real-time updates</p>
        </div>

        {/* Tracking Input */}
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl shadow-blue-500/5 mb-8">
          <form onSubmit={handleTrack} className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Order Number</label>
              <input
                type="text"
                required
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                className="w-full px-5 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-bold placeholder-gray-300"
                placeholder="TPH-2026..."
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-bold placeholder-gray-300"
                placeholder="email@example.com"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-navy text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg hover:bg-gray-800 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {isLoading ? <span>Searching...</span> : (
                <>
                  <span>Track Status</span>
                  <Search className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Tracking Result */}
        {orderData && (
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-blue-600 p-6 text-white flex justify-between items-center">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">Current Status</p>
                <h2 className="text-xl font-black uppercase tracking-tighter">{orderData.status}</h2>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">Order ID</p>
                <p className="font-black tracking-tight">{orderData.order_number}</p>
              </div>
            </div>
<<<<<<< HEAD
            
=======

>>>>>>> a45f52b (payment-integrated)
            <div className="p-8">
              <div className="space-y-1 mb-8">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Ordered On</p>
                <p className="font-bold text-gray-800">{new Date(orderData.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>

              <div className="mb-8">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Tracking Timeline</h3>
                <div className="ml-2">
                  <StatusStep status="Pending" activeStatus={orderData.status} />
                  <StatusStep status="Processing" activeStatus={orderData.status} />
                  <StatusStep status="Shipped" activeStatus={orderData.status} />
                  <StatusStep status="Delivered" activeStatus={orderData.status} />
                </div>
              </div>

              <div className="border-t border-gray-50 pt-6">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Items</h3>
                <div className="space-y-2">
                  {orderData.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-gray-50 px-4 py-3 rounded-xl">
                      <span className="text-xs font-bold text-gray-700">{item.name}</span>
                      <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">x{item.qty}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Help Tip */}
        <div className="mt-8 flex items-center p-4 bg-orange/5 border border-orange/10 rounded-2xl text-[10px] font-bold text-orange uppercase tracking-widest">
          <AlertCircle className="h-4 w-4 mr-3 flex-shrink-0" />
          <span>If you can't find your order details, please check your confirmation email or contact support.</span>
        </div>
      </div>
    </div>
  );
};

export default TrackOrderPage;
