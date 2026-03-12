<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\Category;
use App\Models\ConditionGrade;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $smartphoneId = Category::where('name', 'Smartphones')->first()->id;
        $grades = ConditionGrade::all()->pluck('id', 'code');

        $products = [
            [
                'sku' => 'IPH15-128-BLK-APLUS',
                'category_id' => $smartphoneId,
                'condition_grade_id' => $grades['A+'],
                'brand' => 'Apple',
                'model' => 'iPhone 15',
                'storage' => '128GB',
                'ram' => '6GB',
                'colour' => 'Black',
                'price' => 65000,
                'mrp' => 79900,
                'stock_qty' => 5,
                'description' => 'Like new iPhone 15 with no scratches.',
            ],
            [
                'sku' => 'IPH14-128-BLU-A',
                'category_id' => $smartphoneId,
                'condition_grade_id' => $grades['A'],
                'brand' => 'Apple',
                'model' => 'iPhone 14',
                'storage' => '128GB',
                'ram' => '6GB',
                'colour' => 'Blue',
                'price' => 52000,
                'mrp' => 69900,
                'stock_qty' => 8,
                'description' => 'Superb condition iPhone 14.',
            ],
            [
                'sku' => 'S23U-256-GRN-APLUS',
                'category_id' => $smartphoneId,
                'condition_grade_id' => $grades['A+'],
                'brand' => 'Samsung',
                'model' => 'Galaxy S23 Ultra',
                'storage' => '256GB',
                'ram' => '12GB',
                'colour' => 'Green',
                'price' => 85000,
                'mrp' => 124999,
                'stock_qty' => 3,
                'description' => 'Flagship Samsung S23 Ultra in pristine condition.',
            ],
            [
                'sku' => 'S22-128-WHT-B',
                'category_id' => $smartphoneId,
                'condition_grade_id' => $grades['B'],
                'brand' => 'Samsung',
                'model' => 'Galaxy S22',
                'storage' => '128GB',
                'ram' => '8GB',
                'colour' => 'White',
                'price' => 35000,
                'mrp' => 72999,
                'stock_qty' => 12,
                'description' => 'Fully functional S22 with minor scratches.',
            ],
            [
                'sku' => 'OP11-256-BLK-A',
                'category_id' => $smartphoneId,
                'condition_grade_id' => $grades['A'],
                'brand' => 'OnePlus',
                'model' => 'OnePlus 11',
                'storage' => '256GB',
                'ram' => '16GB',
                'colour' => 'Black',
                'price' => 48000,
                'mrp' => 61999,
                'stock_qty' => 7,
                'description' => 'OnePlus 11 with fast charging and great display.',
            ],
            [
                'sku' => 'OP10P-128-SIL-C',
                'category_id' => $smartphoneId,
                'condition_grade_id' => $grades['C'],
                'brand' => 'OnePlus',
                'model' => 'OnePlus 10 Pro',
                'storage' => '128GB',
                'ram' => '8GB',
                'colour' => 'Silver',
                'price' => 28000,
                'mrp' => 66999,
                'stock_qty' => 4,
                'description' => 'Functional 10 Pro with visible wear and tear.',
            ],
            [
                'sku' => 'IPH13-128-RED-A',
                'category_id' => $smartphoneId,
                'condition_grade_id' => $grades['A'],
                'brand' => 'Apple',
                'model' => 'iPhone 13',
                'storage' => '128GB',
                'ram' => '4GB',
                'colour' => 'Product Red',
                'price' => 42000,
                'mrp' => 59900,
                'stock_qty' => 10,
                'description' => 'Great value iPhone 13.',
            ],
            [
                'sku' => 'S21FE-128-LAV-B',
                'category_id' => $smartphoneId,
                'condition_grade_id' => $grades['B'],
                'brand' => 'Samsung',
                'model' => 'Galaxy S21 FE',
                'storage' => '128GB',
                'ram' => '8GB',
                'colour' => 'Lavender',
                'price' => 22000,
                'mrp' => 49999,
                'stock_qty' => 15,
                'description' => 'S21 FE at an affordable price.',
            ],
            [
                'sku' => 'IPH12-64-WHT-APLUS',
                'category_id' => $smartphoneId,
                'condition_grade_id' => $grades['A+'],
                'brand' => 'Apple',
                'model' => 'iPhone 12',
                'storage' => '64GB',
                'ram' => '4GB',
                'colour' => 'White',
                'price' => 32000,
                'mrp' => 49900,
                'stock_qty' => 6,
                'description' => 'Mint condition iPhone 12.',
            ],
            [
                'sku' => 'OPN2-128-BLU-A',
                'category_id' => $smartphoneId,
                'condition_grade_id' => $grades['A'],
                'brand' => 'OnePlus',
                'model' => 'Nord 2',
                'storage' => '128GB',
                'ram' => '8GB',
                'colour' => 'Blue Haze',
                'price' => 18000,
                'mrp' => 29999,
                'stock_qty' => 20,
                'description' => 'Reliable Nord 2 in good condition.',
            ],
        ];

        foreach ($products as $productData) {
            Product::create($productData);
        }
    }
}
