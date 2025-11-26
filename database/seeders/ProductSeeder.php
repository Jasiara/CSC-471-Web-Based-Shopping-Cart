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
                'image_url' => 'https://assets.bosecreative.com/transform/3b5bc648-2312-46dc-892e-53372caea648/QCH_Black_400x300_x2?io=width:816,height:667,transform:fit&io=width:816,height:667,transform:fit',
            ],
            [
                'sku' => 'PROD002',
                'name' => 'Organic Coffee Beans',
                'description' => 'Fair-trade, single-origin coffee beans sourced from sustainable farms.',
                'price' => 24.99,
                'category' => 'Food & Beverage',
                'stock_quantity' => 120,
                'image_url' => 'https://images.unsplash.com/photo-1495881674446-33314d7fb917?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y29mZmVlJTIwYmVhbnMlMjBwYWNrYWdlfGVufDB8fDB8fHww',
            ],
            [
                'sku' => 'PROD003',
                'name' => 'Eco-Friendly Water Bottle',
                'description' => 'Reusable stainless steel water bottle with double-wall insulation.',
                'price' => 34.99,
                'category' => 'Accessories',
                'stock_quantity' => 80,
                'image_url' => 'https://images.unsplash.com/photo-1625708458528-802ec79b1ed8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8d2F0ZXIlMjBib3R0bGV8ZW58MHx8MHx8fDA%3D',
            ],
            [
                'sku' => 'PROD004',
                'name' => 'Yoga Mat - Non-Slip',
                'description' => 'Premium non-slip yoga mat with carrying strap, perfect for any practice.',
                'price' => 49.99,
                'category' => 'Fitness',
                'stock_quantity' => 65,
                'image_url' => 'https://images.unsplash.com/photo-1591291621164-2c6367723315?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            ],
            [
                'sku' => 'PROD005',
                'name' => 'Smart Watch Pro',
                'description' => 'Advanced smartwatch with health tracking, GPS, and 7-day battery.',
                'price' => 299.99,
                'category' => 'Electronics',
                'stock_quantity' => 30,
                'image_url' => 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c21hcnQlMjB3YXRjaHxlbnwwfHwwfHx8MA%3D%3D',
            ],
            [
                'sku' => 'PROD006',
                'name' => 'Natural Skincare Set',
                'description' => 'Complete skincare set with organic ingredients for all skin types.',
                'price' => 59.99,
                'category' => 'Beauty',
                'stock_quantity' => 55,
                'image_url' => 'https://images.unsplash.com/photo-1762760625095-a8401a4206ed?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2tpbiUyMGNhcmUlMjBzZXR8ZW58MHx8MHx8fDA%3D',
            ],
            [
                'sku' => 'PROD007',
                'name' => 'Bamboo Cutting Board Set',
                'description' => 'Set of 3 durable bamboo cutting boards with non-slip feet.',
                'price' => 39.99,
                'category' => 'Kitchen',
                'stock_quantity' => 90,
                'image_url' => 'https://images.unsplash.com/photo-1660002561318-6ef0a0ae1f04?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YmFtYm9vJTIwY3V0dGluZyUyMGJvYXJkfGVufDB8fDB8fHww',
            ],
            [
                'sku' => 'PROD008',
                'name' => 'Portable Phone Charger',
                'description' => '20000mAh power bank with dual USB ports and fast charging.',
                'price' => 44.99,
                'category' => 'Electronics',
                'stock_quantity' => 150,
                'image_url' => 'https://images.unsplash.com/photo-1574494462163-91285e2386c4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cG9ydGFibGUlMjBwaG9uZSUyMGNoYXJnZXJ8ZW58MHx8MHx8fDA%3D',
            ],
            [
                'sku' => 'PROD009',
                'name' => 'Ergonomic Office Chair',
                'description' => 'Comfortable office chair with lumbar support and adjustable height.',
                'price' => 249.99,
                'category' => 'Furniture',
                'stock_quantity' => 20,
                'image_url' => 'https://plus.unsplash.com/premium_photo-1671656349007-0c41dab52c96?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8b2ZmaWNlJTIwY2hhaXJ8ZW58MHx8MHx8fDA%3D',
            ],
            [
                'sku' => 'PROD010',
                'name' => 'Stainless Steel Thermos',
                'description' => 'Insulated thermos keeping drinks hot for 12 hours or cold for 24 hours.',
                'price' => 29.99,
                'category' => 'Accessories',
                'stock_quantity' => 110,
                'image_url' => 'https://images.unsplash.com/photo-1613645540553-d98859ffeec5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dGhlcm1vc3xlbnwwfHwwfHx8MA%3D%3D',
            ],
        ];

        foreach ($products as $product) {
            Product::updateOrCreate(
                ['sku' => $product['sku']],
                $product
            );
        }
    }
}
