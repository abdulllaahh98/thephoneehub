<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use App\Models\Order;
use Illuminate\Http\Request;
use Carbon\Carbon;

class CouponController extends Controller
{
    protected function response($success, $message, $data = null, $errors = null, $code = 200)
    {
        return response()->json([
            'success' => $success,
            'message' => $message,
            'data'    => $data,
            'errors'  => $errors
        ], $code);
    }

    /**
     * GET /api/v1/admin/coupons
     */
    public function index()
    {
        $coupons = Coupon::orderBy('created_at', 'desc')->get();
        return $this->response(true, 'Coupons retrieved', $coupons);
    }

    /**
     * POST /api/v1/admin/coupons
     */
    public function store(Request $request)
    {
        $request->validate([
            'code'  => 'required|string|unique:coupons,code',
            'type'  => 'required|in:percent,percentage,flat',
            'value' => 'required|numeric|min:0',
        ]);

        // Normalize: frontend sends 'percentage', DB stores 'percent'
        $type = $request->type === 'percentage' ? 'percent' : $request->type;

        $coupon = Coupon::create([
            'code'            => strtoupper(trim($request->code)),
            'type'            => $type,
            'value'           => $request->value,
            'min_order_value' => $request->min_order_value ?? 0,
            'max_discount'    => $request->max_discount ?? null,
            'usage_limit'     => $request->usage_limit ?? null,
            'expires_at'      => $request->expires_at ?? null,
            'used_count'      => 0,
        ]);

        return $this->response(true, 'Coupon created successfully', $coupon, null, 201);
    }

    /**
     * DELETE /api/v1/admin/coupons/{id}
     */
    public function destroy($id)
    {
        $coupon = Coupon::findOrFail($id);
        $coupon->delete();
        return $this->response(true, 'Coupon deleted successfully');
    }

    /**
     * POST /api/v1/coupons/validate
     */
    public function validateCoupon(Request $request)
    {
        $request->validate([
            'code' => 'required|string',
        ]);

        // Accept both field names from frontend (cart_subtotal or cart_total)
        $cartSubtotal = floatval($request->cart_subtotal ?? $request->cart_total ?? 0);

        try {
            $user   = auth('api')->user();
            $coupon = Coupon::where('code', strtoupper(trim($request->code)))->first();

            if (!$coupon) {
                return $this->response(false, 'Coupon code not found. Check the code and try again.', null, null, 422);
            }

            // Expiry check
            if ($coupon->expires_at && Carbon::parse($coupon->expires_at)->isPast()) {
                return $this->response(false, 'This coupon has expired.', null, null, 422);
            }

            // Usage limit
            if ($coupon->usage_limit !== null && $coupon->used_count >= $coupon->usage_limit) {
                return $this->response(false, 'This coupon has reached its usage limit.', null, null, 422);
            }

            // Min order value
            if ($cartSubtotal < floatval($coupon->min_order_value)) {
                return $this->response(false, "Minimum order value of Rs. {$coupon->min_order_value} is required for this coupon.", null, null, 422);
            }

            // Private coupon
            if ($user && $coupon->user_id !== null && $coupon->user_id !== $user->id) {
                return $this->response(false, 'This coupon is not valid for your account.', null, null, 422);
            }

            // Calculate Discount
            $discount = 0;
            if ($coupon->type === 'percent') {
                $discount = ($coupon->value / 100) * $cartSubtotal;
                if ($coupon->max_discount && $discount > $coupon->max_discount) {
                    $discount = $coupon->max_discount;
                }
            } else { // flat
                $discount = min(floatval($coupon->value), $cartSubtotal);
            }

            return $this->response(true, "Coupon applied! You save Rs. " . number_format($discount, 2), [
                'coupon_id'       => $coupon->id,
                'code'            => $coupon->code,
                'discount_amount' => round($discount, 2),
                'final_subtotal'  => round($cartSubtotal - $discount, 2),
            ]);

        } catch (\Exception $e) {
            return $this->response(false, 'Coupon validation failed.', null, $e->getMessage(), 500);
        }
    }
}
