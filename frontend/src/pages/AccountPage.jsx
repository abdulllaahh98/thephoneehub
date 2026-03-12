import React, { useState, useEffect } from 'react';
import { User, MapPin, Key, Camera, Plus, Edit2, Trash2, Check, Loader2, X, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Helmet } from 'react-helmet-async';
import api from '../api/axios';
import useAuthStore from '../store/useAuthStore';

const profileSchema = z.object({
  name: z.string().min(3, 'Name is too short'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid 10-digit mobile number'),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(6, 'Password is too short'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const AccountPage = () => {
  const { user, updateUser } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [isUpdating, setIsUpdating] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [isAddrModalOpen, setIsAddrModalOpen] = useState(false);
  const [editingAddr, setEditingAddr] = useState(null);

  const { register: regProfile, handleSubmit: handleProfileSubmit, reset: profileReset, formState: { errors: profileErrors } } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name || '', email: user?.email || '', phone: user?.phone || '' }
  });

  useEffect(() => {
    if (user) {
      profileReset({ name: user.name, email: user.email, phone: user.phone });
    }
  }, [user, profileReset]);

  const { register: regPass, handleSubmit: handlePassSubmit, reset: resetPass, formState: { errors: passErrors } } = useForm({
    resolver: zodResolver(passwordSchema)
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const response = await api.get('auth/addresses');
      setAddresses(response.data);
    } catch (err) {
      console.error('Error fetching addresses:', err);
    }
  };

  const onProfileSubmit = async (data) => {
    setIsUpdating(true);
    try {
      const response = await api.put('auth/profile', data);
      updateUser(response.data);
      alert('Profile updated successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  const onPassSubmit = async (data) => {
    setIsUpdating(true);
    try {
      // We'll use the profile update endpoint for password if we add it, 
      // but for now let's assume a dedicated endpoint exists or we add it to AuthController
      await api.put('auth/profile', { password: data.newPassword });
      alert('Password changed successfully!');
      resetPass();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to change password');
    } finally {
      setIsUpdating(false);
    }
  };

  const toggleDefault = async (id) => {
    try {
      await api.put(`auth/addresses/${id}`, { is_default: true });
      fetchAddresses();
    } catch (err) {
      alert('Failed to update default address');
    }
  };

  const deleteAddress = async (id) => {
    if (confirm('Are you sure you want to delete this address?')) {
      try {
        await api.delete(`auth/addresses/${id}`);
        fetchAddresses();
      } catch (err) {
        alert('Failed to delete address');
      }
    }
  };

  const handleAddrSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    // Map frontend names to backend names if different
    const payload = {
      name: data.fullName,
      phone: data.phone || user?.phone || '0000000000',
      line1: data.line1,
      city: data.city,
      state: data.state,
      pin: data.pin,
      type: data.type,
      is_default: editingAddr ? editingAddr.is_default : addresses.length === 0
    };

    setIsUpdating(true);
    try {
      if (editingAddr) {
        await api.put(`auth/addresses/${editingAddr.id}`, payload);
      } else {
        await api.post('auth/addresses', payload);
      }
      fetchAddresses();
      setIsAddrModalOpen(false);
      setEditingAddr(null);
      alert(editingAddr ? 'Address updated successfully!' : 'Address added successfully!');
    } catch (err) {
      alert('Failed to save address. Please check all fields.');
    } finally {
      setIsUpdating(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'orders', label: 'My Orders', icon: ShoppingBag },
    { id: 'addresses', label: 'Saved Addresses', icon: MapPin },
    { id: 'security', label: 'Security', icon: Key },
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-12 lg:py-20">
      <Helmet>
        <title>My Account | ThePhoneHub.in</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Sidebar Tabs */}
          <div className="w-full lg:w-80 shrink-0">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-8 border-b border-gray-50 flex items-center space-x-4">
                <div className="relative group">
                  <div className="w-16 h-16 rounded-2xl bg-orange/10 flex items-center justify-center text-orange font-black text-2xl uppercase tracking-tighter overflow-hidden">
                    {user?.name?.substring(0, 2).toUpperCase() || 'U'}
                  </div>
                  <button className="absolute -bottom-1 -right-1 bg-white p-1.5 rounded-lg shadow-md border border-gray-100 text-gray-400 hover:text-orange transition-colors">
                    <Camera className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div>
                  <h2 className="font-black text-gray-900 uppercase">{user?.name || 'Account'}</h2>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{user?.role === 'superadmin' ? 'Super Admin' : 'Premium Member'}</p>
                </div>
              </div>

              <nav className="p-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        if (tab.id === 'orders') {
                          navigate('/orders');
                        } else {
                          setActiveTab(tab.id);
                        }
                      }}
                      className={`w-full flex items-center space-x-3 px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all ${activeTab === tab.id ? 'bg-orange text-white shadow-lg shadow-orange/20' : 'text-gray-400 hover:bg-gray-50 hover:text-navy'
                        }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-grow">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 lg:p-12">

              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="space-y-10">
                  <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Profile Information</h3>
                  <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Full Name</label>
                      <input {...regProfile('name')} className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 font-bold focus:ring-2 focus:ring-orange/20 transition-all outline-none" placeholder="John Doe" />
                      {profileErrors.name && <p className="text-red-500 text-[10px] font-bold uppercase">{profileErrors.name.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Address</label>
                      <input {...regProfile('email')} className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 font-bold focus:ring-2 focus:ring-orange/20 transition-all outline-none" placeholder="john@example.com" />
                      {profileErrors.email && <p className="text-red-500 text-[10px] font-bold uppercase">{profileErrors.email.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Phone Number</label>
                      <input {...regProfile('phone')} className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 font-bold focus:ring-2 focus:ring-orange/20 transition-all outline-none" placeholder="9876543210" maxLength={10} />
                      {profileErrors.phone && <p className="text-red-500 text-[10px] font-bold uppercase">{profileErrors.phone.message}</p>}
                    </div>
                    <div className="md:col-span-2 pt-4">
                      <button type="submit" disabled={isUpdating} className="bg-navy text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-navy/20 hover:bg-[#244A6C] transition-all flex items-center">
                        {isUpdating ? <Loader2 className="h-5 w-5 animate-spin mr-3" /> : 'Update Profile'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Addresses Tab */}
              {activeTab === 'addresses' && (
                <div className="space-y-10">
                  <div className="flex items-center justify-between">
                    <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">My Addresses</h3>
                    <button
                      onClick={() => { setEditingAddr(null); setIsAddrModalOpen(true); }}
                      disabled={addresses.length >= 5}
                      className="inline-flex items-center space-x-2 bg-orange text-white px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-orange/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add New</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {addresses.map((addr) => (
                      <div key={addr.id} className={`group relative p-6 rounded-3xl border-2 transition-all ${addr.isDefault ? 'border-orange bg-orange/[0.02]' : 'border-gray-100 hover:border-gray-200 bg-gray-50'}`}>
                        <div className="flex justify-between items-start mb-4">
                          <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full ${addr.is_default ? 'bg-orange text-white' : 'bg-gray-200 text-gray-500'}`}>
                            {addr.type} {addr.is_default && '• DEFAULT'}
                          </span>
                          <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => { setEditingAddr(addr); setIsAddrModalOpen(true); }}
                              className="p-2 hover:bg-white rounded-xl shadow-sm text-gray-400 hover:text-navy transition-all"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                            {!addr.isDefault && <button onClick={() => deleteAddress(addr.id)} className="p-2 hover:bg-white rounded-xl shadow-sm text-gray-400 hover:text-red-500 transition-all"><Trash2 className="h-3.5 w-3.5" /></button>}
                          </div>
                        </div>
                        <p className="font-black text-gray-900 uppercase tracking-tight">{addr.name}</p>
                        <p className="text-sm font-bold text-gray-400 mt-2 leading-relaxed">{addr.line1}, {addr.city} - {addr.pin}</p>

                        {!addr.is_default && (
                          <button onClick={() => toggleDefault(addr.id)} className="mt-4 text-[10px] font-black uppercase tracking-widest text-navy border-b border-navy/20 hover:border-navy transition-all pb-1">
                            Set as Default
                          </button>
                        )}
                        {addr.is_default && (
                          <div className="mt-4 flex items-center text-orange">
                            <Check className="h-3 w-3 mr-1" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Primary Address</span>
                          </div>
                        )}
                      </div>
                    ))}
                    {addresses.length === 0 && (
                      <div className="md:col-span-2 py-20 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                        <MapPin className="h-12 w-12 text-gray-200 mx-auto mb-4" />
                        <p className="text-gray-400 font-bold uppercase text-xs">No saved addresses found</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="space-y-10">
                  <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Security Settings</h3>
                  <form onSubmit={handlePassSubmit(onPassSubmit)} className="max-w-md space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Current Password</label>
                      <input {...regPass('currentPassword')} type="password" underline="bg-gray-100" className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 font-bold focus:ring-2 focus:ring-orange/20 transition-all outline-none" placeholder="••••••••" />
                      {passErrors.currentPassword && <p className="text-red-500 text-[10px] font-bold uppercase">{passErrors.currentPassword.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">New Password</label>
                      <input {...regPass('newPassword')} type="password" title="At least 8 characters" className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 font-bold focus:ring-2 focus:ring-orange/20 transition-all outline-none" placeholder="••••••••" />
                      {passErrors.newPassword && <p className="text-red-500 text-[10px] font-bold uppercase">{passErrors.newPassword.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Confirm New Password</label>
                      <input {...regPass('confirmPassword')} type="password" className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 font-bold focus:ring-2 focus:ring-orange/20 transition-all outline-none" placeholder="••••••••" />
                      {passErrors.confirmPassword && <p className="text-red-500 text-[10px] font-bold uppercase">{passErrors.confirmPassword.message}</p>}
                    </div>
                    <div className="pt-6">
                      <button type="submit" disabled={isUpdating} className="w-full bg-navy text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-navy/20 hover:bg-[#244A6C] transition-all flex items-center justify-center">
                        {isUpdating ? <Loader2 className="h-5 w-5 animate-spin mr-3" /> : 'Change Password'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
      {/* Address Modal */}
      {isAddrModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-navy/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-black uppercase tracking-tighter">{editingAddr ? 'Edit Address' : 'Add New Address'}</h3>
              <button onClick={() => setIsAddrModalOpen(false)} className="text-gray-400 hover:text-navy transition-colors">
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleAddrSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1 col-span-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Full Name</label>
                  <input name="fullName" defaultValue={editingAddr?.name} required className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:ring-2 focus:ring-orange/20 outline-none" placeholder="John Doe" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Type</label>
                  <select name="type" defaultValue={editingAddr?.type || 'Home'} className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:ring-2 focus:ring-orange/20 outline-none">
                    <option>Home</option>
                    <option>Work</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Phone Number</label>
                  <input name="phone" defaultValue={editingAddr?.phone || user?.phone} required className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:ring-2 focus:ring-orange/20 outline-none" placeholder="9876543210" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pincode</label>
                  <input name="pin" defaultValue={editingAddr?.pin} required maxLength={6} className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:ring-2 focus:ring-orange/20 outline-none" placeholder="123456" />
                </div>
                <div className="space-y-1 col-span-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Address Line</label>
                  <input name="line1" defaultValue={editingAddr?.line1} required className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:ring-2 focus:ring-orange/20 outline-none" placeholder="Flat No, Street, Area" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">City</label>
                  <input name="city" defaultValue={editingAddr?.city} required className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:ring-2 focus:ring-orange/20 outline-none" placeholder="Mumbai" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">State</label>
                  <input name="state" defaultValue={editingAddr?.state} required className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:ring-2 focus:ring-orange/20 outline-none" placeholder="Maharashtra" />
                </div>
              </div>

              <div className="pt-6 flex gap-4">
                <button type="button" onClick={() => setIsAddrModalOpen(false)} className="flex-1 py-4 rounded-xl border border-gray-100 font-black uppercase text-xs tracking-widest hover:bg-gray-50 transition-all">Cancel</button>
                <button type="submit" className="flex-1 py-4 bg-navy text-white rounded-xl font-black uppercase text-xs tracking-widest shadow-lg shadow-navy/20 hover:scale-105 active:scale-95 transition-all">
                  {editingAddr ? 'Save Changes' : 'Add Address'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountPage;
