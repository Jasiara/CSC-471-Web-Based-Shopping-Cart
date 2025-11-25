import { Head, Link } from '@inertiajs/react';

export default function Welcome() {
    return (
        <>
            <Head title="Amazonian - Home" />
            <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6 text-gray-900">
                <div className="text-center max-w-2xl">
                    {/* Logo/Brand */}
                    <h1 className="mb-4 text-6xl font-bold text-indigo-600">
                        Amazonian
                    </h1>

                    {/* Tagline */}
                    <p className="mb-8 text-2xl text-gray-700">
                        We fly orders out quicker than anyone else!
                    </p>

                    {/* Description */}
                    <p className="mb-12 text-lg text-gray-600">
                        Fast, reliable shipping for all your needs. Join thousands
                        of satisfied customers today.
                    </p>

                    {/* Action Buttons */}
                    <div className="flex gap-4 justify-center flex-wrap">
                        <Link
                            href="/signup"
                            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200"
                        >
                            Sign Up
                        </Link>
                        <Link
                            href="/login"
                            className="inline-block bg-white hover:bg-gray-100 text-indigo-600 font-bold py-3 px-8 rounded-lg border-2 border-indigo-600 transition-colors duration-200"
                        >
                            Log In
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
