import { db } from "@/lib/db";
import { CategoryForm } from "@/components/CategoryForm";
import { DeleteCategoryBtn } from "@/components/DeleteCategoryBtn";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { ArrowLeft, Settings as SettingsIcon, UserPlus, Lock } from "lucide-react";
import { ResetGameBtn } from "@/components/ResetGameBtn";
import { checkAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  // 0. VERIFICAR ADMIN
  const isAdmin = await checkAdmin();
  if (!isAdmin) {
    redirect("/"); // O mostrar un mensaje de error
  }

  // 1. Obtener categorías
  const categories = await db.category.findMany({
    orderBy: { minAge: "asc" },
  });

  // 2. Obtener logs de auditoría (últimos 20)
  const auditLogs = await db.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-medium"
          >
            <ArrowLeft size={20} /> Volver
          </Link>
          <div className="flex items-center gap-2 text-slate-900">
            <SettingsIcon />
            <h1 className="text-2xl font-black">Configuración</h1>
          </div>
        </div>

        {/* --- NUEVO: GESTIÓN DE PARTICIPANTES --- */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-8 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-slate-800">Gestionar Participantes</h2>
            <p className="text-sm text-slate-500">Añade nuevos miembros a la competencia familiar.</p>
          </div>
          <Link
            href="/competitors/new"
            className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg font-bold hover:bg-slate-800 transition-colors"
          >
            <UserPlus size={18} /> Crear Nuevo
          </Link>
        </div>

        {/* Formulario de Creación de Categorías */}
        <CategoryForm />

        {/* Lista de Categorías Existentes */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h2 className="font-bold text-slate-800">Categorías Activas</h2>
            <p className="text-sm text-slate-500">El sistema asignará multas basándose en estos rangos.</p>
          </div>

          {categories.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              No hay categorías configuradas. ¡Crea una arriba!
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {categories.map((cat) => (
                <div key={cat.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">

                  {/* Info Categoría */}
                  <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-4 items-center">
                    <div>
                      <p className="font-bold text-slate-900">{cat.name}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-md">
                        {cat.minAge} - {cat.maxAge} años
                      </span>
                    </div>

                    <div className="text-right md:text-left">
                      <span className="text-slate-600 font-medium">
                        Multa: <span className="text-slate-900 font-bold">{formatCurrency(cat.fineAmount)}</span>
                      </span>
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="ml-4 pl-4 border-l border-slate-100">
                    <DeleteCategoryBtn id={cat.id} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* --- AUDITORÍA (Ver Logs) --- */}
        <div className="mt-12">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Registro de Auditoría</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            {auditLogs.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                No hay registros de actividad reciente.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {auditLogs.map((log) => (
                  <div key={log.id} className="p-4 text-sm">
                    <div className="flex justify-between mb-1">
                      <span className="font-bold text-slate-900">{log.action}</span>
                      <span className="text-slate-400">{log.createdAt.toLocaleString()}</span>
                    </div>
                    <p className="text-slate-600 mb-1">{log.description}</p>
                    <p className="text-xs text-slate-400">Por: {log.adminEmail}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* --- ZONA DE PELIGRO (Reset Game) --- */}
        <div className="mt-12 pt-12 border-t border-slate-200">
          <h2 className="text-xl font-bold text-slate-800 mb-2">Zona de Peligro</h2>
          <p className="text-slate-500 mb-6">
            Acciones destructivas que afectan a todo el juego.
          </p>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-red-100">
            <h3 className="font-bold text-red-600 mb-2">Reiniciar Temporada</h3>
            <p className="text-sm text-slate-500 mb-6">
              Esto eliminará todas las multas registradas hasta el momento.
              El contador de dinero volverá a $0, pero los participantes y las categorías se mantendrán.
            </p>

            <ResetGameBtn />
          </div>
        </div>

      </div>
    </main>
  );
}