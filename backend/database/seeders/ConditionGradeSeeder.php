<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ConditionGrade;

class ConditionGradeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        ConditionGrade::create([
            'code' => 'A+',
<<<<<<< HEAD
            'label' => 'Mint (Like New)',
=======
            'label' => 'Like New',
>>>>>>> a45f52b (payment-integrated)
            'description' => 'No visible scratches or dents. Battery health above 90%.',
        ]);

        ConditionGrade::create([
            'code' => 'A',
<<<<<<< HEAD
            'label' => 'Excellent',
=======
            'label' => 'Superb',
>>>>>>> a45f52b (payment-integrated)
            'description' => 'Minor micro-scratches, not visible from 12 inches away.',
        ]);

        ConditionGrade::create([
            'code' => 'B',
            'label' => 'Good',
            'description' => 'Moderate scratches or minor dents. Fully functional.',
        ]);

        ConditionGrade::create([
            'code' => 'C',
            'label' => 'Fair',
            'description' => 'Visible heavy scratches and dents. Pricing reflects condition.',
        ]);
    }
}
