import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';

interface User {
    id: number;
    name: string;
    email: string;
    phone?: string;
    address?: string;
}

interface OrderItem {
    order_item_id: number;
    order_id: number;
    product_id: number;
    quantity: number;
    price: number;
    product: {
        product_id: number;
        name: string;
        image_url?: string;
    };
}

interface Order {
    order_id: number;
    user_id: number;
    shipping_address: string;
    total_amount: number;
    status: string;
    created_at: string;
    items: OrderItem[];
}

interface UserProduct {
    product_id: number;
    name: string;
    description?: string;
    price: number | string;
    category?: string;
    stock_quantity: number;
    image_url?: string;
}

export default function Profile({ user, orders, products }: { user: User; orders: Order[]; products: UserProduct[] }) {
    const profileForm = useForm({
        email: user.email,
        phone: user.phone || '',
        address: user.address || '',
    });

    const productForm = useForm({
        name: '',
        description: '',
        price: '',
        category: '',
        stock_quantity: '',
        image: null as File | null,
    });

    const [editingProduct, setEditingProduct] = useState<UserProduct | null>(null);
    const [deletingProductId, setDeletingProductId] = useState<number | null>(null);

    const productEditForm = useForm({
        name: '',
        description: '',
        price: '',
        category: '',
        stock_quantity: '',
        image: null as File | null,
    });

    const handleLogout = () => {
        router.post('/logout', {}, {
            onSuccess: () => {
                window.location.href = '/';
            },
            onError: (errors) => {
                console.error('Logout failed', errors);
            },
        });
    };

    const handleProfileSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        profileForm.post('/profile');
    };

    const handleProductSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        productForm.post('/products', {
            forceFormData: true,
            onSuccess: () => {
                productForm.reset();
                alert('Product posted successfully!');
                router.visit('/profile');
            },
            onError: (errorBag) => {
                console.error('Product submission failed', errorBag);
            },
        });
    };

    const beginEditingProduct = (product: UserProduct) => {
        setEditingProduct(product);
        productEditForm.setData({
            name: product.name,
            description: product.description || '',
            price: (typeof product.price === 'string' ? product.price : product.price.toString()),
            category: product.category || '',
            stock_quantity: product.stock_quantity.toString(),
            image: null,
        });
    };

    const cancelEditingProduct = () => {
        setEditingProduct(null);
        productEditForm.reset();
    };

    const handleDeleteProduct = (productId: number) => {
        if (!window.confirm('Delete this product listing?')) {
            return;
        }

        setDeletingProductId(productId);

        router.delete(`/products/${productId}`, {
            onSuccess: () => {
                alert('Product deleted successfully!');
                if (editingProduct?.product_id === productId) {
                    cancelEditingProduct();
                }
                router.visit('/profile');
            },
            onError: (errors) => {
                console.error('Product delete failed', errors);
            },
            onFinish: () => {
                setDeletingProductId(null);
            },
        });
    };

    const handleProductUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingProduct) {
            return;
        }

        productEditForm.transform((data) => ({
            ...data,
            _method: 'put',
        }));

        productEditForm.post(`/products/${editingProduct.product_id}`, {
            forceFormData: true,
            onSuccess: () => {
                alert('Product updated successfully!');
                cancelEditingProduct();
                router.visit('/profile');
            },
            onError: (errorBag: Record<string, string>) => {
                console.error('Product update failed', errorBag);
            },
            onFinish: () => {
                productEditForm.transform((data) => data);
            },
        });
    };

    return (
        <>
            <Head title="My Profile" />
            <div className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 to-indigo-100 p-6 text-gray-900">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <h1 className="text-4xl font-bold text-indigo-600">My Profile</h1>
                    <div className="flex gap-4">
                        <a
                            href="/dashboard"
                            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-200"
                        >
                            Back to Store
                        </a>
                        <button
                            onClick={handleLogout}
                            className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-200"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                <div className="mx-auto w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* User Profile Card */}
                    <div className="bg-white p-8 rounded-lg shadow-md">
                        <h2 className="mb-6 text-2xl font-semibold text-gray-800">
                            Update Profile
                        </h2>
                        <form
                            onSubmit={handleProfileSubmit}
                            className="flex flex-col gap-6"
                        >
                            <div className="grid gap-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    disabled
                                    value={user.name}
                                    className="bg-gray-100 cursor-not-allowed"
                                />
                                <p className="text-xs text-gray-500">
                                    Name cannot be changed
                                </p>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    value={profileForm.data.email}
                                    onChange={(e) =>
                                        profileForm.setData(
                                            'email',
                                            e.target.value
                                        )
                                    }
                                    placeholder="john@example.com"
                                />
                                {profileForm.errors.email && (
                                    <p className="text-sm text-red-600">
                                        {profileForm.errors.email}
                                    </p>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    value={profileForm.data.phone}
                                    onChange={(e) =>
                                        profileForm.setData(
                                            'phone',
                                            e.target.value
                                        )
                                    }
                                    placeholder="+1 (555) 000-0000"
                                />
                                {profileForm.errors.phone && (
                                    <p className="text-sm text-red-600">
                                        {profileForm.errors.phone}
                                    </p>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="address">Address</Label>
                                <Input
                                    id="address"
                                    type="text"
                                    value={profileForm.data.address}
                                    onChange={(e) =>
                                        profileForm.setData(
                                            'address',
                                            e.target.value
                                        )
                                    }
                                    placeholder="123 Main Street, City, State"
                                />
                                {profileForm.errors.address && (
                                    <p className="text-sm text-red-600">
                                        {profileForm.errors.address}
                                    </p>
                                )}
                            </div>

                            <Button
                                type="submit"
                                disabled={profileForm.processing}
                                className="w-full"
                            >
                                {profileForm.processing && (
                                    <Spinner className="mr-2 h-4 w-4" />
                                )}
                                Save Changes
                            </Button>
                        </form>
                    </div>

                    {/* Post Product Card */}
                    <div className="bg-white p-8 rounded-lg shadow-md">
                        <h2 className="mb-6 text-2xl font-semibold text-gray-800">
                            Post a Product
                        </h2>
                        <form
                            onSubmit={handleProductSubmit}
                            className="flex flex-col gap-6"
                        >
                            <div className="grid gap-2">
                                <Label htmlFor="product-name">
                                    Product Name *
                                </Label>
                                <Input
                                    id="product-name"
                                    type="text"
                                    required
                                    value={productForm.data.name}
                                    onChange={(e) =>
                                        productForm.setData(
                                            'name',
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter product name"
                                />
                                {productForm.errors.name && (
                                    <p className="text-sm text-red-600">
                                        {productForm.errors.name}
                                    </p>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="product-description">
                                    Description
                                </Label>
                                <textarea
                                    id="product-description"
                                    value={productForm.data.description}
                                    onChange={(e) =>
                                        productForm.setData(
                                            'description',
                                            e.target.value
                                        )
                                    }
                                    placeholder="Describe your product"
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                                    rows={3}
                                />
                                {productForm.errors.description && (
                                    <p className="text-sm text-red-600">
                                        {productForm.errors.description}
                                    </p>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="product-price">
                                    Price ($) *
                                </Label>
                                <Input
                                    id="product-price"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    required
                                    value={productForm.data.price}
                                    onChange={(e) =>
                                        productForm.setData(
                                            'price',
                                            e.target.value
                                        )
                                    }
                                    placeholder="0.00"
                                />
                                {productForm.errors.price && (
                                    <p className="text-sm text-red-600">
                                        {productForm.errors.price}
                                    </p>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="product-category">
                                    Category
                                </Label>
                                <Input
                                    id="product-category"
                                    type="text"
                                    value={productForm.data.category}
                                    onChange={(e) =>
                                        productForm.setData(
                                            'category',
                                            e.target.value
                                        )
                                    }
                                    placeholder="e.g., Electronics, Fashion"
                                />
                                {productForm.errors.category && (
                                    <p className="text-sm text-red-600">
                                        {productForm.errors.category}
                                    </p>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="product-stock">
                                    Stock Quantity *
                                </Label>
                                <Input
                                    id="product-stock"
                                    type="number"
                                    min="0"
                                    required
                                    value={productForm.data.stock_quantity}
                                    onChange={(e) =>
                                        productForm.setData(
                                            'stock_quantity',
                                            e.target.value
                                        )
                                    }
                                    placeholder="0"
                                />
                                {productForm.errors.stock_quantity && (
                                    <p className="text-sm text-red-600">
                                        {productForm.errors.stock_quantity}
                                    </p>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="product-image">
                                    Product Image
                                </Label>
                                <Input
                                    id="product-image"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            productForm.setData('image', file);
                                        }
                                    }}
                                />
                                <p className="text-xs text-gray-500">
                                    Accepted formats: JPEG, PNG, JPG, GIF, WebP (Max 2MB)
                                </p>
                                {productForm.errors.image && (
                                    <p className="text-sm text-red-600">
                                        {productForm.errors.image}
                                    </p>
                                )}
                            </div>

                            <Button
                                type="submit"
                                disabled={productForm.processing}
                                className="w-full bg-green-600 hover:bg-green-700"
                            >
                                {productForm.processing && (
                                    <Spinner className="mr-2 h-4 w-4" />
                                )}
                                Post Product
                            </Button>
                        </form>
                    </div>
                </div>

                {/* User Products Section */}
                <div className="mx-auto w-full max-w-6xl mt-8">
                    <h2 className="mb-6 text-2xl font-semibold text-gray-800">
                        My Products
                    </h2>
                    {products.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                    Listings
                                </h3>
                                <div className="space-y-4">
                                    {products.map((product) => (
                                        <div
                                            key={product.product_id}
                                            className="border border-gray-200 rounded-lg p-4 flex flex-col gap-2"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-lg font-semibold text-gray-900">
                                                        {product.name}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        SKU #{product.product_id}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        onClick={() => beginEditingProduct(product)}
                                                        className="text-indigo-600 hover:text-indigo-800 font-semibold text-sm"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteProduct(product.product_id)}
                                                        disabled={deletingProductId === product.product_id}
                                                        className="text-red-600 hover:text-red-700 disabled:opacity-50"
                                                        aria-label="Delete product"
                                                    >
                                                        {deletingProductId === product.product_id ? (
                                                            <Spinner className="h-4 w-4" />
                                                        ) : (
                                                            <Trash2 className="h-5 w-5" />
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                            {product.category && (
                                                <p className="text-sm text-gray-600">
                                                    Category: {product.category}
                                                </p>
                                            )}
                                            <p className="text-sm text-gray-600">
                                                Stock: {product.stock_quantity}
                                            </p>
                                            <p className="text-sm font-semibold text-indigo-600">
                                                ${
                                                    typeof product.price === 'string'
                                                        ? parseFloat(product.price).toFixed(2)
                                                        : product.price.toFixed(2)
                                                }
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                    {editingProduct ? 'Edit Product' : 'Select a product to edit'}
                                </h3>
                                {editingProduct ? (
                                    <form onSubmit={handleProductUpdate} className="flex flex-col gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="edit-name">Product Name *</Label>
                                            <Input
                                                id="edit-name"
                                                type="text"
                                                required
                                                value={productEditForm.data.name}
                                                onChange={(e) =>
                                                    productEditForm.setData('name', e.target.value)
                                                }
                                                placeholder="Enter product name"
                                            />
                                            {productEditForm.errors.name && (
                                                <p className="text-sm text-red-600">
                                                    {productEditForm.errors.name}
                                                </p>
                                            )}
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="edit-description">Description</Label>
                                            <textarea
                                                id="edit-description"
                                                value={productEditForm.data.description}
                                                onChange={(e) =>
                                                    productEditForm.setData('description', e.target.value)
                                                }
                                                placeholder="Describe your product"
                                                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                                                rows={3}
                                            />
                                            {productEditForm.errors.description && (
                                                <p className="text-sm text-red-600">
                                                    {productEditForm.errors.description}
                                                </p>
                                            )}
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="edit-price">Price ($) *</Label>
                                            <Input
                                                id="edit-price"
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                required
                                                value={productEditForm.data.price}
                                                onChange={(e) =>
                                                    productEditForm.setData('price', e.target.value)
                                                }
                                                placeholder="0.00"
                                            />
                                            {productEditForm.errors.price && (
                                                <p className="text-sm text-red-600">
                                                    {productEditForm.errors.price}
                                                </p>
                                            )}
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="edit-category">Category</Label>
                                            <Input
                                                id="edit-category"
                                                type="text"
                                                value={productEditForm.data.category}
                                                onChange={(e) =>
                                                    productEditForm.setData('category', e.target.value)
                                                }
                                                placeholder="e.g., Electronics, Fashion"
                                            />
                                            {productEditForm.errors.category && (
                                                <p className="text-sm text-red-600">
                                                    {productEditForm.errors.category}
                                                </p>
                                            )}
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="edit-stock">Stock Quantity *</Label>
                                            <Input
                                                id="edit-stock"
                                                type="number"
                                                min="0"
                                                required
                                                value={productEditForm.data.stock_quantity}
                                                onChange={(e) =>
                                                    productEditForm.setData('stock_quantity', e.target.value)
                                                }
                                                placeholder="0"
                                            />
                                            {productEditForm.errors.stock_quantity && (
                                                <p className="text-sm text-red-600">
                                                    {productEditForm.errors.stock_quantity}
                                                </p>
                                            )}
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="edit-image">Update Image</Label>
                                            <Input
                                                id="edit-image"
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0] || null;
                                                    productEditForm.setData('image', file);
                                                }}
                                            />
                                            <p className="text-xs text-gray-500">
                                                Leave empty to keep current image.
                                            </p>
                                            {productEditForm.errors.image && (
                                                <p className="text-sm text-red-600">
                                                    {productEditForm.errors.image}
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex gap-3">
                                            <Button
                                                type="submit"
                                                disabled={productEditForm.processing}
                                                className="flex-1"
                                            >
                                                {productEditForm.processing && (
                                                    <Spinner className="mr-2 h-4 w-4" />
                                                )}
                                                Save Changes
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="secondary"
                                                className="flex-1"
                                                onClick={cancelEditingProduct}
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </form>
                                ) : (
                                    <p className="text-gray-600">
                                        Select one of your products to start editing.
                                    </p>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow-md p-8 text-center">
                            <p className="text-gray-600">
                                You have not posted any products yet.
                            </p>
                        </div>
                    )}
                </div>

                {/* Past Orders Section */}
                <div className="mx-auto w-full max-w-6xl mt-8">
                    <h2 className="mb-6 text-2xl font-semibold text-gray-800">
                        My Orders
                    </h2>
                    {orders && orders.length > 0 ? (
                        <div className="space-y-4">
                            {orders.map((order) => (
                                <div
                                    key={order.order_id}
                                    className="bg-white rounded-lg shadow-md p-6"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                                        <div>
                                            <p className="text-sm text-gray-600">
                                                Order ID
                                            </p>
                                            <p className="font-semibold text-gray-800">
                                                #{order.order_id}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">
                                                Date
                                            </p>
                                            <p className="font-semibold text-gray-800">
                                                {new Date(
                                                    order.created_at
                                                ).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">
                                                Total Amount
                                            </p>
                                            <p className="font-semibold text-indigo-600">
                                                ${parseFloat(
                                                    order.total_amount.toString()
                                                ).toFixed(2)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">
                                                Status
                                            </p>
                                            <p
                                                className={`font-semibold capitalize ${
                                                    order.status === 'pending'
                                                        ? 'text-yellow-600'
                                                        : order.status ===
                                                            'completed'
                                                        ? 'text-green-600'
                                                        : 'text-gray-600'
                                                }`}
                                            >
                                                {order.status}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="border-t pt-4">
                                        <p className="text-sm font-semibold text-gray-700 mb-2">
                                            Shipping Address:
                                        </p>
                                        <p className="text-sm text-gray-600 mb-3">
                                            {order.shipping_address}
                                        </p>

                                        <p className="text-sm font-semibold text-gray-700 mb-2">
                                            Items:
                                        </p>
                                        <div className="space-y-2">
                                            {order.items.map((item) => (
                                                <div
                                                    key={item.order_item_id}
                                                    className="flex justify-between text-sm"
                                                >
                                                    <span className="text-gray-700">
                                                        {
                                                            item.product
                                                                .name
                                                        }{' '}
                                                        (Qty:{' '}
                                                        {item.quantity})
                                                    </span>
                                                    <span className="text-gray-800 font-semibold">
                                                        ${parseFloat(
                                                            item.price.toString()
                                                        ).toFixed(2)}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow-md p-8 text-center">
                            <p className="text-gray-600">
                                You haven't placed any orders yet.
                            </p>
                            <a
                                href="/dashboard"
                                className="inline-block mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-200"
                            >
                                Start Shopping
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
