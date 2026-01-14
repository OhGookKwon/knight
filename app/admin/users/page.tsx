import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Shield, User, ArrowLeft } from "lucide-react";

export default async function UserListPage() {
    const cookieStore = await cookies();
    const session = cookieStore.get('session');
    if (!session) redirect('/login');

    const currentUser = JSON.parse(session.value);
    if (currentUser.role !== 'SUPER_ADMIN') {
        redirect('/admin');
    }

    const users = await prisma.user.findMany({
        orderBy: { username: 'asc' },
        include: { stores: true }
    });

    return (
        <div className="p-4 max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Link href="/admin" className="p-2 rounded-full bg-gray-900 text-white hover:bg-gray-800 transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <h1 className="text-xl font-bold text-white">User Management</h1>
                </div>
                <Link href="/admin/users/new" className="bg-pink-600 text-white px-4 py-2 rounded-full text-xs font-bold hover:bg-pink-700 transition-colors">
                    + New User
                </Link>
            </div>

            <div className="space-y-3">
                {users.map(user => (
                    <Link
                        key={user.id}
                        href={`/admin/users/${user.id}`}
                        className="block bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-gray-600 transition-colors"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${user.role === 'SUPER_ADMIN' ? 'bg-red-900/40 text-red-400' : 'bg-gray-800 text-gray-400'}`}>
                                    {user.role === 'SUPER_ADMIN' ? <Shield size={20} /> : <User size={20} />}
                                </div>
                                <div>
                                    <div className="font-bold text-white">{user.username}</div>
                                    <div className="text-xs text-gray-500 uppercase font-bold">{user.role}</div>
                                </div>
                            </div>

                            {user.stores.length > 0 && (
                                <div className="text-right">
                                    <div className="text-xs text-gray-400">관리 중인 가게</div>
                                    <div className="text-sm font-bold text-pink-500">{user.stores[0].name}</div>
                                </div>
                            )}
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
