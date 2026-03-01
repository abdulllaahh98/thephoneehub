import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { User, Mail, Lock, Phone, Loader2, ArrowRight } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import api from '../api/axios';

const RegisterPage = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState('');
    const { setAuth } = useAuthStore();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        setLoading(true);
        setError('');
        try {
            // Backend expects password_confirmation
            const payload = {
                ...data,
                password_confirmation: data.password
            };
            const response = await api.post('auth/register', payload);
            const { user, access_token } = response.data.data;
            setAuth(user, access_token);
            navigate('/account');
        } catch (err) {
            console.error('Registration full error:', err.response);
            if (err.response?.status === 500) {
                setError('Service is currently unavailable. Please ensure your Database (MySQL) is started in XAMPP.');
            } else {
                const data = err.response?.data;
                let errorMessage = 'Registration failed. Please ensure your details are correct.';
                if (data?.errors) {
                    errorMessage = typeof data.errors === 'string' ? data.errors : Object.values(data.errors).flat()[0];
                } else if (data?.message) {
                    errorMessage = data.message;
                }
                setError(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <Helmet>
                <title>Create Account | ThePhoneHub.in</title>
            </Helmet>

            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
                <div className="text-center">
                    <h2 className="text-4xl font-black text-gray-900 uppercase tracking-tighter">Join The Hub</h2>
                    <p className="mt-2 text-sm font-bold text-gray-400 uppercase tracking-widest">Create your premium account</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl text-xs font-bold uppercase tracking-widest text-center border border-red-100">
                        {error}
                    </div>
                )}

                <form className="mt-8 space-y-4" onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-4">
                        <div className="relative">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                            <div className="relative mt-1">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    {...register('name', { required: 'Name is required' })}
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold focus:ring-2 focus:ring-orange/20 outline-none transition-all"
                                    placeholder="John Doe"
                                />
                            </div>
                            {errors.name && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase ml-1">{errors.name.message}</p>}
                        </div>

                        <div className="relative">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                            <div className="relative mt-1">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    {...register('email', { required: 'Email is required' })}
                                    type="email"
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold focus:ring-2 focus:ring-orange/20 outline-none transition-all"
                                    placeholder="name@example.com"
                                />
                            </div>
                            {errors.email && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase ml-1">{errors.email.message}</p>}
                        </div>

                        <div className="relative">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                            <div className="relative mt-1">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    {...register('phone', { required: 'Phone is required' })}
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold focus:ring-2 focus:ring-orange/20 outline-none transition-all"
                                    placeholder="9876543210"
                                />
                            </div>
                            {errors.phone && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase ml-1">{errors.phone.message}</p>}
                        </div>

                        <div className="relative">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Password</label>
                            <div className="relative mt-1">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 chars' } })}
                                    type="password"
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold focus:ring-2 focus:ring-orange/20 outline-none transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                            {errors.password && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase ml-1">{errors.password.message}</p>}
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-4 px-4 border border-transparent rounded-2xl text-white bg-navy hover:bg-[#244A6C] font-black uppercase tracking-widest transition-all shadow-lg shadow-navy/20 disabled:opacity-70"
                        >
                            {loading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <>
                                    Create Account
                                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-all" />
                                </>
                            )}
                        </button>
                    </div>
                </form>

                <div className="text-center pt-2">
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                        Already have an account?{' '}
                        <Link to="/login" className="text-orange hover:text-orange/80 transition-colors">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
