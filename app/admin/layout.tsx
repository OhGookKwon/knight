import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { logout } from "../actions/auth";
import Link from "next/link";
import { LogOut, Home } from "lucide-react";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = (await cookies()).get('session');

    if (!session) {
        redirect('/login');
    }

    const user = JSON.parse(session.value);

    return (
        <div className="min-h-screen pb-20">
            {/* Admin Header */}
            <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-gray-800 p-4 flex justify-between items-center">
                <Link href="/" className="flex items-center gap-2 text-pink-500 font-black tracking-tighter hover:opacity-80">
                    <Home size={18} />
                    <span>K-NIGHT</span>
                </Link>
                <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-gray-500 uppercase px-2 py-1 bg-gray-900 rounded-md">
                        {user.role}
                    </span>
                    <form action={logout}>
                        <button className="text-gray-400 hover:text-white p-2">
                            <LogOut size={18} />
                        </button>
                    </form>
                </div>
            </header>

            {/* Admin Content */}
            <main>
                {children}
            </main>
        </div>
    );
}
