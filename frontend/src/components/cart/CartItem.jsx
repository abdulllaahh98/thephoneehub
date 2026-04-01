import React from 'react';
import { Minus, Plus, X, AlertTriangle, Smartphone } from 'lucide-react';
import useCartStore from '../../store/useCartStore';

const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1')
    .replace('/api/v1', '');

// Brand-based gradient colors for placeholder
const brandColors = {
    apple:   'from-gray-700 to-gray-900',
    samsung: 'from-blue-600 to-blue-900',
    google:  'from-green-500 to-green-800',
    oneplus: 'from-red-500 to-red-800',
    xiaomi:  'from-orange-500 to-orange-800',
    default: 'from-navy to-blue-900',
};

const ProductImagePlaceholder = ({ brand, model }) => {
    const key = (brand || '').toLowerCase();
    const gradient = Object.keys(brandColors).find(k => key.includes(k))
        ? brandColors[Object.keys(brandColors).find(k => key.includes(k))]
        : brandColors.default;
    const initials = ((brand || '').charAt(0) + (model || '').charAt(0)).toUpperCase();
    return (
        <div className={`w-full h-full bg-gradient-to-br ${gradient} flex flex-col items-center justify-center rounded-xl`}>
            <Smartphone className="h-6 w-6 text-white/50 mb-1" />
            <span className="text-white/80 font-black text-xs tracking-widest">{initials}</span>
        </div>
    );
};

const CartItem = ({ item }) => {
    const { removeItem, updateQuantity } = useCartStore();
    // Store uses `qty` and `cart_item_id` as field names
    const quantity = item.qty ?? item.quantity ?? 1;
    const cartItemId = item.cart_item_id ?? item.id;
    
    // Convert relative path to full URL
    let imageUrl = item.image || item.image_url;
    if (imageUrl && !imageUrl.startsWith('http')) {
        imageUrl = `${BASE_URL}/storage/${imageUrl}`;
    }

    const handleIncrement = () => {
        if (quantity < 2) {
            updateQuantity(cartItemId, quantity + 1);
        }
    };

    const handleDecrement = () => {
        if (quantity > 1) {
            updateQuantity(cartItemId, quantity - 1);
        }
    };

    return (
        <div className="flex flex-col sm:flex-row items-center py-6 border-b border-gray-100 last:border-0 gap-4 sm:gap-6">
            {/* Product Image */}
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl flex-shrink-0 overflow-hidden border border-gray-100">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={item.model || item.name || 'Product'}
                        className="w-full h-full object-contain bg-white"
                        onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML = '<div class="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex flex-col items-center justify-center"><svg class="h-6 w-6 text-white/50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12" y2="18"/></svg></div>';
                        }}
                    />
                ) : (
                    <ProductImagePlaceholder brand={item.brand} model={item.model} />
                )}
            </div>

            {/* Product Info */}
            <div className="flex-grow text-center sm:text-left">
                <div className="flex justify-between items-start mb-1">
                    <h3 className="text-gray-900 font-bold text-lg leading-tight lg:text-xl">{item.model} ({item.storage})</h3>
                    <button
                        onClick={() => removeItem(cartItemId)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">{item.brand} • Grade {item.condition_grade}</p>

                {/* Price for Mobile */}
                <div className="sm:hidden text-orange font-bold text-lg mb-4">
                    ₹{(item.price * quantity).toLocaleString('en-IN')}
                </div>

                {/* Stock Warning */}
                {item.stock_qty <= 3 && item.stock_qty > 0 && (
                    <div className="inline-flex items-center text-red-500 bg-red-50 px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider mb-4 animate-pulse">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Only {item.stock_qty} left!
                    </div>
                )}

                {/* Controls */}
                <div className="flex items-center justify-center sm:justify-start space-x-4">
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
                        <button
                            onClick={handleDecrement}
                            disabled={quantity <= 1}
                            className="p-2 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                            <Minus className="h-4 w-4 text-gray-600" />
                        </button>
                        <span className="px-5 py-1 font-black text-gray-900 border-x border-gray-200 w-12 text-center select-none">
                            {quantity}
                        </span>
                        <button
                            onClick={handleIncrement}
                            disabled={quantity >= 2}
                            className="p-2 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                            <Plus className="h-4 w-4 text-gray-600" />
                        </button>
                    </div>
                    {quantity >= 2 && (
                        <span className="text-[10px] text-gray-400 font-bold italic uppercase">Max 2 per order</span>
                    )}
                </div>
            </div>

            {/* Unit Price & Total (Desktop) */}
            <div className="hidden sm:block text-right flex-shrink-0 min-w-[120px]">
                <div className="text-orange font-black text-xl mb-1">
                    ₹{(item.price * quantity).toLocaleString('en-IN')}
                </div>
                <div className="text-gray-400 text-xs font-bold">
                    ₹{item.price?.toLocaleString('en-IN')} each
                </div>
            </div>
        </div>
    );
};

export default CartItem;
