<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Order;
use App\Models\Product;

class UserProfileController extends Controller
{
    /**
     * Show the user profile page.
     */
    public function show(Request $request)
    {
        $orders = Order::where('user_id', $request->user()->id)
            ->with('items.product')
            ->orderByDesc('created_at')
            ->get();

        $products = Product::where('user_id', $request->user()->id)
            ->orderByDesc('created_at')
            ->get();

        return Inertia::render('profile', [
            'user' => $request->user(),
            'orders' => $orders,
            'products' => $products,
        ]);
    }

    /**
     * Update user information (email, phone, address).
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email|max:255|unique:users,email,' . $request->user()->id,
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:255',
        ]);

        $request->user()->update($validated);

        return redirect()->back()->with('success', 'Profile updated successfully!');
    }
}
