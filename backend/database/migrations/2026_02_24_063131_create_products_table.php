<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration 
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('sku')->unique();
            $table->foreignId('category_id')->constrained()->onDelete('cascade');
            $table->foreignId('condition_grade_id')->constrained()->onDelete('cascade');
            $table->string('brand');
            $table->string('model');
            $table->string('storage');
            $table->string('ram')->nullable();
            $table->string('colour')->nullable();
            $table->decimal('price', 10, 2);
            $table->decimal('mrp', 10, 2);
            $table->integer('stock_qty')->default(0);
            $table->integer('low_stock_threshold')->default(5);
            $table->boolean('is_active')->default(true);
            $table->text('description')->nullable();
            $table->timestamps();
        });

        DB::statement('ALTER TABLE products ADD FULLTEXT fulltext_index (brand, model, description)');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('products');
    }
};
