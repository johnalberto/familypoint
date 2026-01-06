import { db } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, FileWarning, Pencil } from "lucide-react";
import { notFound } from "next/navigation";
import { checkAdmin } from "@/lib/auth";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CompetitorDetailPage({ params }: PageProps) {
  const isAdmin = await checkAdmin();
  const { id } = await params;

  const competitor = await db.competitor.findUnique({
    where: { id },
    include: {
      infractions: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!competitor) return notFound();

  const totalDebt = competitor.infractions.reduce((acc, curr) => acc + curr.amountCharged, 0);

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-3xl mx-auto">
        {/* Botón Volver */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-8 transition-colors font-medium"
        >
          <ArrowLeft size={20} /> Volver al Tablero
        </Link>

        {/* Encabezado del Perfil */}
        {/* 2. Agregado relative y group para posicionar el botón */}
        <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden mb-8 border border-slate-100 relative group">

          {/* --- 3. BOTÓN DE EDITAR (NUEVO) --- */}
          {/* --- 3. BOTÓN DE EDITAR (SOLO ADMIN) --- */}
          {isAdmin && (
            <Link
              href={`/competitors/${id}/edit`}
              className="absolute top-4 right-4 bg-white/30 hover:bg-white text-white hover:text-slate-900 p-3 rounded-full backdrop-blur-md transition-all z-10 shadow-sm"
              title="Editar Perfil"
            >
              <Pencil size={20} />
            </Link>
          )}
          {/* ------------------------------- */}
          {/* ------------------------------- */}

          <div
            className="h-32 w-full bg-slate-200 relative"
            style={{ backgroundColor: competitor.favoriteColor }}
          />
          <div className="px-8 pb-8 relative text-center sm:text-left sm:flex sm:items-end sm:justify-between">

            {/* Foto Superpuesta */}
            <div className="relative -mt-16 mb-4 sm:mb-0">
              <div className="w-32 h-32 rounded-full border-[6px] border-white shadow-md overflow-hidden relative mx-auto sm:mx-0 bg-white">
                <Image
                  src={competitor.photoUrl}
                  alt={competitor.name}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Info Texto */}
            <div className="sm:pl-6 flex-1 mb-2">
              <h1 className="text-3xl font-black text-slate-900">{competitor.name}</h1>
              <p className="text-slate-400 font-medium uppercase tracking-wider text-sm">Historial Delictivo</p>
            </div>

            {/* Deuda Total */}
            <div className="bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100 mt-4 sm:mt-0">
              <p className="text-xs uppercase text-slate-400 font-bold mb-1 text-center sm:text-right">Deuda Total</p>
              <p className={`text-3xl font-black ${totalDebt > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                {formatCurrency(totalDebt)}
              </p>
            </div>
          </div>
        </div>

        {/* Lista de Infracciones (Timeline) */}
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <FileWarning className="text-red-500" />
          Registro de Infracciones
        </h2>

        {competitor.infractions.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-300">
            <p className="text-slate-400 text-lg">Este competidor es un ángel... por ahora. 😇</p>
          </div>
        ) : (
          <div className="space-y-4">
            {competitor.infractions.map((inf) => (
              <div
                key={inf.id}
                className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col sm:flex-row gap-4 items-start sm:items-center hover:shadow-md transition-shadow"
              >
                {/* Fecha */}
                <div className="flex items-center gap-2 text-slate-400 text-sm font-medium bg-slate-50 px-3 py-1 rounded-full min-w-fit">
                  <Calendar size={16} />
                  {format(inf.createdAt, "d MMM yyyy, h:mm a", { locale: es })}
                </div>

                {/* Razón */}
                <div className="flex-1">
                  <p className="text-slate-800 font-bold text-lg">{inf.reason}</p>
                </div>

                {/* Monto cobrado (Snapshot) */}
                <div className="text-red-600 font-bold text-xl min-w-fit bg-red-50 px-4 py-2 rounded-xl">
                  -{formatCurrency(inf.amountCharged)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}