"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { put } from "@vercel/blob"; // <--- Importamos Vercel Blob

export async function updateCompetitor(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const favoriteColor = formData.get("favoriteColor") as string;
  const birthDateRaw = formData.get("birthDate") as string;
  
  const file = formData.get("photo") as File;
  
  let photoUrl = formData.get("currentPhotoUrl") as string;

  // --- LÓGICA DE NUBE ---
  if (file && file.size > 0) {
    // Subimos directamente a la nube de Vercel
    const blob = await put(file.name, file, {
      access: 'public',
    });
    
    photoUrl = blob.url; // Vercel nos devuelve la URL pública de internet
  }
  // ---------------------

  if (!name || !birthDateRaw) {
    throw new Error("Faltan datos requeridos");
  }

  await db.competitor.update({
    where: { id },
    data: {
      name,
      photoUrl,
      favoriteColor,
      birthDate: new Date(birthDateRaw),
    },
  });

  revalidatePath("/");
  revalidatePath(`/competitors/${id}`);
  
  redirect(`/competitors/${id}`);
}