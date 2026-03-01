@component('mail::message')
# Your Order has been Shipped!

Hello {{ $order->user->name }},

Good news! Your order **{{ $order->order_number }}** is on its way.

**Shipping Details:**
- **Courier:** {{ $order->courier }}
- **AWB Number:** {{ $order->awb_number }}

You can track your package on the courier's website using the AWB number provided above.

@component('mail::button', ['url' => config('app.url') . '/orders/' . $order->id])
Track Order
@endcomponent

Thanks,  
{{ config('app.name') }}
@endcomponent
