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
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained()->onDelete('cascade');
            $table->foreignId('reviewer_id')->constrained('employees')->onDelete('cascade');
            $table->date('review_date');
            $table->integer('rating')->unsigned();
            $table->text('comments')->nullable();
            $table->enum('review_type', ['quarterly', 'annual', 'probation', 'other'])->default('quarterly');
            $table->enum('status', ['draft', 'completed'])->default('completed');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
