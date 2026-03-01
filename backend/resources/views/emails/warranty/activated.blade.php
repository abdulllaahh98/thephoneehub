@component('mail::message')
# Warranty Activated!

Hello {{ $warranty->user->name }},

Your order **#{{ $warranty->order->order_number }}** has been delivered, and your warranty is now active!

**Warranty Details:**
- **Product:** {{ $warranty->product->brand }} {{ $warranty->product->model }}
- **Start Date:** {{ $warranty->start_date }}
- **End Date:** {{ $warranty->end_date }} (6 Months Coverage)
- **Status:** Active

You can now manage your warranty and file repair claims directly from your dashboard.

@component('mail::button', ['url' => config('app.url') . '/orders'])
View Warranty Dashboard
@endcomponent

Thanks,  
{{ config('app.name') }}
@endcomponent
