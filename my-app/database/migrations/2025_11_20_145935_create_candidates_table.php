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
        Schema::create('candidates', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('phone')->nullable();
            $table->string('avatar')->nullable();
            $table->string('position');
            $table->date('application_date');
            $table->string('resume_url')->nullable();
            $table->enum('status', ['new', 'screening', 'interview', 'offer', 'hired', 'rejected'])->default('new');
            $table->decimal('expected_salary', 10, 2)->nullable();
            $table->text('notes')->nullable();
            $table->foreignId('employee_id')->nullable()->constrained()->onDelete('set null');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('candidates');
    }
};
