#!/bin/bash

# Script de déploiement Vercel rapide pour SoliReserve Enhanced
# Usage: ./deploy-vercel.sh [--prod]

echo "🚀 Déploiement Vercel - SoliReserve Enhanced"
echo "============================================"

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages
print_status() {
    echo -e "${BLUE}📋 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Vérification de Node.js
print_status "Vérification de Node.js..."
if ! command -v node &> /dev/null; then
    print_error "Node.js n'est pas installé"
    exit 1
fi
print_success "Node.js installé ($(node --version))"

# Vérification de npm
print_status "Vérification de npm..."
if ! command -v npm &> /dev/null; then
    print_error "npm n'est pas installé"
    exit 1
fi
print_success "npm installé ($(npm --version))"

# Vérification de Vercel CLI
print_status "Vérification de Vercel CLI..."
if ! command -v vercel &> /dev/null; then
    print_warning "Vercel CLI non installé. Installation..."
    npm install -g vercel
    if [ $? -ne 0 ]; then
        print_error "Impossible d'installer Vercel CLI"
        exit 1
    fi
fi
print_success "Vercel CLI installé ($(vercel --version))"

# Nettoyage des caches
print_status "Nettoyage des caches..."
rm -rf .next
rm -rf node_modules/.cache
print_success "Caches nettoyés"

# Installation des dépendances
print_status "Installation des dépendances..."
npm install
if [ $? -ne 0 ]; then
    print_error "Échec de l'installation des dépendances"
    exit 1
fi
print_success "Dépendances installées"

# Build de production
print_status "Build de production..."
npm run build
if [ $? -ne 0 ]; then
    print_error "Échec du build de production"
    exit 1
fi
print_success "Build de production réussi"

# Déploiement Vercel
print_status "Déploiement sur Vercel..."
if [ "$1" = "--prod" ]; then
    print_warning "Déploiement en production..."
    vercel --prod
else
    print_warning "Déploiement en preview..."
    vercel
fi

if [ $? -eq 0 ]; then
    print_success "Déploiement Vercel réussi !"
    echo ""
    echo "📋 Prochaines étapes:"
    echo "1. Vérifier l'URL de déploiement fournie"
    echo "2. Configurer les variables d'environnement sur Vercel"
    echo "3. Tester l'application en production"
    echo "4. Configurer un domaine personnalisé si nécessaire"
    echo ""
    echo "📚 Documentation:"
    echo "- Vercel CLI: https://vercel.com/docs/cli"
    echo "- Variables d'environnement: https://vercel.com/docs/projects/environment-variables"
else
    print_error "Échec du déploiement Vercel"
    echo ""
    echo "🔧 Solutions possibles:"
    echo "1. Vérifier votre connexion internet"
    echo "2. Vérifier vos identifiants Vercel"
    echo "3. Vérifier les variables d'environnement"
    echo "4. Consulter les logs de déploiement"
    exit 1
fi

echo ""
echo "🚀 Déploiement Vercel terminé !"
