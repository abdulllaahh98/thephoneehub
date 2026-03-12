import React, { useState } from 'react';
import {
    Plus,
    Search,
    Filter,
    Upload,
    Download,
    Edit2,
    Trash2,
    MoreVertical,
    ChevronRight,
    Smartphone
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const AdminProducts = () => {
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null); // product being edited
    const [editData, setEditData] = useState({});

    // Fetch products
    const { data: apiResponse, isLoading } = useQuery({
        queryKey: ['admin-products', searchTerm],
        queryFn: async () => {
            const response = await api.get('admin/products', { params: { search: searchTerm } });
            return response.data.data;
        }
    });

    const products = apiResponse?.data || [];

    const [formData, setFormData] = useState({
        model: '',
        brand: '',
        price: '',
        storage: '128GB',
        condition: 'Excellent',
        stock_qty: '',
        description: '',
        image: null
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFormData(prev => ({ ...prev, image: e.target.files[0] }));
        }
    };

    // Mutations
    const addMutation = useMutation({
        mutationFn: (newProd) => {
            const data = new FormData();
            Object.keys(newProd).forEach(key => {
                if (newProd[key] !== null) {
                    data.append(key, newProd[key]);
                }
            });
            return api.post('admin/products', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-products']);
            setIsFormOpen(false);
            setFormData({
                model: '',
                brand: '',
                price: '',
                storage: '128GB',
                condition: 'Excellent',
                stock_qty: '',
                description: '',
                image: null
            });
            toast.success('Product added to inventory');
        },
        onError: (error) => {
            const message = error.response?.data?.message || 'Failed to add product';
            toast.error(message);
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => api.delete(`admin/products/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-products']);
            toast.success('Product removed');
        }
    });

    const handleBulkUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            await api.post('admin/products/bulk-upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            queryClient.invalidateQueries(['admin-products']);
            toast.success('Bulk upload successful');
        } catch (err) {
            toast.error('Bulk upload failed');
        }
    };

    const handleAddProduct = (e) => {
        e.preventDefault();
        addMutation.mutate(formData);
    };

    const handleDelete = (id) => {
        if (window.confirm('Confirm deletion?')) {
            deleteMutation.mutate(id);
        }
    };

    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => api.put(`admin/products/${id}`, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-products']);
            setEditingProduct(null);
            setEditData({});
            toast.success('Product updated successfully');
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || 'Failed to update product');
        }
    });

    const handleEdit = (product) => {
        setEditingProduct(product.id);
        setEditData({
            model: product.model || '',
            brand: product.brand || '',
            price: product.price || '',
            storage: product.storage || '128GB',
            condition: product.condition || 'Excellent',
            stock_qty: product.stock_qty ?? '',
            description: product.description || '',
        });
        setIsFormOpen(false); // close add form if open
    };

    const handleEditSubmit = (e, id) => {
        e.preventDefault();
        updateMutation.mutate({ id, data: editData });
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({ ...prev, [name]: value }));
    };

    const filteredProducts = products.filter(p =>
        (p.model || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.brand || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Product Inventory</h1>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Manage single units and bulk stock</p>
                </div>
                <div className="flex items-center gap-4">
                    <label className="flex items-center space-x-2 bg-white border border-gray-100 px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] text-gray-400 hover:text-navy hover:border-gray-300 transition-all cursor-pointer shadow-sm">
                        <Upload className="h-4 w-4" />
                        <span>Bulk CSV</span>
                        <input type="file" className="hidden" accept=".csv" />
                    </label>
                    <button
                        onClick={() => setIsFormOpen(!isFormOpen)}
                        className="flex items-center space-x-2 bg-orange text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-lg shadow-orange/20 hover:scale-105 active:scale-95 transition-all"
                    >
                        {isFormOpen ? <span className="rotate-45 block"><Plus className="h-4 w-4" /></span> : <Plus className="h-4 w-4" />}
                        <span>{isFormOpen ? 'Close Form' : 'Add Product'}</span>
                    </button>
                </div>
            </div>

            {isFormOpen && (
                <div className="bg-white p-10 rounded-[40px] border border-orange/20 shadow-2xl shadow-orange/5 animate-in fade-in slide-in-from-top-6 duration-500">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">New Product Entry</h2>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Fill in the details to initialize a new unit</p>
                        </div>
                        <div className="bg-orange/10 p-4 rounded-2xl text-orange">
                            <Plus className="h-6 w-6" />
                        </div>
                    </div>

                    <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Basic Info */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Model Name</label>
                            <input
                                type="text"
                                name="model"
                                required
                                value={formData.model}
                                onChange={handleInputChange}
                                placeholder="e.g. iPhone 15 Pro Max"
                                className="w-full bg-gray-50 border border-gray-100 px-6 py-4 rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-orange/20 transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Brand</label>
                            <input
                                type="text"
                                name="brand"
                                required
                                value={formData.brand}
                                onChange={handleInputChange}
                                placeholder="e.g. Apple"
                                className="w-full bg-gray-50 border border-gray-100 px-6 py-4 rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-orange/20 transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Price (INR)</label>
                            <input
                                type="number"
                                name="price"
                                required
                                value={formData.price}
                                onChange={handleInputChange}
                                placeholder="99,999"
                                className="w-full bg-gray-50 border border-gray-100 px-6 py-4 rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-orange/20 transition-all"
                            />
                        </div>

                        {/* Specs & Inventory */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Storage Size</label>
                            <select
                                name="storage"
                                value={formData.storage}
                                onChange={handleInputChange}
                                className="w-full bg-gray-50 border border-gray-100 px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] outline-none focus:ring-2 focus:ring-orange/20 transition-all appearance-none"
                            >
                                <option>64GB</option>
                                <option>128GB</option>
                                <option>256GB</option>
                                <option>512GB</option>
                                <option>1TB</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Device Condition</label>
                            <select
                                name="condition"
                                value={formData.condition}
                                onChange={handleInputChange}
                                className="w-full bg-gray-50 border border-gray-100 px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] outline-none focus:ring-2 focus:ring-orange/20 transition-all appearance-none"
                            >
                                <option>Mint (Like New)</option>
                                <option>Excellent</option>
                                <option>Good</option>
                                <option>Fair</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Current Stock</label>
                            <input
                                type="number"
                                name="stock_qty"
                                required
                                value={formData.stock_qty}
                                onChange={handleInputChange}
                                placeholder="Units available"
                                className="w-full bg-gray-50 border border-gray-100 px-6 py-4 rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-orange/20 transition-all"
                            />
                        </div>

                        {/* Description - FULL WIDTH */}
                        <div className="lg:col-span-3 space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Unit Description & Technical Notes</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Detailed specs, battery health, accessories included, etc..."
                                className="w-full bg-gray-50 border border-gray-100 p-8 rounded-[32px] font-bold text-sm min-h-[160px] outline-none focus:ring-4 focus:ring-orange/5 transition-all resize-none"
                            />
                        </div>

                        {/* Image Upload - FULL WIDTH */}
                        <div className="lg:col-span-3 space-y-4">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Product Imagery</label>
                            <div className="relative group">
                                <label className="flex flex-col items-center justify-center w-full h-48 border-4 border-dashed border-gray-100 rounded-[40px] hover:border-orange/30 hover:bg-orange/5 transition-all cursor-pointer">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <div className="bg-white p-4 rounded-2xl shadow-sm mb-4 group-hover:scale-110 transition-transform">
                                            <Upload className="h-6 w-6 text-gray-300 group-hover:text-orange" />
                                        </div>
                                        <p className="mb-1 text-sm font-black text-gray-900 uppercase">Click to upload product image</p>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center px-10">Supporting JPG, PNG, WEBP (Max 5MB)<br />High quality renders preferred</p>
                                    </div>
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                </label>
                                {formData.image && (
                                    <div className="mt-4 p-4 bg-green-50 rounded-2xl flex items-center justify-between border border-green-100">
                                        <div className="flex items-center space-x-3">
                                            <Smartphone className="h-5 w-5 text-green-600" />
                                            <span className="text-[10px] font-black text-green-700 uppercase tracking-widest">{formData.image.name}</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, image: null }))}
                                            className="text-[9px] font-black text-red-500 uppercase hover:underline"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="lg:col-span-3 flex justify-end pt-4">
                            <button
                                type="submit"
                                className="bg-[#1A3A5C] text-white px-12 py-5 rounded-[24px] font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-navy/20 hover:scale-105 active:scale-95 transition-all"
                            >
                                Initialize Product
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Control Bar */}
            <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
                <div className="flex-grow flex items-center bg-gray-50 rounded-2xl px-5 py-3 border border-gray-100 w-full md:w-auto">
                    <Search className="h-4 w-4 text-gray-300" />
                    <input
                        type="text"
                        placeholder="Search by model, brand, or SKU..."
                        className="bg-transparent border-none focus:ring-0 text-sm font-bold w-full ml-3"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button className="flex-grow md:flex-grow-0 flex items-center justify-center space-x-2 bg-gray-50 px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:bg-gray-100 transition-all shadow-sm" onClick={() => alert('Filter UI coming soon!')}>
                        <Filter className="h-4 w-4" />
                        <span>Filter</span>
                    </button>
                    <button className="flex-grow md:flex-grow-0 flex items-center justify-center space-x-2 bg-gray-50 px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:bg-gray-100 transition-all shadow-sm" onClick={() => alert('Preparing CSV Export...')}>
                        <Download className="h-4 w-4" />
                        <span>Export</span>
                    </button>
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50/50 text-left">
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Product Info</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Storage & Condition</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Price</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Stock</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredProducts.map((p) => (
                                <React.Fragment key={p.id}>
                                    <tr className="hover:bg-gray-50/30 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-orange/10 group-hover:text-orange transition-all">
                                                    <Smartphone className="h-6 w-6" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-gray-900 uppercase tracking-tight">{p.model}</p>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase">{p.brand}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center space-x-2">
                                                <span className="text-[10px] font-black uppercase bg-navy/5 text-navy px-2 py-1 rounded-md">{p.storage}</span>
                                                <span className="text-[10px] font-black uppercase bg-orange/5 text-orange px-2 py-1 rounded-md">{p.condition}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <p className="text-sm font-black text-gray-900">₹{parseFloat(p.price).toLocaleString('en-IN')}</p>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full text-xs font-black ${p.stock_qty < 10 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'}`}>
                                                {p.stock_qty}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center justify-center space-x-2">
                                                <button
                                                    onClick={() => editingProduct === p.id ? setEditingProduct(null) : handleEdit(p)}
                                                    className={`p-2.5 rounded-xl transition-all shadow-sm ${
                                                        editingProduct === p.id
                                                            ? 'bg-orange text-white'
                                                            : 'bg-gray-50 text-gray-400 hover:text-navy hover:bg-gray-100'
                                                    }`}
                                                    title="Edit product"
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(p.id)}
                                                    disabled={deleteMutation.isLoading}
                                                    className="p-2.5 rounded-xl bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all shadow-sm disabled:opacity-50"
                                                    title="Delete product"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                    {/* Inline Edit Row */}
                                    {editingProduct === p.id && (
                                        <tr>
                                            <td colSpan="5" className="px-8 py-0">
                                                <div className="bg-blue-50/50 border border-navy/10 rounded-2xl p-6 my-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <p className="text-xs font-black text-navy uppercase tracking-widest">Editing: {p.model}</p>
                                                        <button onClick={() => setEditingProduct(null)} className="text-[10px] font-black text-gray-400 uppercase hover:text-red-500">✕ Close</button>
                                                    </div>
                                                    <form onSubmit={(e) => handleEditSubmit(e, p.id)} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                                                        <div className="space-y-1">
                                                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Model</label>
                                                            <input name="model" value={editData.model} onChange={handleEditChange} className="w-full bg-white border border-gray-200 px-3 py-2 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-navy/20" required />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Brand</label>
                                                            <input name="brand" value={editData.brand} onChange={handleEditChange} className="w-full bg-white border border-gray-200 px-3 py-2 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-navy/20" required />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Price (₹)</label>
                                                            <input name="price" type="number" value={editData.price} onChange={handleEditChange} className="w-full bg-white border border-gray-200 px-3 py-2 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-navy/20" required />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Storage</label>
                                                            <select name="storage" value={editData.storage} onChange={handleEditChange} className="w-full bg-white border border-gray-200 px-3 py-2 rounded-xl text-xs font-bold outline-none">
                                                                <option>64GB</option><option>128GB</option><option>256GB</option><option>512GB</option><option>1TB</option>
                                                            </select>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Stock</label>
                                                            <input name="stock_qty" type="number" min="0" value={editData.stock_qty} onChange={handleEditChange} className="w-full bg-white border border-gray-200 px-3 py-2 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-navy/20" required />
                                                        </div>
                                                        <div className="space-y-1 flex flex-col justify-end">
                                                            <button type="submit" disabled={updateMutation.isLoading} className="w-full bg-navy text-white py-2 rounded-xl text-xs font-black uppercase tracking-widest disabled:opacity-60 hover:bg-[#244A6C] transition-all">
                                                                {updateMutation.isLoading ? 'Saving...' : 'Save Changes'}
                                                            </button>
                                                        </div>
                                                    </form>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="p-8 bg-gray-50/50 border-t border-gray-50 flex items-center justify-between">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Showing {filteredProducts.length} of {products.length} products</p>
                    <div className="flex space-x-2">
                        <button className="px-4 py-2 bg-white border border-gray-100 rounded-xl text-[10px] font-black uppercase text-gray-400 disabled:opacity-50">Prev</button>
                        <button className="px-4 py-2 bg-white border border-gray-100 rounded-xl text-[10px] font-black uppercase text-gray-900 shadow-sm border-orange/40">1</button>
                        <button className="px-4 py-2 bg-white border border-gray-100 rounded-xl text-[10px] font-black uppercase text-gray-400">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminProducts;
