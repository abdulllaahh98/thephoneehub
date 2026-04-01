<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;

class InvoiceController extends Controller
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
     * GET /api/v1/orders/{id}/invoice
     */
    public function download($id)
    {
        try {
            $user = auth('api')->user();
            $order = Order::with(['orderItems', 'address', 'user'])->find($id);

            if (!$order || $order->user_id !== $user->id) {
                return $this->response(false, 'Order not found', null, null, 404);
            }

            $pdf = Pdf::loadView('pdfs.invoice', [
                'order'    => $order,
                'items'    => $order->orderItems,
                'address'  => $order->address,
                'customer' => $order->user,
            ]);

            $pdf->setPaper('A4', 'portrait');

            return $pdf->download("ThePhoneHub-Invoice-{$order->order_number}.pdf");

        }
        catch (\Exception $e) {
            return $this->response(false, 'Failed to generate invoice', null, $e->getMessage(), 500);
        }
    }
}
