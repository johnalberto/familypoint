"use client";

import { useRef } from "react";
import { createCategory } from "@/app/settings/actions";
import { Plus, Save } from "lucide-react";

export function CategoryForm() {
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    await createCategory(formData);
    formRef.current?.reset(); // Limpia el formulario al terminar
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-8">
      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <Plus className="text-blue-600" size={20} />
        Nueva Regla de Juego
      </h3>
      
      <form 
        ref={formRef} 
        action={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
      >
        {/* Nombre */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-400 uppercase">Nombre</label>
          <input 
            name="name" 
            type="text" 
            placeholder="Ej: Adolescente" 
            required 
            className="w-full p-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Edad Mínima */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-400 uppercase">Edad Mín.</label>
          <input 
            name="minAge" 
            type="number" 
            placeholder="0" 
            required 
            className="w-full p-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Edad Máxima */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-400 uppercase">Edad Máx.</label>
          <input 
            name="maxAge" 
            type="number" 
            placeholder="12" 
            required 
            className="w-full p-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Valor Multa */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-400 uppercase">Valor Multa</label>
          <div className="relative">
            <span className="absolute left-3 top-3 text-slate-400">$</span>
            <input 
              name="fineAmount" 
              type="number" 
              placeholder="5000" 
              required 
              className="w-full p-3 pl-7 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        {/* Botón Guardar */}
        <button 
          type="submit" 
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold p-3 rounded-xl flex items-center justify-center gap-2 transition-colors md:col-span-4 lg:col-span-1"
        >
          <Save size={18} /> Guardar
        </button>
      </form>
    </div>
  );
}