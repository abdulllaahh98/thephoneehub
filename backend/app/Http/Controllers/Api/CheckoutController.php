<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Address;
use App\Models\Coupon;
use App\Models\PinCode;
use App\Models\CodEligiblePincode;
use Illuminate\Http\Request;

class CheckoutController extends Controller
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
     * POST /api/v1/checkout/summary
     */
    public function summary(Request $request)
    {
        $request->validate([
            'address_id' => 'required|exists:addresses,id',
            'coupon_code' => 'nullable|string'
        ]);

        try {
            $user = auth('api')->user();
            $address = Address::find($request->address_id);
            if ($address->user_id !== $user->id) {
                return $this->response(false, 'Unauthorized address', null, null, 403);
            }

            $cartItems = $user->cartItems()->with('product')->get();
            if ($cartItems->isEmpty()) {
                return $this->response(false, 'Your cart is empty', null, null, 422);
            }

            $subtotal = $cartItems->sum(function ($item) {
                return $item->product->price * $item->quantity;
            });

            // Discount calculation
            $discount = 0;
            $couponId = null;
            if ($request->coupon_code) {
                // We'll reuse logic or call internally
                // For brevity, re-implementing basic check here
                $coupon = Coupon::where('code', $request->coupon_code)->first();
                if ($coupon) {
                    // Quick check if valid
                    if ($subtotal >= $coupon->min_order_value && (!$coupon->expires_at || new \DateTime($coupon->expires_at) >= new \DateTime())) {
                        if ($coupon->type === 'percent') {
                            $discount = ($coupon->value / 100) * $subtotal;
                            if ($coupon->max_discount && $discount > $coupon->max_discount)
                                $discount = $coupon->max_discount;
                        }
                        else {
                            $discount = min($coupon->value, $subtotal);
                        }
                        $couponId = $coupon->id;
                    }
                }
            }

            $afterDiscount = $subtotal - $discount;
            $gst = round($afterDiscount * 0.18, 2);
            $deliveryFee = 0; // Standard free delivery for premium phones?
            $grandTotal = $afterDiscount + $gst + $deliveryFee;

            // COD Check
            $codEligible = CodEligiblePincode::where('pin', $address->pin)->exists();

            return $this->response(true, 'Checkout summary generated', [
                'subtotal' => round($subtotal, 2),
                'discount' => round($discount, 2),
                'after_discount' => round($afterDiscount, 2),
                'gst' => $gst,
                'delivery_fee' => $deliveryFee,
                'grand_total' => round($grandTotal, 2),
                'address' => $address,
                'cod_eligible' => $codEligible,
                'coupon_id' => $couponId
            ]);

        }
        catch (\Exception $e) {
            return $this->response(false, 'Failed to generate summary', null, $e->getMessage(), 500);
        }
    }
}
