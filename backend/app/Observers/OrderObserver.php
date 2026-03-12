<?php

namespace App\Observers;

use App\Models\Order;
use App\Models\Warranty;
use App\Mail\WarrantyActivatedMail;
use Illuminate\Support\Facades\Mail;

class OrderObserver
{
    /**
     * Handle the Order "updated" event.
     *
     * @param  \App\Models\Order  $order
     * @return void
     */
    public function updated(Order $order)
    {
        if ($order->isDirty('status') && $order->status === 'delivered') {
            // Check if warranty already exists to avoid duplicates
            $exists = Warranty::where('order_id', $order->id)->exists();
            if ($exists)
                return;

            $firstItem = $order->orderItems->first();
            if (!$firstItem)
                return;

            $warranty = Warranty::create([
                'order_id' => $order->id,
                'product_id' => $firstItem->product_id,
                'user_id' => $order->user_id,
                'start_date' => now()->toDateString(),
                'end_date' => now()->addMonths(6)->toDateString(),
                'status' => 'active',
            ]);

            // Dispatch WarrantyActivatedMail (Simulator: Log locally)
            try {
                Mail::to($order->user->email)->queue(new WarrantyActivatedMail($warranty));
            }
            catch (\Exception $e) {
                \Log::error("Failed to queue WarrantyActivatedMail: " . $e->getMessage());
            }
        }
    }
}
