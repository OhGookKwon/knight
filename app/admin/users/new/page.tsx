
import { createUser } from "@/app/actions/user";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function NewUserPage() {
    const cookieStore = await cookies();
    const session = cookieStore.get('session');
    if (!session) redirect('/login');
    const currentUser = JSON.parse(session.value);
    if (currentUser.role !== 'SUPER_ADMIN') redirect('/admin');

    return (
        <div className="p-4 max-w-md mx-auto">
            <div className="flex items-center gap-4 mb-6">
                <Link href="/admin/users" className="p-2 rounded-full bg-gray-900 text-white hover:bg-gray-800 transition-colors">
                    <ArrowLeft size={20} />
                </Link>
                <h1 className="text-xl font-bold text-white">New User</h1>
            </div>

            <form action={createUser} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Username</label>
                    <input
                        name="username"
                        type="text"
                        required
                        placeholder="username"
                        className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Password</label>
                    <input
                        name="password"
                        type="password"
                        required
                        placeholder="password"
                        className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Role</label>
                    <select
                        name="role"
                        className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500"
                    >
                        <option value="OWNER">Owner</option>
                        <option value="SUPER_ADMIN">Super Admin</option>
                        <option value="USER">User</option>
                    </select>
                </div>

                <button type="submit" className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-4 rounded-xl transition-colors">
                    Create User
                </button>
            </form>
        </div>
    );
}
