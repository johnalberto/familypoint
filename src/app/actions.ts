"use server";

import { db } from "@/lib/db";
import { differenceInYears } from "date-fns";
import { revalidatePath } from "next/cache";

export async function createInfraction(formData: FormData) {
  // 1. Extraer datos del formulario
  const competitorId = formData.get("competitorId") as string;
  const reason = formData.get("reason") as string;

  if (!competitorId || !reason) {
    throw new Error("Faltan datos requeridos");
  }

  // 2. Buscar al competidor para saber su nacimiento
  const competitor = await db.competitor.findUnique({
    where: { id: competitorId },
  });

  if (!competitor) throw new Error("Competidor no encontrado");

  // 3. Calcular edad exacta HOY (Lógica de negocio crítica)
  const currentAge = differenceInYears(new Date(), competitor.birthDate);

  // 4. Buscar la categoría que corresponde a esa edad
  // (Ej: Si tiene 8 años, busca la categoría donde minAge <= 8 y maxAge >= 8)
  const category = await db.category.findFirst({
    where: {
      minAge: { lte: currentAge },
      maxAge: { gte: currentAge },
    },
  });

  // Fallback por si no configuramos categorías (defensivo)
  const fineAmount = category ? category.fineAmount : 0;

  // 5. Guardar la infracción (SNAPSHOT del precio)
  await db.infraction.create({
    data: {
      reason,
      amountCharged: fineAmount, // Guardamos cuánto costó HOY
      competitorId,
    },
  });

  // 6. Actualizar la pantalla sin recargar
  revalidatePath("/");
}

import { checkAdmin } from "@/lib/auth";
import { stackServerApp } from "@/stack";

export async function deleteInfraction(id: string) {
  // 1. Verificar Admin
  const isAdmin = await checkAdmin();
  if (!isAdmin) {
    throw new Error("No tienes permisos para realizar esta acción.");
  }

  const user = await stackServerApp.getUser();
  const adminEmail = user?.primaryEmail || "unknown";

  // 2. Buscar la infracción antes de borrarla (para el log)
  const infraction = await db.infraction.findUnique({
    where: { id },
    include: { competitor: true },
  });

  if (!infraction) {
    throw new Error("Infracción no encontrada.");
  }

  // 3. Crear registro de auditoría
  await db.auditLog.create({
    data: {
      action: "INFRACTION_DELETED",
      description: `Se eliminó multa de $${infraction.amountCharged} a ${infraction.competitor.name}. Motivo: ${infraction.reason}`,
      adminEmail: adminEmail,
    },
  });

  // 4. Eliminar la infracción
  await db.infraction.delete({
    where: { id },
  });

  // 5. Revalidar
  revalidatePath("/");
  revalidatePath(`/competitors/${infraction.competitorId}`);
}