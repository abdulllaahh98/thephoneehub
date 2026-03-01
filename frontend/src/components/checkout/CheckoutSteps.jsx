import React from 'react';
import { MapPin, CreditCard, Eye, CheckCircle2 } from 'lucide-react';

const CheckoutSteps = ({ currentStep }) => {
    const steps = [
        { id: 1, label: 'Address', icon: MapPin },
        { id: 2, label: 'Payment', icon: CreditCard },
        { id: 3, label: 'Review', icon: Eye },
        { id: 4, label: 'Confirmed', icon: CheckCircle2 },
    ];

    return (
        <div className="max-w-3xl mx-auto mb-12">
            <div className="relative flex justify-between">
                {/* Progress Bar Line */}
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -translate-y-1/2 z-0"></div>
                <div
                    className="absolute top-1/2 left-0 h-0.5 bg-orange -translate-y-1/2 z-0 transition-all duration-500"
                    style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                ></div>

                {/* Step Icons */}
                {steps.map((step) => {
                    const Icon = step.icon;
                    const isActive = step.id === currentStep;
                    const isCompleted = step.id < currentStep;

                    return (
                        <div key={step.id} className="relative z-10 flex flex-col items-center">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${isActive ? 'bg-orange border-orange text-white scale-110 shadow-lg shadow-orange/20' :
                                        isCompleted ? 'bg-navy border-navy text-white' :
                                            'bg-white border-gray-200 text-gray-400'
                                    }`}
                            >
                                <Icon className="h-5 w-5" />
                            </div>
                            <span className={`mt-3 text-[10px] font-black uppercase tracking-widest transition-colors ${isActive ? 'text-orange' : isCompleted ? 'text-navy' : 'text-gray-400'
                                }`}>
                                {step.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CheckoutSteps;
