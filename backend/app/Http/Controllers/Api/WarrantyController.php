<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Warranty;
use App\Models\Order;
use Illuminate\Http\Request;
use Carbon\Carbon;

class WarrantyController extends Controller
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
     * GET /api/v1/warranties
     */
    public function index()
    {
        try {
            $warranties = auth('api')->user()->warranties()
                ->with(['product', 'order'])
                ->orderBy('created_at', 'desc')
                ->get();

            return $this->response(true, 'Warranties retrieved', $warranties);
        }
        catch (\Exception $e) {
            return $this->response(false, 'Failed to retrieve warranties', null, $e->getMessage(), 500);
        }
    }

    /**
     * GET /api/v1/warranties/{orderId}
     */
    public function show($orderId)
    {
        try {
            $user = auth('api')->user();
            $warranty = Warranty::where('order_id', $orderId)
                ->with(['product', 'order'])
                ->first();

            if (!$warranty || $warranty->user_id !== $user->id) {
                return $this->response(false, 'Warranty not found or unauthorized', null, null, 404);
            }

            $endDate = Carbon::parse($warranty->end_date);
            $daysRemaining = Carbon::now()->diffInDays($endDate, false);

            return $this->response(true, 'Warranty details retrieved', [
                'warranty_id' => $warranty->id,
                'order_number' => $warranty->order->order_number,
                'product' => [
                    'brand' => $warranty->product->brand,
                    'model' => $warranty->product->model,
                    'storage' => $warranty->product->storage,
                ],
                'imei' => $warranty->imei,
                'start_date' => $warranty->start_date,
                'end_date' => $warranty->end_date,
                'status' => $warranty->status,
                'days_remaining' => max(0, $daysRemaining),
                'coverage' => [
                    'covered' => [
                        "Hardware defects",
                        "Screen malfunctions",
                        "Battery failure below 80%"
                    ],
                    'not_covered' => [
                        "Physical damage",
                        "Water damage",
                        "Software issues",
                        "Screen cracks"
                    ]
                ]
            ]);
        }
        catch (\Exception $e) {
            return $this->response(false, 'Failed to retrieve warranty details', null, $e->getMessage(), 500);
        }
    }
}
