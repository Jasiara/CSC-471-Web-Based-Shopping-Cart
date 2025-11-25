<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('carts', function (Blueprint $table) {
            $table->id('cart_id');
            // References the 'id' column of the Laravel 'users' table
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->decimal('credits', 10, 2)->default(0.00);
            $table->timestamps(); // Handles created_at/updated_at
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('carts');
    }
};
