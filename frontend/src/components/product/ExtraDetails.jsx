import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Package, X, Shield } from 'lucide-react';
import ProductCard from './ProductCard';
import { useQuery } from '@tanstack/react-query';
import api from '../../api/axios';

// ─── What's In The Box ──────────────────────────────────────────────────────
export const WhatInTheBox = ({ accessories = [] }) => {
    const defaultItems = ['Smartphone', 'USB-C Cable', 'SIM Ejector Tool', 'ThePhoneHub Warranty Card'];
    const items = accessories?.length > 0
        ? accessories.map(a => a.name || a.accessory_name || a)
        : defaultItems;

    return (
        <div className="space-y-4">
            {items.map((item, i) => (
                <div key={i} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-2xl">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                    <span className="font-bold text-gray-700">{item}</span>
                </div>
            ))}
        </div>
    );
};

// ─── Warranty & Returns ──────────────────────────────────────────────────────
export const WarrantyReturns = () => (
    <div className="space-y-8">
        <div>
            <h4 className="font-black text-green-700 uppercase tracking-widest text-sm mb-4">What's Covered</h4>
            <div className="space-y-3">
                {['Hardware defects', 'Screen malfunctions', 'Battery failure (below 80% capacity)'].map((item, i) => (
                    <div key={i} className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                        <span className="text-gray-700 font-medium">{item}</span>
                    </div>
                ))}
            </div>
        </div>

        <div>
            <h4 className="font-black text-red-600 uppercase tracking-widest text-sm mb-4">What's Not Covered</h4>
            <div className="space-y-3">
                {['Physical damage', 'Water damage', 'Software issues', 'Screen cracks'].map((item, i) => (
                    <div key={i} className="flex items-center space-x-3">
                        <X className="h-5 w-5 text-red-500 shrink-0" />
                        <span className="text-gray-700 font-medium">{item}</span>
                    </div>
                ))}
            </div>
        </div>

        <div className="bg-gray-50 rounded-2xl p-6 space-y-2">
            <p className="font-black text-gray-800 text-sm">Warranty Duration: <span className="text-orange">6 Months from delivery date</span></p>
            <p className="text-sm text-gray-500">To raise a claim: Go to <strong>My Orders → Select Order → Raise Warranty Claim</strong></p>
        </div>
    </div>
);

// ─── Related Products ────────────────────────────────────────────────────────
export const RelatedProducts = ({ brand, currentId }) => {
    const { data } = useQuery({
        queryKey: ['related-products', brand],
        queryFn: async () => {
            const res = await api.get(`/products?brand=${encodeURIComponent(brand)}&limit=6`);
            return (res.data.data || res.data || []).filter(p => p.id !== parseInt(currentId));
        },
        enabled: !!brand,
    });

    const products = data || [];
    if (products.length === 0) return null;

    return (
        <div>
            <h2 className="text-2xl font-black text-navy uppercase tracking-tight mb-8">You May Also Like</h2>
            <div className="flex gap-6 overflow-x-auto pb-4">
                {products.map(p => (
                    <div key={p.id} className="shrink-0 w-60">
                        <ProductCard product={p} />
                    </div>
                ))}
            </div>
        </div>
    );
};
