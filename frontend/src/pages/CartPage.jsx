import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { ShoppingCart as CartIcon, Trash2 } from 'lucide-react';
import useCartStore from '../store/useCartStore';

// Components
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';
import EmptyCart from '../components/cart/EmptyCart';

const CartPage = () => {
  const { items, clearCart, getTotal } = useCartStore();
  const currentTotal = getTotal();
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Helmet>
        <title>Shopping Cart | ThePhoneHub.in</title>
        <meta name="description" content="View and manage the items in your shopping cart before proceeding to checkout." />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-navy p-3 rounded-2xl">
              <CartIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Shopping Cart</h1>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none mt-1">
                {itemCount} {itemCount === 1 ? 'Item' : 'Items'} in your bag
              </p>
            </div>
          </div>

          {items.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to empty your cart?')) {
                  clearCart();
                }
              }}
              className="flex items-center text-xs font-black text-red-400 hover:text-red-600 uppercase tracking-widest border border-red-100 hover:border-red-600 px-4 py-2 rounded-lg transition-all"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Cart
            </button>
          )}
        </div>

        {items.length > 0 ? (
          <div className="flex flex-col lg:flex-row gap-10 items-start">
            {/* List of items */}
            <div className="flex-grow w-full">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-10">
                <div className="hidden sm:grid grid-cols-12 gap-4 pb-4 border-b border-gray-100 mb-4">
                  <div className="col-span-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Product Details</div>
                  <div className="col-span-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Price</div>
                </div>

                <div className="divide-y divide-gray-50">
                  {items.map((item) => (
                    <CartItem key={item.id} item={item} />
                  ))}
                </div>
              </div>
            </div>

            {/* Summary Panel */}
            <aside className="w-full lg:w-[400px] flex-shrink-0">
              <CartSummary items={items} currentTotal={currentTotal} />
            </aside>
          </div>
        ) : (
          <EmptyCart />
        )}
      </div>
    </div>
  );
};

export default CartPage;
