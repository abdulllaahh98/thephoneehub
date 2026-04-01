import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useInventoryStore = create(
    persist(
        (set, get) => ({
            products: [
                { id: 1, name: 'iPhone 15 Pro', brand: 'Apple', storage: '256GB', price: 124999, stock: 15, condition: 'Excellent' },
                { id: 2, name: 'Google Pixel 8', brand: 'Google', storage: '128GB', price: 65000, stock: 8, condition: 'Good' },
                { id: 3, name: 'Samsung S24 Ultra', brand: 'Samsung', storage: '512GB', price: 110000, stock: 3, condition: 'Mint' },
            ],

            addProduct: (product) => {
                const { products } = get();
                // Ensure unique ID for demo
                const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
                set({ products: [{ ...product, id: newId }, ...products] });
            },

            removeProduct: (productId) => {
                set((state) => ({
                    products: state.products.filter((p) => p.id !== productId),
                }));
            },

            updateProduct: (updatedProduct) => {
                set((state) => ({
                    products: state.products.map((p) =>
                        p.id === updatedProduct.id ? updatedProduct : p
                    ),
                }));
            },
        }),
        {
            name: 'phonehubx-inventory', // localStorage key
        }
    )
);

export default useInventoryStore;
