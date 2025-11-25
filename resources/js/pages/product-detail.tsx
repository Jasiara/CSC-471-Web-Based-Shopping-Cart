import { Head } from '@inertiajs/react';
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

export default function ProductDetail({ product }: { product: Product }) {
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(false);

    const handleAddToCart = async () => {
        if (quantity < 1) return;

        setLoading(true);
        const token = document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute('content');

        try {
            const response = await fetch('/cart/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': token || '',
                },
                body: JSON.stringify({
                    product_id: product.product_id,
                    quantity: quantity,
                }),
            });

            if (!response.ok) throw new Error('Failed to add to cart');

            // Show success message and redirect to cart
            alert(`Added ${quantity} item(s) to cart!`);
            window.location.href = '/cart';
        } catch (error) {
            console.error('Add to cart error:', error);
            alert('Failed to add item to cart. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const price =
        typeof product.price === 'string'
            ? parseFloat(product.price)
            : product.price;

    return (
        <>
            <Head title={product.name} />
            <div className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 to-indigo-100 p-6 text-gray-900">
                {/* Back Button */}
                <div className="mb-8">
                    <a
                        href="/dashboard"
                        className="inline-block bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-200"
                    >
                        ← Back to Store
                    </a>
                </div>

                {/* Product Detail Container */}
                <div className="mx-auto w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
                        {/* Product Image */}
                        <div className="flex items-center justify-center bg-gray-100 rounded-lg h-96">
                            {product.image_url ? (
                                <img
                                    src={product.image_url}
                                    alt={product.name}
                                    className="w-full h-full object-cover rounded-lg"
                                />
                            ) : (
                                <span className="text-gray-400 text-xl">
                                    No Image Available
                                </span>
                            )}
                        </div>

                        {/* Product Info */}
                        <div className="flex flex-col justify-between">
                            {/* Header */}
                            <div>
                                {product.category && (
                                    <p className="text-sm font-semibold uppercase text-indigo-600 mb-2">
                                        {product.category}
                                    </p>
                                )}
                                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                                    {product.name}
                                </h1>

                                {/* Price and Stock */}
                                <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
                                    <div>
                                        <p className="text-gray-600 text-sm">
                                            Price
                                        </p>
                                        <p className="text-4xl font-bold text-indigo-600">
                                            ${price.toFixed(2)}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-gray-600 text-sm">
                                            Availability
                                        </p>
                                        <p
                                            className={`text-xl font-bold ${
                                                product.stock_quantity > 0
                                                    ? 'text-green-600'
                                                    : 'text-red-600'
                                            }`}
                                        >
                                            {product.stock_quantity > 0
                                                ? `${product.stock_quantity} in stock`
                                                : 'Out of stock'}
                                        </p>
                                    </div>
                                </div>

                                {/* Description */}
                                {product.description && (
                                    <div className="mb-6">
                                        <h2 className="text-xl font-semibold text-gray-800 mb-2">
                                            Description
                                        </h2>
                                        <p className="text-gray-700 leading-relaxed">
                                            {product.description}
                                        </p>
                                    </div>
                                )}

                                {/* SKU */}
                                <div className="mb-6 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                    <p className="text-sm text-gray-600">
                                        SKU: <span className="font-mono font-semibold text-gray-900">{product.sku}</span>
                                    </p>
                                </div>
                            </div>

                            {/* Add to Cart Section */}
                            {product.stock_quantity > 0 && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-800 mb-2">
                                            Quantity
                                        </label>
                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={() =>
                                                    setQuantity(
                                                        Math.max(
                                                            1,
                                                            quantity - 1
                                                        )
                                                    )
                                                }
                                                className="h-10 w-10 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-lg font-bold text-gray-700 transition-colors"
                                            >
                                                −
                                            </button>
                                            <input
                                                type="number"
                                                min="1"
                                                max={product.stock_quantity}
                                                value={quantity}
                                                onChange={(e) => {
                                                    const val = parseInt(
                                                        e.target.value
                                                    );
                                                    if (
                                                        !isNaN(val) &&
                                                        val >= 1 &&
                                                        val <=
                                                            product.stock_quantity
                                                    ) {
                                                        setQuantity(val);
                                                    }
                                                }}
                                                className="w-16 text-center border-2 border-gray-300 rounded-lg py-2 font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                                            />
                                            <button
                                                onClick={() =>
                                                    setQuantity(
                                                        Math.min(
                                                            product.stock_quantity,
                                                            quantity + 1
                                                        )
                                                    )
                                                }
                                                className="h-10 w-10 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-lg font-bold text-gray-700 transition-colors"
                                            >
                                                +
                                            </button>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2">
                                            Max: {product.stock_quantity}
                                        </p>
                                    </div>

                                    <button
                                        onClick={handleAddToCart}
                                        disabled={loading}
                                        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-bold py-4 px-6 rounded-lg transition-colors duration-200 text-lg"
                                    >
                                        {loading
                                            ? 'Adding to Cart...'
                                            : `Add ${quantity} to Cart`}
                                    </button>
                                </div>
                            )}

                            {product.stock_quantity === 0 && (
                                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-red-700 font-semibold text-center">
                                        This item is currently out of stock
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
