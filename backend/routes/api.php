<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/* |-------------------------------------------------------------------------- | API Routes |-------------------------------------------------------------------------- */

Route::group(['prefix' => 'v1'], function () {
    // 1. PUBLIC PRODUCT & CATALOG ROUTES
    Route::get('/products', [App\Http\Controllers\Api\ProductController::class , 'index']);
    Route::get('/products/search', [App\Http\Controllers\Api\SearchController::class , 'search']);
    Route::get('/products/search/suggest', [App\Http\Controllers\Api\SearchController::class , 'suggest']);
    Route::get('/products/{id}', [App\Http\Controllers\Api\ProductController::class , 'show']);
    Route::get('/products/{id}/variants', [App\Http\Controllers\Api\ProductController::class , 'variants']);
    Route::get('/categories', [App\Http\Controllers\Api\ProductController::class , 'categories']);
    Route::get('/pincodes/{pin}', [App\Http\Controllers\Api\ProductController::class , 'checkPincode']);
    Route::post('/orders/track', [App\Http\Controllers\Api\OrderController::class , 'publicTrack']);

    // 2. AUTHENTICATION & PROTECTED ROUTES
    Route::group(['prefix' => 'auth'], function () {
            // Public Auth
            Route::post('/register', [App\Http\Controllers\AuthController::class , 'register']);
            Route::post('/login', [App\Http\Controllers\AuthController::class , 'login']);
            Route::post('/send-otp', [App\Http\Controllers\AuthController::class , 'sendOtp']);
            Route::post('/verify-otp', [App\Http\Controllers\AuthController::class , 'verifyOtp']);
            Route::post('/refresh', [App\Http\Controllers\AuthController::class , 'refresh']);
            Route::post('/forgot-password', [App\Http\Controllers\AuthController::class , 'forgotPassword']);
            Route::post('/reset-password', [App\Http\Controllers\AuthController::class , 'resetPassword']);

            // Protected (JWT Required)
            Route::group(['middleware' => 'auth:api'], function () {
                    Route::post('/logout', [App\Http\Controllers\AuthController::class , 'logout']);
                    Route::get('/me', [App\Http\Controllers\AuthController::class , 'me']);
                    Route::put('/profile', [App\Http\Controllers\AuthController::class , 'updateProfile']);

                    Route::apiResource('addresses', App\Http\Controllers\AddressController::class);

                    // Cart Routes
                    Route::get('/cart', [App\Http\Controllers\Api\CartController::class , 'index']);
                    Route::post('/cart/items', [App\Http\Controllers\Api\CartController::class , 'addItem']);
                    Route::patch('/cart/items/{id}', [App\Http\Controllers\Api\CartController::class , 'updateItem']);
                    Route::delete('/cart/items/{id}', [App\Http\Controllers\Api\CartController::class , 'removeItem']);
                    Route::delete('/cart', [App\Http\Controllers\Api\CartController::class , 'clearCart']);
                    Route::post('/cart/merge', [App\Http\Controllers\Api\CartController::class , 'mergeCarts']);

                    // Coupon & Checkout
                    Route::post('/coupons/validate', [App\Http\Controllers\Api\CouponController::class , 'validateCoupon']);
                    Route::post('/checkout/summary', [App\Http\Controllers\Api\CheckoutController::class , 'summary']);

                    // Order Routes
                    Route::get('/orders', [App\Http\Controllers\Api\OrderController::class , 'index']);
                    Route::post('/orders', [App\Http\Controllers\Api\OrderController::class , 'store']);
                    Route::get('/orders/{id}', [App\Http\Controllers\Api\OrderController::class , 'show']);
                    Route::delete('/orders/{id}', [App\Http\Controllers\Api\OrderController::class , 'cancel']);
                    Route::get('/orders/{id}/invoice', [App\Http\Controllers\Api\InvoiceController::class , 'download']);

                    // Warranty Routes
                    Route::get('/warranties', [App\Http\Controllers\Api\WarrantyController::class , 'index']);
                    Route::get('/warranties/{orderId}', [App\Http\Controllers\Api\WarrantyController::class , 'show']);

                    // Warranty Claim Routes
                    Route::get('/warranty-claims', [App\Http\Controllers\Api\WarrantyClaimController::class , 'index']);
                    Route::post('/warranty-claims', [App\Http\Controllers\Api\WarrantyClaimController::class , 'store']);
                    Route::get('/warranty-claims/{id}', [App\Http\Controllers\Api\WarrantyClaimController::class , 'show']);
                }
                );
            }
            );

            // 3. ADMIN ROUTES (Protected)
            Route::group(['prefix' => 'admin', 'middleware' => 'auth:api'], function () {
            // Inventory
            Route::get('/products', [App\Http\Controllers\Api\Admin\AdminProductController::class , 'index']);
            Route::post('/products', [App\Http\Controllers\Api\Admin\AdminProductController::class , 'store']);
            Route::get('/products/{id}', [App\Http\Controllers\Api\Admin\AdminProductController::class , 'show']);
            Route::put('/products/{id}', [App\Http\Controllers\Api\Admin\AdminProductController::class , 'update']);
            Route::delete('/products/{id}', [App\Http\Controllers\Api\Admin\AdminProductController::class , 'destroy']);
            Route::post('/products/bulk-upload', [App\Http\Controllers\Api\Admin\AdminProductController::class , 'bulkUpload']);
            Route::patch('/products/{id}/stock', [App\Http\Controllers\Api\Admin\AdminProductController::class , 'updateStock']);

            // Orders
            Route::get('/orders', [App\Http\Controllers\Api\Admin\AdminOrderController::class , 'index']);
            Route::get('/orders/{id}', [App\Http\Controllers\Api\Admin\AdminOrderController::class , 'show']);
            Route::patch('/orders/{id}/status', [App\Http\Controllers\Api\Admin\AdminOrderController::class , 'updateStatus']);
            Route::patch('/orders/{id}/payment', [App\Http\Controllers\Api\Admin\AdminOrderController::class , 'updatePayment']);
            Route::post('/orders/{id}/notes', [App\Http\Controllers\Api\Admin\AdminOrderController::class , 'addNote']);
            Route::post('/orders/{id}/refund', [App\Http\Controllers\Api\Admin\AdminOrderController::class , 'initiateRefund']);
            Route::get('/orders/{id}/packing-slip', [App\Http\Controllers\Api\Admin\AdminOrderController::class , 'packingSlip']);
            Route::post('/orders/{id}/shipment', [App\Http\Controllers\Api\Admin\AdminOrderController::class , 'createShipment']);

            // Users
            Route::get('/users', [App\Http\Controllers\Api\Admin\AdminUserController::class , 'index']);
            Route::get('/users/{id}', [App\Http\Controllers\Api\Admin\AdminUserController::class , 'show']);
            Route::patch('/users/{id}/role', [App\Http\Controllers\Api\Admin\AdminUserController::class , 'updateRole']);

            // Coupons
            Route::get('/coupons', [App\Http\Controllers\Api\Admin\AdminCouponController::class , 'index']);
            Route::post('/coupons', [App\Http\Controllers\Api\Admin\AdminCouponController::class , 'store']);
            Route::put('/coupons/{id}', [App\Http\Controllers\Api\Admin\AdminCouponController::class , 'update']);
            Route::delete('/coupons/{id}', [App\Http\Controllers\Api\Admin\AdminCouponController::class , 'destroy']);

            // Warranty Claims
            Route::get('/warranty-claims', [App\Http\Controllers\Api\Admin\AdminWarrantyController::class , 'index']);
            Route::get('/warranty-claims/{id}', [App\Http\Controllers\Api\Admin\AdminWarrantyController::class , 'show']);
            Route::patch('/warranty-claims/{id}', [App\Http\Controllers\Api\Admin\AdminWarrantyController::class , 'updateStatus']);

            // Reports
            Route::get('/reports/dashboard', [App\Http\Controllers\Api\Admin\AdminReportController::class , 'dashboard']);
            Route::get('/reports/sales', [App\Http\Controllers\Api\Admin\AdminReportController::class , 'sales']);
            Route::get('/reports/sales/export', [App\Http\Controllers\Api\Admin\AdminReportController::class , 'exportCsv']);
        }
        );
    });

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
