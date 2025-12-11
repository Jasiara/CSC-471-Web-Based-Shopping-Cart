<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Product;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function index()
    {
        $users = User::withCount('products')->latest()->get();
        $products = Product::with('user')->latest()->get();
        $orders = Order::with('user')->latest()->get();
        
        return Inertia::render('admin/dashboard', [
            'users' => $users,
            'products' => $products,
            'orders' => $orders,
        ]);
    }

    public function deleteUser(User $user)
    {
        if ($user->is_admin) {
            return redirect()->back()->withErrors(['error' => 'Cannot delete admin users']);
        }
        
        $user->delete();
        return redirect()->back()->with('success', 'User deleted successfully');
    }

    public function updateUser(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'is_admin' => 'boolean',
        ]);

        $user->update($validated);
        return redirect()->back()->with('success', 'User updated successfully');
    }

    public function deleteProduct(Product $product)
    {
        $product->delete();
        return redirect()->back()->with('success', 'Product deleted successfully');
    }

    public function updateProduct(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'stock_quantity' => 'required|integer|min:0',
        ]);

        $product->update($validated);
        return redirect()->back()->with('success', 'Product updated successfully');
    }

    public function updateOrder(Request $request, Order $order)
    {
        $validated = $request->validate([
            'status' => 'required|string|in:pending,processing,shipped,delivered,cancelled',
        ]);

        $order->update($validated);
        return redirect()->back()->with('success', 'Order status updated successfully');
    }

    public function deleteOrder(Order $order)
    {
        $order->delete();
        return redirect()->back()->with('success', 'Order deleted successfully');
    }
}
