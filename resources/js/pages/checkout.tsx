import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';

interface Product {
    product_id: number;
    name: string;
    price: string | number;
    image_url?: string;
}

interface CartItem {
    cart_item_id: number;
    quantity: number;
    product: Product;
}

interface CheckoutProps {
    cartItems: CartItem[];
    defaults: {
        shipping_address: string;
        contact_phone: string;
    };
}

export default function Checkout({ cartItems, defaults }: CheckoutProps) {
    const form = useForm({
        shipping_address: defaults.shipping_address || '',
        contact_phone: defaults.contact_phone || '',
    });

    const total = cartItems.reduce((sum, item) => {
        const price =
            typeof item.product.price === 'string'
                ? parseFloat(item.product.price)
                : item.product.price;
        return sum + price * item.quantity;
    }, 0);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post('/checkout');
    };

    if (cartItems.length === 0) {
        return (
            <>
                <Head title="Checkout" />
                <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6 text-gray-900">
                    <div className="w-full max-w-2xl rounded-2xl bg-white p-10 text-center shadow-xl">
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
                        <p className="text-gray-600 mb-8">
                            Add some products to your cart before heading to checkout.
                        </p>
                        <Link
                            href="/dashboard"
                            className="inline-block rounded-lg bg-indigo-600 px-6 py-3 text-white font-semibold shadow hover:bg-indigo-700"
                        >
                            Back to Store
                        </Link>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Head title="Checkout" />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 text-gray-900">
                <div className="mx-auto flex max-w-6xl flex-col gap-8 lg:flex-row">
                    <div className="flex-1 rounded-2xl bg-white p-8 shadow-xl">
                        <div className="mb-8 flex items-center justify-between">
                            <div>
                                <p className="text-sm uppercase tracking-[0.3em] text-indigo-500">
                                    Amazonian
                                </p>
                                <h1 className="text-3xl font-bold text-gray-900 mt-2">
                                    Shipping Details
                                </h1>
                            </div>
                            <Link
                                href="/cart"
                                className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                            >
                                Back to Cart
                            </Link>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="shipping_address" className="font-semibold text-gray-800">
                                    Shipping address
                                </Label>
                                <textarea
                                    id="shipping_address"
                                    required
                                    value={form.data.shipping_address}
                                    onChange={(e) => form.setData('shipping_address', e.target.value)}
                                    placeholder="123 Main Street, City, State"
                                    className="min-h-[120px] w-full rounded-lg border border-gray-200 px-4 py-3 text-gray-900 shadow-sm focus:border-indigo-600 focus:ring-indigo-100"
                                />
                                {form.errors.shipping_address && (
                                    <p className="text-sm text-red-600">
                                        {form.errors.shipping_address}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="contact_phone" className="font-semibold text-gray-800">
                                    Contact phone
                                </Label>
                                <Input
                                    id="contact_phone"
                                    type="tel"
                                    value={form.data.contact_phone}
                                    onChange={(e) => form.setData('contact_phone', e.target.value)}
                                    placeholder="+1 (555) 000-0000"
                                    className="bg-white text-gray-900 placeholder:text-gray-400 border-gray-200 focus:border-indigo-600 focus:ring-indigo-100"
                                />
                                {form.errors.contact_phone && (
                                    <p className="text-sm text-red-600">
                                        {form.errors.contact_phone}
                                    </p>
                                )}
                            </div>

                            <Button type="submit" disabled={form.processing} className="w-full text-lg">
                                {form.processing && <Spinner className="mr-2 h-4 w-4" />}
                                Place Order
                            </Button>
                        </form>
                    </div>

                    <div className="w-full lg:w-96 rounded-2xl bg-white p-8 shadow-xl lg:sticky lg:top-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
                        <div className="space-y-4 border-b border-gray-200 pb-6">
                            {cartItems.map((item) => {
                                const price =
                                    typeof item.product.price === 'string'
                                        ? parseFloat(item.product.price)
                                        : item.product.price;
                                return (
                                    <div key={item.cart_item_id} className="flex items-center justify-between">
                                        <div>
                                            <p className="font-semibold text-gray-900">
                                                {item.product.name}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Qty: {item.quantity}
                                            </p>
                                        </div>
                                        <p className="font-semibold text-indigo-600">
                                            ${(price * item.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="space-y-3 pt-6">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Shipping</span>
                                <span>Free</span>
                            </div>
                            <div className="flex justify-between text-xl font-bold text-gray-900 pt-4">
                                <span>Total</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
