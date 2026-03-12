import React, { useState } from 'react';
import { Tag, Plus, Trash2, Edit2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';

const AdminCoupons = () => {
    const queryClient = useQueryClient();
    const [isFormVisible, setIsFormVisible] = useState(false);
    const { register, handleSubmit, reset } = useForm();

    const { data: apiResponse, isLoading } = useQuery({
        queryKey: ['admin-coupons'],
        queryFn: async () => {
            const response = await api.get('admin/coupons');
            return response.data;
        }
    });

    const createMutation = useMutation({
        mutationFn: (newCoupon) => api.post('admin/coupons', newCoupon),
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-coupons']);
            setIsFormVisible(false);
            reset();
            toast.success('Coupon created successfully');
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => api.delete(`admin/coupons/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-coupons']);
            toast.success('Coupon deleted');
        }
    });

    const coupons = apiResponse?.data?.data ?? apiResponse?.data ?? [];

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Promotional Hub</h1>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Configure coupons and discount logic</p>
                </div>
                <button
                    onClick={() => setIsFormVisible(!isFormVisible)}
                    className="flex items-center space-x-2 bg-orange text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-lg shadow-orange/20 hover:scale-105 active:scale-95 transition-all"
                >
                    {isFormVisible ? 'Cancel' : <><Plus className="h-4 w-4" /> <span>Create Coupon</span></>}
                </button>
            </div>

            {isFormVisible && (
                <div className="bg-white rounded-[32px] p-8 lg:p-10 border-2 border-orange/20 shadow-xl shadow-orange/5 animate-in fade-in slide-in-from-top-4 duration-500">
                    <form onSubmit={handleSubmit((data) => createMutation.mutate(data))} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Coupon Code</label>
                            <input {...register('code', { required: true })} type="text" placeholder="e.g. SAVE20" className="w-full bg-gray-50 border border-gray-100 px-5 py-4 rounded-2xl font-black uppercase tracking-widest text-xs outline-none focus:ring-2 focus:ring-orange/20" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Discount Type</label>
                            <select {...register('type')} className="w-full bg-gray-50 border border-gray-100 px-5 py-4 rounded-2xl font-black uppercase tracking-widest text-xs outline-none appearance-none">
                                <option value="percentage">Percentage (%)</option>
                                <option value="flat">Flat Amount (₹)</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Value</label>
                            <input {...register('value', { required: true })} type="number" placeholder="Value" className="w-full bg-gray-50 border border-gray-100 px-5 py-4 rounded-2xl font-black text-xs outline-none" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Expiry Date</label>
                            <input {...register('expires_at')} type="date" className="w-full bg-gray-50 border border-gray-100 px-5 py-4 rounded-2xl font-black text-xs outline-none text-gray-400" />
                        </div>
                        <div className="lg:col-span-4 flex justify-end">
                            <button disabled={createMutation.isLoading} className="bg-navy text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-navy/20 disabled:opacity-50">
                                {createMutation.isLoading ? 'Initializing...' : 'Initialize Coupon'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Coupons List */}
            <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50/50 text-left">
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Code & Type</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Value/Limits</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Usage Stats</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Expiry</th>
                                <th className="px-8 py-6"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {isLoading ? (
                                <tr><td colSpan="5" className="py-20 text-center uppercase font-black text-gray-400 animate-pulse">Scanning Promo Codes...</td></tr>
                            ) : coupons.map((c) => (
                                <tr key={c.id} className="hover:bg-gray-50/30 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center space-x-4">
                                            <div className="bg-orange/10 p-3 rounded-xl text-orange">
                                                <Tag className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-gray-900 uppercase tracking-tight">{c.code}</p>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase">{c.type}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="text-xs font-black text-navy uppercase">
                                            {c.type === 'percentage' ? `${c.value}% Off` : `₹${parseFloat(c.value).toLocaleString('en-IN')} Off`}
                                        </p>
                                        <p className="text-[9px] font-bold text-gray-400 uppercase mt-1">Min Order: ₹{parseFloat(c.min_order_value || 0).toLocaleString('en-IN')}</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="w-full max-w-[120px]">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-[9px] font-black text-gray-400 uppercase">{c.total_used || 0}/{c.usage_limit || '∞'}</span>
                                            </div>
                                            <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-navy" style={{ width: c.usage_limit ? `${((c.total_used || 0) / c.usage_limit) * 100}%` : '5%' }}></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest">{c.expires_at ? new Date(c.expires_at).toLocaleDateString() : 'Never'}</p>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end space-x-2">
                                            <button onClick={() => deleteMutation.mutate(c.id)} className="p-2.5 rounded-xl bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all shadow-sm">
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
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

export default AdminCoupons;
