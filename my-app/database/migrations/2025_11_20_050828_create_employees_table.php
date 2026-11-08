<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('employees', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('phone')->nullable();
            $table->string('avatar')->nullable();
            $table->string('role');
            $table->string('department');
            $table->enum('status', ['active', 'inactive', 'on_leave'])->default('active');
            $table->decimal('salary', 10, 2);
            $table->enum('pay_frequency', ['monthly', 'biweekly', 'weekly'])->default('monthly');
            $table->date('hired_date');
            $table->date('last_raise')->nullable();
            $table->date('last_review_date')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employees');
    }
};
