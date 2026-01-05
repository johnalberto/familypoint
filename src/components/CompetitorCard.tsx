"use client";

import Image from 'next/image';
import { formatCurrency, cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Trophy, Medal, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface CompetitorCardProps {
  name: string;
  photoUrl: string;
  favoriteColor: string;
  totalDebt: number;
  age: number;
  rank: number;
}

export function CompetitorCard({ 
  name, 
  photoUrl, 
  favoriteColor, 
  totalDebt,
  age,
  rank
}: CompetitorCardProps) {
  
  const isLeader = rank === 1 && totalDebt > 0;
  const hasDebt = totalDebt > 0;

  // Animación de entrada escalonada
  const variants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 }
  };

  return (
    <motion.div 
      variants={variants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.5, delay: rank * 0.15, type: "spring" }}
      className="relative group h-full"
    >
      {/* Badge de Posición (Top 3) */}
      {rank <= 3 && (
        <div className={cn(
          "absolute -top-3 -left-3 z-20 w-12 h-12 flex items-center justify-center rounded-full text-white font-black shadow-lg ring-4 ring-white border-t border-white/20",
          rank === 1 ? "bg-gradient-to-br from-yellow-400 to-orange-500" : 
          rank === 2 ? "bg-gradient-to-br from-slate-300 to-slate-500" : 
                       "bg-gradient-to-br from-orange-400 to-red-500"
        )}>
          {rank === 1 ? <Trophy size={24} className="drop-shadow-sm" /> : <Medal size={24} />}
        </div>
      )}

      <div className="relative flex flex-col h-full bg-white rounded-[2rem] shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-slate-100 hover:-translate-y-2">
        
        {/* Banner de Color Superior */}
        <div className="h-32 w-full relative overflow-hidden" style={{ backgroundColor: favoriteColor }}>
           {/* Patrón de fondo sutil para textura */}
           <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.8),transparent)]" />
           {isLeader && (
            <div className="absolute inset-0 bg-red-500/30 mix-blend-overlay animate-pulse" />
           )}
        </div>

        <div className="flex-1 flex flex-col items-center p-6 pt-0 relative">
          {/* Avatar superpuesto al banner */}
          <div className="relative -mt-16 mb-4">
            <div 
              className={cn(
                "relative w-32 h-32 rounded-full overflow-hidden ring-[6px] ring-white shadow-xl z-10 bg-white",
                isLeader && "ring-red-500 animate-pulse"
              )}
            >
              <Image 
                src={photoUrl} 
                alt={name}
                fill
                className="object-cover"
              />
            </div>
             {/* Etiqueta de Líder */}
             {isLeader && (
              <div className="absolute -bottom-3 inset-x-0 flex justify-center z-20">
                <span className="bg-red-600 text-white text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest shadow-sm border-2 border-white">
                  Más Buscado
                </span>
              </div>
            )}
          </div>

          <div className="text-center flex-1 flex flex-col w-full">
            <h3 className="text-2xl font-black text-slate-800 mb-1">{name}</h3>
            <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-6">{age} años</p>

            {/* Sección de Deuda */}
            <div className={cn(
              "mt-auto w-full rounded-2xl p-4 text-center transition-all relative overflow-hidden group-hover:scale-105",
              hasDebt 
                ? "bg-gradient-to-br from-red-50 to-pink-50 text-red-800 border border-red-100" 
                : "bg-gradient-to-br from-emerald-50 to-teal-50 text-emerald-800 border border-emerald-100"
            )}>
              <p className={cn(
                "text-xs font-bold uppercase tracking-widest mb-2 flex items-center justify-center gap-2",
                hasDebt ? "text-red-600" : "text-emerald-600"
              )}>
                {hasDebt ? <><AlertTriangle size={16}/> Multa Pendiente</> : <><CheckCircle2 size={16}/> Saldo Limpio</>}
              </p>
              <p className={cn(
                "text-4xl font-black tracking-tight",
                hasDebt ? "text-red-600" : "text-emerald-600"
              )}>
                {formatCurrency(totalDebt)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}