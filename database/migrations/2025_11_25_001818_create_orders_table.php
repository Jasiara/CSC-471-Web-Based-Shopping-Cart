<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id('order_id');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            // order_date is handled by timestamps()
            $table->string('shipping_address')->nullable();
            $table->string('contact_phone', 50)->nullable();
            $table->decimal('total_amount', 10, 2);
            $table->string('status', 50)->default('Pending');
            $table->timestamps(); // Adds created_at (your order_date) and updated_at
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
