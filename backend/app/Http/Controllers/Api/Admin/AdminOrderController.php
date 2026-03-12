<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderStatusHistory;
use App\Mail\ShippedMail;
use App\Mail\DeliveredMail;
use App\Mail\OrderCancelledMail;
use App\Jobs\SendSmsNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

class AdminOrderController extends Controller
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
     * GET /api/v1/admin/orders
     */
    public function index(Request $request)
    {
        try {
            $orders = Order::with(['user', 'orderItems'])
                ->when($request->status, function ($q) use ($request) {
                $q->where('status', $request->status);
            })
                ->orderBy('created_at', 'desc')
                ->paginate(20);

            return $this->response(true, 'Orders retrieved', $orders);
        }
        catch (\Exception $e) {
            return $this->response(false, 'Failed to retrieve orders', null, $e->getMessage(), 500);
        }
    }

    /**
     * GET /api/v1/admin/orders/{id}
     */
    public function show($id)
    {
        try {
            $order = Order::with(['user', 'address', 'orderItems.product', 'statusHistory.user', 'coupon.coupon'])
                ->findOrFail($id);

            return $this->response(true, 'Order details retrieved', $order);
        }
        catch (\Exception $e) {
            return $this->response(false, 'Order not found', null, $e->getMessage(), 404);
        }
    }

    /**
     * PATCH /api/v1/admin/orders/{id}/status
     */
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:pending,processing,shipped,out_for_delivery,delivered,cancelled',
            'note' => 'nullable|string',
        ]);

        try {
            $order = Order::findOrFail($id);
            $newStatus = $request->status;

            // Admins can freely set any valid status (no strict transition enforcement)

            DB::transaction(function () use ($order, $newStatus, $request) {
                $order->update(['status' => $newStatus]);

                try {
                    OrderStatusHistory::create([
                        'order_id' => $order->id,
                        'status' => $newStatus,
                        'note' => $request->note ?? 'Status updated by admin',
                        'changed_by' => auth('api')->id() ?? 1,
                    ]);
                }
                catch (\Exception $logEx) {
                    // Non-fatal: log failure shouldn't block the status update
                    \Illuminate\Support\Facades\Log::warning('Status history log failed: ' . $logEx->getMessage());
                }

                // Notifications (non-fatal)
                try {
                    if ($newStatus === 'shipped') {
                        Mail::to($order->user->email)->queue(new ShippedMail($order));
                    }
                    elseif ($newStatus === 'delivered') {
                        Mail::to($order->user->email)->queue(new DeliveredMail($order));
                    }
                    elseif ($newStatus === 'cancelled') {
                        Mail::to($order->user->email)->queue(new OrderCancelledMail($order));
                    }
                }
                catch (\Exception $mailEx) {
                    \Illuminate\Support\Facades\Log::warning('Order mail failed: ' . $mailEx->getMessage());
                }
            });

            return $this->response(true, "Order status updated to {$newStatus}", $order);

        }
        catch (\Exception $e) {
            return $this->response(false, 'Failed to update status', null, $e->getMessage(), 500);
        }
    }

    /**
     * POST /api/v1/admin/orders/{id}/shipment
     */
    public function createShipment(Request $request, $id)
    {
        $request->validate([
            'courier' => 'required|string',
            'awb_number' => 'required|string'
        ]);

        try {
            $order = Order::findOrFail($id);

            if ($order->status !== 'processing') {
                return $this->response(false, 'Only processing orders can be shipped.', null, null, 422);
            }

            DB::transaction(function () use ($order, $request) {
                $order->update([
                    'status' => 'shipped',
                    'courier' => $request->courier,
                    'awb_number' => $request->awb_number
                ]);

                OrderStatusHistory::create([
                    'order_id' => $order->id,
                    'status' => 'shipped',
                    'note' => "Shipped via {$request->courier} (AWB: {$request->awb_number})",
                    'changed_by' => auth()->id()
                ]);

                Mail::to($order->user->email)->queue(new ShippedMail($order));

                $msg = "Great news! Your order {$order->order_number} has been shipped via {$request->courier}. Tracking: {$request->awb_number}";
                dispatch(new SendSmsNotification($order->user->phone, $msg));
            });

            return $this->response(true, 'Shipment created and order marked as shipped.', $order);

        }
        catch (\Exception $e) {
            return $this->response(false, 'Failed to create shipment', null, $e->getMessage(), 500);
        }
    }

    /**
     * GET /api/v1/admin/orders/{id}/packing-slip
     */
    public function packingSlip($id)
    {
        try {
            $order = Order::with(['orderItems', 'address', 'user'])->findOrFail($id);
            // In a real app, generate a PDF here. For now, return basic info.
            return $this->response(true, 'Packing slip data retrieved', [
                'order' => $order,
                'instructions' => 'Print this page as a packing slip.'
            ]);
        }
        catch (\Exception $e) {
            return $this->response(false, 'Failed to retrieve packing slip', null, $e->getMessage(), 500);
        }
    }

    /**
     * POST /api/v1/admin/orders/{id}/refund
     */
    public function initiateRefund(Request $request, $id)
    {
        $request->validate(['reason' => 'nullable|string|max:500']);
        try {
            $order = Order::with('user')->findOrFail($id);
            DB::transaction(function () use ($order, $request) {
                $order->update(['payment_status' => 'refunded', 'status' => 'cancelled']);
                try {
                    OrderStatusHistory::create([
                        'order_id' => $order->id,
                        'status' => 'cancelled',
                        'note' => 'Refund initiated: ' . ($request->reason ?? 'No reason provided'),
                        'changed_by' => auth('api')->id() ?? 1,
                    ]);
                }
                catch (\Exception $logEx) {
                    \Illuminate\Support\Facades\Log::warning('Refund history log failed: ' . $logEx->getMessage());
                }
            });
            return $this->response(true, 'Refund initiated. Payment status set to refunded.', $order);
        }
        catch (\Exception $e) {
            return $this->response(false, 'Failed to initiate refund', null, $e->getMessage(), 500);
        }
    }

    /**
     * PATCH /api/v1/admin/orders/{id}/payment  (registered dynamically)
     */
    public function updatePayment(Request $request, $id)
    {
        $request->validate(['payment_status' => 'required|in:pending,paid,failed,refunded']);
        try {
            $order = Order::findOrFail($id);
            $order->update(['payment_status' => $request->payment_status]);
            return $this->response(true, 'Payment status updated to ' . $request->payment_status, $order);
        }
        catch (\Exception $e) {
            return $this->response(false, 'Failed to update payment status', null, $e->getMessage(), 500);
        }
    }
}
