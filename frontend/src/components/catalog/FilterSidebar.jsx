import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const FilterSidebar = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const brands = ['Apple', 'Samsung', 'OnePlus', 'Google', 'Xiaomi'];
    const conditions = ['A+', 'A', 'B', 'C'];
    const storageOptions = ['64GB', '128GB', '256GB', '512GB'];
    const ramOptions = ['4GB', '6GB', '8GB', '12GB'];

    const handleCheckboxChange = (category, value) => {
        const currentParams = new URLSearchParams(searchParams);
        const existingValues = currentParams.get(category)?.split(',') || [];

        let newValues;
        if (existingValues.includes(value)) {
            newValues = existingValues.filter((v) => v !== value);
        } else {
            newValues = [...existingValues, value];
        }

        if (newValues.length > 0) {
            currentParams.set(category, newValues.join(','));
        } else {
            currentParams.delete(category);
        }

        currentParams.set('page', '1'); // Reset to page 1 on filter change
        setSearchParams(currentParams);
    };

    const isChecked = (category, value) => {
        return searchParams.get(category)?.split(',').includes(value) || false;
    };

    return (
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Filters</h2>

            {/* Brand Filter */}
            <div className="mb-8">
                <h3 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wider">Brand</h3>
                <div className="space-y-2">
                    {brands.map((brand) => (
                        <label key={brand} className="flex items-center text-sm text-gray-600 cursor-pointer hover:text-orange">
                            <input
                                type="checkbox"
                                className="rounded border-gray-300 text-orange focus:ring-orange mr-3 h-4 w-4"
                                checked={isChecked('brand', brand)}
                                onChange={() => handleCheckboxChange('brand', brand)}
                            />
                            {brand}
                        </label>
                    ))}
                </div>
            </div>

            {/* Condition Grade Filter */}
            <div className="mb-8">
                <h3 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wider">Condition</h3>
                <div className="space-y-2">
                    {conditions.map((grade) => (
                        <label key={grade} className="flex items-center text-sm text-gray-600 cursor-pointer hover:text-orange">
                            <input
                                type="checkbox"
                                className="rounded border-gray-300 text-orange focus:ring-orange mr-3 h-4 w-4"
                                checked={isChecked('condition', grade)}
                                onChange={() => handleCheckboxChange('condition', grade)}
                            />
                            Grade {grade}
                        </label>
                    ))}
                </div>
            </div>

            {/* Storage Filter */}
            <div className="mb-8">
                <h3 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wider">Storage</h3>
                <div className="grid grid-cols-2 gap-2">
                    {storageOptions.map((option) => (
                        <button
                            key={option}
                            onClick={() => handleCheckboxChange('storage', option)}
                            className={`text-xs py-2 rounded border transition-all ${isChecked('storage', option)
                                    ? 'bg-orange text-white border-orange shadow-sm font-bold'
                                    : 'bg-white text-gray-600 border-gray-200 hover:border-orange'
                                }`}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            </div>

            {/* Price Range (Simplified for logic) */}
            <div className="mb-8">
                <h3 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wider">Price Range</h3>
                <input
                    type="range"
                    min="5000"
                    max="150000"
                    step="5000"
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange"
                    onChange={(e) => {
                        const params = new URLSearchParams(searchParams);
                        params.set('max_price', e.target.value);
                        params.set('page', '1');
                        setSearchParams(params);
                    }}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>₹5k</span>
                    <span>Max: ₹{parseInt(searchParams.get('max_price') || 150000).toLocaleString('en-IN')}</span>
                </div>
            </div>

            <button
                onClick={() => setSearchParams({})}
                className="w-full text-sm text-gray-500 hover:text-orange font-medium mt-4 py-2"
            >
                Clear All Filters
            </button>
        </div>
    );
};

export default FilterSidebar;
