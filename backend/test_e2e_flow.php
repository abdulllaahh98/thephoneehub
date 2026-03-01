<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\Product;
use App\Models\Order;
use App\Models\Address;
use App\Models\Warranty;
use App\Models\WarrantyClaim;

$user = User::where('email', 'verifyuser@example.com')->first();
auth('api')->login($user);

// Clear cart before start
$user->cartItems()->delete();

echo "--- STEP 4: Add Product to Cart ---\n";
$product = Product::find(11);
$cartController = app(App\Http\Controllers\Api\CartController::class);
$request = new \Illuminate\Http\Request([
    'product_id' => $product->id,
    'quantity' => 1,
    'colour' => 'Black', // Optional depending on controller
    'storage' => '128GB' // Optional
]);
$response = $cartController->addItem($request);
echo "Cart Response: " . $response->getContent() . "\n\n";

echo "--- STEP 5: Place COD Order ---\n";
// Create a test address for the user
$address = Address::create([
    'user_id' => $user->id,
    'name' => 'Verify User',
    'phone' => '9111111111',
    'line1' => '123 Test Street',
    'city' => 'Mumbai',
    'state' => 'Maharashtra',
    'pin' => '400001',
    'is_default' => true
]);

$orderController = app(App\Http\Controllers\Api\OrderController::class);
$orderRequest = new \Illuminate\Http\Request([
    'address_id' => $address->id,
    'payment_method' => 'cod'
]);
$orderResponse = $orderController->store($orderRequest);
$orderData = json_decode($orderResponse->getContent(), true);
echo "Order Response: " . $orderResponse->getContent() . "\n\n";

if ($orderData['success']) {
    $orderId = $orderData['data']['id'];
    $order = Order::find($orderId);
    echo "Order Created: " . $order->order_number . "\n";

    echo "--- STEP 6: Check Orders List ---\n";
    $listResponse = $orderController->index();
    echo "Orders List Count: " . count(json_decode($listResponse->getContent(), true)['data']['data']) . "\n\n";

    echo "--- STEP 7: Cancel Order & Restore Stock ---\n";
    $stockBefore = $product->stock;
    echo "Stock Before Cancel: " . $stockBefore . "\n";
    $cancelResponse = $orderController->cancel($orderId);
    echo "Cancel Response: " . $cancelResponse->getContent() . "\n";
    $product->refresh();
    echo "Stock After Cancel: " . $product->stock . "\n";
    if ($product->stock > $stockBefore) {
        echo "STOCK RESTORED SUCCESSFULLY.\n\n";
    }

    echo "--- STEP 8: Admin Status Update to Delivered ---\n";
    // We need a NEW order because we canceled the first one for testing stock.
    // Let's place another one.
    $orderResponse2 = $orderController->store($orderRequest);
    $orderData2 = json_decode($orderResponse2->getContent(), true);
    $orderId2 = $orderData2['data']['id'];
    echo "Second Order Created: " . $orderId2 . "\n";

    $admin = User::where('role', 'admin')->first();
    auth('api')->login($admin);

    $adminOrderController = app(App\Http\Controllers\Api\Admin\AdminOrderController::class);
    $statusRequest = new \Illuminate\Http\Request(['status' => 'delivered']);
    $statusResponse = $adminOrderController->updateStatus($statusRequest, $orderId2);
    echo "Status Update Response: " . $statusResponse->getContent() . "\n\n";

    echo "--- STEP 9: Verify Warranty Auto-Created ---\n";
    $warranty = Warranty::where('order_id', $orderId2)->first();
    if ($warranty) {
        echo "WARRANTY AUTO-CREATED SUCCESSFULLY for Order " . $orderId2 . "\n";
        echo "Warranty Ends: " . $warranty->ends_at . "\n\n";

        echo "--- STEP 10: Submit Warranty Claim ---\n";
        auth('api')->login($user);
        $claimController = app(App\Http\Controllers\Api\WarrantyClaimController::class);
        $claimRequest = new \Illuminate\Http\Request([
            'warranty_id' => $warranty->id,
            'issue_description' => 'Display flickering',
            'preferred_resolution' => 'Repair'
        ]);
        $claimResponse = $claimController->store($claimRequest);
        echo "Claim Response: " . $claimResponse->getContent() . "\n";
    }
    else {
        echo "WARRANTY NOT CREATED.\n";
    }
}
else {
    echo "FAILED TO CREATE ORDER.\n";
}
