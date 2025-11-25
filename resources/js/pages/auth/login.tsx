import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

type LoginProps = {
    canResetPassword: boolean;
    canRegister: boolean;
    status?: string | null;
};

export default function Login({ canResetPassword, canRegister, status }: LoginProps) {
    const form = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        form.post('/login', {
            onFinish: () => form.reset('password'),
        });
    };

    return (
        <>
            <Head title="Login" />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
                <div className="grid w-full max-w-5xl grid-cols-1 overflow-hidden rounded-2xl bg-white shadow-xl md:grid-cols-2">
                    <div className="hidden bg-indigo-600 p-10 text-white md:flex md:flex-col md:justify-between">
                        <div>
                            <p className="text-sm uppercase tracking-[0.3em] text-indigo-200">
                                Amazonian
                            </p>
                            <h1 className="mt-6 text-4xl font-bold leading-tight">
                                Welcome back to your faster shopping experience
                            </h1>
                            <p className="mt-4 text-indigo-100">
                                Sign in to manage your cart, track orders, and keep every delivery
                                moving on schedule.
                            </p>
                        </div>
                        <div className="mt-12 text-sm text-indigo-100/80">
                            Need an account?{' '}
                            {canRegister && (
                                <Link href="/signup" className="font-semibold text-white underline">
                                    Create one here
                                </Link>
                            )}
                        </div>
                    </div>

                    <div className="p-10">
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-gray-900">Log in</h2>
                            <p className="mt-2 text-gray-600">
                                Enter your credentials to access your Amazonian dashboard.
                            </p>
                        </div>

                        {status && (
                            <div className="mb-6 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
                                {status}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-gray-900 font-medium">
                                    Email address
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    autoFocus
                                    required
                                    value={form.data.email}
                                    onChange={(e) => form.setData('email', e.target.value)}
                                    autoComplete="email"
                                    placeholder="you@example.com"
                                    className="bg-white text-gray-900 placeholder:text-gray-400 border-gray-200 focus:border-indigo-600 focus:ring-indigo-100"
                                />
                                <InputError message={form.errors.email} />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="text-gray-900 font-medium">
                                        Password
                                    </Label>
                                    {canResetPassword && (
                                        <Link
                                            href="/forgot-password"
                                            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                                        >
                                            Forgot password?
                                        </Link>
                                    )}
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    value={form.data.password}
                                    onChange={(e) => form.setData('password', e.target.value)}
                                    autoComplete="current-password"
                                    placeholder="••••••••"
                                    className="bg-white text-gray-900 placeholder:text-gray-400 border-gray-200 focus:border-indigo-600 focus:ring-indigo-100"
                                />
                                <InputError message={form.errors.password} />
                            </div>

                            <label className="flex items-center gap-2 text-sm text-gray-600">
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                    checked={form.data.remember}
                                    onChange={(e) => form.setData('remember', e.target.checked)}
                                />
                                Remember me on this device
                            </label>

                            <Button type="submit" disabled={form.processing} className="w-full text-lg">
                                {form.processing && <Spinner className="mr-2 h-4 w-4" />}
                                Sign in
                            </Button>
                        </form>

                        {canRegister && (
                            <p className="mt-8 text-center text-sm text-gray-600">
                                New to Amazonian?{' '}
                                <TextLink href="/signup">Create an account</TextLink>
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
