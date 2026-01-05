"use client";

import { useState, useTransition } from "react";
import { resetGame } from "@/app/settings/actions";
import { Trash2, AlertTriangle, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

export function ResetGameBtn() {
  const [isPending, startTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  const handleReset = () => {
    startTransition(async () => {
      await resetGame();
      setShowConfirm(false);
      router.refresh(); // Refresca la UI actual
      alert("¡Juego reiniciado! Todos comienzan desde cero.");
    });
  };

  if (showConfirm) {
    return (
      <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex flex-col sm:flex-row items-center gap-4 justify-between animate-in fade-in slide-in-from-top-2">
        <div className="flex items-center gap-3 text-red-800">
          <AlertTriangle className="shrink-0" />
          <div>
            <p className="font-bold">¿Estás absolutamente seguro?</p>
            <p className="text-sm">Esta acción borrará todas las multas y no se puede deshacer.</p>
          </div>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button
            onClick={() => setShowConfirm(false)}
            className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-lg text-sm w-full sm:w-auto"
          >
            Cancelar
          </button>
          <button
            onClick={handleReset}
            disabled={isPending}
            className="px-4 py-2 bg-red-600 text-white font-bold hover:bg-red-700 rounded-lg text-sm w-full sm:w-auto flex items-center justify-center gap-2"
          >
            {isPending ? <RefreshCw className="animate-spin" size={16}/> : <Trash2 size={16}/>}
            Sí, Reiniciar
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="w-full sm:w-auto px-6 py-4 bg-white border-2 border-red-100 text-red-600 font-bold rounded-xl hover:bg-red-50 hover:border-red-200 transition-all flex items-center justify-center gap-2"
    >
      <Trash2 size={20} />
      Reiniciar Juego (Reset Scores)
    </button>
  );
}