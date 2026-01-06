import { stackServerApp } from "@/stack";

export async function checkAdmin() {
    const user = await stackServerApp.getUser();

    // Si no hay usuario, no es admin
    if (!user) return false;

    // Lista de correos admin permitidos
    const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(",") || [];

    // Si el correo del usuario está en la lista (limpiamos espacios)
    const userEmail = user.primaryEmail?.toLowerCase().trim();

    if (userEmail && ADMIN_EMAILS.some(email => email.toLowerCase().trim() === userEmail)) {
        return true;
    }

    return false;
}
