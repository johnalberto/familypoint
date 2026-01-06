"use client";

import { createCompetitor } from "@/app/competitors/actions";
import { Save, User, Calendar, Image as ImageIcon, Palette } from "lucide-react";
import { useState } from "react";

export function NewCompetitorForm() {
    const [isPending, setIsPending] = useState(false);

    const handleSubmit = async (formData: FormData) => {
        setIsPending(true);
        await createCompetitor(formData);
        // No setIsPending(false) porque redirection ocurre
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
                        placeholder="Ej: Pedro"
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
                        type="date"
                        required
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                    />
                </div>

                {/* Foto */}
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-bold text-slate-500 uppercase tracking-wider">
                        <ImageIcon size={16} /> Foto
                    </label>
                    <input
                        name="photo"
                        type="file"
                        accept="image/*"
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all"
                    />
                </div>

                {/* Color Favorito */}
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-bold text-slate-500 uppercase tracking-wider">
                        <Palette size={16} /> Color Favorito
                    </label>
                    <div className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                        <input
                            name="favoriteColor"
                            type="color"
                            defaultValue="#3b82f6"
                            required
                            className="h-10 w-10 cursor-pointer border-none bg-transparent"
                        />
                        <span className="text-sm text-slate-500 font-medium">Click para elegir</span>
                    </div>
                </div>

                {/* Botón Crear */}
                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full mt-6 bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-500 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-md shadow-blue-200"
                >
                    {isPending ? "Creando..." : <><Save size={20} /> Crear Competidor</>}
                </button>
            </div>
        </form>
    );
}
