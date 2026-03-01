import { create } from 'zustand';
import api from '../api/axios';

const useCartStore = create((set, get) => ({
    items: [],
    isLoading: false,
    // Coupon applied globally so it persists from Cart → Checkout
    appliedCoupon: null, // { code, discount_amount }

    setCoupon: (couponData) => set({ appliedCoupon: couponData }),
    clearCoupon: () => set({ appliedCoupon: null }),

    fetchCart: async () => {
        set({ isLoading: true });
        try {
            const { data } = await api.get('auth/cart');
            // Standardized response: { success: true, data: { items: [...] } }
            const cartData = data.data;
            set({
                items: (cartData.items || []).map(item => {
                    const product = item.product || {};
                    // Normalize image: backend may return image_url, image, or images[]
                    const imageUrl =
                        product.image_url ||
                        product.image ||
                        (Array.isArray(product.images) && product.images[0]) ||
                        null;

                    return {
                        id: product.id,
                        cart_item_id: item.id,
                        sku: product.sku,
                        model: product.model,
                        name: `${product.brand} ${product.model}`,
                        brand: product.brand,
                        price: parseFloat(product.price),
                        qty: item.quantity,
                        quantity: item.quantity,
                        image: imageUrl,
                        image_url: imageUrl,
                        storage: product.storage,
                        colour: product.colour,
                        condition_grade: product.condition_grade || product.condition,
                        stock_qty: product.stock_qty,
                    };
                })
            });
        } catch (error) {
            console.error('Failed to fetch cart', error);
        } finally {
            set({ isLoading: false });
        }
    },

    addItem: async (productId, quantity = 1) => {
        console.log('Adding to cart, productId:', productId);
        try {
            const { data } = await api.post('auth/cart/items', {
                product_id: productId,
                quantity: quantity
            });

            // Re-fetch cart to ensure state is perfectly synced with server logic (caps, stock, etc)
            get().fetchCart();
            return { success: true, message: data.message };
        } catch (error) {
            console.error('Failed to add item', error);
            return { success: false, message: error.response?.data?.message || 'Failed to add item' };
        }
    },

    removeItem: async (cartItemId) => {
        try {
            await api.delete(`auth/cart/items/${cartItemId}`);
            set((state) => ({
                items: state.items.filter(item => item.cart_item_id !== cartItemId)
            }));
            return { success: true };
        } catch (error) {
            console.error('Failed to remove item', error);
            return { success: false };
        }
    },

    updateQuantity: async (cartItemId, quantity) => {
        if (quantity < 1) return;
        try {
            await api.patch(`auth/cart/items/${cartItemId}`, {
                quantity: quantity
            });

            set((state) => ({
                items: state.items.map(item =>
                    item.cart_item_id === cartItemId ? { ...item, qty: quantity } : item
                )
            }));
            return { success: true };
        } catch (error) {
            console.error('Failed to update quantity', error);
            // Re-fetch to revert to server state if failed
            get().fetchCart();
            return { success: false };
        }
    },

    clearCart: async () => {
        try {
            await api.delete('auth/cart');
            set({ items: [], appliedCoupon: null });
            return { success: true };
        } catch (error) {
            console.error('Failed to clear cart', error);
            return { success: false };
        }
    },

    getTotal: () => {
        const items = get().items;
        return items.reduce((total, item) => total + (item.price * item.qty), 0);
    },

    getItemCount: () => {
        const items = get().items;
        return items.reduce((count, item) => count + item.qty, 0);
    },

    mergeCarts: async () => {
        try {
            await api.post('auth/cart/merge');
            get().fetchCart();
        } catch (error) {
            console.error('Failed to merge carts', error);
        }
    }
}));

export default useCartStore;
