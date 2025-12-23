#!/bin/bash

echo "🔐 Installation de QPDF pour le cryptage des PDFs"
echo "=================================================="
echo ""

# Vérifier si qpdf est déjà installé
if command -v qpdf &> /dev/null; then
    echo "✅ QPDF est déjà installé !"
    qpdf --version
    echo ""
    read -p "Voulez-vous continuer quand même ? (y/N) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 0
    fi
fi

echo "📦 Installation de QPDF..."
echo ""

# Détecter l'OS
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo "🐧 Système Linux détecté"
    if command -v apt-get &> /dev/null; then
        echo "Installation via apt-get..."
        sudo apt-get update
        sudo apt-get install -y qpdf
    elif command -v yum &> /dev/null; then
        echo "Installation via yum..."
        sudo yum install -y qpdf
    else
        echo "❌ Gestionnaire de paquets non supporté"
        exit 1
    fi
elif [[ "$OSTYPE" == "darwin"* ]]; then
    echo "🍎 macOS détecté"
    if command -v brew &> /dev/null; then
        echo "Installation via Homebrew..."
        brew install qpdf
    else
        echo "❌ Homebrew n'est pas installé"
        echo "Installez Homebrew depuis : https://brew.sh"
        exit 1
    fi
else
    echo "❌ Système d'exploitation non supporté"
    exit 1
fi

echo ""
echo "✅ Installation terminée !"
echo ""
echo "Vérification de l'installation..."
qpdf --version
echo ""
echo "🚀 Vous pouvez maintenant lancer le script d'import :"
echo "   cd api"
echo "   node scripts/importEbooks.js"
echo ""
