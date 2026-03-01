<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration 
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('product_specs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->string('display')->nullable();
            $table->string('processor')->nullable();
            $table->string('battery')->nullable();
            $table->string('camera')->nullable();
            $table->string('os')->nullable();
            $table->string('connectivity')->nullable();
            $table->string('sim_type')->nullable();
            $table->string('dimensions')->nullable();
            $table->string('weight')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('product_specs');
    }
};
