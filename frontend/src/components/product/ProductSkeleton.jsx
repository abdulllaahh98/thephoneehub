import React from 'react';

const ProductSkeleton = () => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
            <div className="aspect-square bg-gray-200"></div>
            <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <div className="h-3 w-16 bg-gray-200 rounded"></div>
                    <div className="h-4 w-12 bg-gray-200 rounded"></div>
                </div>
                <div className="h-5 w-3/4 bg-gray-200 rounded mb-2"></div>
                <div className="flex items-baseline space-x-2 mb-4">
                    <div className="h-6 w-20 bg-gray-200 rounded"></div>
                    <div className="h-4 w-16 bg-gray-200 rounded"></div>
                </div>
                <div className="h-10 w-full bg-gray-200 rounded-lg"></div>
            </div>
        </div>
    );
};

export default ProductSkeleton;
