require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const crypto = require('crypto');
const { execSync } = require('child_process');
const Product = require('../models/Product');
const Category = require('../models/Categories');

// Configuration de la connexion MongoDB
const MONGODB_URI = process.env.MONGODB_URL || process.env.MONGODB_URI || 'mongodb://localhost:27017/marxgeek';

// Mapping des ebooks avec leurs métadonnées (regroupés par formation)
const ebooksData = [
  {
    fileName: '0-Guide-Demarrage.pdf',
    coverImage: '0-Guide-Demarrage.png',
    name: '📘 Guide de Démarrage - Programmation Web',
    nameEn: '📘 Getting Started Guide - Web Programming',
    category: 'Projets Pratiques Web',
    price: 8000,
    pricePromo: 4000,
    description: `🚀 Commencez votre aventure dans la programmation web !

📖 Ce guide complet vous accompagne pas à pas dans vos premiers pas en développement web.

✨ Contenu du guide :
• 🎯 Introduction aux concepts fondamentaux
• 💻 Configuration de votre environnement de développement
• 🛠️ Outils essentiels pour débuter
• 📚 Ressources et bonnes pratiques
• 🎓 Parcours d'apprentissage recommandé

🎁 Avantages inclus :
• ✅ Support WhatsApp personnalisé
• 🔄 Mises à jour gratuites à vie
• 💬 Accès au groupe de discussion
• 🎯 Suivi de votre progression

Parfait pour les débutants qui souhaitent construire des bases solides ! 🌟`,
    descriptionEn: `🚀 Start your web programming journey!

📖 This comprehensive guide takes you step by step through your first steps in web development.

✨ Guide contents:
• 🎯 Introduction to fundamental concepts
• 💻 Setting up your development environment
• 🛠️ Essential tools to get started
• 📚 Resources and best practices
• 🎓 Recommended learning path

🎁 Included benefits:
• ✅ Personalized WhatsApp support
• 🔄 Free lifetime updates
• 💬 Access to discussion group
• 🎯 Progress tracking

Perfect for beginners who want to build a solid foundation! 🌟`,
  },
  {
    fileName: 'Formation-HTML-Complete.pdf',
    coverImage: 'Formation-HTML-Complete.png',
    name: '🌐 Formation HTML Complète - Maîtrisez les Fondamentaux',
    nameEn: '🌐 Complete HTML Training - Master the Fundamentals',
    category: 'HTML',
    price: 10000,
    pricePromo: 5000,
    description: `🎓 Devenez expert en HTML5 avec cette formation complète !

📚 Une formation structurée pour maîtriser HTML de A à Z.

✨ Programme détaillé :
• 🏗️ Structure d'une page web
• 🔖 Balises HTML5 sémantiques
• 📝 Formulaires et validation
• 🖼️ Gestion des images et médias
• 🔗 Liens et navigation
• 📱 HTML responsive

🎁 Avantages inclus :
• ✅ Support WhatsApp personnalisé 24/7
• 🔄 Mises à jour gratuites à vie
• 💬 Groupe d'entraide communautaire
• 🎯 Suivi personnalisé de progression
• 💻 50+ exercices pratiques avec solutions

Idéal pour créer des structures web solides et professionnelles ! 💪`,
    descriptionEn: `🎓 Become an HTML5 expert with this complete training!

📚 A structured course to master HTML from A to Z.

✨ Detailed program:
• 🏗️ Web page structure
• 🔖 Semantic HTML5 tags
• 📝 Forms and validation
• 🖼️ Image and media management
• 🔗 Links and navigation
• 📱 Responsive HTML

🎁 Included benefits:
• ✅ 24/7 personalized WhatsApp support
• 🔄 Free lifetime updates
• 💬 Community support group
• 🎯 Personalized progress tracking
• 💻 50+ practical exercises with solutions

Ideal for creating solid and professional web structures! 💪`,
  },
  {
    fileName: 'Formation-CSS-ENRICHIE.pdf',
    coverImage: 'Formation-CSS-ENRICHIE.png',
    name: '🎨 Formation CSS Enrichie - Design Moderne',
    nameEn: '🎨 Advanced CSS Training - Modern Design',
    category: 'CSS',
    price: 12000,
    pricePromo: 6000,
    description: `🎨 Créez des designs époustouflants avec CSS3 !

🚀 Formation avancée pour maîtriser le style et l'animation CSS.

✨ Au programme :
• 🎯 Sélecteurs CSS avancés
• 🌈 Couleurs, dégradés et ombres
• 📐 Flexbox et Grid Layout
• ✨ Animations et transitions
• 🎭 Transformations 3D
• 📱 Design responsive avancé

🎁 Avantages inclus :
• ✅ Support WhatsApp personnalisé 24/7
• 🔄 Mises à jour gratuites à vie
• 💬 Groupe d'entraide actif
• 🎯 Coaching personnalisé
• 💻 100+ snippets CSS prêts à l'emploi

Transformez vos designs en œuvres d'art interactives ! 🌟`,
    descriptionEn: `🎨 Create stunning designs with CSS3!

🚀 Advanced training to master CSS styling and animation.

✨ Program:
• 🎯 Advanced CSS selectors
• 🌈 Colors, gradients and shadows
• 📐 Flexbox and Grid Layout
• ✨ Animations and transitions
• 🎭 3D transformations
• 📱 Advanced responsive design

🎁 Included benefits:
• ✅ 24/7 personalized WhatsApp support
• 🔄 Free lifetime updates
• 💬 Active support group
• 🎯 Personalized coaching
• 💻 100+ ready-to-use CSS snippets

Transform your designs into interactive works of art! 🌟`,
  },
  {
    fileName: 'Formation-JavaScript-ENRICHIE.pdf',
    coverImage: 'Formation-JavaScript-ENRICHIE.png',
    name: '⚡ Formation JavaScript Enrichie - Programmation Interactive',
    nameEn: '⚡ Advanced JavaScript Training - Interactive Programming',
    category: 'JavaScript Avancé',
    price: 15000,
    pricePromo: 7500,
    description: `⚡ Maîtrisez JavaScript et créez des applications interactives !

🎓 Formation complète du débutant au niveau avancé.

✨ Contenu enrichi :
• 🎯 Fondamentaux JavaScript ES6+
• 🔧 Manipulation du DOM
• 📡 AJAX et Fetch API
• 🎨 Programmation orientée objet
• 🔄 Programmation asynchrone
• 🛠️ Modules et outils modernes

🎁 Avantages inclus :
• ✅ Support WhatsApp personnalisé 24/7
• 🔄 Mises à jour gratuites à vie
• 💬 Groupe d'entraide développeurs
• 🎯 Mentorat personnalisé
• 💻 150+ exercices progressifs avec corrections

Devenez un développeur JavaScript accompli ! 🚀`,
    descriptionEn: `⚡ Master JavaScript and create interactive applications!

🎓 Complete training from beginner to advanced level.

✨ Enriched content:
• 🎯 JavaScript ES6+ fundamentals
• 🔧 DOM manipulation
• 📡 AJAX and Fetch API
• 🎨 Object-oriented programming
• 🔄 Asynchronous programming
• 🛠️ Modern modules and tools

🎁 Included benefits:
• ✅ 24/7 personalized WhatsApp support
• 🔄 Free lifetime updates
• 💬 Developer support group
• 🎯 Personalized mentoring
• 💻 150+ progressive exercises with corrections

Become an accomplished JavaScript developer! 🚀`,
  },
  {
    fileName: 'Integration-HTML-CSS-JS.pdf',
    coverImage: 'Integration-HTML-CSS-JS.png',
    name: '🔗 Intégration HTML-CSS-JS - Projets Web Complets',
    nameEn: '🔗 HTML-CSS-JS Integration - Complete Web Projects',
    category: 'Projets Pratiques Web',
    price: 18000,
    pricePromo: 9000,
    description: `🔗 Intégrez HTML, CSS et JavaScript pour créer des sites web complets !

🎯 Apprenez à combiner les trois piliers du développement web.

✨ 6 Projets inclus :
• 🌐 Portfolio professionnel
• 🛒 E-commerce simple
• 📱 Application météo
• 🎮 Mini-jeu interactif
• 📝 Todo list avancée
• 🎨 Galerie d'images dynamique

🎁 Avantages inclus :
• ✅ Support WhatsApp personnalisé 24/7
• 🔄 Mises à jour gratuites à vie
• 💬 Groupe d'entraide projets
• 🎯 Revue de code personnalisée
• 💻 Code source complet commenté

De la conception à la mise en ligne ! 🚀`,
    descriptionEn: `🔗 Integrate HTML, CSS and JavaScript to create complete websites!

🎯 Learn to combine the three pillars of web development.

✨ 6 Included projects:
• 🌐 Professional portfolio
• 🛒 Simple e-commerce
• 📱 Weather application
• 🎮 Interactive mini-game
• 📝 Advanced todo list
• 🎨 Dynamic image gallery

🎁 Included benefits:
• ✅ 24/7 personalized WhatsApp support
• 🔄 Free lifetime updates
• 💬 Project support group
• 🎯 Personalized code review
• 💻 Complete commented source code

From design to deployment! 🚀`,
  },
  {
    fileName: '10-Projets-Pratiques-COMPLET.pdf',
    coverImage: '10-Projets-Pratiques-COMPLET.png',
    name: '🎯 10 Projets Pratiques - Portfolio Complet',
    nameEn: '🎯 10 Practical Projects - Complete Portfolio',
    category: 'Projets Pratiques Web',
    price: 25000,
    pricePromo: 12500,
    description: `🎯 Construisez 10 projets professionnels pour votre portfolio !

💼 Des projets réels pour impressionner les recruteurs.

✨ Les 10 projets :
1. 🌐 Site vitrine responsive
2. 🛒 Boutique e-commerce
3. 📱 Application mobile-first
4. 📊 Dashboard analytics
5. 🎮 Jeu interactif
6. 📝 Blog avec CMS
7. 🎨 Portfolio créatif
8. 📧 Newsletter manager
9. 🔐 Système d'authentification
10. 🚀 Landing page conversion

🎁 Avantages inclus :
• ✅ Support WhatsApp personnalisé 24/7
• 🔄 Mises à jour gratuites à vie
• 💬 Groupe d'entraide portfolio
• 🎯 Revue détaillée de tous vos projets
• 💻 Code source complet + Designs Figma
• 🎥 Vidéos explicatives pour chaque projet

Votre portfolio professionnel clé en main ! 💼`,
    descriptionEn: `🎯 Build 10 professional projects for your portfolio!

💼 Real projects to impress recruiters.

✨ The 10 projects:
1. 🌐 Responsive showcase site
2. 🛒 E-commerce store
3. 📱 Mobile-first application
4. 📊 Analytics dashboard
5. 🎮 Interactive game
6. 📝 Blog with CMS
7. 🎨 Creative portfolio
8. 📧 Newsletter manager
9. 🔐 Authentication system
10. 🚀 Conversion landing page

🎁 Included benefits:
• ✅ 24/7 personalized WhatsApp support
• 🔄 Free lifetime updates
• 💬 Portfolio support group
• 🎯 Detailed review of all your projects
• 💻 Complete source code + Figma designs
• 🎥 Explanatory videos for each project

Your professional portfolio ready to use! 💼`,
  },
  {
    // GROUPEMENT: React Débutant Partie 1 + 2
    fileName: ['React_Ebook_Debutant_Partie1_v2.pdf', 'React_Ebook_Partie2.pdf'],
    coverImage: 'React_Ebook_Debutant_Partie1_v2.png',
    name: '⚛️ React Débutant Complet - Parties 1 & 2',
    nameEn: '⚛️ Complete React Beginner - Parts 1 & 2',
    category: 'React.js',
    price: 20000,
    pricePromo: 10000,
    description: `⚛️ Formation React complète pour débutants - Les 2 parties réunies !

🎓 Maîtrisez React de A à Z avec cette formation en 2 parties.

✨ Partie 1 - Les Fondamentaux :
• 🎯 Introduction à React
• 🧩 Composants et JSX
• 📦 Props et State
• 🔄 Cycle de vie des composants
• 🎨 Styling dans React
• 🛠️ Create React App

✨ Partie 2 - Concepts Avancés :
• 🔄 Hooks (useState, useEffect, useContext)
• 🎣 Hooks personnalisés
• 📡 API et fetch de données
• 🗂️ Gestion d'état avancée
• 🧭 React Router
• 📝 Formulaires et validation

🎁 Avantages inclus :
• ✅ Support WhatsApp personnalisé 24/7
• 🔄 Mises à jour gratuites à vie
• 💬 Groupe d'entraide React
• 🎯 Mentorat et revue de code
• 💻 70+ exercices + 8 projets complets
• 📚 Antisèche React complète

Votre parcours complet pour devenir développeur React ! 🚀`,
    descriptionEn: `⚛️ Complete React training for beginners - Both parts together!

🎓 Master React from A to Z with this 2-part training.

✨ Part 1 - Fundamentals:
• 🎯 Introduction to React
• 🧩 Components and JSX
• 📦 Props and State
• 🔄 Component lifecycle
• 🎨 Styling in React
• 🛠️ Create React App

✨ Part 2 - Advanced Concepts:
• 🔄 Hooks (useState, useEffect, useContext)
• 🎣 Custom Hooks
• 📡 API and data fetching
• 🗂️ Advanced state management
• 🧭 React Router
• 📝 Forms and validation

🎁 Included benefits:
• ✅ 24/7 personalized WhatsApp support
• 🔄 Free lifetime updates
• 💬 React support group
• 🎯 Mentoring and code review
• 💻 70+ exercises + 8 complete projects
• 📚 Complete React cheat sheet

Your complete journey to becoming a React developer! 🚀`,
  },
  {
    // GROUPEMENT: React Intermédiaire Partie 1 + 2
    fileName: ['React_Intermediaire_Partie1.pdf', 'React_Intermediaire_Partie2.pdf'],
    coverImage: 'React_Intermediaire_Partie1.png',
    name: '⚛️ React Intermédiaire Complet - Parties 1 & 2',
    nameEn: '⚛️ Complete React Intermediate - Parts 1 & 2',
    category: 'React.js',
    price: 30000,
    pricePromo: 15000,
    description: `⚛️ Formation React avancée - Architecture et Production !

🎯 Pour développeurs React souhaitant créer des applications professionnelles.

✨ Partie 1 - Architecture Avancée :
• 🏗️ Architecture d'application scalable
• 🗂️ Context API et Redux Toolkit
• 🎭 Performance et optimisation (memo, useMemo, useCallback)
• 🧪 Testing avec Jest et React Testing Library
• 🔒 Sécurité et authentification JWT
• 📦 Code splitting et lazy loading

✨ Partie 2 - Production Ready :
• 🔧 Build et optimisation pour production
• 🌐 SEO et SSR avec Next.js
• 📊 Monitoring et analytics (Sentry, Google Analytics)
• 🔄 CI/CD et déploiement automatisé
• 🐛 Error tracking et debugging avancé
• 📈 Performance monitoring et optimisation

🎁 Avantages inclus :
• ✅ Support WhatsApp personnalisé 24/7
• 🔄 Mises à jour gratuites à vie
• 💬 Groupe d'entraide React Pro
• 🎯 Mentorat expert et revue de code
• 💻 Projet e-commerce complet production-ready
• 📚 Templates d'architecture + Pipeline CI/CD
• 🎥 Vidéos de déploiement étape par étape

De l'architecture au déploiement professionnel ! 💼`,
    descriptionEn: `⚛️ Advanced React training - Architecture and Production!

🎯 For React developers wanting to create professional applications.

✨ Part 1 - Advanced Architecture:
• 🏗️ Scalable application architecture
• 🗂️ Context API and Redux Toolkit
• 🎭 Performance and optimization (memo, useMemo, useCallback)
• 🧪 Testing with Jest and React Testing Library
• 🔒 Security and JWT authentication
• 📦 Code splitting and lazy loading

✨ Part 2 - Production Ready:
• 🔧 Build and production optimization
• 🌐 SEO and SSR with Next.js
• 📊 Monitoring and analytics (Sentry, Google Analytics)
• 🔄 CI/CD and automated deployment
• 🐛 Error tracking and advanced debugging
• 📈 Performance monitoring and optimization

🎁 Included benefits:
• ✅ 24/7 personalized WhatsApp support
• 🔄 Free lifetime updates
• 💬 React Pro support group
• 🎯 Expert mentoring and code review
• 💻 Complete production-ready e-commerce project
• 📚 Architecture templates + CI/CD pipeline
• 🎥 Step-by-step deployment videos

From architecture to professional deployment! 💼`,
  },
  {
    // GROUPEMENT: React Exercices Partie 1 + 2
    fileName: ['React_Exercices_Partie1.pdf', 'React_Exercices_Partie2_Complete.pdf'],
    coverImage: 'React_Exercices_Partie1.png',
    name: '💪 React Exercices Complet - Parties 1 & 2',
    nameEn: '💪 Complete React Exercises - Parts 1 & 2',
    category: 'React.js',
    price: 15000,
    pricePromo: 8000,
    description: `💪 80+ exercices React pour devenir expert !

🎯 Entraînement intensif avec exercices progressifs et défis avancés.

✨ Partie 1 - Pratique Intensive (50+ exercices) :
• 🧩 Composants et props
• 🔄 State et hooks
• 📝 Formulaires contrôlés
• 📡 API calls et gestion async
• 🎨 Styling et animations
• 🧪 Testing de composants

✨ Partie 2 - Défis Avancés (30+ défis) :
• 🏗️ Architecture patterns (HOC, Render Props, Compound)
• 🗂️ State management complexe (Redux, Context)
• 🎭 Performance optimization challenges
• 🧪 Advanced testing patterns
• 🔒 Security patterns et authentification
• 📦 Custom hooks avancés

🎁 Avantages inclus :
• ✅ Support WhatsApp personnalisé 24/7
• 🔄 Mises à jour gratuites à vie
• 💬 Groupe d'entraide exercices
• 🎯 Correction personnalisée de vos solutions
• 💻 80+ exercices avec solutions détaillées
• 🏆 Certificat de réussite React

La pratique fait le maître - Devenez expert React ! 🏆`,
    descriptionEn: `💪 80+ React exercises to become an expert!

🎯 Intensive training with progressive exercises and advanced challenges.

✨ Part 1 - Intensive Practice (50+ exercises):
• 🧩 Components and props
• 🔄 State and hooks
• 📝 Controlled forms
• 📡 API calls and async management
• 🎨 Styling and animations
• 🧪 Component testing

✨ Part 2 - Advanced Challenges (30+ challenges):
• 🏗️ Architecture patterns (HOC, Render Props, Compound)
• 🗂️ Complex state management (Redux, Context)
• 🎭 Performance optimization challenges
• 🧪 Advanced testing patterns
• 🔒 Security patterns and authentication
• 📦 Advanced custom hooks

🎁 Included benefits:
• ✅ 24/7 personalized WhatsApp support
• 🔄 Free lifetime updates
• 💬 Exercise support group
• 🎯 Personalized correction of your solutions
• 💻 80+ exercises with detailed solutions
• 🏆 React achievement certificate

Practice makes perfect - Become a React expert! 🏆`,
  },
];

