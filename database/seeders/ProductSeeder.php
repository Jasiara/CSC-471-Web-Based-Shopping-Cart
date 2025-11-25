<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = [
            [
                'sku' => 'PROD001',
                'name' => 'Premium Wireless Headphones',
                'description' => 'High-quality wireless headphones with noise cancellation and 30-hour battery life.',
                'price' => 199.99,
                'category' => 'Electronics',
                'stock_quantity' => 45,
            ],
            [
                'sku' => 'PROD002',
                'name' => 'Organic Coffee Beans',
                'description' => 'Fair-trade, single-origin coffee beans sourced from sustainable farms.',
                'price' => 24.99,
                'category' => 'Food & Beverage',
                'stock_quantity' => 120,
            ],
            [
                'sku' => 'PROD003',
                'name' => 'Eco-Friendly Water Bottle',
                'description' => 'Reusable stainless steel water bottle with double-wall insulation.',
                'price' => 34.99,
                'category' => 'Accessories',
                'stock_quantity' => 80,
            ],
            [
                'sku' => 'PROD004',
                'name' => 'Yoga Mat - Non-Slip',
                'description' => 'Premium non-slip yoga mat with carrying strap, perfect for any practice.',
                'price' => 49.99,
                'category' => 'Fitness',
                'stock_quantity' => 65,
            ],
            [
                'sku' => 'PROD005',
                'name' => 'Smart Watch Pro',
                'description' => 'Advanced smartwatch with health tracking, GPS, and 7-day battery.',
                'price' => 299.99,
                'category' => 'Electronics',
                'stock_quantity' => 30,
            ],
            [
                'sku' => 'PROD006',
                'name' => 'Natural Skincare Set',
                'description' => 'Complete skincare set with organic ingredients for all skin types.',
                'price' => 59.99,
                'category' => 'Beauty',
                'stock_quantity' => 55,
            ],
            [
                'sku' => 'PROD007',
                'name' => 'Bamboo Cutting Board Set',
                'description' => 'Set of 3 durable bamboo cutting boards with non-slip feet.',
                'price' => 39.99,
                'category' => 'Kitchen',
                'stock_quantity' => 90,
            ],
            [
                'sku' => 'PROD008',
                'name' => 'Portable Phone Charger',
                'description' => '20000mAh power bank with dual USB ports and fast charging.',
                'price' => 44.99,
                'category' => 'Electronics',
                'stock_quantity' => 150,
            ],
            [
                'sku' => 'PROD009',
                'name' => 'Ergonomic Office Chair',
                'description' => 'Comfortable office chair with lumbar support and adjustable height.',
                'price' => 249.99,
                'category' => 'Furniture',
                'stock_quantity' => 20,
            ],
            [
                'sku' => 'PROD010',
                'name' => 'Stainless Steel Thermos',
                'description' => 'Insulated thermos keeping drinks hot for 12 hours or cold for 24 hours.',
                'price' => 29.99,
                'category' => 'Accessories',
                'stock_quantity' => 110,
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}
