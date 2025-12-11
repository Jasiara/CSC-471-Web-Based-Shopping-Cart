<?php

use App\Http\Controllers\SignUpController;
use App\Http\Controllers\UserProfileController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProductDetailController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\LogoutController;
use App\Http\Controllers\AdminController;
use App\Models\Product;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Laravel\Fortify\Features;

// Serve storage files (for PHP built-in server compatibility)
Route::get('/storage/{path}', function ($path) {
    $filePath = storage_path('app/public/' . $path);
    
    if (!file_exists($filePath)) {
        abort(404);
    }
    
    $mimeType = mime_content_type($filePath);
    return response()->file($filePath, ['Content-Type' => $mimeType]);
})->where('path', '.*');

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

// Logout route (must be outside auth middleware to work properly)
Route::post('/logout', [LogoutController::class, 'logout'])->name('logout');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        // Redirect admins to admin dashboard
        if (Auth::user()->is_admin) {
            return redirect()->route('admin.dashboard');
        }
        
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
    
    // Admin routes
    Route::middleware('admin')->group(function () {
        Route::get('admin', [AdminController::class, 'index'])->name('admin.dashboard');
        Route::delete('admin/users/{user}', [AdminController::class, 'deleteUser'])->name('admin.users.delete');
        Route::put('admin/users/{user}', [AdminController::class, 'updateUser'])->name('admin.users.update');
        Route::delete('admin/products/{product}', [AdminController::class, 'deleteProduct'])->name('admin.products.delete');
        Route::put('admin/products/{product}', [AdminController::class, 'updateProduct'])->name('admin.products.update');
        Route::delete('admin/orders/{order}', [AdminController::class, 'deleteOrder'])->name('admin.orders.delete');
        Route::put('admin/orders/{order}', [AdminController::class, 'updateOrder'])->name('admin.orders.update');
    });
});

Route::get('/signup', [SignUpController::class, 'show'])->name('signup');
Route::post('/signup', [SignUpController::class, 'store']);

require __DIR__.'/settings.php';