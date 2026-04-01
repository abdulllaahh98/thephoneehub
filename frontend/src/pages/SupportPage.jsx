import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import {
    ChevronDown,
    ChevronUp,
    ShieldCheck,
    FileText,
    Truck,
    RotateCcw,
    HelpCircle,
    Package,
    Clock,
    CreditCard
} from 'lucide-react';

const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-gray-100 rounded-xl mb-4 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
            >
                <span className="font-bold text-gray-800">{question}</span>
                {isOpen ? (
                    <ChevronUp className="h-5 w-5 text-blue-600" />
                ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
            </button>
            <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
            >
                <div className="p-5 pt-0 text-gray-600 leading-relaxed border-t border-gray-50">
                    {answer}
                </div>
            </div>
        </div>
    );
};

const Section = ({ id, title, children, icon: Icon, color = "blue" }) => (
    <section id={id} className="py-20 border-b border-gray-100 last:border-0 scroll-mt-24">
        <div className="max-w-4xl mx-auto px-4">
            <div className="flex items-center space-x-4 mb-10">
                <div className={`p-3 rounded-2xl bg-${color}-50 text-${color}-600`}>
                    <Icon className="h-8 w-8" />
                </div>
                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">{title}</h2>
            </div>
            <div className="prose prose-blue max-w-none">
                {children}
            </div>
        </div>
    </section>
);

