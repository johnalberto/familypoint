import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.dicebear.com', // Avatares por defecto
      },
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com', // <--- NUEVO: Almacenamiento de Vercel
      },
    ],
  },
};

export default nextConfig;