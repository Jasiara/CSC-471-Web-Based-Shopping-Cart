<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $orders = Order::where('user_id', $request->user()->id)
            ->with('items.product')
            ->orderByDesc('created_at')
            ->get();

        return Inertia::render('profile/orders', [
            'orders' => $orders,
        ]);
    }
}
