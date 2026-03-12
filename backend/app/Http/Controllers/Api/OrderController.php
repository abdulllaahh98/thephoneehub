<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Address;
use App\Models\PinCode;
use App\Models\CodEligiblePincode;
use App\Models\Product;
use App\Models\Coupon;
use App\Models\OrderCoupon;
use App\Models\OrderStatusHistory;
use App\Mail\OrderConfirmationMail;
use App\Mail\OrderCancelledMail;
use App\Jobs\SendSmsNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;

class OrderController extends Controller
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
     * POST /api/v1/orders
     */
    public function store(Request $request)
    {
        $request->validate([
            'address_id' => 'required|exists:addresses,id',
            'coupon_code' => 'nullable|string'
        ]);

        try {
            return DB::transaction(function () use ($request) {
                $user = auth('api')->user();

                // a. Validate address
                $address = Address::find($request->address_id);
                if ($address->user_id !== $user->id) {
                    return $this->response(false, 'Unauthorized address', null, null, 403);
                }

                // b. COD is available for all pincodes and any amount

                // c. Grand Total calculation
                $cartItems = $user->cartItems()->with('product.conditionGrade')->get();
                if ($cartItems->isEmpty()) {
                    return $this->response(false, 'Your cart is empty.', null, null, 422);
                }

                $subtotal = $cartItems->sum(function ($item) {
                        return $item->product->price * $item->quantity;
                    }
                    );

                    $discount = 0;
                    $coupon = null;
                    if ($request->coupon_code) {
                        $coupon = Coupon::where('code', $request->coupon_code)->first();
                        if ($coupon) {
                            // Basic validation (reuse logic or assume pre-validated by CouponController)
                            if ($subtotal >= $coupon->min_order_value) {
                                if ($coupon->type === 'percent') {
                                    $discount = ($coupon->value / 100) * $subtotal;
                                    if ($coupon->max_discount && $discount > $coupon->max_discount)
                                        $discount = $coupon->max_discount;
                                }
                                else {
                                    $discount = min($coupon->value, $subtotal);
                                }
                            }
                        }
                    }

                    $afterDiscount = $subtotal - $discount;
                    $gst = round($afterDiscount * 0.18, 2);
                    $grandTotal = round($afterDiscount + $gst, 2);

                    // COD is allowed for any amount

                    // d. Stock check
                    foreach ($cartItems as $item) {
                        if (!$item->product->is_active || $item->product->stock_qty < $item->quantity) {
                            return $this->response(false, "{$item->product->brand} {$item->product->model} is no longer available in the requested quantity.", null, null, 422);
                        }
                    }

                    // e. Generate Order Number
                    $dateStr = date('Ymd');
                    $lastOrderCount = Order::whereDate('created_at', Carbon::today())->lockForUpdate()->count();
                    $sequence = str_pad($lastOrderCount + 1, 5, '0', STR_PAD_LEFT);
                    $orderNumber = "TPH-{$dateStr}-{$sequence}";

                    // f. Create Order
                    $order = Order::create([
                        'order_number' => $orderNumber,
                        'user_id' => $user->id,
                        'address_id' => $address->id,
                        'status' => 'pending',
                        'payment_method' => 'cod',
                        'payment_status' => 'unpaid',
                        'subtotal' => $subtotal,
                        'discount' => $discount,
                        'gst_amount' => $gst,
                        'grand_total' => $grandTotal,
                    ]);

                    // g. Create Order Items & i. Decrement Stock
                    foreach ($cartItems as $item) {
                        $product = $item->product;

                        OrderItem::create([
                            'order_id' => $order->id,
                            'product_id' => $product->id,
                            'product_name' => "{$product->brand} {$product->model}",
                            'storage' => $product->storage,
                            'colour' => $product->colour,
                            'condition' => $product->conditionGrade->grade_name ?? 'Used',
                            'quantity' => $item->quantity,
                            'unit_price' => $product->price,
                            'line_total' => $product->price * $item->quantity,
                        ]);

                        $affected = DB::table('products')
                            ->where('id', $product->id)
                            ->where('stock_qty', '>=', $item->quantity)
                            ->decrement('stock_qty', $item->quantity);

                        if ($affected === 0) {
                            throw new \Exception("Stock unavailable for {$product->brand} {$product->model}.");
                        }
                    }

                    // h. Coupon record
                    if ($coupon) {
                        OrderCoupon::create([
                            'order_id' => $order->id,
                            'coupon_id' => $coupon->id,
                            'discount_amount' => $discount
                        ]);
                        $coupon->increment('used_count');
                    }

                    // j. Status History
                    OrderStatusHistory::create([
                        'order_id' => $order->id,
                        'status' => 'pending',
                        'note' => 'Order placed via COD',
                    ]);

                    // k. Clear Cart
                    $user->cartItems()->delete();

                    // l. Notifications
                    Mail::to($user->email)->queue(new OrderConfirmationMail($order));

                    $pinData = PinCode::where('pin', $address->pincode)->first();
                    $eddDays = $pinData ? $pinData->edd_days : 5;
                    $eddDate = Carbon::now()->addDays($eddDays)->format('Y-m-d');

                    $smsMessage = "Order Confirmed! Your order {$order->orderNumber} of Rs. {$order->grandTotal} will be delivered by {$eddDate}. Please keep cash ready.";
                    dispatch(new SendSmsNotification($user->phone, $smsMessage));

                    return $this->response(true, 'Order placed successfully!', [
                        'order_id' => $order->id,
                        'order_number' => $order->order_number,
                        'status' => $order->status,
                        'payment_method' => $order->payment_method,
                        'payment_status' => $order->payment_status,
                        'grand_total' => $order->grand_total,
                        'estimated_delivery' => $eddDate
                    ], null, 201);
                });
        }
        catch (\Exception $e) {
            return $this->response(false, 'Order placement failed', null, $e->getMessage(), 422);
        }
    }

    /**
     * GET /api/v1/orders
     */
    public function index()
    {
        try {
            $user = auth('api')->user();
            $orders = Order::where('user_id', $user->id)
                ->with(['orderItems' => function ($q) {
                $q->with('product.productImages');
            }])
                ->orderBy('created_at', 'desc')
                ->paginate(10);

            $formatted = $orders->getCollection()->map(function ($order) {
                $firstItem = $order->orderItems->first();
                return [
                'order_id' => $order->id,
                'order_number' => $order->order_number,
                'status' => $order->status,
                'payment_status' => $order->payment_status,
                'grand_total' => $order->grand_total,
                'item_count' => $order->orderItems->sum('quantity'),
                'created_at' => $order->created_at,
                'preview' => [
                'product_name' => $firstItem->product_name ?? 'Product',
                'image' => $firstItem->product->productImages->where('is_primary', true)->first()->image_path
                ?? $firstItem->product->productImages->first()->image_path ?? null
                ]
                ];
            });

            return $this->response(true, 'Orders retrieved', [
                'orders' => $formatted,
                'meta' => [
                    'total' => $orders->total(),
                    'current_page' => $orders->currentPage(),
                    'last_page' => $orders->lastPage()
                ]
            ]);
        }
        catch (\Exception $e) {
            return $this->response(false, 'Failed to fetch orders', null, $e->getMessage(), 500);
        }
    }

    /**
     * GET /api/v1/orders/{id}
     */
    public function show($id)
    {
        try {
            $user = auth('api')->user();
            $order = Order::with([
                'orderItems.product.productImages',
                'statusHistory' => function ($q) {
                $q->orderBy('created_at', 'asc');
            },
                'address',
                'coupon.coupon'
            ])->find($id);

            if (!$order || $order->user_id !== $user->id) {
                return $this->response(false, 'Order not found or unauthorized', null, null, 403);
            }

            return $this->response(true, 'Order details retrieved', $order);
        }
        catch (\Exception $e) {
            return $this->response(false, 'Failed to fetch order details', null, $e->getMessage(), 500);
        }
    }

    /**
     * DELETE /api/v1/orders/{id}
     */
    public function cancel($id)
    {
        try {
            return DB::transaction(function () use ($id) {
                $user = auth('api')->user();
                $order = Order::lockForUpdate()->find($id);

                if (!$order || $order->user_id !== $user->id) {
                    return $this->response(false, 'Order not found', null, null, 404);
                }

                if (!in_array($order->status, ['pending', 'processing'])) {
                    return $this->response(false, 'Order cannot be cancelled after it has been shipped.', null, null, 422);
                }

                // a, b. Update status
                $order->update([
                    'status' => 'cancelled',
                    'payment_status' => 'cancelled'
                ]);

                // c. History
                OrderStatusHistory::create([
                    'order_id' => $order->id,
                    'status' => 'cancelled',
                    'note' => 'Cancelled by customer',
                    'changed_by' => $user->id
                ]);

                // d. Restore stock
                foreach ($order->orderItems as $item) {
                    Product::where('id', $item->product_id)->increment('stock_qty', $item->quantity);
                }

                // e. Notifications
                Mail::to($user->email)->queue(new OrderCancelledMail($order));
                dispatch(new SendSmsNotification($user->phone, "Your order {$order->order_number} has been cancelled."));

                return $this->response(true, 'Your order has been cancelled successfully.', [
                    'order_id' => $order->id,
                    'status' => 'cancelled'
                ]);
            });
        }
        catch (\Exception $e) {
            return $this->response(false, 'Cancellation failed', null, $e->getMessage(), 500);
        }
    }

    /**
     * POST /api/v1/orders/track
     * Publicly track order by ID and Email
     */
    public function publicTrack(Request $request)
    {
        $request->validate([
            'order_number' => 'required|string',
            'email' => 'required|email'
        ]);

        try {
            $order = Order::with([
                'orderItems.product.productImages',
                'statusHistory' => function ($q) {
                    $q->orderBy('created_at', 'asc');
                }
            ])
            ->where('order_number', $request->order_number)
            ->whereHas('user', function($q) use ($request) {
                $q->where('email', $request->email);
            })
            ->first();

            if (!$order) {
                return $this->response(false, 'No order found with the provided details.', null, null, 404);
            }

            return $this->response(true, 'Order status retrieved', [
                'order_number' => $order->order_number,
                'status' => $order->status,
                'created_at' => $order->created_at,
                'items' => $order->orderItems->map(fn($item) => [
                    'name' => $item->product_name,
                    'qty' => $item->quantity
                ]),
                'history' => $order->statusHistory->map(fn($h) => [
                    'status' => $h->status,
                    'note' => $h->note,
                    'time' => $h->created_at
                ])
            ]);
        } catch (\Exception $e) {
            return $this->response(false, 'Tracking failed', null, $e->getMessage(), 500);
        }
    }
}
