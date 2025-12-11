<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductDetailController extends Controller
{
    /**
     * Show the product detail page.
     */
    public function show(Product $product)
    {
        return Inertia::render('product-detail', [
            'product' => $product,
        ]);
    }
}
