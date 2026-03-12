<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        User::create([
            'name' => 'Super Admin',
            'email' => 'superadmin@thephonehub.in',
            'phone' => '9999999999',
            'password' => Hash::make('admin123'),
            'role' => 'superadmin',
            'is_verified' => true,
        ]);

        User::create([
            'name' => 'Admin User',
            'email' => 'admin@thephonehub.in',
            'phone' => '8888888888',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
            'is_verified' => true,
        ]);

        User::create([
            'name' => 'Customer User',
            'email' => 'customer@gmail.com',
            'phone' => '7777777777',
            'password' => Hash::make('password123'),
            'role' => 'customer',
            'is_verified' => true,
        ]);
    }
}
