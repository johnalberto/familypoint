"use client";

import { useState } from "react";
import { createInfraction } from "@/app/actions";
import { Plus, X, Siren, Save } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Recibimos la lista de competidores para el select
interface FineButtonProps {
  competitors: { id: string; name: string }[];
}

export function FineButton({ competitors }: FineButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  // Manejador del submit
  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    try {
      await createInfraction(formData); // Llamamos al Server Action
      setIsOpen(false); // Cerramos el modal
    } catch (error) {
      alert("Error al multar: " + error);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <>
      {/* Botón Flotante (FAB) */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-red-600 hover:bg-red-700 text-white w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
      >
        <Plus size={32} strokeWidth={3} />
      </button>

      {/* Modal Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          >
            {/* Modal Content */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden"
            >
              {/* Header Modal */}
              <div className="bg-red-600 p-6 text-white flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Siren size={24} />
                  </div>
                  <h2 className="text-xl font-bold">Nueva Multa</h2>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Formulario */}
              <form action={handleSubmit} className="p-6 space-y-6">
                
                {/* Selector de Culpable */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">¿Quién fue?</label>
                  <select 
                    name="competitorId" 
                    required
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-lg font-medium focus:ring-2 focus:ring-red-500 outline-none transition-all"
                  >
                    <option value="" disabled selected>Selecciona al infractor...</option>
                    {competitors.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Motivo */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">Motivo</label>
                  <input
                    type="text"
                    name="reason"
                    placeholder="Ej: Dejar la luz prendida..."
                    required
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-lg outline-none focus:ring-2 focus:ring-red-500 transition-all"
                  />
                </div>

                {/* Botón de Guardar */}
                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-800 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPending ? (
                    "Aplicando justicia..."
                  ) : (
                    <>
                      <Save size={20} /> Aplicar Multa
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}