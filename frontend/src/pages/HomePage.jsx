import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, RefreshCw, Smartphone, ChevronRight, Award } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const HomePage = () => {
  // Inline SVG brand logos — no CDN dependency
  const brands = [
    {
      name: 'Apple',
      color: 'bg-gray-100',
      svg: (
        <svg viewBox="0 0 56 56" className="h-10 w-auto mb-4 grayscale group-hover:grayscale-0 transition-all" fill="#1d1d1f">
          <path d="M38.5 28.9c-.1-4.5 3.7-6.7 3.9-6.8-2.1-3.1-5.4-3.5-6.6-3.6-2.8-.3-5.5 1.7-6.9 1.7-1.4 0-3.6-1.6-5.9-1.6-3 .1-5.8 1.8-7.4 4.5-3.2 5.5-.8 13.6 2.2 18.1 1.5 2.2 3.3 4.6 5.6 4.5 2.3-.1 3.1-1.4 5.9-1.4 2.7 0 3.5 1.4 5.9 1.4 2.4 0 3.9-2.2 5.4-4.3 1.7-2.5 2.4-4.9 2.4-5-.1-.1-4.4-1.7-4.5-6.5zm-4.2-12c1.2-1.5 2.1-3.5 1.8-5.6-1.8.1-4 1.2-5.2 2.7-1.1 1.3-2.1 3.4-1.8 5.4 2 .2 4-1.1 5.2-2.5z" />
        </svg>
      )
    },
    {
      name: 'Samsung',
      color: 'bg-blue-50',
      svg: (
        <svg viewBox="0 0 300 60" className="h-8 w-auto mb-4 grayscale group-hover:grayscale-0 transition-all">
          <text x="50%" y="80%" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="48" fill="#1428A0" letterSpacing="2">SAMSUNG</text>
        </svg>
      )
    },
    {
      name: 'OnePlus',
      color: 'bg-red-50',
      svg: (
        <svg viewBox="0 0 200 60" className="h-8 w-auto mb-4 grayscale group-hover:grayscale-0 transition-all">
          <text x="50%" y="80%" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="40" fill="#F50514">1+</text>
        </svg>
      )
    },
    {
      name: 'Google',
      color: 'bg-white',
      svg: (
        <svg viewBox="0 0 130 44" className="h-8 w-auto mb-4 transition-all">
          <text fontFamily="Arial, Helvetica, sans-serif" fontWeight="bold" fontSize="32" y="34">
            <tspan fill="#4285F4">G</tspan><tspan fill="#EA4335">o</tspan><tspan fill="#FBBC05">o</tspan><tspan fill="#4285F4">g</tspan><tspan fill="#34A853">l</tspan><tspan fill="#EA4335">e</tspan>
          </text>
        </svg>
      )
    },
    {
      name: 'Xiaomi',
      color: 'bg-orange/10',
      svg: (
        <svg viewBox="0 0 100 100" className="h-10 w-auto mb-4 grayscale group-hover:grayscale-0 transition-all">
          <rect width="100" height="100" rx="20" fill="#FF6900" />
          <text x="50%" y="68%" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="52" fill="white">mi</text>
        </svg>
      )
    },
  ];

  return (
    <div className="bg-gray-50 overflow-hidden">
      <Helmet>
<<<<<<< HEAD
        <title>ThePhoneHub.in | Premium Certified Refurbished Smartphones</title>
=======
        <title>PhoneHubX | Premium Certified Refurbished Smartphones</title>
>>>>>>> a45f52b (payment-integrated)
        <meta name="description" content="India's most trusted shop for certified refurbished smartphones. 6 months warranty, 40+ quality checks, and free shipping." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative bg-[#1A3A5C] text-white py-20 lg:py-32 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-orange rounded-full blur-[120px] opacity-20"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-96 h-96 bg-blue-400 rounded-full blur-[120px] opacity-10"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
            <div className="flex-grow text-center lg:text-left space-y-8 max-w-2xl">
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                <Award className="h-4 w-4 text-orange" />
                <span className="text-xs font-black uppercase tracking-widest">India's Trusted Refurbished Store</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-black leading-[1.1] tracking-tighter">
                Premium Phones. <br />
                <span className="text-orange">Unbeatable Prices.</span>
              </h1>

              <p className="text-lg lg:text-xl text-blue-100 font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
                Get the latest iPhones and Androids at up to 50% off. Every device is certified with 40+ quality checks and 6-month warranty.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                <Link
                  to="/products"
                  className="w-full sm:w-auto bg-orange text-white px-10 py-5 rounded-2xl font-black text-lg uppercase tracking-widest shadow-xl shadow-orange/30 hover:scale-105 transition-all flex items-center justify-center group"
                >
                  Shop Now
                  <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-all" />
                </Link>
                <Link
                  to="/about"
                  className="w-full sm:w-auto bg-white/10 backdrop-blur-md text-white border border-white/20 px-10 py-5 rounded-2xl font-black text-lg uppercase tracking-widest hover:bg-white/20 transition-all text-center"
                >
                  Our Process
                </Link>
              </div>

              <div className="pt-8 flex items-center justify-center lg:justify-start space-x-8 opacity-60">
                <div className="text-center">
                  <p className="text-2xl font-black">10k+</p>
                  <p className="text-[10px] uppercase font-bold tracking-widest">Happy Users</p>
                </div>
                <div className="h-8 w-px bg-white/20"></div>
                <div className="text-center">
                  <p className="text-2xl font-black">40+</p>
                  <p className="text-[10px] uppercase font-bold tracking-widest">Quality Checks</p>
                </div>
                <div className="h-8 w-px bg-white/20"></div>
                <div className="text-center">
                  <p className="text-2xl font-black">6-Mo</p>
                  <p className="text-[10px] uppercase font-bold tracking-widest">Warranty</p>
                </div>
              </div>
            </div>

            <div className="flex-shrink-0 w-full lg:w-[450px] relative mt-12 lg:mt-0">
              <div className="aspect-[4/5] bg-gradient-to-tr from-orange/20 to-blue-400/20 rounded-[40px] border border-white/10 backdrop-blur-sm shadow-2xl overflow-hidden p-6 flex items-center justify-center">
                <Smartphone className="h-64 w-64 text-white/20 absolute -bottom-10 -right-10 rotate-12" />
                <div className="relative z-10 text-center space-y-4">
                  <div className="bg-white/90 p-4 rounded-3xl shadow-xl text-navy">
                    <p className="text-xs font-black uppercase tracking-widest mb-1 text-orange">Best Seller</p>
                    <p className="text-xl font-bold">iPhone 14 Pro</p>
                    <p className="text-navy/50 font-bold line-through">₹1,29,900</p>
                    <p className="text-2xl font-black">₹64,999</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-around gap-8">
          <div className="flex items-center space-x-4">
            <div className="bg-green-50 p-3 rounded-2xl">
              <ShieldCheck className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-tight">6 Month Warranty</p>
              <p className="text-xs text-gray-400 font-bold">100% Assurance</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-orange/10 p-3 rounded-2xl">
              <Truck className="h-6 w-6 text-orange" />
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-tight">Free Delivery</p>
              <p className="text-xs text-gray-400 font-bold">Across India</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-blue-50 p-3 rounded-2xl">
              <RefreshCw className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-tight">7 Days Return</p>
              <p className="text-xs text-gray-400 font-bold">No Questions Asked</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-2">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 uppercase tracking-tighter">Latest Arrivals</h2>
            <p className="text-gray-500 font-bold tracking-widest uppercase text-xs">Freshly certified devices just for you</p>
          </div>
          <Link to="/products" className="group inline-flex items-center text-xs font-black uppercase tracking-widest text-navy bg-white border-2 border-navy/10 px-6 py-3 rounded-xl hover:bg-navy hover:text-white transition-all">
            View All Products
            <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-all" />
          </Link>
        </div>

        <FeaturedProducts />
      </section>

      {/* Brand Grid */}
      <section className="py-24 max-w-7xl mx-auto px-4">
        <div className="text-center mb-16 px-4">
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 uppercase tracking-tighter mb-4">Shop by Brand</h2>
          <p className="text-gray-500 font-bold tracking-widest uppercase text-xs">Certified devices from your favorite brands</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 lg:gap-8">
          {brands.map((brand) => (
            <Link
              key={brand.name}
              to={`/products?brand=${brand.name}`}
              className={`group ${brand.color} h-40 rounded-3xl p-8 flex flex-col items-center justify-center border border-transparent hover:border-orange/20 hover:shadow-xl hover:shadow-orange/5 transition-all duration-300`}
            >
              {brand.svg}
              <span className="text-xs font-black uppercase tracking-widest text-gray-400 group-hover:text-orange">{brand.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Teaser */}
      <section className="py-24 bg-navy text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-orange -skew-x-12 translate-x-1/2 opacity-10"></div>

        <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="space-y-6 text-center lg:text-left">
            <h2 className="text-4xl lg:text-5xl font-black tracking-tighter uppercase leading-tight">
              Looking for <br />
              <span className="text-orange">Something specific?</span>
            </h2>
            <p className="text-blue-200 font-bold lg:max-w-md">
              Filter by condition, storage, price or brand. Our smart filters help you find the perfect device.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center text-xs font-black uppercase tracking-[0.2em] border-b-2 border-orange pb-2 hover:text-orange transition-all"
            >
              Explore Full Collection
              <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 flex-shrink-0">
            <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10 w-40 text-center">
              <Smartphone className="h-8 w-8 text-orange mx-auto mb-4" />
              <p className="text-[10px] font-black uppercase">iPhones</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10 w-40 text-center translate-y-8">
              <Smartphone className="h-8 w-8 text-blue-400 mx-auto mb-4" />
              <p className="text-[10px] font-black uppercase">Androids</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const FeaturedProducts = () => {
  const [products, setProducts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchLatest = async () => {
      try {
        const response = await api.get('/products', { params: { limit: 4 } });
        setProducts(response.data.data.products.slice(0, 4));
      } catch (error) {
        console.error('Failed to fetch latest products', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLatest();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl h-80 animate-pulse border border-gray-100"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
      {products.length === 0 && (
        <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-gray-100 italic text-gray-400">
          More amazing deals coming soon!
        </div>
      )}
    </div>
  );
};

// Also add missing imports if any
import api from '../api/axios';
import ProductCard from '../components/product/ProductCard';

export default HomePage;
