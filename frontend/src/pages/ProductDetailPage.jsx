import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { ChevronRight, ShoppingCart } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

import ImageGallery from '../components/product/ImageGallery';
import ProductInfoDetail from '../components/product/ProductInfoDetail';
import TechnicalSpecs from '../components/product/TechnicalSpecs';
import { WhatInTheBox, WarrantyReturns, RelatedProducts } from '../components/product/ExtraDetails';
import useCartStore from '../store/useCartStore';

/* ── Loading Skeleton ───────────────────────────────────────────────────── */
const Skeleton = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
    <div className="flex gap-2 mb-8">
      {[1, 2, 3].map(i => <div key={i} className="h-4 bg-gray-200 rounded w-20" />)}
    </div>
    <div className="flex flex-col lg:flex-row gap-12">
      <div className="w-full lg:w-[45%] aspect-square bg-gray-200 rounded-3xl" />
      <div className="flex-1 space-y-5">
        <div className="h-4 bg-gray-200 rounded w-20" />
        <div className="h-10 bg-gray-200 rounded w-3/4" />
        <div className="h-8 bg-gray-200 rounded w-1/3" />
        <div className="h-6 bg-gray-200 rounded w-1/2" />
        <div className="flex gap-3">
          {[1, 2, 3].map(i => <div key={i} className="h-10 bg-gray-200 rounded-xl w-20" />)}
        </div>
        <div className="h-14 bg-gray-200 rounded-2xl w-full" />
        <div className="h-16 bg-gray-100 rounded-2xl w-full" />
      </div>
    </div>
  </div>
);

/* ── Main Page ──────────────────────────────────────────────────────────── */
const ProductDetailPage = () => {
  const { id } = useParams();
  const addItem = useCartStore(s => s.addItem);
  const [activeTab, setActiveTab] = useState('specs');

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const response = await api.get(`/products/${id}`);
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) return <Skeleton />;

  if (isError || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="text-6xl">📦</div>
        <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Product Not Found</h2>
        <p className="text-gray-500">The product you're looking for might have been removed or is unavailable.</p>
        <Link to="/products" className="inline-block bg-orange text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-orange/90 transition-all">
          Back to Catalog
        </Link>
      </div>
    );
  }

  const price = parseFloat(product.price);
  const mrp = parseFloat(product.mrp);
  const primaryImage = product.images?.find(i => i.is_primary)?.image_path;
  const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1').replace('/api/v1', '');
  const ogImage = primaryImage
    ? `${BASE_URL}/storage/${primaryImage}`
    : null;

  const tabs = [
    { key: 'specs', label: 'Specifications' },
    { key: 'inbox', label: "What's in the Box" },
    { key: 'warranty', label: 'Warranty & Returns' },
  ];

  const handleMobileAddToCart = async () => {
    await addItem(product.id);
    toast.success(`${product.brand} ${product.model} added to cart!`);
  };

  return (
    <div className="bg-white min-h-screen">
      <Helmet>
        <title>{`${product.brand} ${product.model} ${product.storage} — Buy Refurbished at ₹${price.toLocaleString('en-IN')} | ThePhoneHub.in`}</title>
        <meta name="description" content={`Buy certified refurbished ${product.brand} ${product.model} ${product.storage} in ${product.condition} condition at ₹${price.toLocaleString('en-IN')}. 6-month warranty. Cash on Delivery. ThePhoneHub.in`} />
        {ogImage && <meta property="og:image" content={ogImage} />}
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest flex-wrap">
          <Link to="/" className="hover:text-orange transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/products" className="hover:text-orange transition-colors">Products</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to={`/products?brand=${product.brand}`} className="hover:text-orange transition-colors">{product.brand}</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-gray-700">{product.model}</span>
        </nav>

        {/* Two-column main section */}
        <div className="flex flex-col lg:flex-row gap-12 pb-20">
          {/* Left — Image Gallery (45%) */}
          <div className="w-full lg:w-[45%]">
            <ImageGallery images={product.images || []} />
          </div>

          {/* Right — Product Info (55%) */}
          <div className="w-full lg:w-[55%]">
            <ProductInfoDetail product={product} />
          </div>
        </div>

        {/* ── Tabs ─────────────────────────────────────────────────── */}
        <div className="border-b border-gray-100 mb-10">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map(t => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`px-6 py-4 text-xs font-black uppercase tracking-widest whitespace-nowrap border-b-2 transition-all ${activeTab === t.key
                    ? 'border-orange text-orange'
                    : 'border-transparent text-gray-400 hover:text-gray-700'
                  }`}
              >{t.label}</button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="pb-16">
          {activeTab === 'specs' && <TechnicalSpecs specs={product.specs} />}
          {activeTab === 'inbox' && <WhatInTheBox accessories={product.accessories} />}
          {activeTab === 'warranty' && <WarrantyReturns />}
        </div>

        {/* Related Products */}
        <div className="pb-20">
          <RelatedProducts brand={product.brand} currentId={id} />
        </div>
      </div>

      {/* ── Mobile Sticky Bottom Bar ─────────────────────────────── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-2xl px-4 py-3 z-40 flex items-center gap-4">
        <div className="flex-1">
          <p className="text-xs text-gray-400 font-bold uppercase">Price</p>
          <p className="text-xl font-black text-orange">₹{price.toLocaleString('en-IN')}</p>
        </div>
        <button
          onClick={handleMobileAddToCart}
          disabled={product.stock_qty === 0}
          className={`flex items-center gap-2 px-6 py-3.5 rounded-2xl font-black text-sm uppercase tracking-wide transition-all ${product.stock_qty === 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-orange text-white hover:bg-orange/90 shadow-lg shadow-orange/30'
            }`}
        >
          <ShoppingCart className="h-4 w-4" />
          {product.stock_qty === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default ProductDetailPage;
