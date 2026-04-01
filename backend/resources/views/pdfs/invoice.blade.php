<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Invoice - {{ $order->order_number }}</title>
    <style>
        body { font-family: 'Helvetica', 'Arial', sans-serif; color: #333; line-height: 1.5; }
        .invoice-box { max-width: 800px; margin: auto; padding: 30px; border: 1px solid #eee; }
        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #3b82f6; padding-bottom: 20px; }
        .logo { font-size: 28px; font-weight: bold; color: #3b82f6; }
        .title { font-size: 24px; font-weight: bold; text-transform: uppercase; }
        .info-section { margin-top: 20px; display: table; width: 100%; }
        .info-block { display: table-cell; width: 50%; vertical-align: top; }
        .details-table { width: 100%; border-collapse: collapse; margin-top: 30px; }
        .details-table th { background: #f8fafc; border-bottom: 2px solid #e2e8f0; padding: 12px; text-align: left; }
        .details-table td { padding: 12px; border-bottom: 1px solid #e2e8f0; }
        .totals-section { margin-top: 30px; text-align: right; }
        .totals-table { display: inline-table; width: 250px; }
        .totals-table td { padding: 8px 0; }
        .grand-total { font-size: 18px; font-weight: bold; color: #3b82f6; border-top: 2px solid #3b82f6; padding-top: 10px; }
        .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 20px; }
    </style>
</head>
<body>
    <div class="invoice-box">
        <table width="100%">
            <tr>
<<<<<<< HEAD
                <td><div class="logo">ThePhoneHub.in</div></td>
=======
                <td><div class="logo">PhoneHubX</div></td>
>>>>>>> a45f52b (payment-integrated)
                <td align="right"><div class="title">Tax Invoice</div></td>
            </tr>
        </table>

        <div class="info-section">
            <div class="info-block">
                <strong>Invoice No:</strong> {{ $order->order_number }}<br>
                <strong>Date:</strong> {{ $order->created_at->format('d M Y') }}<br>
                <strong>Order Date:</strong> {{ $order->created_at->format('d M Y') }}
            </div>
            <div class="info-block" align="right">
                <strong>Bill To / Ship To:</strong><br>
                {{ $customer->name }}<br>
                {{ $address->line1 }}{{ $address->line2 ? ', ' . $address->line2 : '' }}<br>
                {{ $address->city }}, {{ $address->state }} - {{ $address->pin }}<br>
                Phone: {{ $address->phone }}
            </div>
        </div>

        <table class="details-table">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Product</th>
                    <th align="center">Qty</th>
                    <th align="right">Price</th>
                    <th align="right">Total</th>
                </tr>
            </thead>
            <tbody>
                @foreach($items as $index => $item)
                <tr>
                    <td>{{ $index + 1 }}</td>
                    <td>{{ $item->product_name }} ({{ $item->storage }} | {{ $item->colour }})</td>
                    <td align="center">{{ $item->quantity }}</td>
<<<<<<< HEAD
                    <td align="right">{{ number_format($item->unit_price, 2) }}</td>
                    <td align="right">{{ number_format($item->line_total, 2) }}</td>
=======
                    <td align="right">Rs. {{ number_format($item->unit_price, 2) }}</td>
                    <td align="right">Rs. {{ number_format($item->line_total, 2) }}</td>
>>>>>>> a45f52b (payment-integrated)
                </tr>
                @endforeach
            </tbody>
        </table>

        <div class="totals-section">
            <table class="totals-table">
                <tr>
                    <td>Subtotal:</td>
<<<<<<< HEAD
                    <td align="right">{{ number_format($order->subtotal, 2) }}</td>
                </tr>
                <tr>
                    <td>Coupon Discount:</td>
                    <td align="right">-{{ number_format($order->discount, 2) }}</td>
                </tr>
                <tr>
                    <td>GST (18%):</td>
                    <td align="right">{{ number_format($order->gst_amount, 2) }}</td>
=======
                    <td align="right">Rs. {{ number_format($order->subtotal, 2) }}</td>
                </tr>
                <tr>
                    <td>Coupon Discount:</td>
                    <td align="right">-Rs. {{ number_format($order->discount, 2) }}</td>
                </tr>
                <tr>
                    <td>GST (18%):</td>
                    <td align="right">Rs. {{ number_format($order->gst_amount, 2) }}</td>
>>>>>>> a45f52b (payment-integrated)
                </tr>
                <tr>
                    <td>Shipping:</td>
                    <td align="right">FREE</td>
                </tr>
                <tr class="grand-total">
                    <td><strong>TOTAL:</strong></td>
<<<<<<< HEAD
                    <td align="right"><strong>{{ number_format($order->grand_total, 2) }}</strong></td>
=======
                    <td align="right"><strong>Rs. {{ number_format($order->grand_total, 2) }}</strong></td>
>>>>>>> a45f52b (payment-integrated)
                </tr>
            </table>
        </div>

        <div style="margin-top: 40px;">
            <strong>Payment Method:</strong> {{ strtoupper($order->payment_method) }}<br>
            <strong>Payment Status:</strong> {{ ucfirst($order->payment_status) }}
        </div>

        <div class="footer">
            Warranty: 6 months from delivery date<br>
<<<<<<< HEAD
            Support: support@thephonehub.in<br>
=======
            Support: support@phonehubx.com<br>
>>>>>>> a45f52b (payment-integrated)
            <strong>Thank you for shopping with us!</strong>
        </div>
    </div>
</body>
</html>
