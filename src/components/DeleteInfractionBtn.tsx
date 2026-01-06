"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteInfraction } from "@/app/actions";

export function DeleteInfractionBtn({ id }: { id: string }) {
    const [isPending, startTransition] = useTransition();

    function handleDelete() {
        if (confirm("¿Estás seguro de eliminar esta infracción? Esta acción quedará registrada.")) {
            startTransition(async () => {
                try {
                    await deleteInfraction(id);
                } catch (error) {
                    alert("Error: " + error);
                }
            });
        }
    }

    return (
        <button
            onClick={handleDelete}
            disabled={isPending}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
            title="Eliminar Infracción"
        >
            <Trash2 size={18} className={isPending ? "opacity-50" : ""} />
        </button>
    );
}
