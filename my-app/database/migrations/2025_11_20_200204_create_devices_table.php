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
        Schema::create('devices', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('serial_number')->unique();
            $table->enum('device_type', ['laptop', 'desktop', 'phone', 'tablet', 'monitor', 'other'])->default('laptop');
            $table->foreignId('assigned_to')->nullable()->constrained('employees')->onDelete('set null');
            $table->enum('status', ['in_use', 'available', 'maintenance', 'retired'])->default('available');
            $table->integer('health_score')->unsigned()->default(100);
            $table->date('purchase_date')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('devices');
    }
};
