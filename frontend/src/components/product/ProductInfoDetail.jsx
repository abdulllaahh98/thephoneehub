import React, { useState } from 'react';
import { ShoppingCart, Shield, MapPin, CheckCircle, XCircle, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import useCartStore from '../../store/useCartStore';

// Condition badge colour
const conditionStyles = {
    'A+': 'bg-green-100 text-green-800 border-green-200',
    'A': 'bg-blue-100 text-blue-800 border-blue-200',
    'B': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'C': 'bg-gray-100 text-gray-600 border-gray-200',
};
const conditionLabels = {
    'A+': 'Like New',
    'A': 'Excellent',
    'B': 'Good',
    'C': 'Open Box',
};

const ProductInfoDetail = ({ product }) => {
    const addItem = useCartStore(s => s.addItem);
    const cartItems = useCartStore(s => s.items);
    const navigate = useNavigate();

    const [selectedStorage, setSelectedStorage] = useState(product.storage);
    const [selectedColour, setSelectedColour] = useState(product.colour || '');
    const [currentPrice, setCurrentPrice] = useState(parseFloat(product.price));
    const [currentMrp, setCurrentMrp] = useState(parseFloat(product.mrp));
    const [currentStock, setCurrentStock] = useState(product.stock_qty);

    const [pincode, setPincode] = useState(() => localStorage.getItem('last_pincode') || '');
    const [pincodeResult, setPincodeResult] = useState(null);
    const [pincodeLoading, setPincodeLoading] = useState(false);
    const [pincodeError, setPincodeError] = useState('');

    const grade = product.condition_grade?.grade || product.condition_grade || '';
    const conditionLabel = product.condition_grade?.label || conditionLabels[grade] || grade;
    const conditionDescription = product.condition_grade?.description || '';

    // Unique storages & colours from variants
    const variants = product.variants || [];
    const storages = [...new Set([product.storage, ...variants.map(v => v.storage)].filter(Boolean))];
    const colours = [...new Set([product.colour, ...variants.map(v => v.colour)].filter(Boolean))];

    const discount = currentMrp > currentPrice
        ? Math.round(((currentMrp - currentPrice) / currentMrp) * 100)
        : 0;
    const savings = currentMrp - currentPrice;

    // Cart quantity for this product
    const cartItem = cartItems?.find(c => c.product_id === product.id || c.id === product.id);
    const cartQty = cartItem?.quantity || 0;

    const handleVariantChange = async (storage, colour) => {
        setSelectedStorage(storage);
        setSelectedColour(colour);
        try {
            const params = new URLSearchParams();
            if (storage) params.append('storage', storage);
            if (colour) params.append('colour', colour);
            const res = await api.get(`/products/${product.id}/variants?${params}`);
            const v = res.data.data?.[0];
            if (v) {
                setCurrentPrice(parseFloat(v.price));
                setCurrentMrp(parseFloat(v.mrp));
                setCurrentStock(v.stock_qty);
            }
        } catch { /* use current values */ }
    };

    const handleAddToCart = async () => {
        if (cartQty >= 2) {
            toast.error('Maximum 2 units allowed per product');
            return;
        }
        const result = await addItem(product.id);
        if (result?.success !== false) {
            toast.success(`${product.brand} ${product.model} added to cart!`);
        } else {
            toast.error('Please sign in to add items to cart');
        }
    };

    const checkPincode = async () => {
        const pin = pincode.trim();
        if (!/^\d{6}$/.test(pin)) {
            setPincodeError('Please enter a valid 6-digit PIN code');
            return;
        }
        setPincodeError('');
        setPincodeLoading(true);
        setPincodeResult(null);
        try {
            localStorage.setItem('last_pincode', pin);
            const res = await api.get(`/pincodes/${pin}`);
            setPincodeResult({ ok: true, data: res.data.data });
        } catch {
            setPincodeResult({ ok: false });
        } finally {
            setPincodeLoading(false);
        }
    };

    const stockStatus = () => {
        if (currentStock === 0) return { text: 'Out of Stock', cls: 'text-red-500' };
        if (currentStock <= 3) return { text: `Only ${currentStock} left — Order soon!`, cls: 'text-orange' };
        return { text: 'In Stock', cls: 'text-green-600' };
    };
    const { text: stockText, cls: stockCls } = stockStatus();

    return (
        <div className="space-y-6">
            {/* Brand */}
            <p className="text-xs font-black text-gray-400 uppercase tracking-[0.25em]">{product.brand}</p>

            {/* Model + condition badge */}
            <div className="flex flex-wrap items-start gap-3">
                <h1 className="text-3xl font-black text-navy tracking-tight leading-tight flex-1">{product.model}</h1>
                {grade && (
                    <div className="relative group">
                        <span className={`text-xs font-black px-3 py-1 rounded-full border cursor-help ${conditionStyles[grade] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                            {conditionLabel}
                        </span>
                        {conditionDescription && (
                            <div className="absolute z-10 hidden group-hover:block bottom-full left-0 mb-2 w-52 bg-gray-900 text-white text-xs rounded-xl p-3 shadow-xl">
                                {conditionDescription}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Stars */}
            <div className="flex items-center space-x-2">
                <div className="flex">
                    {[1, 2, 3, 4, 5].map(i => <Star key={i} className="h-4 w-4 fill-orange text-orange" />)}
                </div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Certified Refurbished</span>
            </div>

            {/* Price */}
            <div className="space-y-1">
                <div className="flex items-baseline space-x-3">
                    <span className="text-4xl font-black text-orange">
                        ₹{currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                    {currentMrp > currentPrice && (
                        <span className="text-lg text-gray-400 line-through">
                            ₹{currentMrp.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </span>
                    )}
                </div>
                {discount > 0 && (
                    <span className="inline-block bg-green-100 text-green-700 text-xs font-black px-3 py-1 rounded-full">
                        You save ₹{savings.toLocaleString('en-IN')} ({discount}% OFF)
                    </span>
                )}
            </div>

            <hr className="border-gray-100" />

            {/* Storage Variants */}
            {storages.length > 0 && (
                <div className="space-y-3">
                    <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Storage</p>
                    <div className="flex flex-wrap gap-2">
                        {storages.map(s => (
                            <button
                                key={s}
                                onClick={() => handleVariantChange(s, selectedColour)}
                                className={`px-4 py-2 rounded-xl text-sm font-black border-2 transition-all ${selectedStorage === s
                                    ? 'bg-navy text-white border-navy'
                                    : 'bg-white text-navy border-navy hover:bg-navy/5'
                                    }`}
                            >{s}</button>
                        ))}
                    </div>
                </div>
            )}

            {/* Colour Variants */}
            {colours.filter(Boolean).length > 0 && (
                <div className="space-y-3">
                    <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Colour</p>
                    <div className="flex flex-wrap gap-3">
                        {colours.filter(Boolean).map(c => (
                            <button
                                key={c}
                                onClick={() => handleVariantChange(selectedStorage, c)}
                                title={c}
                                className={`w-8 h-8 rounded-full border-2 transition-all ring-offset-2 ${selectedColour === c ? 'ring-2 ring-orange' : 'ring-0'
                                    }`}
                                style={{ backgroundColor: c.toLowerCase(), borderColor: '#e5e7eb' }}
                            />
                        ))}
                    </div>
                </div>
            )}

            <hr className="border-gray-100" />

            {/* Stock Status */}
            <p className={`text-sm font-black uppercase tracking-widest ${stockCls}`}>● {stockText}</p>

            {/* Pincode Checker */}
            <div className="space-y-3">
                <p className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                    <MapPin className="h-4 w-4" /> Check Delivery
                </p>
                <div className="flex gap-2">
                    <input
                        type="text"
                        maxLength={6}
                        value={pincode}
                        onChange={e => setPincode(e.target.value.replace(/\D/g, ''))}
                        onKeyDown={e => e.key === 'Enter' && checkPincode()}
                        placeholder="Enter 6-digit PIN code"
                        className="flex-1 bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 font-bold text-sm outline-none focus:ring-2 focus:ring-orange/20 transition-all"
                    />
                    <button
                        onClick={checkPincode}
                        disabled={pincodeLoading}
                        className="bg-navy text-white px-5 py-3 rounded-2xl font-black text-sm uppercase tracking-wider hover:bg-navy/90 transition-all disabled:opacity-70"
                    >
                        {pincodeLoading ? '...' : 'Check'}
                    </button>
                </div>
                {pincodeError && <p className="text-xs text-red-500 font-bold">{pincodeError}</p>}
                {pincodeResult?.ok && (
                    <div className="flex items-start space-x-2 text-green-700 bg-green-50 rounded-xl p-3">
                        <CheckCircle className="h-4 w-4 mt-0.5 shrink-0" />
                        <div className="text-xs font-bold space-y-0.5">
                            <p>Delivery available to {pincodeResult.data?.city}, {pincodeResult.data?.state}</p>
                            {pincodeResult.data?.edd_date && <p>Expected by: <strong>{pincodeResult.data.edd_date}</strong></p>}
                            {pincodeResult.data?.cod_available && <p>✓ Cash on Delivery available</p>}
                        </div>
                    </div>
                )}
                {pincodeResult?.ok === false && (
                    <div className="flex items-center space-x-2 text-red-600 bg-red-50 rounded-xl p-3">
                        <XCircle className="h-4 w-4 shrink-0" />
                        <p className="text-xs font-bold">Sorry, delivery not available to this PIN code</p>
                    </div>
                )}
            </div>

            {/* Add to Cart Button */}
            <button
                onClick={handleAddToCart}
                disabled={currentStock === 0}
                className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-black text-base uppercase tracking-widest transition-all ${currentStock === 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-orange text-white hover:bg-orange/90 shadow-lg shadow-orange/20 active:scale-95'
                    }`}
            >
                <ShoppingCart className="h-5 w-5" />
                {currentStock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>

            {/* Warranty Badge */}
            <div className="flex items-start gap-4 bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <div className="bg-orange/10 text-orange p-2 rounded-xl shrink-0">
                    <Shield className="h-5 w-5" />
                </div>
                <div>
                    <p className="font-black text-gray-900 text-sm">6 Month ThePhoneHub Warranty</p>
                    <p className="text-xs text-gray-500 mt-0.5">Covers hardware defects & battery issues</p>
                </div>
            </div>
        </div>
    );
};

export default ProductInfoDetail;
