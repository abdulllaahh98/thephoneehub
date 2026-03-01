import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import useCartStore from '../store/useCartStore';

// Components
import CheckoutSteps from '../components/checkout/CheckoutSteps';
import AddressStep from '../components/checkout/AddressStep';
import PaymentStep from '../components/checkout/PaymentStep';
import CheckoutReview from '../components/checkout/CheckoutReview';
import OrderSuccess from '../components/checkout/OrderSuccess';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, getTotal, clearCart } = useCartStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [checkoutData, setCheckoutData] = useState({
    address: null,
    paymentInfo: null,
    items: items,
    total: getTotal(),
    order_id: null
  });

  // Redirect if cart is empty and not on success step
  useEffect(() => {
    if (items.length === 0 && currentStep < 4) {
      navigate('/cart');
    }
  }, [items, currentStep, navigate]);

  const handleNext = (data) => {
    if (currentStep === 1) {
      setCheckoutData(prev => ({ ...prev, address: data }));
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCheckoutData(prev => ({
        ...prev,
        paymentInfo: data,
        order_id: data.order_id
      }));
      setCurrentStep(4); // Skip Review for COD if preferred, or go to 3. User said "confirm the order", maybe step 3 is review.
    } else if (currentStep === 3) {
      // Final confirmation
      clearCart();
      setCurrentStep(4);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Helmet>
        <title>Checkout | ThePhoneHub.in</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-20">
        {currentStep < 4 && (
          <div className="text-center mb-12">
            <h1 className="text-3xl lg:text-5xl font-black text-gray-900 uppercase tracking-tighter">Secure Checkout</h1>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.3em] mt-3">Finish your purchase safely</p>
          </div>
        )}

        <CheckoutSteps currentStep={currentStep} />

        <div className="max-w-4xl mx-auto">
          {currentStep === 1 && (
            <AddressStep onNext={handleNext} initialData={checkoutData.address} />
          )}

          {currentStep === 2 && (
            <PaymentStep
              onNext={handleNext}
              onBack={handleBack}
              orderData={checkoutData}
            />
          )}

          {currentStep === 3 && (
            <CheckoutReview
              onNext={handleNext}
              onBack={handleBack}
              orderData={checkoutData}
            />
          )}

          {currentStep === 4 && (
            <OrderSuccess orderData={checkoutData} />
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
