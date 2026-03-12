import React, { useState } from 'react';
import { Smartphone } from 'lucide-react';

const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1')
    .replace('/api/v1', '');

const ImageGallery = ({ images = [] }) => {
    const primary = images.find(i => i.is_primary) || images[0];
    const [selected, setSelected] = useState(primary);

    const getUrl = (img) => {
        if (!img) return null;
        const path = img.image_path || img;
        if (path.startsWith('http')) return path;
        return `${BASE_URL}/storage/${path}`;
    };

    const [imgError, setImgError] = useState(false);

    const handleThumbClick = (img) => {
        setSelected(img);
        setImgError(false);
    };

    const mainUrl = getUrl(selected);

    return (
        <div className="flex flex-col gap-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-gray-50 rounded-3xl overflow-hidden border border-gray-100">
                {!imgError && mainUrl ? (
                    <img
                        src={mainUrl}
                        alt="Product"
                        className="w-full h-full object-contain p-6 transition-transform duration-300 hover:scale-110"
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
                        <Smartphone className="h-24 w-24 mb-4" />
                        <span className="text-xs font-bold uppercase tracking-widest text-gray-400">No Image</span>
                    </div>
                )}
            </div>

            {/* Thumbnails — only show if more than 1 image */}
            {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                    {images.map((img, idx) => {
                        const thumbUrl = getUrl(img);
                        const isActive = selected === img || (selected?.id && selected.id === img.id);
                        return (
                            <button
                                key={img.id || idx}
                                onClick={() => handleThumbClick(img)}
                                className={`shrink-0 w-16 h-16 rounded-xl border-2 overflow-hidden bg-gray-50 transition-all ${isActive ? 'border-orange shadow-md shadow-orange/20' : 'border-gray-100 hover:border-gray-300'
                                    }`}
                            >
                                <img
                                    src={thumbUrl}
                                    alt={`View ${idx + 1}`}
                                    className="w-full h-full object-contain p-1"
                                    onError={(e) => { e.target.style.display = 'none'; }}
                                />
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ImageGallery;
