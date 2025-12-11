<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CartController extends Controller
{
    /**
     * Show the user's cart.
     */
    public function show(Request $request)
    {
        $cart = Cart::forUser($request->user());
        $cartItems = $cart->items()->with('product')->get();

        return Inertia::render('cart', [
            'cartItems' => $cartItems,
            'cart' => $cart,
        ]);
    }

    /**
     * Add a product to the user's cart.
     */
    public function add(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|integer|exists:products,product_id',
            'quantity' => 'required|integer|min:1|max:999',
        ]);

        $cart = Cart::forUser($request->user());
        
        // Check product stock availability
        $product = Product::findOrFail($validated['product_id']);
        
        // Check if product already exists in cart
        $cartItem = CartItem::where('cart_id', $cart->cart_id)
            ->where('product_id', $validated['product_id'])
            ->first();

        $newQuantity = $cartItem ? ($cartItem->quantity + $validated['quantity']) : $validated['quantity'];
        
        if ($newQuantity > $product->stock_quantity) {
            return redirect()->back()->withErrors(['quantity' => 'Insufficient stock available. Only ' . $product->stock_quantity . ' items in stock.']);
        }

        if ($cartItem) {
            // Increment quantity if already in cart
            $cartItem->increment('quantity', $validated['quantity']);
        } else {
            // Add new item to cart
            CartItem::create([
                'cart_id' => $cart->cart_id,
                'product_id' => $validated['product_id'],
                'quantity' => $validated['quantity'],
            ]);
        }

        return redirect()->back()->with('success', 'Product added to cart!');
    }

    /**
     * Remove a product from the user's cart.
     */
    public function remove(Request $request, CartItem $cartItem)
    {
        $cart = Cart::forUser($request->user());

        // Ensure the cart item belongs to the user's cart
        if ($cartItem->cart_id !== $cart->cart_id) {
            abort(403, 'Unauthorized');
        }

        $cartItem->delete();

        return redirect()->back()->with('success', 'Product removed from cart!');
    }

    /**
     * Update quantity of a cart item.
     */
    public function updateQuantity(Request $request, CartItem $cartItem)
    {
        $validated = $request->validate([
            'quantity' => 'required|integer|min:1|max:999',
        ]);

        $cart = Cart::forUser($request->user());

        // Ensure the cart item belongs to the user's cart
        if ($cartItem->cart_id !== $cart->cart_id) {
            abort(403, 'Unauthorized');
        }
        
        // Check stock availability
        if ($validated['quantity'] > $cartItem->product->stock_quantity) {
            return redirect()->back()->withErrors(['quantity' => 'Insufficient stock available. Only ' . $cartItem->product->stock_quantity . ' items in stock.']);
        }

        $cartItem->update(['quantity' => $validated['quantity']]);

        return redirect()->back()->with('success', 'Quantity updated!');
    }

    /**
     * Get cart item count for the authenticated user.
     */
    public function getCartCount(Request $request)
    {
        $cart = Cart::forUser($request->user());
        $count = CartItem::where('cart_id', $cart->cart_id)->sum('quantity');

        return response()->json(['count' => $count]);
    }
}
