<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Category::create([
            'name' => 'Smartphones',
            'slug' => Str::slug('Smartphones'),
        ]);

        Category::create([
            'name' => 'Accessories',
            'slug' => Str::slug('Accessories'),
        ]);
    }
}
