<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('order_items', function (Blueprint $table) {
            $table->id('order_item_id');
            $table->foreignId('order_id')->constrained('orders')->references('order_id')->onDelete('cascade');
            $table->foreignId('product_id')->constrained('products')->references('product_id')->onDelete('cascade');
            $table->decimal('price', 10, 2); // Price at time of purchase
            $table->integer('purchase_quantity');
            $table->timestamps(); // Optional
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_items');
    }
};
