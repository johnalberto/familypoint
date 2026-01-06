import { stackServerApp } from "@/stack";
import { checkAdmin } from "@/lib/auth";

export default async function AdminDebugPage() {
    const user = await stackServerApp.getUser();
    const isAdmin = await checkAdmin();
    const rawEnv = process.env.ADMIN_EMAILS || "(not set)";

    return (
        <div className="p-8 max-w-2xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold">Admin Permission Debugger</h1>

            <div className="bg-slate-100 p-4 rounded-lg space-y-2">
                <p><strong>Is Admin (Function Check):</strong> {isAdmin ? "✅ YES" : "❌ NO"}</p>
                <p><strong>User Email (Stack Auth):</strong> {user?.primaryEmail || "(not logged in)"}</p>
            </div>

            <div className="bg-slate-100 p-4 rounded-lg space-y-2 break-all">
                <h2 className="font-bold border-b border-slate-300 pb-2">Environment Variable</h2>
                <p><strong>process.env.ADMIN_EMAILS:</strong></p>
                <code className="block bg-black text-green-400 p-2 rounded">{rawEnv}</code>
                <p className="text-sm text-slate-500 mt-2">
                    Note: Check if there are extra quotes (e.g. <code>"email@test.com"</code>) inside the value.
                    Vercel does NOT require quotes around the value in the UI.
                </p>
            </div>
        </div>
    );
}
