<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PinCode;
use App\Models\CodEligiblePincode;
use Illuminate\Support\Facades\DB;

class PincodeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $cities = [
            'Mumbai' => ['400001', '400050', '400072'],
            'Delhi' => ['110001', '110020', '110045'],
            'Bangalore' => ['560001', '560034', '560068'],
            'Pune' => ['411001', '411014', '411038'],
            'Hyderabad' => ['500001', '500032', '500081'],
            'Chennai' => ['600001', '600020', '600040'],
            'Kolkata' => ['700001', '700050', '700091'],
            'Ahmedabad' => ['380001', '380015', '380054'],
        ];

        $states = [
            'Mumbai' => 'Maharashtra',
            'Delhi' => 'Delhi',
            'Bangalore' => 'Karnataka',
            'Pune' => 'Maharashtra',
            'Hyderabad' => 'Telangana',
            'Chennai' => 'Tamil Nadu',
            'Kolkata' => 'West Bengal',
            'Ahmedabad' => 'Gujarat',
        ];

        $count = 0;
        foreach ($cities as $city => $pins) {
            foreach ($pins as $basePin) {
                for ($i = 0; $i < 12; $i++) {
                    if ($count >= 100)
                        break 2;
                    $pin = (int)$basePin + $i;
                    $pinStr = str_pad($pin, 6, '0', STR_PAD_LEFT);

                    PinCode::create([
                        'pin' => $pinStr,
                        'city' => $city,
                        'state' => $states[$city],
                        'is_serviceable' => true,
                        'edd_days' => rand(3, 7),
                    ]);

                    // Make 50% of them COD eligible
                    if ($count < 50) {
                        DB::table('cod_eligible_pincodes')->insert([
                            'pin' => $pinStr,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]);
                    }

                    // Also make them serviceable in the other table if needed
                    DB::table('serviceable_pincodes')->insert([
                        'pin' => $pinStr,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);

                    $count++;
                }
            }
        }
    }
}
