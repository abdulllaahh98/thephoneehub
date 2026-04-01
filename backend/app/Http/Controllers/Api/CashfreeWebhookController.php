<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderStatusHistory;
use App\Models\PinCode;
use App\Mail\OrderConfirmationMail;
use App\Jobs\SendSmsNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;

class CashfreeWebhookController extends Controller
{
    public function handle(Request $request)
    {
        $rawBody = $request->getContent();
        $timestamp = $request->header('x-webhook-timestamp');
        $signature = $request->header('x-webhook-signature');
        $secret = config('services.cashfree.secret_key');

        if (!$rawBody || !$timestamp || !$signature || !$secret) {
            Log::warning('Cashfree Webhook Missing Signature Data', [
                'has_body' => (bool) $rawBody,
                'has_timestamp' => (bool) $timestamp,
                'has_signature' => (bool) $signature,
                'has_secret' => (bool) $secret,
            ]);
            return response()->json(['message' => 'Invalid webhook signature headers'], 400);
        }

        $expected = base64_encode(hash_hmac('sha256', $timestamp . $rawBody, $secret, true));
        if (!hash_equals($expected, $signature)) {
            Log::warning('Cashfree Webhook Signature Mismatch', [
                'expected' => $expected,
                'received' => $signature,
            ]);
            return response()->json(['message' => 'Invalid webhook signature'], 400);
        }

        $payload = json_decode($rawBody, true);
        if (!is_array($payload)) {
            Log::warning('Cashfree Webhook Invalid JSON Payload');
            return response()->json(['message' => 'Invalid payload'], 400);
        }

        Log::info('Cashfree Webhook Received', $payload);

        // Basic verification: Check if data exists
        if (!isset($payload['data']['order']['order_id']) || !isset($payload['type'])) {
            return response()->json(['message' => 'Invalid payload'], 400);
        }

        $orderNumber = $payload['data']['order']['order_id'];
        $eventType = $payload['type'];

        if ($eventType === 'PAYMENT_SUCCESS_WEBHOOK') {
            $order = Order::where('order_number', $orderNumber)->first();

            if ($order && $order->payment_status !== 'paid') {
                $user = $order->user;

                // Update Order
                $order->update([
                    'payment_status' => 'paid',
                    'status' => 'processing'
                ]);

                // Add to Status History
                OrderStatusHistory::create([
                    'order_id' => $order->id,
                    'status' => 'processing',
                    'note' => 'Payment successful via Cashfree Webhook. Status updated to processing.',
                ]);

                // Clear Cart (if not already cleared)
                $user->cartItems()->delete();

                // Send Notifications
                try {
                    Mail::to($user->email)->queue(new OrderConfirmationMail($order));

                    $address = $order->address;
                    $pinData = PinCode::where('pin', $address->pin)->first();
                    $eddDays = $pinData ? $pinData->edd_days : 5;
                    $eddDate = Carbon::now()->addDays($eddDays)->format('Y-m-d');

                    $smsMessage = "Payment Successful! Your order {$order->order_number} is being processed and will be delivered by {$eddDate}.";
                    dispatch(new SendSmsNotification($user->phone, $smsMessage));
                } catch (\Exception $e) {
                    Log::error('Error sending notifications after webhook', ['error' => $e->getMessage()]);
                }

                return response()->json(['message' => 'Order updated successfully']);
            }
        }

        return response()->json(['message' => 'Processed']);
    }
}
