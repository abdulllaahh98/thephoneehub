<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderStatusHistory;
use App\Mail\OrderConfirmationMail;
use App\Jobs\SendSmsNotification;
use App\Models\PinCode;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;

class PaymentController extends Controller
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

    public function verify(Request $request)
    {
        $request->validate([
            'order_number' => 'required|string',
        ]);

        try {
            $user = auth('api')->user();
            $order = Order::where('order_number', $request->order_number)
                ->where('user_id', $user->id)
                ->first();

            if (!$order) {
                return $this->response(false, 'Order not found', null, null, 404);
            }

            if ($order->payment_status === 'paid') {
                return $this->response(true, 'Payment already verified', $order);
            }

            // Verify with Cashfree
            $http = Http::withHeaders([
                'x-api-version' => config('services.cashfree.version'),
                'x-client-id' => config('services.cashfree.app_id'),
                'x-client-secret' => config('services.cashfree.secret_key'),
            ]);

            if (app()->environment('local')) {
                // Local Windows stacks can miss CA bundle; allow SSL bypass only in local env.
                $http = $http->withOptions(['verify' => false]);
            }

            $response = $http->get((config('services.cashfree.env') === 'test' ? 'https://sandbox.cashfree.com/pg/orders/' : 'https://api.cashfree.com/pg/orders/') . $order->order_number);

            if ($response->successful()) {
                $cfOrder = $response->json();
                
                if ($cfOrder['order_status'] === 'PAID') {
                    // Update Order
                    $order->update([
                        'payment_status' => 'paid',
                        'status' => 'processing'
                    ]);

                    // Add to Status History
                    OrderStatusHistory::create([
                        'order_id' => $order->id,
                        'status' => 'processing',
                        'note' => 'Payment verified via Cashfree. Status updated to processing.',
                    ]);

                    // Clear Cart
                    $user->cartItems()->delete();

                    // Send Notifications
                    Mail::to($user->email)->queue(new OrderConfirmationMail($order));

                    $address = $order->address;
                    $pinData = PinCode::where('pin', $address->pin)->first();
                    $eddDays = $pinData ? $pinData->edd_days : 5;
                    $eddDate = Carbon::now()->addDays($eddDays)->format('Y-m-d');

                    $smsMessage = "Payment Successful! Your order {$order->order_number} is being processed and will be delivered by {$eddDate}.";
                    dispatch(new SendSmsNotification($user->phone, $smsMessage));

                    return $this->response(true, 'Payment verified successfully', $order);
                } else {
                    return $this->response(false, 'Payment not completed. Current status: ' . $cfOrder['order_status'], null, null, 400);
                }
            } else {
                Log::error('Cashfree Verification Failed', [
                    'response' => $response->body(),
                    'order' => $order->order_number
                ]);
                return $this->response(false, 'Failed to verify payment with Cashfree', null, null, 500);
            }

        } catch (\Exception $e) {
            return $this->response(false, 'Verification error', null, $e->getMessage(), 500);
        }
    }
}
