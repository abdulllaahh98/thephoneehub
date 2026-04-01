<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\WarrantyClaim;
use Illuminate\Http\Request;

class AdminWarrantyController extends Controller
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
     * GET /api/v1/admin/warranty-claims
     */
    public function index(Request $request)
    {
        try {
            $claims = WarrantyClaim::with(['warranty.user', 'warranty.product'])
                ->when($request->status, function ($q) use ($request) {
                $q->where('status', $request->status);
            })
                ->orderBy('created_at', 'desc')
                ->paginate(20);

            return $this->response(true, 'Warranty claims retrieved', $claims);
        }
        catch (\Exception $e) {
            return $this->response(false, 'Failed to retrieve claims', null, $e->getMessage(), 500);
        }
    }

    /**
     * GET /api/v1/admin/warranty-claims/{id}
     */
    public function show($id)
    {
        try {
            $claim = WarrantyClaim::with(['warranty.user', 'warranty.product', 'warranty.order.address'])
                ->findOrFail($id);

            return $this->response(true, 'Claim details retrieved', $claim);
        }
        catch (\Exception $e) {
            return $this->response(false, 'Claim not found', null, $e->getMessage(), 404);
        }
    }

    /**
     * PATCH /api/v1/admin/warranty-claims/{id}
     */
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:received,under_review,approved,rejected,resolved',
            'note' => 'nullable|string'
        ]);

        try {
            $claim = WarrantyClaim::findOrFail($id);
            $claim->update([
                'status' => $request->status,
                'resolved_at' => in_array($request->status, ['resolved', 'rejected']) ? now() : $claim->resolved_at
            ]);

            return $this->response(true, "Claim status updated to {$request->status}", $claim);
        }
        catch (\Exception $e) {
            return $this->response(false, 'Failed to update claim status', null, $e->getMessage(), 500);
        }
    }
}
