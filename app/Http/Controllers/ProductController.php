<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    /**
     * Store a newly created product by the authenticated user.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'description' => 'nullable|string|max:500',
            'price' => 'required|numeric|min:0.01|max:999999.99',
            'category' => 'nullable|string|max:100',
            'stock_quantity' => 'required|integer|min:0|max:999999',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        // Generate a unique SKU
        $validated['sku'] = 'SKU-' . uniqid() . '-' . $request->user()->id;
        $validated['user_id'] = $request->user()->id;

        // Handle image upload
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('products', 'public');
            $validated['image_url'] = '/storage/' . $imagePath;
        }

        Product::create($validated);

        return redirect()->route('profile')->with('success', 'Product posted successfully!');
    }

    public function update(Request $request, Product $product)
    {
        abort_if($product->user_id !== $request->user()->id, 403);

        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'description' => 'nullable|string|max:500',
            'price' => 'required|numeric|min:0.01|max:999999.99',
            'category' => 'nullable|string|max:100',
            'stock_quantity' => 'required|integer|min:0|max:999999',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('products', 'public');
            $validated['image_url'] = '/storage/' . $imagePath;
        }

        $product->update($validated);

        return redirect()->route('profile')->with('success', 'Product updated successfully!');
    }

    /**
     * Remove a product owned by the authenticated user.
     */
    public function destroy(Request $request, Product $product)
    {
        abort_if($product->user_id !== $request->user()->id, 403);

        if ($product->image_url) {
            $relativePath = ltrim(str_replace('/storage/', '', $product->image_url), '/');
            Storage::disk('public')->delete($relativePath);
        }

        $product->delete();

        return redirect()->route('profile')->with('success', 'Product deleted successfully!');
    }
}
