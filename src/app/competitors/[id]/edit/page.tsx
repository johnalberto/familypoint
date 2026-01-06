import { db } from "@/lib/db";
import { EditCompetitorForm } from "@/components/EditCompetitorForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { checkAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCompetitorPage({ params }: EditPageProps) {
  // 0. VERIFICAR ADMIN
  const isAdmin = await checkAdmin();
  if (!isAdmin) {
    redirect("/");
  }

  const { id } = await params;

  const competitor = await db.competitor.findUnique({
    where: { id },
  });

  if (!competitor) return notFound();

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Link
            href={`/competitors/${id}`}
            className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-medium mb-4"
          >
            <ArrowLeft size={20} /> Cancelar y Volver
          </Link>
          <h1 className="text-3xl font-black text-slate-900">Editar Perfil</h1>
          <p className="text-slate-500">Actualiza los datos de {competitor.name}</p>
        </div>

        <EditCompetitorForm competitor={competitor} />
      </div>
    </main>
  );
}