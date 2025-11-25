import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

interface Product {
    product_id: number;
    sku: string;
    name: string;
    description?: string;
    price: string | number;
    image_url?: string;
    category?: string;
    stock_quantity: number;
}

interface CartItem {
    cart_item_id: number;
    product_id: number;
    quantity: number;
    product: Product;
}

export default function Cart({ cartItems: initialItems }: { cartItems: CartItem[] }) {
    const [cartItems, setCartItems] = useState(initialItems);
    const deleteForm = useForm({});
    const updateForm = useForm<{ quantity: number }>({ quantity: 1 });

    const handleRemove = (cartItem: CartItem) => {
        if (confirm('Remove this item from cart?')) {
            deleteForm.delete(`/cart/items/${cartItem.cart_item_id}`, {
                onSuccess: () => {
                    window.location.reload();
                },
            });
        }
    };

    const handleUpdateQuantity = (
        cartItem: CartItem,
        newQuantity: number
    ) => {
        if (newQuantity < 1) return;

        // Update local state immediately for UI feedback
        setCartItems(
            cartItems.map((item) =>
                item.cart_item_id === cartItem.cart_item_id
                    ? { ...item, quantity: newQuantity }
                    : item
            )
        );

        // Send update to server: first set form data, then call patch with options
        updateForm.setData('quantity', newQuantity);
        updateForm.patch(`/cart/items/${cartItem.cart_item_id}`, {
            onError: () => {
                // Revert on error
                setCartItems(initialItems);
            },
        });
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => {
            const price =
                typeof item.product.price === 'string'
                    ? parseFloat(item.product.price)
                    : item.product.price;
            return total + price * item.quantity;
        }, 0);
    };

    return (
        <>
            <Head title="Shopping Cart" />
            <div className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 to-indigo-100 p-6 text-gray-900">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <h1 className="text-4xl font-bold text-indigo-600">
                        Shopping Cart
                    </h1>
                    <a
                        href="/dashboard"
                        className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-200"
                    >
                        Continue Shopping
                    </a>
                </div>

                {cartItems.length === 0 ? (
                    <div className="mx-auto w-full max-w-4xl bg-white p-12 rounded-lg shadow-md text-center">
                        <p className="text-xl text-gray-600 mb-6">
                            Your cart is empty
                        </p>
                        <a
                            href="/dashboard"
                            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200"
                        >
                            Start Shopping
                        </a>
                    </div>
                ) : (
                    <div className="mx-auto w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                                {cartItems.map((item) => (
                                    <div
                                        key={item.cart_item_id}
                                        className="border-b border-gray-200 p-6 flex items-center gap-6 hover:bg-gray-50 transition-colors"
                                    >
                                        {/* Product Image */}
                                        <div className="h-24 w-24 bg-gray-200 rounded flex-shrink-0 flex items-center justify-center">
                                            {item.product.image_url ? (
                                                <img
                                                    src={item.product.image_url}
                                                    alt={item.product.name}
                                                    className="h-full w-full object-cover rounded"
                                                />
                                            ) : (
                                                <span className="text-gray-400 text-sm">
                                                    No Image
                                                </span>
                                            )}
                                        </div>

                                        {/* Product Info */}
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                                {item.product.name}
                                            </h3>
                                            {item.product.category && (
                                                <p className="text-sm text-gray-600 mb-2">
                                                    Category:{' '}
                                                    {item.product.category}
                                                </p>
                                            )}
                                            <p className="text-lg font-bold text-indigo-600">
                                                $
                                                {typeof item.product
                                                    .price === 'string'
                                                    ? parseFloat(
                                                          item.product.price
                                                      ).toFixed(2)
                                                    : item.product.price.toFixed(
                                                          2
                                                      )}
                                            </p>
                                        </div>

                                        {/* Quantity and Actions */}
                                        <div className="flex flex-col items-end gap-3">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() =>
                                                        handleUpdateQuantity(
                                                            item,
                                                            item.quantity - 1
                                                        )
                                                    }
                                                    className="h-8 w-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded text-gray-700 font-bold"
                                                    disabled={item.quantity <= 1}
                                                >
                                                    −
                                                </button>
                                                <span className="w-8 text-center font-semibold">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() =>
                                                        handleUpdateQuantity(
                                                            item,
                                                            item.quantity + 1
                                                        )
                                                    }
                                                    className="h-8 w-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded text-gray-700 font-bold"
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <p className="text-sm font-semibold text-gray-600">
                                                Subtotal: $
                                                {(
                                                    (typeof item.product
                                                        .price === 'string'
                                                        ? parseFloat(
                                                              item.product
                                                                  .price
                                                          )
                                                        : item.product.price) *
                                                    item.quantity
                                                ).toFixed(2)}
                                            </p>
                                            <button
                                                onClick={() =>
                                                    handleRemove(item)
                                                }
                                                className="text-red-600 hover:text-red-800 font-semibold text-sm"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Summary */}
                        <div className="bg-white rounded-lg shadow-md p-6 h-fit sticky top-6">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                                Order Summary
                            </h2>
                            <div className="space-y-4 mb-6 border-b border-gray-200 pb-6">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">
                                        Items ({cartItems.length}):
                                    </span>
                                    <span className="font-semibold">
                                        {cartItems.reduce(
                                            (sum, item) =>
                                                sum + item.quantity,
                                            0
                                        )}{' '}
                                        units
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">
                                        Subtotal:
                                    </span>
                                    <span className="font-semibold">
                                        ${calculateTotal().toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">
                                        Shipping:
                                    </span>
                                    <span className="font-semibold">Free</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center mb-6 pt-4">
                                <span className="text-xl font-bold text-gray-900">
                                    Total:
                                </span>
                                <span className="text-2xl font-bold text-indigo-600">
                                    ${calculateTotal().toFixed(2)}
                                </span>
                            </div>
                            <Link href="/checkout" className="w-full inline-block text-center bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200">
                                Proceed to Checkout
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
