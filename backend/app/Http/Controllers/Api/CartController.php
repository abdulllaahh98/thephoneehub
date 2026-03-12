<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Resources\ProductListResource;

class CartController extends Controller
{
    protected function response($success, $message, $data = null, $errors = null, $code = 200)
    {
        return response()->json([
            'success' => $success,
            'message' => $message,
            'data' => $data,
            'errors' => $errors
        ], $code);
    }

    /**
     * GET /api/v1/cart
     */
    public function index()
    {
        try {
            $user = auth('api')->user();
            $items = $user->cartItems()
                ->with(['product.productImages', 'product.conditionGrade'])
                ->get();

            $subtotal = 0;
            $itemsFormatted = $items->map(function ($item) use (&$subtotal) {
                $product = $item->product;
                $itemSubtotal = $product->price * $item->quantity;
                $subtotal += $itemSubtotal;

                return [
                'id' => $item->id,
                'product_id' => $item->product_id,
                'quantity' => $item->quantity,
                'product' => new ProductListResource($product),
                'line_total' => $itemSubtotal,
                'stock_qty' => $product->stock_qty,
                'low_stock' => $product->stock_qty <= 5
                ];
            });

            return $this->response(true, 'Cart retrieved', [
                'items' => $itemsFormatted,
                'subtotal' => $subtotal,
                'item_count' => $items->sum('quantity')
            ]);
        }
        catch (\Exception $e) {
            return $this->response(false, 'Failed to retrieve cart', null, $e->getMessage(), 500);
        }
    }

    /**
     * POST /api/v1/cart/items
     */
    public function addItem(Request $request)
    {
        Log::info('Add to Cart Request Received', $request->all());

        $request->validate([
            'product_id' => 'required|integer',
            'quantity' => 'required|integer|min:1'
        ]);

        try {
            return DB::transaction(function () use ($request) {
                $user = auth('api')->user();
                $product = Product::find($request->product_id);

                if (!$product) {
                    Log::error("Add to Cart Error: Product ID {$request->product_id} not found in database.");
                    return $this->response(false, 'The selected product is invalid or no longer exists.', null, null, 404);
                }

                if (!$product->is_active) {
                    return $this->response(false, 'Product is currently unavailable', null, null, 422);
                }

                $existingItem = $user->cartItems()->where('product_id', $product->id)->first();
                $currentQty = $existingItem ? $existingItem->quantity : 0;
                $requestedQty = $request->quantity;
                $newQty = $currentQty + $requestedQty;

                if ($newQty > 2) {
                    return $this->response(false, 'Maximum 2 units allowed per product per order', null, null, 422);
                }

                if ($product->stock_qty < $newQty) {
                    return $this->response(false, "Only {$product->stock_qty} units left in stock", null, null, 422);
                }

                if ($existingItem) {
                    $existingItem->update(['quantity' => $newQty]);
                    $item = $existingItem;
                }
                else {
                    $item = $user->cartItems()->create([
                        'product_id' => $product->id,
                        'quantity' => $newQty
                    ]);
                }

                return $this->response(true, 'Item added to cart', $item);
            });
        }
        catch (\Exception $e) {
            return $this->response(false, 'Failed to add item', null, $e->getMessage(), 500);
        }
    }

    /**
     * PATCH /api/v1/cart/items/{id}
     */
    public function updateItem(Request $request, $id)
    {
        $request->validate(['quantity' => 'required|integer|min:1|max:2']);

        try {
            return DB::transaction(function () use ($request, $id) {
                $item = auth('api')->user()->cartItems()->find($id);
                if (!$item)
                    return $this->response(false, 'Item not found in your cart', null, null, 404);

                $product = $item->product;
                if ($product->stock_qty < $request->quantity) {
                    return $this->response(false, 'Requested quantity exceeds available stock', null, null, 422);
                }

                $item->update(['quantity' => $request->quantity]);

                // Return updated summary by calling index logic internaly or just returning message
                return $this->index();
            });
        }
        catch (\Exception $e) {
            return $this->response(false, 'Update failed', null, $e->getMessage(), 500);
        }
    }

    /**
     * DELETE /api/v1/cart/items/{id}
     */
    public function removeItem($id)
    {
        try {
            $item = auth('api')->user()->cartItems()->find($id);
            if (!$item)
                return $this->response(false, 'Item not found', null, null, 404);

            $item->delete();
            return $this->response(true, 'Item removed successfully');
        }
        catch (\Exception $e) {
            return $this->response(false, 'Removal failed', null, $e->getMessage(), 500);
        }
    }

    /**
     * DELETE /api/v1/cart
     */
    public function clearCart()
    {
        try {
            auth('api')->user()->cartItems()->delete();
            return $this->response(true, 'Cart cleared successfully');
        }
        catch (\Exception $e) {
            return $this->response(false, 'Clear failed', null, $e->getMessage(), 500);
        }
    }

    /**
     * POST /api/v1/cart/merge
     */
    public function mergeCarts(Request $request)
    {
        $request->validate([
            'items' => 'required|array',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1|max:2'
        ]);

        try {
            return DB::transaction(function () use ($request) {
                $user = auth('api')->user();
                foreach ($request->items as $guestItem) {
                    $product = Product::find($guestItem['product_id']);
                    if (!$product || !$product->is_active)
                        continue;

                    $existing = $user->cartItems()->where('product_id', $product->id)->first();
                    $newQty = min(2, ($existing->quantity ?? 0) + $guestItem['quantity']);

                    if ($product->stock_qty < $newQty) {
                        $newQty = $product->stock_qty;
                    }

                    if ($newQty > 0) {
                        $user->cartItems()->updateOrCreate(
                        ['product_id' => $product->id],
                        ['quantity' => $newQty]
                        );
                    }
                }
                return $this->index();
            });
        }
        catch (\Exception $e) {
            return $this->response(false, 'Merge failed', null, $e->getMessage(), 500);
        }
    }
}
