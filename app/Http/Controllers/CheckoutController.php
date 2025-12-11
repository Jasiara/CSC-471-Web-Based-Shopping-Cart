<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class CheckoutController extends Controller
{
    public function show(Request $request)
    {
        $cart = Cart::forUser($request->user());
        $items = $cart->items()->with('product')->get();

        return Inertia::render('checkout', [
            'cartItems' => $items,
            'defaults' => [
                'shipping_address' => $request->user()->address ?? '',
                'contact_phone' => $request->user()->phone ?? '',
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'shipping_address' => 'required|string|max:1024',
            'contact_phone' => 'nullable|string|max:50',
        ]);

        $user = $request->user();
        $cart = Cart::forUser($user);
        $items = $cart->items()->with('product')->get();

        if ($items->isEmpty()) {
            return redirect()->back()->withErrors(['cart' => 'Cart is empty']);
        }

        $order = null;

        // Use transaction for order creation
        DB::transaction(function () use ($user, $cart, $items, $validated, &$order) {
            $total = 0;

            foreach ($items as $it) {
                $price = is_string($it->product->price) ? (float)$it->product->price : $it->product->price;
                $total += $price * $it->quantity;
            }

            $order = Order::create([
                'user_id' => $user->id,
                'shipping_address' => $validated['shipping_address'],
                'contact_phone' => $validated['contact_phone'] ?? null,
                'total_amount' => $total,
                'status' => 'Pending',
            ]);

            foreach ($items as $it) {
                $price = is_string($it->product->price) ? (float)$it->product->price : $it->product->price;

                OrderItem::create([
                    'order_id' => $order->order_id,
                    'product_id' => $it->product->product_id,
                    'price' => $price,
                    'purchase_quantity' => $it->quantity,
                ]);

                // Optionally decrease product stock
                $it->product->decrement('stock_quantity', $it->quantity);
            }

            // Empty the cart
            $cart->items()->delete();
        });

        return redirect()->route('profile.orders')->with('success', 'Order placed successfully');
    }
}