// Fonction pour générer un mot de passe aléatoire
function generatePassword() {
  return crypto.randomBytes(4).toString('hex').toUpperCase();
}

// Fonction pour générer un code de téléchargement unique
function generateDownloadCode() {
  return crypto.randomBytes(6).toString('hex').toUpperCase();
}

// Fonction pour retirer tous les emojis et caractères spéciaux d'une chaîne
function removeEmojis(text) {
  return text
    .replace(/[\u{1F000}-\u{1FFFF}]/gu, '')
    .replace(/[\u{2600}-\u{27BF}]/gu, '')
    .replace(/[\u{FE00}-\u{FE0F}]/gu, '')
    .replace(/[\u{E0020}-\u{E007F}]/gu, '')
    .replace(/[\u{200D}]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Fonction pour créer une page HTML de téléchargement avec protection
function createDownloadPage(ebookData, downloadLink, downloadCode, productId) {
  const htmlContent = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Téléchargement - ${removeEmojis(ebookData.name)}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: linear-gradient(135deg, #FA003F 0%, #C70032 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .container {
            background: white;
            border-radius: 24px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            max-width: 600px;
            width: 100%;
            padding: 40px;
        }
        .logo {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo h1 {
            color: #FA003F;
            font-size: 28px;
            font-weight: 800;
            margin-bottom: 10px;
        }
        .logo p {
            color: #666;
            font-size: 14px;
        }
        .product-info {
            background: linear-gradient(135deg, rgba(250, 0, 63, 0.08) 0%, rgba(199, 0, 50, 0.03) 100%);
            border-radius: 16px;
            padding: 20px;
            margin-bottom: 30px;
            border-left: 4px solid #FA003F;
        }
        .product-info h2 {
            color: #333;
            font-size: 20px;
            margin-bottom: 10px;
        }
        .product-info p {
            color: #666;
            font-size: 14px;
            line-height: 1.6;
        }
        .download-section {
            margin-bottom: 30px;
        }
        .download-section h3 {
            color: #333;
            font-size: 18px;
            margin-bottom: 15px;
        }
        .input-group {
            margin-bottom: 20px;
        }
        .input-group label {
            display: block;
            color: #555;
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 8px;
        }
        .input-group input {
            width: 100%;
            padding: 12px 16px;
            border: 2px solid #e0e0e0;
            border-radius: 12px;
            font-size: 16px;
            transition: all 0.3s ease;
        }
        .input-group input:focus {
            outline: none;
            border-color: #FA003F;
            box-shadow: 0 0 0 3px rgba(250, 0, 63, 0.1);
        }
        .btn {
            width: 100%;
            padding: 14px 24px;
            background: linear-gradient(135deg, #FA003F 0%, #C70032 100%);
            color: white;
            border: none;
            border-radius: 12px;
            font-size: 16px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 8px 24px rgba(250, 0, 63, 0.35);
        }
        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 32px rgba(250, 0, 63, 0.5);
        }
        .btn:active {
            transform: translateY(0);
        }
        .info-box {
            background: #f8f9fa;
            border-radius: 12px;
            padding: 16px;
            margin-top: 20px;
        }
        .info-box p {
            color: #666;
            font-size: 13px;
            line-height: 1.6;
            margin-bottom: 8px;
        }
        .info-box p:last-child {
            margin-bottom: 0;
        }
        .info-box strong {
            color: #333;
        }
        .error {
            background: #fee;
            color: #c00;
            padding: 12px 16px;
            border-radius: 8px;
            margin-bottom: 20px;
            font-size: 14px;
            display: none;
        }
        .success {
            background: #efe;
            color: #080;
            padding: 12px 16px;
            border-radius: 8px;
            margin-bottom: 20px;
            font-size: 14px;
            display: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">
            <h1>MarxGeek Academy</h1>
            <p>Plateforme de formation professionnelle</p>
        </div>

        <div class="product-info">
            <h2>${removeEmojis(ebookData.name)}</h2>
            <p>Merci pour votre achat ! Pour télécharger votre formation, veuillez entrer le code de téléchargement que vous avez reçu par email.</p>
        </div>

        <div class="error" id="error"></div>
        <div class="success" id="success"></div>

        <div class="download-section">
            <h3>Téléchargement sécurisé</h3>
            <div class="input-group">
                <label for="downloadCode">Code de téléchargement</label>
                <input
                    type="text"
                    id="downloadCode"
                    placeholder="Entrez le code reçu par email"
                    autocomplete="off"
                    style="text-transform: uppercase;"
                >
            </div>
            <button class="btn" onclick="verifyAndDownload()">Télécharger la formation</button>
        </div>

        <div class="info-box">
            <p><strong>Besoin d'aide ?</strong></p>
            <p>📧 Email: mgangbala610@gmail.com</p>
            <p>💬 WhatsApp: +229 01 69 81 13</p>
            <p><strong>Note:</strong> Le code de téléchargement vous a été envoyé par email lors de votre achat.</p>
        </div>
    </div>

    <script>
        const CORRECT_CODE = '${downloadCode}';
        const DOWNLOAD_LINK = '${downloadLink}';

        function verifyAndDownload() {
            const input = document.getElementById('downloadCode');
            const enteredCode = input.value.toUpperCase().trim();
            const errorDiv = document.getElementById('error');
            const successDiv = document.getElementById('success');

            // Reset messages
            errorDiv.style.display = 'none';
            successDiv.style.display = 'none';

            if (!enteredCode) {
                errorDiv.textContent = 'Veuillez entrer le code de téléchargement.';
                errorDiv.style.display = 'block';
                return;
            }

            if (enteredCode === CORRECT_CODE) {
                successDiv.textContent = 'Code correct ! Téléchargement en cours...';
                successDiv.style.display = 'block';

                // Télécharger le fichier
                setTimeout(() => {
                    window.location.href = DOWNLOAD_LINK;
                }, 1000);
            } else {
                errorDiv.textContent = 'Code incorrect. Veuillez vérifier le code reçu par email ou contactez le support.';
                errorDiv.style.display = 'block';
            }
        }

        // Permettre la validation avec Enter
        document.getElementById('downloadCode').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                verifyAndDownload();
            }
        });
    </script>
</body>
</html>`;

  return htmlContent;
}

// Fonction pour créer un PDF preview avec lien vers la page de téléchargement
async function createPreviewPDF(ebookData, outputPath, password, downloadPageUrl) {
  try {
    const pdfDoc = await PDFDocument.create();
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Page 1 - Page de garde
    const coverPage = pdfDoc.addPage([595, 842]);
    const { width, height } = coverPage.getSize();

    // Fond dégradé
    coverPage.drawRectangle({
      x: 0,
      y: height * 0.5,
      width: width,
      height: height * 0.5,
      color: rgb(0.98, 0, 0.25),
    });

    coverPage.drawRectangle({
      x: 0,
      y: 0,
      width: width,
      height: height * 0.5,
      color: rgb(0.78, 0, 0.20),
    });

    // Titre
    const titleText = removeEmojis(ebookData.name);
    coverPage.drawText(titleText, {
      x: 50,
      y: height - 150,
      size: 28,
      font: helveticaBold,
      color: rgb(1, 1, 1),
      maxWidth: width - 100,
    });

    coverPage.drawText('Formation Premium MarxGeek', {
      x: 50,
      y: height - 200,
      size: 16,
      font: helveticaFont,
      color: rgb(1, 1, 1),
    });

    // Badge
    coverPage.drawRectangle({
      x: 50,
      y: height - 250,
      width: 150,
      height: 40,
      color: rgb(1, 1, 1),
      borderColor: rgb(0.98, 0, 0.25),
      borderWidth: 2,
    });

    coverPage.drawText('APERCU', {
      x: 85,
      y: height - 238,
      size: 18,
      font: helveticaBold,
      color: rgb(0.98, 0, 0.25),
    });

    coverPage.drawText('© MarxGeek.com - Tous droits reserves', {
      x: width / 2 - 100,
      y: 50,
      size: 10,
      font: helveticaFont,
      color: rgb(1, 1, 1),
    });

    // Page 2 - Instructions de téléchargement
    const downloadPage = pdfDoc.addPage([595, 842]);

    downloadPage.drawText('Telechargement du fichier complet', {
      x: 50,
      y: height - 100,
      size: 24,
      font: helveticaBold,
      color: rgb(0.98, 0, 0.25),
    });

    const instructionLines = [
      'Merci pour votre achat !',
      '',
      'Pour acceder au fichier complet, rendez-vous sur :',
      '',
      downloadPageUrl,
      '',
      'Instructions :',
      '1. Cliquez sur le lien ci-dessus',
      '2. Entrez le code de telechargement recu par email',
      '3. Telechargez votre formation complete',
      '',
      'Code de telechargement : Envoye par email',
      '',
      'Support :',
      'Email : mgangbala610@gmail.com',
      'WhatsApp : +229 01 69 81 64 13',
    ];

    let yPos = height - 160;
    instructionLines.forEach((line) => {
      const fontSize = line.startsWith('http') ? 10 : (line.match(/^[0-9]\./) || line === 'Support :' || line === 'Instructions :') ? 12 : 11;
      const font = (line === 'Support :' || line === 'Instructions :' || line.startsWith('Code de')) ? helveticaBold : helveticaFont;

      downloadPage.drawText(removeEmojis(line), {
        x: 50,
        y: yPos,
        size: fontSize,
        font: font,
        color: line.startsWith('http') ? rgb(0, 0.4, 0.8) : rgb(0, 0, 0),
      });
      yPos -= fontSize === 10 ? 15 : fontSize === 12 ? 20 : 18;
    });

    downloadPage.drawText('© MarxGeek.com - Formation Premium', {
      x: width / 2 - 80,
      y: 50,
      size: 10,
      font: helveticaFont,
      color: rgb(0.5, 0.5, 0.5),
    });

    // Sauvegarder
    const pdfBytes = await pdfDoc.save();
    const tempOutputPath = outputPath.replace('.pdf', '_temp.pdf');
    fs.writeFileSync(tempOutputPath, pdfBytes);

    // Crypter
    try {
      execSync(`qpdf --encrypt "${password}" "${password}" 256 -- "${tempOutputPath}" "${outputPath}"`, {
        stdio: 'pipe'
      });
      fs.unlinkSync(tempOutputPath);
      console.log(`✅ PDF preview créé et crypté : ${path.basename(outputPath)}`);
      console.log(`   🔐 Mot de passe : ${password}`);
      return true;
    } catch (encryptError) {
      console.error(`❌ Erreur cryptage :`, encryptError.message);
      if (fs.existsSync(tempOutputPath)) {
        fs.renameSync(tempOutputPath, outputPath);
      }
      return true;
    }
  } catch (error) {
    console.error(`❌ Erreur création PDF preview :`, error.message);
    return false;
  }
}

// Fonction pour copier les fichiers
function copyFile(source, destination) {
  try {
    const destDir = path.dirname(destination);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    fs.copyFileSync(source, destination);
    console.log(`✅ Fichier copié : ${path.basename(destination)}`);
    return true;
  } catch (error) {
    console.error(`❌ Erreur copie ${source} :`, error.message);
    return false;
  }
}

// Fonction principale d'import
async function importEbooks() {
  try {
    console.log('🚀 Démarrage de l\'import des ebooks V2...\n');

    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connecté à MongoDB\n');

    const ebookSourceDir = path.join(__dirname, '../../ebook');
    const uploadsDir = path.join(__dirname, '../uploads');
    const ebooksDir = path.join(uploadsDir, 'ebooks');
    const previewsDir = path.join(uploadsDir, 'ebook-previews');
    const coversDir = path.join(uploadsDir, 'covers');
    const downloadPagesDir = path.join(uploadsDir, 'download-pages');

    [ebooksDir, previewsDir, coversDir, downloadPagesDir].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });

    let importedCount = 0;
    const importResults = [];

    for (const ebookData of ebooksData) {
      console.log(`\n📚 Traitement : ${ebookData.name}`);
      console.log('─'.repeat(60));

      // Vérifier si la catégorie existe
      const category = await Category.findOne({ nameFr: ebookData.category });
      if (!category) {
        console.warn(`⚠️  Catégorie "${ebookData.category}" non trouvée, skip...`);
        continue;
      }
      console.log(`✅ Catégorie : ${category.nameFr}`);

      // Gérer fichiers multiples (parties 1 & 2)
      const fileNames = Array.isArray(ebookData.fileName) ? ebookData.fileName : [ebookData.fileName];
      const allEbookFiles = [];

      for (const fileName of fileNames) {
        const sourcePdfPath = path.join(ebookSourceDir, fileName);
        if (!fs.existsSync(sourcePdfPath)) {
          console.warn(`⚠️  Fichier PDF non trouvé : ${fileName}`);
          continue;
        }

        const ebookFileName = `ebook_${Date.now()}_${Math.random().toString(36).substring(7)}_${fileName}`;
        const destPdfPath = path.join(ebooksDir, ebookFileName);

        if (copyFile(sourcePdfPath, destPdfPath)) {
          allEbookFiles.push(`/uploads/ebooks/${ebookFileName}`);
        }
      }

      if (allEbookFiles.length === 0) {
        console.warn(`⚠️  Aucun fichier PDF copié, skip...`);
        continue;
      }

      // Copier la couverture
      const sourceCoverPath = path.join(ebookSourceDir, ebookData.coverImage);
      let coverPath = null;
      if (fs.existsSync(sourceCoverPath)) {
        const coverFileName = `cover_${Date.now()}_${ebookData.coverImage}`;
        const destCoverPath = path.join(coversDir, coverFileName);
        if (copyFile(sourceCoverPath, destCoverPath)) {
          coverPath = `/uploads/covers/${coverFileName}`;
        }
      }

      // Générer les codes
      const password = generatePassword();
      const downloadCode = generateDownloadCode();
      console.log(`🔑 Mot de passe PDF : ${password}`);
      console.log(`🔐 Code téléchargement : ${downloadCode}`);

      // Créer un produit temporaire pour avoir l'ID
      const tempProduct = new Product({
        category: category.nameFr,
        name: ebookData.name,
        nameEn: ebookData.nameEn,
        description: ebookData.description,
        descriptionEn: ebookData.descriptionEn,
        price: ebookData.price,
        pricePromo: ebookData.pricePromo,
        photos: coverPath ? [coverPath] : [],
        ebookFile: allEbookFiles,
        ebookPassword: password,
        productStatus: 'active',
        state: 'available',
        productType: 'standard',
        isSubscriptionBased: false,
      });

      const productId = tempProduct._id.toString();

      // Créer la page HTML de téléchargement
      const downloadPageFileName = `download_${productId}.html`;
      const downloadPagePath = path.join(downloadPagesDir, downloadPageFileName);
      const downloadPageUrl = `${process.env.API_URL}uploads/download-pages/${downloadPageFileName}`;
      const downloadLink = `${process.env.API_URL2}${allEbookFiles[0]}`; // Premier fichier principal

      const htmlContent = createDownloadPage(ebookData, downloadLink, downloadCode, productId);
      fs.writeFileSync(downloadPagePath, htmlContent);
      console.log(`✅ Page de téléchargement créée : ${downloadPageFileName}`);

      // Créer le PDF preview
      const previewFileName = `preview_${Date.now()}_${fileNames[0]}`;
      const destPreviewPath = path.join(previewsDir, previewFileName);

      const previewCreated = await createPreviewPDF(
        ebookData,
        destPreviewPath,
        password,
        downloadPageUrl
      );

      if (!previewCreated) {
        console.warn(`⚠️  Échec création preview, skip...`);
        continue;
      }

      // Mettre à jour le produit avec toutes les infos
      tempProduct.ebookPreview = `/uploads/ebook-previews/${previewFileName}`;
      tempProduct.downloadLink = downloadPageUrl;
      tempProduct.downloadCode = downloadCode;
      tempProduct.saleDocument = [`/uploads/ebook-previews/${previewFileName}`];

      await tempProduct.save();
      console.log(`✅ Produit créé : ${tempProduct._id}`);

      importResults.push({
        name: ebookData.name,
        category: category.nameFr,
        price: ebookData.price,
        pricePromo: ebookData.pricePromo,
        pdfPassword: password,
        downloadCode: downloadCode,
        downloadUrl: downloadPageUrl,
        files: allEbookFiles.length,
      });

      importedCount++;
    }

    // Mettre à jour les compteurs de catégories
    const categories = await Category.find({ isActive: true });
    for (const cat of categories) {
      const totalProducts = await Product.countDocuments({
        category: cat.nameFr,
        isDeleted: false
      });
      cat.totalProduct = totalProducts;
      await cat.save();
    }

    console.log('\n' + '='.repeat(60));
    console.log(`🎉 Import terminé !`);
    console.log(`   ${importedCount} ebooks importés avec succès\n`);

    console.log('📋 RÉSUMÉ DES IMPORTS :');
    console.log('='.repeat(60));
    importResults.forEach((result, index) => {
      console.log(`\n${index + 1}. ${result.name}`);
      console.log(`   Catégorie : ${result.category}`);
      console.log(`   Prix : ${result.price} FCFA (Promo: ${result.pricePromo} FCFA)`);
      console.log(`   Fichiers : ${result.files} PDF(s)`);
      console.log(`   🔐 Mot de passe PDF : ${result.pdfPassword}`);
      console.log(`   🔑 Code téléchargement : ${result.downloadCode}`);
      console.log(`   🔗 URL téléchargement : ${result.downloadUrl}`);
    });

    console.log('\n' + '='.repeat(60));

  } catch (error) {
    console.error('\n❌ Erreur import :', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ Déconnexion MongoDB');
  }
}

// Exécuter le script
importEbooks();
