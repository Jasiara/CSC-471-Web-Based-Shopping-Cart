<?php

use App\Http\Controllers\SignUpController;
use App\Http\Controllers\UserProfileController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProductDetailController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\LogoutController;
use App\Models\Product;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

// Logout route (must be outside auth middleware to work properly)
Route::post('/logout', [LogoutController::class, 'logout']);

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        $products = Product::when(Auth::check(), function ($query) {
            $query->where(function ($inner) {
                $inner->whereNull('user_id')
                    ->orWhere('user_id', '!=', Auth::id());
            });
        })->latest()->take(10)->get();
        return Inertia::render('dashboard', [
            'products' => $products,
        ]);
    })->name('dashboard');

    Route::get('profile', [UserProfileController::class, 'show'])->name('profile');
    Route::post('profile', [UserProfileController::class, 'update']);
    Route::post('products', [ProductController::class, 'store'])->name('products.store');
    Route::put('products/{product}', [ProductController::class, 'update'])->name('products.update');
    Route::delete('products/{product}', [ProductController::class, 'destroy'])->name('products.destroy');

    Route::get('products/{product}', [ProductDetailController::class, 'show'])->name('products.show');

    Route::get('cart', [CartController::class, 'show'])->name('cart');
    Route::post('cart/add', [CartController::class, 'add'])->name('cart.add');
    Route::delete('cart/items/{cartItem}', [CartController::class, 'remove'])->name('cart.remove');
    Route::patch('cart/items/{cartItem}', [CartController::class, 'updateQuantity'])->name('cart.updateQuantity');
    Route::get('cart/count', [CartController::class, 'getCartCount'])->name('cart.count');
    
    // Checkout and Orders
    Route::get('checkout', [\App\Http\Controllers\CheckoutController::class, 'show'])->name('checkout');
    Route::post('checkout', [\App\Http\Controllers\CheckoutController::class, 'store']);

    Route::get('profile/orders', [\App\Http\Controllers\OrderController::class, 'index'])->name('profile.orders');
});

Route::get('/signup', [SignUpController::class, 'show'])->name('signup');
Route::post('/signup', [SignUpController::class, 'store']);

Route::get('/signup', [SignUpController::class, 'show'])->name('signup');
Route::post('/signup', [SignUpController::class, 'store']);

require __DIR__.'/settings.php';