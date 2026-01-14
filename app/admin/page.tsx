import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Settings, Eye, EyeOff } from "lucide-react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
    const cookieStore = await cookies();
    const session = cookieStore.get('session');

    if (!session) redirect('/login');
    const user = JSON.parse(session.value);

    // Role-based fetch
    const where = user.role === 'SUPER_ADMIN' ? {} : { ownerId: user.id };
    const stores = await prisma.store.findMany({
        where,
        include: { _count: { select: { reviews: true } } }
    });

    return (
        <div className="p-4 space-y-6 max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-black text-white">Dashboard</h1>
                    <p className="text-xs text-gray-500 uppercase font-bold">{user.role}</p>
                </div>
                {user.role === 'SUPER_ADMIN' && (
                    <button className="p-2 rounded-full bg-gray-900 border border-gray-800 text-gray-400 hover:text-white">
                        <Settings size={20} />
                    </button>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-gray-900 p-4 rounded-xl border border-gray-800">
                    <span className="text-gray-400 text-xs uppercase font-bold">Your Stores</span>
                    <p className="text-2xl font-bold text-white mt-1">{stores.length}</p>
                </div>
                <Link href="/admin/users" className="bg-gray-900 p-4 rounded-xl border border-gray-800 hover:border-pink-500 transition-colors group">
                    <span className="text-gray-400 text-xs uppercase font-bold group-hover:text-pink-500">User Management</span>
                    <p className="text-2xl font-bold text-white mt-1">Users</p>
                </Link>
            </div>

            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-white">Store Management</h2>
                    {user.role === 'SUPER_ADMIN' && (
                        <form action={async () => {
                            'use server';
                            const { createStore } = await import("@/app/actions/store");
                            await createStore();
                        }}>
                            <button type="submit" className="flex items-center gap-1 text-xs bg-pink-600 text-white px-3 py-1.5 rounded-full font-bold hover:bg-pink-700 transition-colors">
                                <Plus size={14} />
                                Add New
                            </button>
                        </form>
                    )}
                </div>

                <div className="space-y-3">
                    {stores.map(store => (
                        <div key={store.id} className="bg-gray-900 p-4 rounded-xl border border-gray-800 flex justify-between items-center group hover:border-gray-700 transition-colors">
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="font-bold text-white">{store.name}</h3>
                                    {user.role === 'SUPER_ADMIN' && (
                                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${store.isVisible ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                            {store.isVisible ? 'Visible' : 'Hidden'}
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-gray-500">{store.region} • {store._count.reviews} Reviews</p>
                            </div>
                            <Link href={`/admin/stores/${store.id}`} className="text-xs font-bold text-gray-400 border border-gray-700 px-3 py-1.5 rounded-lg hover:bg-white hover:text-black transition-colors">
                                Edit
                            </Link>
                        </div>
                    ))}
                    {stores.length === 0 && (
                        <div className="text-center py-10 bg-gray-900 rounded-xl border border-gray-800 border-dashed">
                            <p className="text-gray-500 text-sm">No stores found.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
