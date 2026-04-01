import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import api from '../api/axios';

// Components
import ProductCard from '../components/product/ProductCard';
import ProductSkeleton from '../components/product/ProductSkeleton';
import FilterSidebar from '../components/catalog/FilterSidebar';
import SortBar from '../components/catalog/SortBar';
import useInventoryStore from '../store/useInventoryStore';

const CatalogPage = () => {
  const [searchParams] = useSearchParams();
  const { products: storeProducts } = useInventoryStore();

  // Fetch products function
  const fetchProducts = async ({ pageParam = 1 }) => {
    const q = searchParams.get('q');
    const params = Object.fromEntries(searchParams.entries());
    const response = await api.get('/products', {
      params: { ...params, q, page: pageParam }
    });
    return response.data.data;
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['products', searchParams.toString()],
    queryFn: fetchProducts,
    getNextPageParam: (lastPage) => {
      // Laravel standard pagination: current_page, last_page
      if (lastPage?.current_page < lastPage?.last_page) {
        return lastPage.current_page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });

  // Refetch when searchParams change or storeProducts changes
  useEffect(() => {
    refetch();
  }, [searchParams, storeProducts, refetch]);

  const apiProducts = data?.pages.flatMap((page) => page.products) || [];
  const allProducts = apiProducts;
  const totalCount = data?.pages[0]?.meta?.total || 0;

  if (isError) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Oops! Something went wrong.</h2>
        <p className="text-gray-600 mb-8">We couldn't load the products. Please try again later.</p>
        <button
          onClick={() => refetch()}
          className="bg-navy text-white px-6 py-2 rounded-lg font-bold hover:bg-[#244A6C]"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <Helmet>
<<<<<<< HEAD
        <title>Shop Refurbished Smartphones | ThePhoneHub.in</title>
        <meta name="description" content="Browse our wide selection of certified refurbished smartphones from top brands like Apple, Samsung, and OnePlus." />
=======
        <title>Shop Refurbished Smartphones | PhoneHubX</title>
        <meta name="description" content="Browse our wide selection of certified refurbished smartphones from top brands like Apple, Samsung, and OnePlus at PhoneHubX." />
>>>>>>> a45f52b (payment-integrated)
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <FilterSidebar />
          </aside>

          <main className="flex-grow">
            {searchParams.get('q') && (
              <div className="mb-6">
                <h2 className="text-xl font-black uppercase tracking-tighter">Search results for: <span className="text-orange">"{searchParams.get('q')}"</span></h2>
                <button
                  onClick={() => {
                    const newParams = new URLSearchParams(searchParams);
                    newParams.delete('q');
                    window.history.pushState({}, '', `${window.location.pathname}?${newParams.toString()}`);
                    window.dispatchEvent(new PopStateEvent('popstate'));
                  }}
                  className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-orange transition-colors"
                >
                  Clear Search
                </button>
              </div>
            )}
            <SortBar totalCount={totalCount} />

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                // Show 6 skeletons while loading
                [...Array(6)].map((_, i) => <ProductSkeleton key={i} />)
              ) : (
                allProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              )}
            </div>

            {/* Load More Button */}
            {hasNextPage && (
              <div className="mt-12 text-center">
                <button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="bg-white border-2 border-navy text-navy px-8 py-3 rounded-xl font-bold hover:bg-navy hover:text-white transition-all duration-200 disabled:opacity-50"
                >
                  {isFetchingNextPage ? 'Loading more...' : 'Load More Products'}
                </button>
              </div>
            )}

            {/* No Results Fallback */}
            {!isLoading && allProducts.length === 0 && (
              <div className="py-20 text-center">
                <div className="text-gray-400 mb-4 text-6xl">🔍</div>
                <h3 className="text-xl font-bold text-gray-900">No products found</h3>
                <p className="text-gray-600 mt-2">Try adjusting your filters or search query.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default CatalogPage;
