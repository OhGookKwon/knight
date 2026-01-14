'use client';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html>
            <body>
                <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
                    <h2 className="text-xl font-bold mb-4">Something went wrong!</h2>
                    <pre className="bg-gray-900 p-4 rounded mb-4 text-xs text-red-400 max-w-full overflow-auto">
                        {error.message}
                        {error.digest && ` (Digest: ${error.digest})`}
                    </pre>
                    <button
                        onClick={() => reset()}
                        className="px-4 py-2 bg-pink-600 rounded-full font-bold hover:bg-pink-700 transition-colors"
                    >
                        Try again
                    </button>
                </div>
            </body>
        </html>
    );
}
