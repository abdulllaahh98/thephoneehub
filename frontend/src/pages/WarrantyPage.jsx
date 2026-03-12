import React, { useState } from 'react';
import { ShieldCheck, Calendar, Info, AlertCircle, Upload, CheckCircle2, ChevronLeft, Loader2 } from 'lucide-react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Helmet } from 'react-helmet-async';
import api from '../api/axios';

const WarrantyPage = () => {
    const { orderId } = useParams();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [claimSuccess, setClaimSuccess] = useState(false);

    const { data: warranty, isLoading, isError } = useQuery({
        queryKey: ['warranty', orderId],
        queryFn: async () => {
            const response = await api.get(`auth/warranties/${orderId}`);
            return response.data.data;
        },
        retry: false,
    });

    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    const onClaimSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('warranty_id', warranty.warranty_id);
            formData.append('issue_category', data.category);
            formData.append('description', data.description);
            // Handle file upload if proof exists
            if (data.proof && data.proof[0]) {
                formData.append('evidence_files[]', data.proof[0]);
            }

            await api.post('auth/warranty-claims', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setClaimSuccess(true);
            reset();
        } catch (err) {
            console.error('Claim submission failed', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <div className="max-w-4xl mx-auto px-4 py-20 text-center uppercase font-black text-gray-400 animate-pulse">Loading warranty details...</div>;

    if (isError || !warranty) return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <Link to="/orders" className="inline-flex items-center text-xs font-black uppercase text-gray-400 hover:text-orange transition-colors mb-12">
                <ChevronLeft className="h-4 w-4 mr-1" /> Back to Orders
            </Link>
            <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100 text-center space-y-6">
                <div className="bg-orange/10 h-20 w-20 rounded-full flex items-center justify-center mx-auto">
                    <ShieldCheck className="h-10 w-10 text-orange" />
                </div>
                <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">No Warranty Found</h2>
                <p className="text-gray-400 font-bold max-w-md mx-auto">
                    Warranty is activated after your order is delivered. If your order is already delivered and you still see this, please contact support.
                </p>
                <Link to="/orders" className="inline-block bg-navy text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs">
                    Back to My Orders
                </Link>
            </div>
        </div>
    );

    const deviceName = warranty.product ? `${warranty.product.brand} ${warranty.product.model}` : 'Your Device';
    const coveredItems = Array.isArray(warranty.coverage?.covered) ? warranty.coverage.covered : ['Hardware defects', 'Screen malfunctions', 'Battery failure below 80%'];
    const notCoveredItems = Array.isArray(warranty.coverage?.not_covered) ? warranty.coverage.not_covered : ['Physical damage', 'Water damage', 'Software issues'];

    return (
        <div className="bg-gray-50 min-h-screen py-12 lg:py-20">
            <Helmet>
                <title>Warranty Details | ThePhoneHub.in</title>
            </Helmet>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link to={`/orders/${orderId}`} className="inline-flex items-center text-xs font-black uppercase text-gray-400 hover:text-orange transition-colors mb-12">
                    <ChevronLeft className="h-4 w-4 mr-1" /> Back to Order
                </Link>

                {/* Warranty Status Card */}
                <div className="bg-[#1A3A5C] text-white rounded-[40px] p-8 lg:p-12 shadow-2xl relative overflow-hidden mb-8">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-orange rounded-full blur-[100px] opacity-20 -translate-y-1/2 translate-x-1/4"></div>

                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                        <div className="space-y-4">
                            <div className="inline-flex items-center space-x-2 bg-white/10 px-3 py-1 rounded-full border border-white/20">
                                <ShieldCheck className="h-4 w-4 text-orange" />
                                <span className="text-[10px] font-black uppercase tracking-widest">{warranty.status} Warranty</span>
                            </div>
                            <h1 className="text-3xl font-black uppercase tracking-tight leading-tight">{deviceName}</h1>
                            {warranty.imei && <p className="text-blue-200 font-bold uppercase tracking-widest text-xs">IMEI: {warranty.imei}</p>}
                            {warranty.order_number && <p className="text-blue-200 font-bold uppercase tracking-widest text-xs">Order: {warranty.order_number}</p>}
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-black text-blue-300 uppercase tracking-widest mb-1">Coverage Ends</p>
                            <p className="text-2xl font-black text-orange">{warranty.end_date ? new Date(warranty.end_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A'}</p>
                            <p className="text-[10px] font-bold text-blue-300 mt-1">{warranty.days_remaining} days remaining</p>
                        </div>
                    </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
                        <div className="flex items-center space-x-3">
                            <Calendar className="h-5 w-5 text-gray-400" />
                            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Key Dates</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-xs font-bold uppercase">
                                <span className="text-gray-400">Warranty Start</span>
                                <span className="text-gray-900">{warranty.start_date ? new Date(warranty.start_date).toLocaleDateString('en-IN') : 'N/A'}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs font-bold uppercase">
                                <span className="text-gray-400">Warranty End</span>
                                <span className="text-gray-900">{warranty.end_date ? new Date(warranty.end_date).toLocaleDateString('en-IN') : 'N/A'}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs font-bold uppercase">
                                <span className="text-gray-400">Status</span>
                                <span className={`font-black px-2 py-1 rounded-lg text-[10px] ${
                                    warranty.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                                }`}>{warranty.status?.toUpperCase()}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
                        <div className="flex items-center space-x-3">
                            <Info className="h-5 w-5 text-gray-400" />
                            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Coverage Details</h3>
                        </div>
                        <div className="space-y-2">
                            <p className="text-[10px] font-black text-green-600 uppercase tracking-widest mb-2">✓ Covered</p>
                            {coveredItems.map((item, i) => <p key={i} className="text-xs font-bold text-gray-500">• {item}</p>)}
                            <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mt-4 mb-2">✗ Not Covered</p>
                            {notCoveredItems.map((item, i) => <p key={i} className="text-xs font-bold text-gray-500">• {item}</p>)}
                        </div>
                    </div>
                </div>

                {/* Raise Claim Banner */}
                <div className="mt-12 bg-white rounded-3xl p-8 lg:p-10 border-2 border-dashed border-gray-200 flex flex-col items-center text-center">
                    <AlertCircle className="h-10 w-10 text-gray-300 mb-6" />
                    <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Facing an issue?</h3>
                    <p className="text-gray-400 font-bold mt-2 mb-8 max-w-md">
                        If your device has a manufacturing defect or software glitch covered under warranty, you can raise a claim instantly.
                    </p>
                    {warranty.status === 'active' ? (
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-navy text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-navy/20 hover:bg-[#244A6C] transition-all active:scale-95"
                        >
                            Raise Warranty Claim
                        </button>
                    ) : (
                        <p className="text-sm font-black text-red-400 uppercase tracking-widest">Warranty Expired — Claims Not Accepted</p>
                    )}
                </div>

                {/* Claim Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-sm">
                        <div className="bg-white rounded-[40px] w-full max-w-2xl p-8 lg:p-12 shadow-2xl relative">
                            {!claimSuccess ? (
                                <>
                                    <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-gray-400 hover:text-gray-600">
                                        <XCircle className="h-6 w-6" />
                                    </button>
                                    <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-8">Claim Submission</h2>

                                    <form onSubmit={handleSubmit(onClaimSubmit)} className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Issue Category</label>
                                            <select
                                                {...register('category', { required: 'Please select a category' })}
                                                className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 font-bold focus:ring-2 focus:ring-orange/20 transition-all outline-none appearance-none"
                                            >
                                                <option value="">Select issue category</option>
                                                <option value="software">Software / Lag Issues</option>
                                                <option value="display">Display / Touch Issues</option>
                                                <option value="battery">Battery Performance</option>
                                                <option value="hardware">Charging / Hardware Ports</option>
                                            </select>
                                            {errors.category && <p className="text-red-500 text-[10px] font-bold uppercase">{errors.category.message}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Description</label>
                                            <textarea
                                                {...register('description', { required: 'Description is required' })}
                                                className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 font-bold focus:ring-2 focus:ring-orange/20 transition-all outline-none min-h-[120px]"
                                                placeholder="Please describe the issue in detail..."
                                            />
                                            {errors.description && <p className="text-red-500 text-[10px] font-bold uppercase">{errors.description.message}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Proof of Issue (Photo/Video)</label>
                                            <div className="border-2 border-dashed border-gray-100 rounded-2xl p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer group">
                                                <Upload className="h-6 w-6 text-gray-300 mx-auto mb-2 group-hover:text-orange transition-colors" />
                                                <p className="text-[10px] font-black uppercase text-gray-400">Drag files or click to upload</p>
                                                <p className="text-[9px] font-bold text-gray-300 mt-1 uppercase">Max size: 5MB</p>
                                            </div>
                                        </div>

                                        <div className="pt-4">
                                            <button type="submit" disabled={isSubmitting} className="w-full bg-orange text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-orange/20 hover:scale-[1.02] transition-all flex items-center justify-center">
                                                {isSubmitting ? <Loader2 className="h-6 w-6 animate-spin" /> : 'Submit Claim'}
                                            </button>
                                        </div>
                                    </form>
                                </>
                            ) : (
                                <div className="text-center py-10 space-y-6">
                                    <div className="bg-green-100 h-20 w-20 rounded-full flex items-center justify-center mx-auto">
                                        <CheckCircle2 className="h-10 w-10 text-green-600" />
                                    </div>
                                    <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Claim Received</h2>
                                    <p className="text-gray-500 font-bold max-w-sm mx-auto leading-relaxed">
                                        Your warranty claim has been successfully registered. Our technical team will review it and contact you within 24-48 business hours.
                                    </p>
                                    <button
                                        onClick={() => { setIsModalOpen(false); setClaimSuccess(false); }}
                                        className="w-full bg-navy text-white py-5 rounded-2xl font-black uppercase tracking-widest"
                                    >
                                        Close
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// Simple X icon since Lucide's X might not be imported as XCircle above
const XCircle = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
);

export default WarrantyPage;
