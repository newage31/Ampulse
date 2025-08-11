#!/bin/bash
echo "🚀 Déploiement rapide vers Vercel..."

# Vérification de l'état Git
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️ Modifications non commitées détectées"
    echo "📦 Ajout et commit des modifications..."
    git add .
    git commit -m "🚀 Déploiement automatique - $(date)"
    git push origin main
fi

# Déploiement Vercel
echo "📤 Déploiement vers Vercel..."
vercel --prod --yes

echo "✅ Déploiement terminé !"
