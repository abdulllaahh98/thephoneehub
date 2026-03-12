import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { MapPin, Search, Loader2, AlertCircle, Plus, Check } from 'lucide-react';
import api from '../../api/axios';

const addressSchema = z.object({
    fullName: z.string().min(3, 'Full name is too short'),
    mobile: z.string().regex(/^[6-9]\d{9}$/, 'Invalid 10-digit mobile number'),
    line1: z.string().min(5, 'Address is too short'),
    line2: z.string().optional(),
    pincode: z.string().length(6, 'Pincode must be 6 digits'),
    city: z.string().min(2, 'City is required'),
    state: z.string().min(2, 'State is required'),
});

const AddressStep = ({ onNext, initialData }) => {
    const [savedAddresses, setSavedAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [isPincodeLoading, setIsPincodeLoading] = useState(false);
    const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [pincodeError, setPincodeError] = useState('');

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(addressSchema),
        defaultValues: initialData || {
            fullName: '',
            mobile: '',
            line1: '',
            line2: '',
            pincode: '',
            city: '',
            state: '',
        },
    });

    useEffect(() => {
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        setIsLoadingAddresses(true);
        try {
            const { data } = await api.get('auth/addresses');
            setSavedAddresses(data);
            if (data.length > 0) {
                const defaultAddr = data.find(a => a.is_default) || data[0];
                setSelectedAddressId(defaultAddr.id);
            } else {
                setShowForm(true);
            }
        } catch (error) {
            console.error('Failed to fetch addresses', error);
            setShowForm(true);
        } finally {
            setIsLoadingAddresses(false);
        }
    };

    const handlePincodeBlur = async (e) => {
        const pin = e.target.value;
        if (pin.length === 6) {
            setIsPincodeLoading(true);
            setPincodeError('');
            try {
                // Mocking pincode API or using a real one if available
                // For now use hardcoded logic or fallback
                if (pin === '110001') {
                    setValue('city', 'Mumbai', { shouldValidate: true });
                    setValue('state', 'Delhi', { shouldValidate: true });
                } else if (pin.startsWith('400')) {
                    setValue('city', 'Mumbai', { shouldValidate: true });
                    setValue('state', 'Maharashtra', { shouldValidate: true });
                } else {
                    setValue('city', 'Detected City', { shouldValidate: true });
                    setValue('state', 'Detected State', { shouldValidate: true });
                }
            } catch (error) {
                setPincodeError('Invalid pincode or server error');
            } finally {
                setIsPincodeLoading(false);
            }
        }
    };

    const onSubmit = async (data) => {
        if (pincodeError) return;
        setIsSubmitting(true);
        try {
            // Save new address to backend
            const payload = {
                name: data.fullName,
                phone: data.mobile,
                line1: data.line1,
                city: data.city,
                state: data.state,
                pin: data.pincode,
                type: 'Home',
                is_default: savedAddresses.length === 0
            };
            const { data: newAddr } = await api.post('auth/addresses', payload);
            console.log('Address saved successfully:', newAddr);
            onNext(newAddr);
        } catch (err) {
            console.error('Save address error:', err);
            alert('Failed to save address: ' + (err.response?.data?.message || 'Please check all fields.'));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSelectedSubmit = () => {
        const addr = savedAddresses.find(a => a.id === selectedAddressId);
        onNext(addr);
    };

    if (isLoadingAddresses) {
        return (
            <div className="bg-white rounded-3xl p-12 flex justify-center items-center shadow-sm border border-gray-100">
                <Loader2 className="h-10 w-10 animate-spin text-orange" />
            </div>
        );
    }

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 lg:p-10">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                    <div className="bg-orange/10 p-2 rounded-xl">
                        <MapPin className="h-6 w-6 text-orange" />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Delivery Address</h2>
                </div>
                {savedAddresses.length > 0 && (
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="text-xs font-black uppercase tracking-widest text-orange flex items-center bg-orange/5 px-4 py-2 rounded-xl hover:bg-orange/10 transition-all"
                    >
                        {showForm ? 'Select Saved' : <><Plus className="h-3 w-3 mr-1" /> Add New</>}
                    </button>
                )}
            </div>

            {!showForm && savedAddresses.length > 0 ? (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {savedAddresses.map((addr) => (
                            <div
                                key={addr.id}
                                onClick={() => setSelectedAddressId(addr.id)}
                                className={`p-6 rounded-2xl border-2 cursor-pointer transition-all relative group ${selectedAddressId === addr.id ? 'border-orange bg-orange/5' : 'border-gray-100 hover:border-gray-200'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <span className="bg-gray-100 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md text-gray-500">{addr.type || 'Home'}</span>
                                    {selectedAddressId === addr.id && <div className="bg-orange text-white rounded-full p-1"><Check className="h-3 w-3" /></div>}
                                </div>
                                <p className="font-black text-gray-900 tracking-tight">{addr.name}</p>
                                <p className="text-xs font-bold text-gray-500 mt-2 leading-relaxed">
                                    {addr.line1}, {addr.city}, {addr.state} - {addr.pin}
                                </p>
                                <p className="text-xs font-black text-gray-400 mt-3">{addr.phone}</p>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={handleSelectedSubmit}
                        className="w-full bg-navy text-white py-4 rounded-2xl font-black text-lg uppercase tracking-widest shadow-lg shadow-navy/20 hover:bg-[#244A6C] active:scale-[0.98] transition-all mt-8"
                    >
                        Continue to Payment
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest text-left block">Full Name</label>
                            <input
                                {...register('fullName')}
                                className={`w-full px-5 py-3 rounded-2xl border bg-gray-50 focus:outline-none focus:ring-2 transition-all font-bold ${errors.fullName ? 'border-red-300 focus:ring-red-100' : 'border-gray-100 focus:ring-orange/20'}`}
                                placeholder="John Doe"
                            />
                            {errors.fullName && <p className="text-red-500 text-[10px] font-bold uppercase">{errors.fullName.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest text-left block">Mobile Number</label>
                            <input
                                {...register('mobile')}
                                className={`w-full px-5 py-3 rounded-2xl border bg-gray-50 focus:outline-none focus:ring-2 transition-all font-bold ${errors.mobile ? 'border-red-300 focus:ring-red-100' : 'border-gray-100 focus:ring-orange/20'}`}
                                placeholder="9876543210"
                                maxLength={10}
                            />
                            {errors.mobile && <p className="text-red-500 text-[10px] font-bold uppercase">{errors.mobile.message}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest text-left block">Address (House No, Building, Street)</label>
                        <input
                            {...register('line1')}
                            className={`w-full px-5 py-3 rounded-2xl border bg-gray-50 focus:outline-none focus:ring-2 transition-all font-bold ${errors.line1 ? 'border-red-300 focus:ring-red-100' : 'border-gray-100 focus:ring-orange/20'}`}
                            placeholder="Flat 101, Galaxy Apartments"
                        />
                        {errors.line1 && <p className="text-red-500 text-[10px] font-bold uppercase">{errors.line1.message}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2 relative">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest text-left block">Pincode</label>
                            <div className="relative">
                                <input
                                    {...register('pincode')}
                                    onBlur={handlePincodeBlur}
                                    className={`w-full px-5 py-3 rounded-2xl border bg-gray-50 focus:outline-none focus:ring-2 transition-all font-bold pr-12 ${errors.pincode || pincodeError ? 'border-red-300 focus:ring-red-100' : 'border-gray-100 focus:ring-orange/20'}`}
                                    placeholder="110001"
                                    maxLength={6}
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                    {isPincodeLoading ? <Loader2 className="h-4 w-4 animate-spin text-orange" /> : <Search className="h-4 w-4 text-gray-300" />}
                                </div>
                            </div>
                            {errors.pincode && <p className="text-red-500 text-[10px] font-bold uppercase">{errors.pincode.message}</p>}
                            {pincodeError && <p className="text-red-500 text-[10px] font-bold uppercase flex items-center"><AlertCircle className="h-3 w-3 mr-1" />{pincodeError}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest text-left block">City</label>
                            <input
                                {...register('city')}
                                className="w-full px-5 py-3 rounded-2xl border border-gray-100 bg-gray-100 focus:outline-none transition-all font-bold uppercase"
                                placeholder="City"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest text-left block">State</label>
                            <input
                                {...register('state')}
                                className="w-full px-5 py-3 rounded-2xl border border-gray-100 bg-gray-100 focus:outline-none transition-all font-bold uppercase"
                                placeholder="State"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-navy text-white py-4 rounded-2xl font-black text-xl uppercase tracking-widest shadow-lg shadow-navy/20 hover:bg-[#244A6C] active:scale-[0.98] transition-all mt-8 flex justify-center items-center"
                    >
                        {isSubmitting ? <Loader2 className="h-6 w-6 animate-spin" /> : 'Continue to Payment'}
                    </button>
                    {savedAddresses.length > 0 && (
                        <button
                            type="button"
                            onClick={() => setShowForm(false)}
                            className="w-full text-xs font-black uppercase tracking-widest text-gray-400 mt-4 hover:text-gray-600 transition-all"
                        >
                            Cancel and use saved address
                        </button>
                    )}
                </form>
            )}
        </div>
    );
};

export default AddressStep;