const SupportPage = () => {
    const [activeTab, setActiveTab] = useState('faq');

    useEffect(() => {
        const handleScroll = () => {
            const sections = ['faq', 'privacy', 'terms', 'shipping', 'returns'];
            const current = sections.find(section => {
                const el = document.getElementById(section);
                if (el) {
                    const rect = el.getBoundingClientRect();
                    return rect.top >= 0 && rect.top <= 300;
                }
                return false;
            });
            if (current) setActiveTab(current);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItems = [
        { id: 'faq', label: 'FAQ', icon: HelpCircle },
        { id: 'privacy', label: 'Privacy', icon: ShieldCheck },
        { id: 'terms', label: 'Terms', icon: FileText },
        { id: 'shipping', label: 'Shipping', icon: Truck },
        { id: 'returns', label: 'Returns', icon: RotateCcw },
    ];

    return (
        <div className="bg-white min-h-screen font-sans">
            <Helmet>
                <title>Support & Legal Information | PhoneHubX</title>
                <meta name="description" content="Find FAQs, Privacy Policy, Terms of Service, and Shipping details for PhoneHubX" />
            </Helmet>

            {/* Hero Section */}
            <div className="bg-[#f8f9fa] pt-32 pb-20 text-center border-b border-gray-100">
                <div className="max-w-4xl mx-auto px-4">
                    <h1 className="text-5xl md:text-6xl font-black text-[#1e293b] mb-6 tracking-tight">
                        Support & Legal Information
                    </h1>
                    <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed font-medium">
                        Everything you need to know about our services, policies, and how we protect your interests at PhoneHubX.
                    </p>
                </div>
            </div>

            {/* Sticky Navigation */}
            <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-100 shadow-sm overflow-x-auto">
                <div className="max-w-5xl mx-auto px-4 flex justify-between md:justify-center md:space-x-8 py-4 whitespace-nowrap">
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => {
                                const el = document.getElementById(item.id);
                                if (el) el.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-full font-bold text-sm transition-all ${activeTab === item.id
                                ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                                : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50'
                                }`}
                        >
                            <item.icon className="h-4 w-4" />
                            <span>{item.label}</span>
                        </button>
                    ))}
                </div>
            </nav>

            {/* Main Content */}
            <div className="pb-20">
                {/* FAQ Section */}
                <Section id="faq" title="Frequently Asked Questions" icon={HelpCircle} color="blue">
                    <div className="mt-8">
                        <FAQItem
                            question="What is the quality of your refurbished phones?"
                            answer="All our phones undergo a rigorous 42-point quality check by certified technicians. We categorize them into grades (A+, A, B) so you know exactly what to expect in terms of cosmetic condition and performance."
                        />
                        <FAQItem
                            question="Do you provide a warranty?"
                            answer="Yes, every smartphone purchased from PhoneHubX comes with a minimum of 6 months comprehensive warranty covering manufacturing defects and hardware failures."
                        />
                        <FAQItem
                            question="Can I pay via Cash on Delivery?"
                            answer="Absolutely! We offer Cash on Delivery for most pincodes across India. You only pay once the product is delivered to your doorstep."
                        />
                        <FAQItem
                            question="How long does delivery take?"
                            answer="Standard delivery takes 3-5 business days depending on your location. You can check the estimated delivery date on the product page by entering your pincode."
                        />
                        <FAQItem
                            question="What is your return policy?"
                            answer="We offer a 7-day easy replacement policy if the product received is defective or doesn't match the description. Please ensure the original packaging is intact."
                        />
                    </div>
                </Section>

                {/* Privacy Policy Section */}
                <Section id="privacy" title="Privacy Policy" icon={ShieldCheck} color="green">
                    <div className="space-y-8 text-gray-700">
                        <div>
                            <h4 className="text-xl font-bold mb-3 text-gray-900">Information We Collect</h4>
                            <p className="mb-4">We collect information that you provide directly to us, such as when you create an account, make a purchase, or contact support. This includes:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Name, Email Address, and Phone Number</li>
                                <li>Shipping and Billing Addresses</li>
                                <li>Device information and IP address</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-xl font-bold mb-3 text-gray-900">How We Use Your Information</h4>
                            <p>Your data helps us process orders, prevent fraud, and improve your shopping experience. We never sell your personal information to third parties for marketing purposes.</p>
                        </div>
                        <div className="p-6 bg-green-50 rounded-2xl border border-green-100">
                            <p className="text-sm text-green-800 font-medium italic">"We value your trust and prioritize the security of your personal data above all else."</p>
                        </div>
                    </div>
                </Section>

                {/* Terms of Service Section */}
                <Section id="terms" title="Terms of Service" icon={FileText} color="blue">
                    <div className="space-y-6 text-gray-700">
                        <ol className="list-decimal pl-6 space-y-6">
                            <li>
                                <h4 className="font-bold text-gray-900 inline"> Acceptance of Terms: </h4>
                                By accessing PhoneHubX, you agree to abide by these terms and conditions.
                            </li>
                            <li>
                                <h4 className="font-bold text-gray-900 inline"> User Accounts: </h4>
                                You are responsible for maintaining the confidentiality of your account credentials.
                            </li>
                            <li>
                                <h4 className="font-bold text-gray-900 inline"> Product Accuracy: </h4>
                                We strive for absolute accuracy, but slight variations in refurbished cosmetic marks may exist compared to stock photos.
                            </li>
                            <li>
                                <h4 className="font-bold text-gray-900 inline"> Limitation of Liability: </h4>
                                PhoneHubX is not liable for indirect damages arising from the use of our products beyond the replacement cost.
                            </li>
                        </ol>
                    </div>
                </Section>

                {/* Shipping Policy Section */}
                <Section id="shipping" title="Shipping Policy" icon={Truck} color="orange">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="p-6 bg-white border border-gray-100 rounded-3xl shadow-sm text-center">
                            <div className="h-12 w-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Truck className="h-6 w-6" />
                            </div>
                            <h5 className="font-bold mb-2">Free Shipping</h5>
                            <p className="text-sm text-gray-500">On all orders above ₹499 across India.</p>
                        </div>
                        <div className="p-6 bg-white border border-gray-100 rounded-3xl shadow-sm text-center">
                            <div className="h-12 w-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Clock className="h-6 w-6" />
                            </div>
                            <h5 className="font-bold mb-2">3-5 Days</h5>
                            <p className="text-sm text-gray-500">Standard delivery time for most metropolitan cities.</p>
                        </div>
                        <div className="p-6 bg-white border border-gray-100 rounded-3xl shadow-sm text-center">
                            <div className="h-12 w-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Package className="h-6 w-6" />
                            </div>
                            <h5 className="font-bold mb-2">Secure Packing</h5>
                            <p className="text-sm text-gray-500">Shock-proof packaging to ensure safe transit.</p>
                        </div>
                    </div>
                    <p className="text-gray-600 leading-relaxed italic">
                        Note: Shipping times may vary for remote areas or during peak festival seasons.
                    </p>
                </Section>

                {/* Refund Policy Section */}
                <Section id="returns" title="Return & Refund Policy" icon={RotateCcw} color="red">
                    <div className="border-l-4 border-red-500 pl-8 space-y-6">
                        <p className="text-gray-700 leading-relaxed">
                            We offer a <strong>7-Day Easy Replacement</strong> policy. If your device has functional defects that were not disclosed, we will provide a replacement of the same model.
                        </p>
                        <div className="space-y-4">
                            <h4 className="text-xl font-bold text-gray-900">Refund Eligibility:</h4>
                            <ul className="list-disc pl-6 space-y-2 text-gray-600">
                                <li>Refunds are initiated ONLY if a replacement unit is out of stock.</li>
                                <li>Device must be in the same condition as received with all accessories.</li>
                                <li>Software manipulation or rooting voids the return policy.</li>
                            </ul>
                        </div>
                        <div className="flex items-center p-4 bg-gray-50 rounded-2xl border border-gray-200">
                            <CreditCard className="h-5 w-5 text-gray-400 mr-3" />
                            <p className="text-sm text-gray-500 italic">Refunds are processed back to the original payment method within 5-7 business days.</p>
                        </div>
                    </div>
                </Section>
            </div>
        </div>
    );
};

export default SupportPage;
