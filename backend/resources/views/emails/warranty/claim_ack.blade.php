@component('mail::message')
# Claim Received

Hello {{ $claim->warranty->user->name }},

We have received your warranty claim **{{ $claim->claim_number }}** for your **{{ $claim->warranty->product->brand }} {{ $claim->warranty->product->model }}**.

**Claim Details:**
- **Issue Type:** {{ str_replace('_', ' ', ucfirst($claim->issue_type)) }}
- **Status:** Received
- **Submitted At:** {{ $claim->created_at->format('d M Y, h:i A') }}

Our technical team will review your evidence and update you within 24 hours. No further action is required from your side at this moment.

@component('mail::button', ['url' => config('app.url') . '/orders/' . $claim->warranty->order_id])
Track Claim Status
@endcomponent

Thanks,  
{{ config('app.name') }}
@endcomponent
