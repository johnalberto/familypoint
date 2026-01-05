"use client";

import { deleteCategory } from "@/app/settings/actions";
import { Trash2 } from "lucide-react";

export function DeleteCategoryBtn({ id }: { id: string }) {
  return (
    <button
      onClick={() => {
        if (confirm("¿Seguro que quieres borrar esta categoría?")) {
          deleteCategory(id);
        }
      }}
      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
    >
      <Trash2 size={18} />
    </button>
  );
}