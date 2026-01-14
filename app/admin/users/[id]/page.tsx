import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ArrowLeft } from "lucide-react"; // Import ArrowLeft
import { updateUser } from "@/app/actions/user";

export default async function UserEditPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const cookieStore = await cookies();
    const session = cookieStore.get('session');

    if (!session) redirect('/login');
    const currentUser = JSON.parse(session.value);

    if (currentUser.role !== 'SUPER_ADMIN') {
        redirect('/admin');
    }

    const user = await prisma.user.findUnique({
        where: { id },
        include: { stores: true }
    });

    if (!user) return <div>User not found</div>;

    const allStores = await prisma.store.findMany();
    const unassignedStores = allStores.filter(s => s.ownerId === null);

    async function updateUserWithId(formData: FormData) {
        'use server';
        await updateUser(id, formData);
    }

    return (
        <div className="p-4 max-w-md mx-auto">
            <div className="flex items-center gap-4 mb-6">
                <Link href="/admin/users" className="p-2 rounded-full bg-gray-900 text-white hover:bg-gray-800 transition-colors">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-xl font-bold text-white uppercase">{user.username}</h1>
                    <p className="text-xs text-gray-500 font-bold">{user.role}</p>
                </div>
            </div>

            <form action={updateUserWithId} className="space-y-6 mb-8">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">새 비밀번호</label>
                    <input
                        name="password"
                        type="text"
                        placeholder="변경하려면 입력하세요"
                        className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500"
                    />
                    <p className="text-[10px] text-gray-500">입력하지 않으면 기존 비밀번호가 유지됩니다.</p>
                </div>

                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-colors">
                    비밀번호 변경
                </button>
            </form>

            <div className="pt-8 border-t border-gray-800">
                <h2 className="text-sm font-bold text-white mb-4 uppercase">Assigned Stores</h2>
                <div className="space-y-3 mb-6">
                    {user.stores.map(store => (
                        <div key={store.id} className="bg-gray-900 p-3 rounded-xl border border-gray-800 flex justify-between items-center">
                            <span className="text-sm font-bold text-white">{store.name}</span>
                            <form action={async () => {
                                'use server';
                                const { unassignStore } = await import("@/app/actions/user");
                                await unassignStore(store.id, user.id);
                            }}>
                                <button className="text-xs text-red-500 hover:text-red-400 font-bold">Unassign</button>
                            </form>
                        </div>
                    ))}
                    {user.stores.length === 0 && (
                        <p className="text-xs text-gray-600">No stores assigned.</p>
                    )}
                </div>

                <div className="bg-gray-900 p-4 rounded-xl border border-gray-800">
                    <h3 className="text-xs font-bold text-gray-400 mb-3 uppercase">Assign Store</h3>
                    {unassignedStores.length > 0 ? (
                        <form action={async (formData) => {
                            'use server';
                            const storeId = formData.get('storeId') as string;
                            const { assignStore } = await import("@/app/actions/user");
                            await assignStore(user.id, storeId);
                        }} className="flex gap-2">
                            <select name="storeId" className="flex-1 bg-black border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none">
                                {unassignedStores.map(store => (
                                    <option key={store.id} value={store.id}>{store.name}</option>
                                ))}
                            </select>
                            <button className="bg-green-600 text-white text-xs font-bold px-4 rounded-lg hover:bg-green-700">Assign</button>
                        </form>
                    ) : (
                        <p className="text-xs text-gray-600">No unassigned stores available.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
