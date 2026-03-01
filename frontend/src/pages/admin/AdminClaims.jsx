import React, { useState } from 'react';
import { Eye } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const AdminClaims = () => {
    const queryClient = useQueryClient();
    const [activeFilter, setActiveFilter] = useState('All');

    const { data: apiResponse, isLoading } = useQuery({
        queryKey: ['admin-claims', activeFilter],
        queryFn: async () => {
            const status = activeFilter === 'All' ? '' : activeFilter.toLowerCase();
            const response = await api.get('admin/warranty-claims', { params: { status } });
            return response.data;
        }
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, status }) => api.patch(`admin/warranty-claims/${id}/status`, { status }),
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-claims']);
            toast.success('Claim status updated');
        }
    });

    const claims = apiResponse?.data?.data || [];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-100 text-yellow-700';
            case 'Approved': return 'bg-green-100 text-green-700';
            case 'Rejected': return 'bg-red-100 text-red-600';
            default: return 'bg-gray-100 text-gray-500';
        }
    };

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Warranty Claims</h1>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Review and process device warranty requests</p>
                </div>
                <div className="flex bg-white p-1 rounded-2xl border border-gray-100 shadow-sm">
                    {['All', 'Pending', 'Actioned'].map(f => (
                        <button
                            key={f}
                            onClick={() => setActiveFilter(f)}
                            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeFilter === f ? 'bg-orange text-white shadow-lg shadow-orange/20' : 'text-gray-400 hover:text-navy'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50/50 text-left">
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Claim ID & Date</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Customer & Device</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Order Ref</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
                                <th className="px-8 py-6"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {isLoading ? (
                                <tr><td colSpan="5" className="py-20 text-center uppercase font-black text-gray-400 animate-pulse">Scanning Claims...</td></tr>
                            ) : claims.map((c) => (
                                <tr key={c.id} className="hover:bg-gray-50/30 transition-colors group">
                                    <td className="px-8 py-6">
                                        <p className="text-xs font-black text-gray-900 uppercase">{c.claim_number}</p>
                                        <p className="text-[9px] font-bold text-gray-400 uppercase mt-1">{new Date(c.created_at).toLocaleDateString()}</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="text-sm font-black text-gray-900 uppercase tracking-tight">{c.warranty?.user?.name}</p>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase">{c.warranty?.product_name}</p>
                                    </td>
                                    <td className="px-8 py-6 text-xs font-bold text-navy uppercase">{c.warranty?.order?.order_number}</td>
                                    <td className="px-8 py-6 text-center">
                                        <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${getStatusColor(c.status.charAt(0).toUpperCase() + c.status.slice(1))}`}>
                                            {c.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end space-x-3">
                                            <select
                                                className="bg-gray-100 border-none text-[9px] font-black uppercase tracking-widest px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-orange/20"
                                                value={c.status}
                                                onChange={(e) => updateMutation.mutate({ id: c.id, status: e.target.value })}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="approved">Approved</option>
                                                <option value="rejected">Rejected</option>
                                                <option value="inspecting">Inspecting</option>
                                            </select>
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

export default AdminClaims;
