/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration pour le déploiement Vercel
  output: 'standalone',
  experimental: {
    appDir: true
  },
  // Désactiver la compression pour éviter les problèmes de build
  compress: false,
  // Configuration pour les images
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig 