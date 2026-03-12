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
        Schema::table('orders', function (Blueprint $table) {
            $table->string('payment_status')
                ->default('unpaid')
                ->after('payment_method')
                ->comment('unpaid | paid | cancelled');

        // Just update default if needed, though we'll handle it in the controller mostly
        // $table->string('payment_method')->default('cod')->change(); 
        // In Laravel 9, changing columns requires doctrine/dbal. 
        // I'll just add the status and ensure the controller handles the default.
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['payment_status']);
        });
    }
};
