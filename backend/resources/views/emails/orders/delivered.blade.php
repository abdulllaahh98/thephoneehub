@component('mail::message')
# Order Delivered!

Hello {{ $order->user->name }},

Your order **{{ $order->order_number }}** has been successfully delivered. We hope you love your new device!

**Warranty Activation:**
Since your order is now delivered, your 6-month warranty has been automatically activated. You will receive a separate confirmation email for the same.

@component('mail::button', ['url' => config('app.url') . '/orders'])
View My Warranties
@endcomponent

<<<<<<< HEAD
If you have any issues with your delivery, please contact us at support@thephonehub.in.
=======
If you have any issues with your delivery, please contact us at support@phonehubx.com.
>>>>>>> a45f52b (payment-integrated)

Thanks,  
{{ config('app.name') }}
@endcomponent
