<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Coupon;

class CouponSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Coupon::create([
            'code' => 'WELCOME10',
            'type' => 'percent',
            'value' => 10,
            'min_order_value' => 5000,
            'max_discount' => 1000,
            'expires_at' => now()->addMonth(),
        ]);

        Coupon::create([
            'code' => 'FLAT500',
            'type' => 'flat',
            'value' => 500,
            'min_order_value' => 10000,
            'expires_at' => now()->addMonth(),
        ]);

        Coupon::create([
            'code' => 'FIRST200',
            'type' => 'flat',
            'value' => 200,
            'min_order_value' => 2000,
            'expires_at' => now()->addYear(),
        ]);
    }
}
