import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import useCartStore from '../../store/useCartStore';
import toast from 'react-hot-toast';

const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1')
    .replace('/api/v1', '');

const ProductCard = ({ product }) => {
    if (!product) return null;
    const addItem = useCartStore((state) => state.addItem);

    const { id, brand, model, storage, price, mrp, condition, stock_qty, image } = product;

    const isOutOfStock = stock_qty === 0;
    const discount = mrp > 0 ? Math.round(((mrp - price) / mrp) * 100) : 0;

    const imageUrl = (product.image_url || image)
        ? ((product.image_url || image).startsWith('http')
            ? (product.image_url || image)
            : `${BASE_URL}/storage/${product.image_url || image}`)
        : null;

    const getConditionColor = (label) => {
        switch (label) {
            case 'Brand New':
            case 'Mint (Like New)':
            case 'Like New': return 'bg-green-100 text-green-800 border-green-200';
            case 'Excellent': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'Good': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const handleAddToCart = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isOutOfStock) {
            const result = await addItem(id);
            if (result?.success !== false) {
                toast.success(`${brand} ${model} added to cart!`);
            } else {
                toast.error('Please sign in to add items to cart');
            }
        }
    };

    return (
        <Link
            to={`/products/${id}`}
            className="block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:border-orange/30 transition-all duration-200 cursor-pointer relative"
        >
            {/* Discount Badge */}
            {discount > 0 && (
                <div className="absolute top-3 right-3 z-10 bg-orange text-white text-xs font-bold px-2 py-1 rounded-full">
                    {discount}% OFF
                </div>
            )}

            {/* Image Container */}
            <div className="aspect-square bg-gray-50 flex items-center justify-center p-4">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={`${brand} ${model}`}
                        className="object-contain h-full w-full mix-blend-multiply"
                        onError={e => { e.target.style.display = 'none'; }}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-200">
                        <svg className="h-16 w-16" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zm-5 18a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm5-4H7V4h10v12z" />
                        </svg>
                    </div>
                )}
            </div>

            {/* Product Details */}
            <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{brand}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getConditionColor(condition)}`}>
                        {condition}
                    </span>
                </div>

                <h3 className="text-gray-900 font-bold text-sm md:text-base mb-1 truncate">
                    {model} ({storage})
                </h3>

                <div className="flex items-baseline space-x-2 mb-4">
                    <span className="text-orange font-bold text-lg">₹{parseFloat(price).toLocaleString('en-IN')}</span>
                    {mrp > price && (
                        <span className="text-gray-400 text-xs line-through">₹{parseFloat(mrp).toLocaleString('en-IN')}</span>
                    )}
                </div>

                {/* Action Button */}
                <button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className={`w-full flex items-center justify-center py-2.5 rounded-lg font-bold text-sm transition-all duration-200 ${isOutOfStock
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                        : 'bg-navy text-white hover:bg-[#244A6C] active:transform active:scale-95'
                        }`}
                >
                    {isOutOfStock ? (
                        'Out of Stock'
                    ) : (
                        <>
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Add to Cart
                        </>
                    )}
                </button>
            </div>
        </Link>
    );
};

export default ProductCard;
