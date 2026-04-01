@component('mail::message')
# Order Confirmed!

Hello {{ $order->user->name }},

Thank you for shopping with us. Your order **{{ $order->order_number }}** has been successfully placed.

**Order Summary:**
@foreach($order->orderItems as $item)
- {{ $item->product_name }} ({{ $item->storage }} | {{ $item->colour }}) x {{ $item->quantity }}
@endforeach

<<<<<<< HEAD
**Total Amount:** ₹{{ number_format($order->grand_total, 2) }}  
**Payment Method:** Cash on Delivery (COD)

> [!IMPORTANT]
> **COD Reminder**: Please keep **₹{{ number_format($order->grand_total, 2) }}** ready in cash at the time of delivery.
=======
**Total Amount:** Rs. {{ number_format($order->grand_total, 2) }}  
**Payment Method:** Cash on Delivery (COD)

> [!IMPORTANT]
> **COD Reminder**: Please keep **Rs. {{ number_format($order->grand_total, 2) }}** ready in cash at the time of delivery.
>>>>>>> a45f52b (payment-integrated)

**Delivery Address:**
{{ $order->address->line1 }}, {{ $order->address->city }}, {{ $order->address->state }} - {{ $order->address->pin }}

@component('mail::button', ['url' => config('app.url') . '/orders/' . $order->id])
View Order Details
@endcomponent

Thanks,  
{{ config('app.name') }}
@endcomponent
