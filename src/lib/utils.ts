import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Función helper para combinar clases de Tailwind sin conflictos
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Función para formatear dinero (lo usaremos en todo el app)
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("es-CO", { // Cambia es-CO por tu localidad si prefieres
    style: "currency",
    currency: "COP", // O USD, EUR, etc.
    minimumFractionDigits: 0,
  }).format(amount);
};