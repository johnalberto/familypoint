import { NewCompetitorForm } from "@/components/NewCompetitorForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { checkAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function NewCompetitorPage() {
    // 0. VERIFICAR ADMIN
    const isAdmin = await checkAdmin();
    if (!isAdmin) {
        redirect("/");
    }

    return (
        <main className="min-h-screen bg-slate-100 p-6 flex flex-col items-center justify-center">
            <div className="w-full max-w-lg mb-6 flex items-center gap-2">
                <Link
                    href="/"
                    className="p-2 bg-white rounded-full text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors"
                >
                    <ArrowLeft size={24} />
                </Link>
                <h1 className="text-2xl font-black text-slate-800">Nuevo Competidor</h1>
            </div>

            <NewCompetitorForm />
        </main>
    );
}
