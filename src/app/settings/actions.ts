"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

// Acción para CREAR una nueva categoría
export async function createCategory(formData: FormData) {
  const name = formData.get("name") as string;
  const minAge = parseInt(formData.get("minAge") as string);
  const maxAge = parseInt(formData.get("maxAge") as string);
  const fineAmount = parseFloat(formData.get("fineAmount") as string);

  if (!name || isNaN(minAge) || isNaN(maxAge) || isNaN(fineAmount)) {
    throw new Error("Datos inválidos");
  }

  await db.category.create({
    data: {
      name,
      minAge,
      maxAge,
      fineAmount,
    },
  });

  // Refrescamos la página de settings para ver la nueva fila
  revalidatePath("/settings");
}

// Acción para ELIMINAR una categoría
export async function deleteCategory(id: string) {
  await db.category.delete({
    where: { id },
  });
  
  revalidatePath("/settings");
}

// Acción para RESETEAR EL JUEGO (Borrar todas las multas)
export async function resetGame() {
  // Borramos TODAS las filas de la tabla Infraction
  await db.infraction.deleteMany();
  
  // Revalidamos todo para que el dashboard quede en $0
  revalidatePath("/");
  revalidatePath("/settings");
}