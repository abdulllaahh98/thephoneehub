import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ShieldCheck, Truck, Clock, Award, Star, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
    const qualitySteps = [
        { title: 'Procurement', desc: 'Sourcing directly from verified vendors and brand-authorized channels.' },
        { title: '40+ Point Inspection', desc: 'Scientific testing of every hardware and software component.' },
        { title: 'Deep Cleaning', desc: 'Restoring aesthetics with professional-grade sanitation.' },
        { title: 'Warranty Tagging', desc: 'Final certification and activation of 6-month support.' },
    ];

    return (
        <div className="bg-white min-h-screen">
            <Helmet>
                <title>About Us | PhoneHubX</title>
            </Helmet>

            {/* Hero Section */}
            <section className="bg-navy text-white py-24 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-orange rounded-full blur-[120px] opacity-10 translate-x-1/2 -translate-y-1/2"></div>
                <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
                    <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6">Our Journey</h1>
                    <p className="text-xl text-blue-100 max-w-2xl mx-auto font-medium">
                        Redefining the refurbished smartphone market in India with trust, transparency, and top-tier quality.
                    </p>
                </div>
            </section>

            {/* Our Process Section */}
            <section id="process" className="py-24 max-w-7xl mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-black uppercase tracking-tighter mb-4">How We Work</h2>
                    <p className="text-gray-500 font-bold tracking-widest uppercase text-xs">Our meticulous certification process</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {qualitySteps.map((step, idx) => (
                        <div key={idx} className="relative p-8 rounded-3xl bg-gray-50 border border-transparent hover:border-orange/20 transition-all group">
                            <span className="absolute -top-4 -left-4 w-12 h-12 bg-navy text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-lg">
                                {idx + 1}
                            </span>
                            <h3 className="text-lg font-black uppercase tracking-tight mb-3 mt-2">{step.title}</h3>
                            <p className="text-sm text-gray-400 font-bold leading-relaxed">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Trust Section */}
            <section className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center gap-16">
                    <div className="flex-1 space-y-8">
                        <h2 className="text-4xl lg:text-5xl font-black tracking-tighter uppercase leading-tight">
                            Why Choose <br />
                            <span className="text-orange text-6xl">PhoneHubX?</span>
                        </h2>
                        <div className="space-y-6">
                            <div className="flex items-start space-x-4">
                                <div className="p-3 bg-white rounded-2xl shadow-sm text-orange">
                                    <ShieldCheck className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="font-black uppercase text-sm">Certified Quality</p>
                                    <p className="text-xs text-gray-400 font-bold">Every device undergoes 40+ manual and automated tests.</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-4">
                                <div className="p-3 bg-white rounded-2xl shadow-sm text-blue-600">
                                    <Clock className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="font-black uppercase text-sm">Quick Support</p>
                                    <p className="text-xs text-gray-400 font-bold">24/7 dedicated support for all your queries and warranty claims.</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-4">
                                <div className="p-3 bg-white rounded-2xl shadow-sm text-green-600">
                                    <Award className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="font-black uppercase text-sm">Best Value</p>
                                    <p className="text-xs text-gray-400 font-bold">Premium tech at nearly half the original price.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 w-full lg:max-w-md">
                        <div className="bg-navy rounded-[40px] p-10 text-white relative overflow-hidden group">
                            <Star className="absolute -top-10 -right-10 w-40 h-40 text-white/5 rotate-12 transition-transform group-hover:scale-110" />
                            <h3 className="text-3xl font-black uppercase tracking-tighter mb-6 relative z-10">Start Your Journey</h3>
                            <p className="text-blue-100 font-medium mb-8 relative z-10 leading-relaxed">
                                Experience the joy of flagship smartphones without breaking the bank. Join 10k+ happy customers today.
                            </p>
                            <Link to="/products" className="inline-flex items-center bg-orange text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-all">
                                Browse Collection <ChevronRight className="ml-2 h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;
