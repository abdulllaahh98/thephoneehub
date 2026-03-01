<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use Illuminate\Http\Request;

class AdminCouponController extends Controller
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
     * GET /api/v1/admin/coupons
     */
    public function index()
    {
        try {
            $coupons = Coupon::orderBy('created_at', 'desc')->get();
            return $this->response(true, 'Coupons retrieved', $coupons);
        }
        catch (\Exception $e) {
            return $this->response(false, 'Failed to retrieve coupons', null, $e->getMessage(), 500);
        }
    }

    /**
     * POST /api/v1/admin/coupons
     */
    public function store(Request $request)
    {
        $request->validate([
            'code'            => 'required|string|unique:coupons,code',
            'type'            => 'required|in:percent,percentage,flat,fixed',
            'value'           => 'required|numeric|min:0',
            'min_order_value' => 'nullable|numeric|min:0',
            'max_discount'    => 'nullable|numeric|min:0',
            'usage_limit'     => 'nullable|integer|min:1',
            'expires_at'      => 'nullable|date',
        ]);

        // Normalize: frontend sends 'percentage', DB stores 'percent'; 'fixed' → 'flat'
        $typeMap = ['percentage' => 'percent', 'fixed' => 'flat'];
        $type = $typeMap[$request->type] ?? $request->type;

        try {
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
        } catch (\Exception $e) {
            return $this->response(false, 'Failed to create coupon', null, $e->getMessage(), 500);
        }
    }

    /**
     * PUT /api/v1/admin/coupons/{id}
     */
    public function update(Request $request, $id)
    {
        $coupon = Coupon::findOrFail($id);
        $validated = $request->validate([
            'code' => "string|unique:coupons,code,{$id}",
            'value' => 'numeric|min:0',
            'is_active' => 'boolean'
        ]);

        try {
            $coupon->update($validated);
            return $this->response(true, 'Coupon updated successfully', $coupon);
        }
        catch (\Exception $e) {
            return $this->response(false, 'Failed to update coupon', null, $e->getMessage(), 500);
        }
    }

    /**
     * DELETE /api/v1/admin/coupons/{id}
     */
    public function destroy($id)
    {
        try {
            $coupon = Coupon::findOrFail($id);
            $coupon->delete();
            return $this->response(true, 'Coupon deleted successfully');
        }
        catch (\Exception $e) {
            return $this->response(false, 'Failed to delete coupon', null, $e->getMessage(), 500);
        }
    }
}
