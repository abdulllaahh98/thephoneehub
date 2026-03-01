import React from 'react';
import { useSearchParams } from 'react-router-dom';

const SortBar = ({ totalCount }) => {
    const [searchParams, setSearchParams] = useSearchParams();

    const sortOptions = [
        { value: 'relevance', label: 'Relevance' },
        { value: 'price_asc', label: 'Price: Low to High' },
        { value: 'price_desc', label: 'Price: High to Low' },
        { value: 'newest', label: 'Newest First' },
        { value: 'popularity', label: 'Popularity' },
    ];

    const handleSortChange = (e) => {
        const params = new URLSearchParams(searchParams);
        params.set('sort', e.target.value);
        params.set('page', '1');
        setSearchParams(params);
    };

    return (
        <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-6">
            <div className="text-sm text-gray-600 mb-4 sm:mb-0">
                <span className="font-bold text-gray-900">{totalCount || 0}</span> products found
            </div>

            <div className="flex items-center">
                <label htmlFor="sort" className="text-sm text-gray-500 mr-3">Sort by:</label>
                <select
                    id="sort"
                    className="text-sm border-gray-200 rounded-lg focus:ring-orange focus:border-orange bg-gray-50 px-3 py-2 cursor-pointer outline-none"
                    value={searchParams.get('sort') || 'relevance'}
                    onChange={handleSortChange}
                >
                    {sortOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default SortBar;
