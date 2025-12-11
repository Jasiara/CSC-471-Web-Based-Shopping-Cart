import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';

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

export default function Dashboard({ products, auth }: { products: Product[]; auth?: any }) {
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        // Fetch cart count on mount
        fetch('/cart/count')
            .then((res) => res.json())
            .then((data) => setCartCount(data.count || 0))
            .catch(console.error);
    }, []);

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 to-indigo-100 p-6 text-gray-900">
                {/* Header with Profile Button and Cart Button */}
                <div className="mb-12 flex items-center justify-between">
                    <div className="text-center flex-1">
                        <h1 className="mb-2 text-5xl font-bold text-indigo-600">
                            Amazonian Store
                        </h1>
                        <p className="text-lg text-gray-700">
                            Fast, reliable shipping for all your needs
                        </p>
                    </div>
                    <div className="flex-shrink-0 ml-6 flex gap-4">
                        <Link
                            href="/cart"
                            className="relative h-12 w-12 rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center text-white font-bold text-lg transition-colors duration-200"
                        >
                            🛒
                            {cartCount > 0 && (
                                <span className="absolute top-0 right-0 inline-flex items-center justify-center h-6 w-6 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                        <Link
                            href="/profile"
                            className="h-12 w-12 rounded-full bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center text-white font-bold text-lg transition-colors duration-200"
                        >
                            👤
                        </Link>
                    </div>
                </div>

                {/* Products Grid */}
                <div className="mx-auto w-full max-w-7xl">
                    <h2 className="mb-8 text-3xl font-semibold text-gray-800">
                        Featured Products
                    </h2>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {products.map((product) => (
                            <div
                                key={product.product_id}
                                className="flex flex-col overflow-hidden rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow duration-200"
                            >
                                {/* Product Image */}
                                <div className="h-40 bg-gray-200 flex items-center justify-center">
                                    {product.image_url ? (
                                        <img
                                            src={product.image_url}
                                            alt={product.name}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-gray-400 text-sm">
                                            No Image
                                        </span>
                                    )}
                                </div>

                                {/* Product Info */}
                                <div className="flex flex-1 flex-col justify-between p-4">
                                    <div>
                                        {product.category && (
                                            <p className="text-xs font-semibold uppercase text-indigo-600 mb-1">
                                                {product.category}
                                            </p>
                                        )}
                                        <h3 className="mb-2 text-lg font-semibold text-gray-900 line-clamp-2">
                                            {product.name}
                                        </h3>
                                        {product.description && (
                                            <p className="mb-3 text-sm text-gray-600 line-clamp-2">
                                                {product.description}
                                            </p>
                                        )}
                                    </div>

                                    {/* Price and Stock */}
                                    <div className="space-y-2 pt-4 border-t border-gray-200">
                                        <div className="flex items-center justify-between">
                                            <span className="text-2xl font-bold text-indigo-600">
                                                ${typeof product.price === 'string' ? parseFloat(product.price).toFixed(2) : product.price.toFixed(2)}
                                            </span>
                                            <span
                                                className={`text-sm font-semibold ${
                                                    product.stock_quantity > 0
                                                        ? 'text-green-600'
                                                        : 'text-red-600'
                                                }`}
                                            >
                                                {product.stock_quantity > 0
                                                    ? `${product.stock_quantity} in stock`
                                                    : 'Out of stock'}
                                            </span>
                                        </div>
                                        <Link
                                            href={`/products/${product.product_id}`}
                                            className={`w-full block text-center font-bold py-2 px-4 rounded transition-colors duration-200 ${
                                                product.stock_quantity > 0
                                                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            }`}
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
