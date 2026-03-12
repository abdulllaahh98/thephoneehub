import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const ContactInfo = ({ icon: Icon, title, content, subContent }) => (
  <div className="flex items-start space-x-4 p-6 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
    <div className="bg-blue-50 p-3 rounded-2xl text-blue-600">
      <Icon className="h-6 w-6" />
    </div>
    <div>
      <h3 className="font-bold text-gray-900 border-b-2 border-blue-100 pb-1 mb-2 inline-block">{title}</h3>
      <p className="text-gray-800 font-medium">{content}</p>
      {subContent && <p className="text-sm text-gray-500 mt-1">{subContent}</p>}
    </div>
  </div>
);

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success('Message sent successfully! We will get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="bg-[#fcfcfc] min-h-screen pt-32 pb-20">
      <Helmet>
        <title>Contact Us | ThePhoneHub.in</title>
        <meta name="description" content="Reach out to ThePhoneHub.in for any queries regarding refurbished smartphones." />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-black text-navy uppercase tracking-tighter mb-4">
            Get In <span className="text-blue-600">Touch</span>
          </h1>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">
            We're here to help you with your smartphone journey
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Details */}
          <div className="lg:col-span-1 space-y-6">
            <ContactInfo 
              icon={Phone} 
              title="Call Us" 
              content="+91 12345 67890" 
              subContent="Mon-Sat, 10am - 7pm"
            />
            <ContactInfo 
              icon={Mail} 
              title="Email Us" 
              content="support@thephonehub.in" 
              subContent="We usually reply within 24 hours"
            />
            <ContactInfo 
              icon={MapPin} 
              title="Our Office" 
              content="Mumbai" 
              subContent="Delhi 110019, India"
            />
            <ContactInfo 
              icon={MessageSquare} 
              title="WhatsApp" 
              content="+91 98765 43210" 
              subContent="Quick support on chat"
            />
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 md:p-12 rounded-[2rem] border border-gray-100 shadow-xl shadow-blue-500/5">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-5 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-5 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Subject</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full px-5 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                    placeholder="Inquiry about Warranty"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Message</label>
                  <textarea
                    required
                    rows="5"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full px-5 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                    placeholder="How can we help you?"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full md:w-auto bg-blue-600 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all flex items-center justify-center space-x-3 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Sending...</span>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <Send className="h-5 w-5" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
