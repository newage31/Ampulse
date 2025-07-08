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
  // Les variables d'environnement seront configurées directement sur Vercel
  experimental: {
    esmExternals: false
  }
}

module.exports = nextConfig 