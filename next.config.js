/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration pour le déploiement Vercel
  output: 'standalone',
  // Désactiver la compression pour éviter les problèmes de build
  compress: false,
  // Configuration pour les images
  images: {
    unoptimized: true
  },
  // Configuration pour les variables d'environnement
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  }
}

module.exports = nextConfig 