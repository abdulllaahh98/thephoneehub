<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\CartItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    /**
     * Store a newly created order.
     */
    public function store(Request $request)
    {
        $request->validate([
            'address_id' => 'required|exists:addresses,id',
            'payment_method' => 'required|in:cod',
        ]);

        $user = auth('api')->user();
        $cartItems = $user->cartItems()->with('product')->get();

        if ($cartItems->isEmpty()) {
            return response()->json(['message' => 'Cart is empty'], 400);
        }

        $subtotal = $cartItems->sum(function ($item) {
            return ($item->product) ? ($item->product->price * $item->quantity) : 0;
        });

        // Simple tax calculation (18% inclusive for example)
        $gstAmount = $subtotal * 0.18;
        $grandTotal = $subtotal; // Assuming price is inclusive of GST for now

        DB::beginTransaction();
        try {
            $order = Order::create([
                'order_number' => 'TPH-' . date('Ymd') . '-' . strtoupper(Str::random(5)),
                'user_id' => $user->id,
                'address_id' => $request->address_id,
                'status' => 'pending',
                'subtotal' => $subtotal - $gstAmount,
                'gst_amount' => $gstAmount,
                'grand_total' => $grandTotal,
                'payment_method' => 'cod',
            ]);

            foreach ($cartItems as $cartItem) {
                if ($cartItem->product) {
                    OrderItem::create([
                        'order_id' => $order->id,
                        'product_id' => $cartItem->product_id,
                        'product_name' => $cartItem->product->model,
                        'storage' => $cartItem->product->storage,
                        'colour' => $cartItem->product->colour,
                        'condition' => 'Grade A', // Fallback since condition_grade_id is numeric
                        'quantity' => $cartItem->quantity,
                        'unit_price' => $cartItem->product->price,
                        'line_total' => $cartItem->product->price * $cartItem->quantity,
                    ]);
                }
            }

            // Clear Cart
            $user->cartItems()->delete();

            DB::commit();

            return response()->json($order, 201);
        }
        catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Order creation failed: ' . $e->getMessage()], 500);
        }
    }

    /**
     * List user orders.
     */
    public function index()
    {
        $orders = auth('api')->user()->orders()->with('orderItems.product')->latest()->get();
        return response()->json($orders);
    }

    /**
     * Show order details.
     */
    public function show($id)
    {
        $order = auth('api')->user()->orders()->with(['orderItems.product', 'address'])->findOrFail($id);
        return response()->json($order);
    }
}
