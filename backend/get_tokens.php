<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;

$user = User::where('email', 'verifyuser@example.com')->first();
$token = auth('api')->login($user);
echo "USER_TOKEN: " . $token . "\n";

$admin = User::where('role', 'admin')->first();
if ($admin) {
    $adminToken = auth('api')->login($admin);
    echo "ADMIN_TOKEN: " . $adminToken . "\n";
}
