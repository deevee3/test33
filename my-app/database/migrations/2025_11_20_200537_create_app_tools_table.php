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
        Schema::create('app_tools', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('icon_url')->nullable();
            $table->text('description');
            $table->string('category');
            $table->string('link_url')->nullable();
            $table->enum('integration_status', ['active', 'inactive', 'pending'])->default('active');
            $table->integer('usage_count')->unsigned()->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('app_tools');
    }
};
