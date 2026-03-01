<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Http\Controllers\Api\Admin\AdminProductController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// 1. Mock the request
$request = Request::create('/api/v1/admin/products', 'POST', [
    'brand' => 'Apple',
    'model' => 'iPhone 15 Pro',
    'storage' => '256GB',
    'price' => 120000,
    'stock_qty' => 10,
    'description' => 'Test product description',
    'condition' => 'Excellent',
]);

// 2. Instantiate controller
$controller = new AdminProductController();

// 3. Call store method
echo "Attempting to store product...\n";
try {
    $response = $controller->store($request);
    echo "Status Code: " . $response->getStatusCode() . "\n";
    echo "Response Body: " . $response->getContent() . "\n";
    
    if ($response->getStatusCode() === 201) {
        echo "\nSUCCESS: Product created successfully!\n";
    } else {
        echo "\nFAILED: Product creation failed.\n";
    }
} catch (\Exception $e) {
    echo "\nCRITICAL ERROR: " . $e->getMessage() . "\n";
    echo $e->getTraceAsString() . "\n";
}
