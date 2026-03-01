<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Category;
use App\Models\ConditionGrade;

echo "Categories:\n";
foreach (Category::all() as $cat) {
    echo "ID: {$cat->id}, Name: {$cat->name}\n";
}

echo "\nCondition Grades:\n";
foreach (ConditionGrade::all() as $grade) {
    echo "ID: {$grade->id}, Label: {$grade->label}\n";
}
