"use client";

import { updateCompetitor, deleteCompetitor } from "@/app/competitors/actions";
import { Save, User, Calendar, Image as ImageIcon, Palette, Trash2, AlertTriangle } from "lucide-react";
import { useState } from "react";

interface EditCompetitorFormProps {
  competitor: {
    id: string;
    name: string;
    birthDate: Date;
    photoUrl: string;
    favoriteColor: string;
  };
}

export function EditCompetitorForm({ competitor }: EditCompetitorFormProps) {
  const [isPending, setIsPending] = useState(false);

  // Formatear fecha para el input type="date" (YYYY-MM-DD)
  const formattedDate = competitor.birthDate.toISOString().split("T")[0];

  const handleSubmit = async (formData: FormData) => {
    setIsPending(true);
    // Pasamos el ID y el FormData a la Server Action
    await updateCompetitor(competitor.id, formData);
    // No necesitamos setIsPending(false) porque la acción hace redirect
  };

  const handleDelete = async () => {
    if (confirm("¿Estás seguro de que quieres eliminar a este competidor? Esta acción no se puede deshacer.")) {
      setIsPending(true);
      await deleteCompetitor(competitor.id);
    }
  };

  return (
    <form action={handleSubmit} className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 max-w-lg mx-auto">
      <div className="space-y-6">

        {/* Nombre */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-bold text-slate-500 uppercase tracking-wider">
            <User size={16} /> Nombre
          </label>
          <input
            name="name"
            defaultValue={competitor.name}
            type="text"
            required
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-800"
          />
        </div>

        {/* Fecha Nacimiento */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-bold text-slate-500 uppercase tracking-wider">
            <Calendar size={16} /> Fecha de Nacimiento
          </label>
          <input
            name="birthDate"
            defaultValue={formattedDate}
            type="date"
            required
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium"
          />
        </div>

        {/* Foto (File Upload) */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-bold text-slate-500 uppercase tracking-wider">
            <ImageIcon size={16} /> Foto
          </label>

          {/* Previsualización actual */}
          {competitor.photoUrl && (
            <div className="mb-2">
              <p className="text-xs text-slate-400 mb-1">Actual:</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={competitor.photoUrl}
                alt="Foto actual"
                className="w-20 h-20 rounded-full object-cover border-2 border-slate-100 shadow-sm"
              />
            </div>
          )}

          {/* Input oculto para mantener la URL anterior si no se sube nada nuevo */}
          <input type="hidden" name="currentPhotoUrl" value={competitor.photoUrl} />

          <input
            name="photo"
            type="file"
            accept="image/*"
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all"
          />
          <p className="text-xs text-slate-400 pl-1">
            Sube una nueva imagen para reemplazar la actual.
          </p>
        </div>

        {/* Color Favorito */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-bold text-slate-500 uppercase tracking-wider">
            <Palette size={16} /> Color Favorito
          </label>
          <div className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <input
              name="favoriteColor"
              defaultValue={competitor.favoriteColor}
              type="color"
              required
              className="h-10 w-10 cursor-pointer border-none bg-transparent"
            />
            <span className="text-sm text-slate-500 font-medium">Click en el círculo para cambiar</span>
          </div>
        </div>

        {/* Botón Guardar */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full mt-6 bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 active:scale-95"
        >
          {isPending ? "Guardando..." : <><Save size={20} /> Guardar Cambios</>}
        </button>

        {/* Botón Eliminar (Zona de Peligro) */}
        <div className="pt-6 mt-6 border-t border-slate-100">
          <button
            type="button"
            onClick={handleDelete}
            disabled={isPending}
            className="w-full flex items-center justify-center gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 p-4 rounded-xl transition-colors font-medium text-sm"
          >
            <Trash2 size={16} /> Eliminar Competidor
          </button>
        </div>
      </div>
    </form>
  );
}