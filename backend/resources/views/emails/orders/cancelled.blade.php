@component('mail::message')
# Order Cancelled

Hello {{ $order->user->name }},

Your order **{{ $order->order_number }}** has been cancelled as requested.

**Items Cancelled:**
@foreach($order->orderItems as $item)
- {{ $item->product_name }}
@endforeach

Since this was a Cash on Delivery (COD) order, no payment was collected.

If you did not request this cancellation, please contact our support team immediately.

Thanks,  
{{ config('app.name') }}
@endcomponent
