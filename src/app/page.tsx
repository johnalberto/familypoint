import { db } from "@/lib/db";
import { CompetitorCard } from "@/components/CompetitorCard";
import { differenceInYears } from "date-fns";
import { PiggyBank, Sparkles, Settings } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { FineButton } from "@/components/FineButton";
import Link from "next/link";
import { UserButton } from "@stackframe/stack";
import { checkAdmin } from "@/lib/auth";

const calculateAge = (birthDate: Date) => differenceInYears(new Date(), birthDate);

export const dynamic = 'force-dynamic';

export default async function Home() {
  const isAdmin = await checkAdmin();

  const competitors = await db.competitor.findMany({
    include: { infractions: true },
  });

  const scoreboard = competitors.map(comp => ({
    ...comp,
    totalDebt: comp.infractions.reduce((sum, inf) => sum + inf.amountCharged, 0),
    age: calculateAge(comp.birthDate),
  }));

  scoreboard.sort((a, b) => b.totalDebt - a.totalDebt);
  const grandTotal = scoreboard.reduce((acc, curr) => acc + curr.totalDebt, 0);

  // Preparar datos simples para el select del botón
  const competitorsList = competitors.map(c => ({ id: c.id, name: c.name }));

  return (
    <main className="min-h-screen bg-slate-100 pb-24">

      {/* Hero Header: Oscuro y con formas orgánicas */}
      <div className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-violet-900 text-white pt-16 pb-32 px-6 rounded-b-[3rem] shadow-2xl overflow-hidden">

        {/* --- NUEVO: BOTÓN DE SETTINGS --- */}
        {/* Solo visible para admins */}
        {isAdmin && (
          <Link
            href="/settings"
            className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-sm transition-all z-50 hover:rotate-90"
            title="Configurar Categorías"
          >
            <Settings size={24} />
          </Link>
        )}

        {/* --- USER BUTTON --- */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50">
          <UserButton />
        </div>
        {/* ------------------- */}

        {/* Elementos de fondo decorativos (Blobs) */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-40">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-32 -right-24 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        </div>

        <div className="relative z-10 max-w-xl mx-auto text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-blue-200 text-sm font-bold uppercase tracking-widest mb-6 border border-white/10 backdrop-blur-sm">
            <Sparkles size={16} className="text-yellow-400" /> Family Point System
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-indigo-200">
            El Pozo Familiar
          </h1>
          <p className="text-blue-200 text-lg mb-8 font-medium">¿Quién paga la próxima pizza? 🍕</p>

          <div className="inline-flex items-center gap-4 bg-white/10 p-6 rounded-3xl border-2 border-white/10 backdrop-blur-md shadow-xl">
            <div className="bg-gradient-to-br from-pink-500 to-orange-500 p-4 rounded-2xl shadow-lg">
              <PiggyBank size={48} className="text-white" />
            </div>
            <div className="text-left">
              <p className="text-sm text-blue-200 font-bold uppercase tracking-wider">Total Recaudado</p>
              <p className="text-5xl font-black text-white tracking-tight leading-none">
                {formatCurrency(grandTotal)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid de Tarjetas (Superpuesto al header) */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-20 relative z-20">
        {scoreboard.length === 0 ? (
          <div className="bg-white p-12 rounded-[2rem] shadow-xl text-center max-w-md mx-auto">
            <p className="text-gray-400 text-lg font-medium">No hay participantes aún.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 items-start">
            {scoreboard.map((member, index) => (
              <Link href={`/competitors/${member.id}`} key={member.id} className="block h-full transition-transform hover:scale-[1.02]">
                <CompetitorCard
                  rank={index + 1}
                  name={member.name}
                  age={member.age}
                  photoUrl={member.photoUrl}
                  favoriteColor={member.favoriteColor}
                  totalDebt={member.totalDebt}
                />
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Botón Flotante para Multar (Solo Admin) */}
      {isAdmin && <FineButton competitors={competitorsList} />}
    </main>
  );
}