import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { useState } from 'react';

interface User {
    id: number;
    name: string;
    email: string;
    is_admin: boolean;
    products_count: number;
    created_at: string;
}

interface Product {
    product_id: number;
    name: string;
    description?: string;
    price: string;
    stock_quantity: number;
    user?: {
        name: string;
        email: string;
    };
}

interface Order {
    order_id: number;
    total_amount: string;
    status: string;
    user: {
        name: string;
        email: string;
    };
    created_at: string;
}

interface AdminDashboardProps {
    users: User[];
    products: Product[];
    orders: Order[];
}

export default function AdminDashboard({ users, products, orders }: AdminDashboardProps) {
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [editingOrder, setEditingOrder] = useState<Order | null>(null);

    const deleteUser = (userId: number) => {
        if (confirm('Are you sure you want to delete this user?')) {
            router.delete(`/admin/users/${userId}`);
        }
    };

    const deleteProduct = (productId: number) => {
        if (confirm('Are you sure you want to delete this product?')) {
            router.delete(`/admin/products/${productId}`);
        }
    };

    const deleteOrder = (orderId: number) => {
        if (confirm('Are you sure you want to delete this order?')) {
            router.delete(`/admin/orders/${orderId}`);
        }
    };

    const handleUpdateUser = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingUser) {
            router.put(`/admin/users/${editingUser.id}`, {
                name: editingUser.name,
                email: editingUser.email,
                is_admin: editingUser.is_admin,
            }, {
                onSuccess: () => setEditingUser(null),
            });
        }
    };

    const handleUpdateProduct = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingProduct) {
            router.put(`/admin/products/${editingProduct.product_id}`, {
                name: editingProduct.name,
                description: editingProduct.description,
                price: editingProduct.price,
                stock_quantity: editingProduct.stock_quantity,
            }, {
                onSuccess: () => setEditingProduct(null),
            });
        }
    };

    const handleUpdateOrder = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingOrder) {
            router.put(`/admin/orders/${editingOrder.order_id}`, {
                status: editingOrder.status,
            }, {
                onSuccess: () => setEditingOrder(null),
            });
        }
    };

    const handleLogout = () => {
        router.post('/logout', {}, {
            onSuccess: () => {
                window.location.href = '/';
            }
        });
    };

    const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.total_amount), 0);
    const lowStockProducts = products.filter(p => p.stock_quantity < 10).length;

    return (
        <AppLayout>
            <Head title="Admin Dashboard" />
            
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
                <div className="max-w-7xl mx-auto p-6 space-y-8">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl p-8 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
                                <p className="text-indigo-100">Manage your e-commerce platform</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="bg-white text-indigo-600 hover:bg-indigo-50 font-semibold px-6 py-3 rounded-lg transition-colors duration-200 shadow-lg flex items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                Logout
                            </button>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 uppercase">Total Users</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">{users.length}</p>
                                </div>
                                <div className="bg-blue-100 rounded-full p-3">
                                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 uppercase">Products</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">{products.length}</p>
                                </div>
                                <div className="bg-green-100 rounded-full p-3">
                                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500 hover:shadow-xl transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 uppercase">Total Orders</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">{orders.length}</p>
                                </div>
                                <div className="bg-purple-100 rounded-full p-3">
                                    <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500 hover:shadow-xl transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 uppercase">Revenue</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">${totalRevenue.toFixed(2)}</p>
                                </div>
                                <div className="bg-yellow-100 rounded-full p-3">
                                    <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Users Section */}
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                            <h2 className="text-2xl font-bold text-white flex items-center">
                                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                                Users Management
                                <span className="ml-auto bg-blue-800 text-blue-100 px-3 py-1 rounded-full text-sm">{users.length}</span>
                            </h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Role</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Products</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {users.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="font-medium text-gray-900">{user.name}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-600">{user.email}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {user.is_admin ? (
                                                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-sm">
                                                        ⭐ Admin
                                                    </span>
                                                ) : (
                                                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-200 text-gray-700">
                                                        User
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm font-medium">{user.products_count}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex gap-2">
                                                    {!user.is_admin && (
                                                        <>
                                                            <button
                                                                onClick={() => setEditingUser(user)}
                                                                className="bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold px-4 py-2 rounded-lg transition-colors duration-200 shadow-sm"
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                onClick={() => deleteUser(user.id)}
                                                                className="bg-red-100 hover:bg-red-200 text-red-700 font-semibold px-4 py-2 rounded-lg transition-colors duration-200 shadow-sm"
                                                            >
                                                                Delete
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Products Section */}
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
                            <h2 className="text-2xl font-bold text-white flex items-center">
                                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                                Products Inventory
                                <span className="ml-auto bg-green-800 text-green-100 px-3 py-1 rounded-full text-sm">{products.length}</span>
                                {lowStockProducts > 0 && (
                                    <span className="ml-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm animate-pulse">
                                        {lowStockProducts} Low Stock
                                    </span>
                                )}
                            </h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Product Name</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Price</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Stock</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Seller</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {products.map((product) => (
                                        <tr key={product.product_id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="font-medium text-gray-900">{product.name}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-green-600 font-bold text-lg">${product.price}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {product.stock_quantity < 10 ? (
                                                    <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
                                                        ⚠️ {product.stock_quantity}
                                                    </span>
                                                ) : (
                                                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                                                        ✓ {product.stock_quantity}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                                                {product.user ? product.user.name : 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => setEditingProduct(product)}
                                                        className="bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold px-4 py-2 rounded-lg transition-colors duration-200 shadow-sm"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => deleteProduct(product.product_id)}
                                                        className="bg-red-100 hover:bg-red-200 text-red-700 font-semibold px-4 py-2 rounded-lg transition-colors duration-200 shadow-sm"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Orders Section */}
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
                        <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4">
                            <h2 className="text-2xl font-bold text-white flex items-center">
                                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                                Recent Orders
                                <span className="ml-auto bg-purple-800 text-purple-100 px-3 py-1 rounded-full text-sm">{orders.length}</span>
                            </h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Order ID</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Customer</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Total Amount</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {orders.map((order) => (
                                        <tr key={order.order_id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="font-mono font-semibold text-indigo-600">#{order.order_id}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="font-medium text-gray-900">{order.user.name}</div>
                                                <div className="text-sm text-gray-500">{order.user.email}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-green-600 font-bold text-lg">${order.total_amount}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gradient-to-r from-blue-400 to-blue-600 text-white shadow-sm">
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                                                {new Date(order.created_at).toLocaleDateString('en-US', { 
                                                    year: 'numeric', 
                                                    month: 'short', 
                                                    day: 'numeric' 
                                                })}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => setEditingOrder(order)}
                                                        className="bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold px-4 py-2 rounded-lg transition-colors duration-200 shadow-sm"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => deleteOrder(order.order_id)}
                                                        className="bg-red-100 hover:bg-red-200 text-red-700 font-semibold px-4 py-2 rounded-lg transition-colors duration-200 shadow-sm"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit User Modal */}
            {editingUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setEditingUser(null)}>
                    <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-2xl font-bold mb-6 text-gray-900">Edit User</h3>
                        <form onSubmit={handleUpdateUser} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                                <input
                                    type="text"
                                    value={editingUser.name}
                                    onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                                <input
                                    type="email"
                                    value={editingUser.email}
                                    onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="is_admin"
                                    checked={editingUser.is_admin}
                                    onChange={(e) => setEditingUser({...editingUser, is_admin: e.target.checked})}
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <label htmlFor="is_admin" className="ml-2 text-sm font-medium text-gray-700">Admin User</label>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button
                                    type="submit"
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                                >
                                    Save Changes
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setEditingUser(null)}
                                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Product Modal */}
            {editingProduct && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setEditingProduct(null)}>
                    <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-2xl font-bold mb-6 text-gray-900">Edit Product</h3>
                        <form onSubmit={handleUpdateProduct} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Product Name</label>
                                <input
                                    type="text"
                                    value={editingProduct.name}
                                    onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Price ($)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={editingProduct.price}
                                    onChange={(e) => setEditingProduct({...editingProduct, price: e.target.value})}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Stock Quantity</label>
                                <input
                                    type="number"
                                    value={editingProduct.stock_quantity}
                                    onChange={(e) => setEditingProduct({...editingProduct, stock_quantity: parseInt(e.target.value)})}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button
                                    type="submit"
                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                                >
                                    Save Changes
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setEditingProduct(null)}
                                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Order Modal */}
            {editingOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setEditingOrder(null)}>
                    <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-2xl font-bold mb-6 text-gray-900">Edit Order Status</h3>
                        <form onSubmit={handleUpdateOrder} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Order ID</label>
                                <div className="text-lg font-mono font-semibold text-indigo-600">#{editingOrder.order_id}</div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Customer</label>
                                <div className="text-gray-900">{editingOrder.user.name}</div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                                <select
                                    value={editingOrder.status}
                                    onChange={(e) => setEditingOrder({...editingOrder, status: e.target.value})}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="processing">Processing</option>
                                    <option value="shipped">Shipped</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button
                                    type="submit"
                                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                                >
                                    Update Status
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setEditingOrder(null)}
                                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
