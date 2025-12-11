import { login } from '@/routes';
import { Head, useForm } from '@inertiajs/react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
export default function SignUp() {
    const form = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        phone: '',
        address: '',
    });

    return (
        <>
            <Head title="Sign Up" />

            <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6 text-gray-900">
                <div className="text-center w-full max-w-3xl">
                    <h1 className="mb-4 text-5xl font-bold text-indigo-600">Amazonian</h1>
                    <p className="mb-8 text-lg text-gray-700">
                        Create your account to get started — fast, reliable shipping.
                    </p>

                    <div className="mx-auto w-full max-w-md bg-white p-8 rounded-lg shadow-md">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                form.post('/signup');
                            }}
                            className="flex flex-col gap-6"
                        >
                            <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                            id="name"
                            type="text"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="name"
                            name="name"
                            value={form.data.name}
                            onChange={(e: any) => form.setData('name', e.target.value)}
                            placeholder="John Doe"
                        />
                        {form.errors.name && (
                            <p className="text-sm text-red-600">{form.errors.name}</p>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            tabIndex={2}
                            autoComplete="email"
                            name="email"
                            value={form.data.email}
                            onChange={(e: any) => form.setData('email', e.target.value)}
                            placeholder="john@example.com"
                        />
                        {form.errors.email && (
                            <p className="text-sm text-red-600">{form.errors.email}</p>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                            id="phone"
                            type="tel"
                            tabIndex={3}
                            autoComplete="tel"
                            name="phone"
                            value={form.data.phone}
                            onChange={(e: any) => form.setData('phone', e.target.value)}
                            placeholder="+1 (555) 000-0000"
                        />
                        {form.errors.phone && (
                            <p className="text-sm text-red-600">{form.errors.phone}</p>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="address">Address</Label>
                        <Input
                            id="address"
                            type="text"
                            tabIndex={4}
                            autoComplete="street-address"
                            name="address"
                            value={form.data.address}
                            onChange={(e: any) => form.setData('address', e.target.value)}
                            placeholder="123 Main Street, City, State"
                        />
                        {form.errors.address && (
                            <p className="text-sm text-red-600">
                                {form.errors.address}
                            </p>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            required
                            tabIndex={5}
                            autoComplete="new-password"
                            name="password"
                            value={form.data.password}
                            onChange={(e: any) => form.setData('password', e.target.value)}
                            placeholder="Create a strong password"
                        />
                        {form.errors.password && (
                            <p className="text-sm text-red-600">
                                {form.errors.password}
                            </p>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation">
                            Confirm Password
                        </Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            required
                            tabIndex={6}
                            autoComplete="new-password"
                            name="password_confirmation"
                            value={form.data.password_confirmation}
                            onChange={(e: any) => form.setData('password_confirmation', e.target.value)}
                            placeholder="Confirm your password"
                        />
                        {form.errors.password_confirmation && (
                            <p className="text-sm text-red-600">
                                {form.errors.password_confirmation}
                            </p>
                        )}
                    </div>
                </div>

                <Button type="submit" disabled={form.processing} className="w-full" tabIndex={7}>
                    {form.processing && <Spinner className="mr-2 h-4 w-4" />}
                    Create Account
                </Button>
            </form>

            <div className="text-center text-sm mt-4">
                Already have an account?{' '}
                <TextLink href={login()}>Log in</TextLink>
            </div>
                        </div>
                    </div>
                </div>
        </>
    );
}
