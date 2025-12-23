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

// Mapping des ebooks avec leurs métadonnées
const ebooksData = [
  {
    fileName: '0-Guide-Demarrage.pdf',
    coverImage: '0-Guide-Demarrage.png',
    name: '📘 Guide de Démarrage - Programmation Web',
    nameEn: '📘 Getting Started Guide - Web Programming',
    category: 'Formation',
    price: 5000,
    pricePromo: 2500,
    description: `🚀 Commencez votre aventure dans la programmation web !

📖 Ce guide complet vous accompagne pas à pas dans vos premiers pas en développement web.

✨ Contenu du guide :
• 🎯 Introduction aux concepts fondamentaux
• 💻 Configuration de votre environnement de développement
• 🛠️ Outils essentiels pour débuter
• 📚 Ressources et bonnes pratiques
• 🎓 Parcours d'apprentissage recommandé

🎁 Bonus inclus :
• ✅ Checklist de démarrage
• 🔗 Liens vers des ressources gratuites
• 💡 Conseils de professionnels

Parfait pour les débutants qui souhaitent construire des bases solides ! 🌟`,
    descriptionEn: `🚀 Start your web programming journey!

📖 This comprehensive guide takes you step by step through your first steps in web development.

✨ Guide contents:
• 🎯 Introduction to fundamental concepts
• 💻 Setting up your development environment
• 🛠️ Essential tools to get started
• 📚 Resources and best practices
• 🎓 Recommended learning path

🎁 Included bonuses:
• ✅ Startup checklist
• 🔗 Links to free resources
• 💡 Professional advice

Perfect for beginners who want to build a solid foundation! 🌟`,
    advantage: [
      '✅ Accès immédiat après achat',
      '📥 Format PDF téléchargeable',
      '🔄 Mises à jour gratuites',
      '💯 Garantie satisfaction 14 jours',
      '🎯 Parfait pour débutants',
    ],
    advantageEn: [
      '✅ Immediate access after purchase',
      '📥 Downloadable PDF format',
      '🔄 Free updates',
      '💯 14-day satisfaction guarantee',
      '🎯 Perfect for beginners',
    ],
  },
  {
    fileName: 'Formation-HTML-Complete.pdf',
    coverImage: 'Formation-HTML-Complete.png',
    name: '🌐 Formation HTML Complète - Maîtrisez les Fondamentaux',
    nameEn: '🌐 Complete HTML Training - Master the Fundamentals',
    category: 'Formation',
    price: 8000,
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

🎁 Inclus dans la formation :
• ✅ 50+ exercices pratiques
• 💻 Code source des exemples
• 📋 Antisèche HTML5
• 🎯 Mini-projets guidés

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

🎁 Included in the training:
• ✅ 50+ practical exercises
• 💻 Example source code
• 📋 HTML5 cheat sheet
• 🎯 Guided mini-projects

Ideal for creating solid and professional web structures! 💪`,
    advantage: [
      '📚 Formation complète et structurée',
      '🎯 50+ exercices pratiques',
      '💻 Code source inclus',
      '📋 Antisèche PDF',
      '🔄 Support à vie',
    ],
    advantageEn: [
      '📚 Complete and structured training',
      '🎯 50+ practical exercises',
      '💻 Source code included',
      '📋 PDF cheat sheet',
      '🔄 Lifetime support',
    ],
  },
  {
    fileName: 'Formation-CSS-ENRICHIE.pdf',
    coverImage: 'Formation-CSS-ENRICHIE.png',
    name: '🎨 Formation CSS Enrichie - Design Moderne',
    nameEn: '🎨 Advanced CSS Training - Modern Design',
    category: 'Formation',
    price: 10000,
    pricePromo: 5000,
    description: `🎨 Créez des designs époustouflants avec CSS3 !

🚀 Formation avancée pour maîtriser le style et l'animation CSS.

✨ Au programme :
• 🎯 Sélecteurs CSS avancés
• 🌈 Couleurs, dégradés et ombres
• 📐 Flexbox et Grid Layout
• ✨ Animations et transitions
• 🎭 Transformations 3D
• 📱 Design responsive avancé

🎁 Bonus premium :
• ✅ 100+ snippets CSS prêts à l'emploi
• 🎨 Palette de couleurs professionnelle
• 💻 Projets complets avec code
• 🔥 Techniques des pros

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

🎁 Premium bonuses:
• ✅ 100+ ready-to-use CSS snippets
• 🎨 Professional color palette
• 💻 Complete projects with code
• 🔥 Pro techniques

Transform your designs into interactive works of art! 🌟`,
    advantage: [
      '🎨 100+ snippets CSS',
      '✨ Animations avancées',
      '📱 Responsive design',
      '💻 Projets complets',
      '🎯 Techniques professionnelles',
    ],
    advantageEn: [
      '🎨 100+ CSS snippets',
      '✨ Advanced animations',
      '📱 Responsive design',
      '💻 Complete projects',
      '🎯 Professional techniques',
    ],
  },
  {
    fileName: 'Formation-JavaScript-ENRICHIE.pdf',
    coverImage: 'Formation-JavaScript-ENRICHIE.png',
    name: '⚡ Formation JavaScript Enrichie - Programmation Interactive',
    nameEn: '⚡ Advanced JavaScript Training - Interactive Programming',
    category: 'Formation',
    price: 12000,
    pricePromo: 6000,
    description: `⚡ Maîtrisez JavaScript et créez des applications interactives !

🎓 Formation complète du débutant au niveau avancé.

✨ Contenu enrichi :
• 🎯 Fondamentaux JavaScript ES6+
• 🔧 Manipulation du DOM
• 📡 AJAX et Fetch API
• 🎨 Programmation orientée objet
• 🔄 Programmation asynchrone
• 🛠️ Modules et outils modernes

🎁 Ressources incluses :
• ✅ 150+ exercices progressifs
• 💻 10 projets complets
• 📚 Guide des bonnes pratiques
• 🎯 Défis de code

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

🎁 Included resources:
• ✅ 150+ progressive exercises
• 💻 10 complete projects
• 📚 Best practices guide
• 🎯 Code challenges

Become an accomplished JavaScript developer! 🚀`,
    advantage: [
      '⚡ 150+ exercices JavaScript',
      '💻 10 projets complets',
      '📚 ES6+ moderne',
      '🎯 Async/Await maîtrisé',
      '🔥 Techniques avancées',
    ],
    advantageEn: [
      '⚡ 150+ JavaScript exercises',
      '💻 10 complete projects',
      '📚 Modern ES6+',
      '🎯 Async/Await mastered',
      '🔥 Advanced techniques',
    ],
  },
  {
    fileName: 'Integration-HTML-CSS-JS.pdf',
    coverImage: 'Integration-HTML-CSS-JS.png',
    name: '🔗 Intégration HTML-CSS-JS - Projets Web Complets',
    nameEn: '🔗 HTML-CSS-JS Integration - Complete Web Projects',
    category: 'Formation',
    price: 15000,
    pricePromo: 7500,
    description: `🔗 Intégrez HTML, CSS et JavaScript pour créer des sites web complets !

🎯 Apprenez à combiner les trois piliers du développement web.

✨ Projets inclus :
• 🌐 Portfolio professionnel
• 🛒 E-commerce simple
• 📱 Application météo
• 🎮 Mini-jeu interactif
• 📝 Todo list avancée
• 🎨 Galerie d'images dynamique

🎁 Bonus exclusifs :
• ✅ Code source complet
• 🎨 Templates prêts à l'emploi
• 📚 Guide d'intégration
• 🔧 Outils de développement

De la conception à la mise en ligne ! 🚀`,
    descriptionEn: `🔗 Integrate HTML, CSS and JavaScript to create complete websites!

🎯 Learn to combine the three pillars of web development.

✨ Included projects:
• 🌐 Professional portfolio
• 🛒 Simple e-commerce
• 📱 Weather application
• 🎮 Interactive mini-game
• 📝 Advanced todo list
• 🎨 Dynamic image gallery

🎁 Exclusive bonuses:
• ✅ Complete source code
• 🎨 Ready-to-use templates
• 📚 Integration guide
• 🔧 Development tools

From design to deployment! 🚀`,
    advantage: [
      '🔗 6 projets complets',
      '💻 Code source inclus',
      '🎨 Templates premium',
      '📚 Guide étape par étape',
      '🚀 Déploiement inclus',
    ],
    advantageEn: [
      '🔗 6 complete projects',
      '💻 Source code included',
      '🎨 Premium templates',
      '📚 Step-by-step guide',
      '🚀 Deployment included',
    ],
  },
  {
    fileName: '10-Projets-Pratiques-COMPLET.pdf',
    coverImage: '10-Projets-Pratiques-COMPLET.png',
    name: '🎯 10 Projets Pratiques - Portfolio Complet',
    nameEn: '🎯 10 Practical Projects - Complete Portfolio',
    category: 'Formation',
    price: 18000,
    pricePromo: 9000,
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

🎁 Pack complet :
• ✅ Code source commenté
• 🎨 Designs Figma inclus
• 📚 Documentation complète
• 🎥 Vidéos explicatives

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

🎁 Complete pack:
• ✅ Commented source code
• 🎨 Figma designs included
• 📚 Complete documentation
• 🎥 Explanatory videos

Your professional portfolio ready to use! 💼`,
    advantage: [
      '🎯 10 projets professionnels',
      '💻 Code source complet',
      '🎨 Designs Figma',
      '🎥 Vidéos tutoriels',
      '💼 Portfolio employable',
    ],
    advantageEn: [
      '🎯 10 professional projects',
      '💻 Complete source code',
      '🎨 Figma designs',
      '🎥 Tutorial videos',
      '💼 Employable portfolio',
    ],
  },
  {
    fileName: 'React_Ebook_Debutant_Partie1_v2.pdf',
    coverImage: 'React_Ebook_Debutant_Partie1_v2.png',
    name: '⚛️ React Débutant - Partie 1 & 2 - Les Fondamentaux',
    nameEn: '⚛️ React Beginner - Part 1 & 2 - The Fundamentals',
    category: 'Formation',
    price: 12000,
    pricePromo: 5000,
    description: `⚛️ Démarrez avec React et créez vos premières applications !

🎓 Formation complète pour maîtriser les bases de React.

✨ Programme Partie 1 :
• 🎯 Introduction à React
• 🧩 Composants et JSX
• 📦 Props et State
• 🔄 Cycle de vie des composants
• 🎨 Styling dans React
• 🛠️ Create React App

🎁 Ressources incluses :
• ✅ 30+ exercices pratiques
• 💻 5 projets guidés
• 📚 Antisèche React
• 🎯 Quiz d'évaluation

Votre première étape vers la maîtrise de React ! 🚀`,
    descriptionEn: `⚛️ Get started with React and create your first applications!

🎓 Complete training to master React basics.

✨ Part 1 program:
• 🎯 Introduction to React
• 🧩 Components and JSX
• 📦 Props and State
• 🔄 Component lifecycle
• 🎨 Styling in React
• 🛠️ Create React App

🎁 Included resources:
• ✅ 30+ practical exercises
• 💻 5 guided projects
• 📚 React cheat sheet
• 🎯 Assessment quiz

Your first step to mastering React! 🚀`,
    advantage: [
      '⚛️ Fondamentaux React',
      '💻 5 projets guidés',
      '📚 30+ exercices',
      '🎯 Quiz inclus',
      '🔄 Support communauté',
    ],
    advantageEn: [
      '⚛️ React fundamentals',
      '💻 5 guided projects',
      '📚 30+ exercises',
      '🎯 Quiz included',
      '🔄 Community support',
    ],
  },
  {
    fileName: 'React_Ebook_Partie2.pdf',
    coverImage: 'React_Ebook_Partie2.png',
    name: '⚛️ React Débutant - Partie 2 - Concepts Avancés',
    nameEn: '⚛️ React Beginner - Part 2 - Advanced Concepts',
    category: 'Formation',
    price: 12000,
    pricePromo: 6000,
    description: `⚛️ Approfondissez vos connaissances React !

🚀 Suite logique de la Partie 1 pour aller plus loin.

✨ Programme Partie 2 :
• 🔄 Hooks (useState, useEffect)
• 🎣 Hooks personnalisés
• 📡 API et fetch de données
• 🗂️ Gestion d'état avancée
• 🧭 React Router
• 📝 Formulaires et validation

🎁 Contenu premium :
• ✅ 40+ exercices avancés
• 💻 3 applications complètes
• 📚 Guide des Hooks
• 🔥 Best practices

Passez au niveau supérieur avec React ! ⚡`,
    descriptionEn: `⚛️ Deepen your React knowledge!

🚀 Logical continuation of Part 1 to go further.

✨ Part 2 program:
• 🔄 Hooks (useState, useEffect)
• 🎣 Custom Hooks
• 📡 API and data fetching
• 🗂️ Advanced state management
• 🧭 React Router
• 📝 Forms and validation

🎁 Premium content:
• ✅ 40+ advanced exercises
• 💻 3 complete applications
• 📚 Hooks guide
• 🔥 Best practices

Level up with React! ⚡`,
    advantage: [
      '🎣 Hooks maîtrisés',
      '💻 3 apps complètes',
      '📡 API integration',
      '🧭 React Router',
      '📚 40+ exercices',
    ],
    advantageEn: [
      '🎣 Hooks mastered',
      '💻 3 complete apps',
      '📡 API integration',
      '🧭 React Router',
      '📚 40+ exercises',
    ],
  },
  {
    fileName: 'React_Intermediaire_Partie1.pdf',
    coverImage: 'React_Intermediaire_Partie1.png',
    name: '⚛️ React Intermédiaire - Partie 1 - Architecture Avancée',
    nameEn: '⚛️ React Intermediate - Part 1 - Advanced Architecture',
    category: 'Formation',
    price: 15000,
    pricePromo: 7500,
    description: `⚛️ Architecturez des applications React professionnelles !

🎯 Pour développeurs React souhaitant aller plus loin.

✨ Programme avancé :
• 🏗️ Architecture d'application
• 🗂️ Context API et Redux
• 🎭 Performance et optimisation
• 🧪 Testing avec Jest/RTL
• 🔒 Sécurité et authentification
• 📦 Code splitting

🎁 Outils pro inclus :
• ✅ Templates d'architecture
• 💻 Projet e-commerce complet
• 📚 Guide des patterns
• 🔧 Outils de debugging

Créez des apps React scalables ! 🚀`,
    descriptionEn: `⚛️ Architect professional React applications!

🎯 For React developers wanting to go further.

✨ Advanced program:
• 🏗️ Application architecture
• 🗂️ Context API and Redux
• 🎭 Performance and optimization
• 🧪 Testing with Jest/RTL
• 🔒 Security and authentication
• 📦 Code splitting

🎁 Pro tools included:
• ✅ Architecture templates
• 💻 Complete e-commerce project
• 📚 Patterns guide
• 🔧 Debugging tools

Create scalable React apps! 🚀`,
    advantage: [
      '🏗️ Architecture pro',
      '🗂️ Redux maîtrisé',
      '🧪 Testing complet',
      '💻 E-commerce projet',
      '📚 Design patterns',
    ],
    advantageEn: [
      '🏗️ Pro architecture',
      '🗂️ Redux mastered',
      '🧪 Complete testing',
      '💻 E-commerce project',
      '📚 Design patterns',
    ],
  },
  {
    fileName: 'React_Intermediaire_Partie2.pdf',
    coverImage: 'React_Intermediaire_Partie2.png',
    name: '⚛️ React Intermédiaire - Partie 2 - Production Ready',
    nameEn: '⚛️ React Intermediate - Part 2 - Production Ready',
    category: 'Formation',
    price: 15000,
    pricePromo: 7500,
    description: `⚛️ Déployez des applications React en production !

🚀 De la conception au déploiement professionnel.

✨ Contenu production :
• 🔧 Build et optimisation
• 🌐 SEO et SSR avec Next.js
• 📊 Monitoring et analytics
• 🔄 CI/CD et déploiement
• 🐛 Error tracking
• 📈 Performance monitoring

🎁 Stack complète :
• ✅ Pipeline de déploiement
• 💻 Configuration Vercel/Netlify
• 📚 Guide de production
• 🎯 Checklist qualité

Applications prêtes pour la production ! 💼`,
    descriptionEn: `⚛️ Deploy React applications in production!

🚀 From design to professional deployment.

✨ Production content:
• 🔧 Build and optimization
• 🌐 SEO and SSR with Next.js
• 📊 Monitoring and analytics
• 🔄 CI/CD and deployment
• 🐛 Error tracking
• 📈 Performance monitoring

🎁 Complete stack:
• ✅ Deployment pipeline
• 💻 Vercel/Netlify configuration
• 📚 Production guide
• 🎯 Quality checklist

Production-ready applications! 💼`,
    advantage: [
      '🚀 Déploiement maîtrisé',
      '🌐 SSR Next.js',
      '📊 Monitoring inclus',
      '🔄 CI/CD pipeline',
      '💼 Production ready',
    ],
    advantageEn: [
      '🚀 Deployment mastered',
      '🌐 SSR Next.js',
      '📊 Monitoring included',
      '🔄 CI/CD pipeline',
      '💼 Production ready',
    ],
  },
  {
    fileName: 'React_Exercices_Partie1.pdf',
    coverImage: 'React_Exercices_Partie1.png',
    name: '💪 React Exercices - Partie 1 - Pratique Intensive',
    nameEn: '💪 React Exercises - Part 1 - Intensive Practice',
    category: 'Formation',
    price: 8000,
    pricePromo: 4000,
    description: `💪 Entraînez-vous avec 50+ exercices React !

🎯 Pratiquez et solidifiez vos compétences React.

✨ Types d'exercices :
• 🧩 Composants et props
• 🔄 State et hooks
• 📝 Formulaires
• 📡 API calls
• 🎨 Styling
• 🧪 Testing

🎁 Format pratique :
• ✅ 50+ exercices corrigés
• 💻 Solutions détaillées
• 📊 Niveau progressif
• 🎯 Auto-évaluation

La pratique fait le maître ! 🏆`,
    descriptionEn: `💪 Practice with 50+ React exercises!

🎯 Practice and strengthen your React skills.

✨ Exercise types:
• 🧩 Components and props
• 🔄 State and hooks
• 📝 Forms
• 📡 API calls
• 🎨 Styling
• 🧪 Testing

🎁 Practical format:
• ✅ 50+ corrected exercises
• 💻 Detailed solutions
• 📊 Progressive level
• 🎯 Self-assessment

Practice makes perfect! 🏆`,
    advantage: [
      '💪 50+ exercices',
      '✅ Solutions détaillées',
      '📊 Progression mesurée',
      '🎯 Auto-évaluation',
      '🏆 Certifications',
    ],
    advantageEn: [
      '💪 50+ exercises',
      '✅ Detailed solutions',
      '📊 Measured progress',
      '🎯 Self-assessment',
      '🏆 Certifications',
    ],
  },
  {
    fileName: 'React_Exercices_Partie2_Complete.pdf',
    coverImage: 'React_Exercices_Partie2.png',
    name: '💪 React Exercices - Partie 2 - Défis Avancés',
    nameEn: '💪 React Exercises - Part 2 - Advanced Challenges',
    category: 'Formation',
    price: 10000,
    pricePromo: 5000,
    description: `💪 Relevez des défis React de niveau avancé !

🚀 Exercices complexes pour devenir expert.

✨ Défis inclus :
• 🏗️ Architecture patterns
• 🗂️ State management
• 🎭 Performance optimization
• 🧪 Advanced testing
• 🔒 Security patterns
• 📦 Custom hooks

🎁 Ressources pro :
• ✅ 30+ défis avancés
• 💻 Solutions optimisées
• 📚 Explications détaillées
• 🏆 Certificat de réussite

Devenez un expert React reconnu ! 🌟`,
    descriptionEn: `💪 Take on advanced React challenges!

🚀 Complex exercises to become an expert.

✨ Included challenges:
• 🏗️ Architecture patterns
• 🗂️ State management
• 🎭 Performance optimization
• 🧪 Advanced testing
• 🔒 Security patterns
• 📦 Custom hooks

🎁 Pro resources:
• ✅ 30+ advanced challenges
• 💻 Optimized solutions
• 📚 Detailed explanations
• 🏆 Certificate of achievement

Become a recognized React expert! 🌟`,
    advantage: [
      '🚀 30+ défis avancés',
      '💻 Solutions optimisées',
      '🏗️ Patterns avancés',
      '🏆 Certificat expert',
      '🌟 Niveau professionnel',
    ],
    advantageEn: [
      '🚀 30+ advanced challenges',
      '💻 Optimized solutions',
      '🏗️ Advanced patterns',
      '🏆 Expert certificate',
      '🌟 Professional level',
    ],
  },
];

// Fonction pour générer un mot de passe aléatoire
function generatePassword() {
  return crypto.randomBytes(4).toString('hex').toUpperCase();
}

// Fonction pour retirer tous les emojis et caractères spéciaux d'une chaîne
function removeEmojis(text) {
  // Retire tous les emojis, modificateurs de variation, et autres caractères Unicode problématiques
  return text
    .replace(/[\u{1F000}-\u{1FFFF}]/gu, '') // Emojis et symboles
    .replace(/[\u{2600}-\u{27BF}]/gu, '') // Symboles divers
    .replace(/[\u{FE00}-\u{FE0F}]/gu, '') // Sélecteurs de variation
    .replace(/[\u{E0020}-\u{E007F}]/gu, '') // Tags
    .replace(/[\u{200D}]/gu, '') // Zero Width Joiner
    .replace(/\s+/g, ' ') // Normaliser les espaces
    .trim();
}

// Fonction pour créer un PDF preview avec page de garde et lien de téléchargement
async function createPreviewPDF(ebookData, outputPath, password, downloadLink) {
  try {
    // Créer un nouveau document PDF
    const pdfDoc = await PDFDocument.create();

    // Chargement des polices
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Page 1 - Page de garde (couverture)
    const coverPage = pdfDoc.addPage([595, 842]); // A4 size
    const { width, height } = coverPage.getSize();

    // Fond dégradé simulé avec rectangles
    coverPage.drawRectangle({
      x: 0,
      y: height * 0.5,
      width: width,
      height: height * 0.5,
      color: rgb(0.98, 0, 0.25), // #FA003F
    });

    coverPage.drawRectangle({
      x: 0,
      y: 0,
      width: width,
      height: height * 0.5,
      color: rgb(0.78, 0, 0.20), // #C70032
    });

    // Titre (sans emojis)
    const titleText = removeEmojis(ebookData.name);
    coverPage.drawText(titleText, {
      x: 50,
      y: height - 150,
      size: 28,
      font: helveticaBold,
      color: rgb(1, 1, 1),
      maxWidth: width - 100,
    });

    // Sous-titre
    coverPage.drawText('Formation Premium MarxGeek Academy', {
      x: 50,
      y: height - 200,
      size: 16,
      font: helveticaFont,
      color: rgb(1, 1, 1),
    });

    // Badge "Preview"
    coverPage.drawRectangle({
      x: 50,
      y: height - 250,
      width: 150,
      height: 40,
      color: rgb(1, 1, 1),
      borderColor: rgb(0.98, 0, 0.25),
      borderWidth: 2,
    });

    coverPage.drawText('APERÇU', {
      x: 85,
      y: height - 238,
      size: 18,
      font: helveticaBold,
      color: rgb(0.98, 0, 0.25),
    });

    // Footer
    coverPage.drawText('© MarxGeek.com - Tous droits réservés', {
      x: width / 2 - 100,
      y: 50,
      size: 10,
      font: helveticaFont,
      color: rgb(1, 1, 1),
    });

    // Page 2 - Lien de téléchargement
    const downloadPage = pdfDoc.addPage([595, 842]);

    // Titre
    downloadPage.drawText('Téléchargement du fichier complet', {
      x: 50,
      y: height - 100,
      size: 24,
      font: helveticaBold,
      color: rgb(0.98, 0, 0.25),
    });

    // Instruction
    const instructionText = 'Merci pour votre achat ! Pour accéder au fichier complet,\nveuillez cliquer sur le lien ci-dessous :';
    const lines = instructionText.split('\n');
    lines.forEach((line, index) => {
      downloadPage.drawText(line, {
        x: 50,
        y: height - 160 - (index * 25),
        size: 14,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });
    });

    // Lien de téléchargement
    downloadPage.drawRectangle({
      x: 50,
      y: height - 250,
      width: width - 100,
      height: 60,
      color: rgb(0.98, 0.98, 0.98),
      borderColor: rgb(0.98, 0, 0.25),
      borderWidth: 2,
    });

    downloadPage.drawText('Lien de telechargement :', {
      x: 60,
      y: height - 230,
      size: 12,
      font: helveticaBold,
      color: rgb(0, 0, 0),
    });

    downloadPage.drawText(removeEmojis(downloadLink), {
      x: 60,
      y: height - 255,
      size: 11,
      font: helveticaFont,
      color: rgb(0, 0.4, 0.8),
    });

    // Instructions supplémentaires (sans emojis)
    const additionalInfo = [
      '',
      'Instructions :',
      '- Cliquez sur le lien pour telecharger le fichier complet',
      '- Le fichier sera telecharge automatiquement',
      '- Conservez ce PDF pour reference future',
      '',
      'Support :',
      '- Email : mgangbala610@gmail.com',
      '- Des questions ? Contactez-nous !',
    ];

    additionalInfo.forEach((line, index) => {
      downloadPage.drawText(removeEmojis(line), {
        x: 50,
        y: height - 320 - (index * 20),
        size: 11,
        font: line.startsWith('-') ? helveticaFont : helveticaBold,
        color: rgb(0, 0, 0),
      });
    });

    // Footer
    downloadPage.drawText(removeEmojis('© MarxGeek.com - Formation Premium'), {
      x: width / 2 - 80,
      y: 50,
      size: 10,
      font: helveticaFont,
      color: rgb(0.5, 0.5, 0.5),
    });

    // Sauvegarder le PDF temporaire (non crypté)
    const pdfBytes = await pdfDoc.save();
    const tempOutputPath = outputPath.replace('.pdf', '_temp.pdf');
    fs.writeFileSync(tempOutputPath, pdfBytes);

    // Verrouiller le PDF avec le mot de passe (simple protection à l'ouverture)
    try {
      // Utiliser qpdf directement via la ligne de commande avec AES-256
      // Format simple : juste un mot de passe pour ouvrir le PDF
      execSync(`qpdf --encrypt "${password}" "${password}" 256 -- "${tempOutputPath}" "${outputPath}"`, {
        stdio: 'pipe'
      });

      // Supprimer le fichier temporaire
      fs.unlinkSync(tempOutputPath);

      console.log(`✅ PDF preview créé et crypté : ${path.basename(outputPath)}`);
      console.log(`   🔐 Mot de passe : ${password}`);
      return true;
    } catch (encryptError) {
      console.error(`❌ Erreur lors du cryptage du PDF :`, encryptError.message);

      // En cas d'erreur de cryptage, utiliser le PDF non crypté
      if (fs.existsSync(tempOutputPath)) {
        fs.renameSync(tempOutputPath, outputPath);
        console.log(`⚠️  PDF créé sans cryptage (erreur de cryptage)`);
      }
      return true; // On continue quand même
    }
  } catch (error) {
    console.error(`❌ Erreur lors de la création du PDF preview :`, error.message);
    return false;
  }
}

// Fonction pour copier les fichiers
function copyFile(source, destination) {
  try {
    // Créer le dossier de destination s'il n'existe pas
    const destDir = path.dirname(destination);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    fs.copyFileSync(source, destination);
    console.log(`✅ Fichier copié : ${path.basename(destination)}`);
    return true;
  } catch (error) {
    console.error(`❌ Erreur lors de la copie de ${source} :`, error.message);
    return false;
  }
}

// Fonction principale d'import
async function importEbooks() {
  try {
    console.log('🚀 Démarrage de l\'import des ebooks...\n');

    // Connexion à MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connecté à MongoDB\n');

    // Récupérer la catégorie "Formation"
    const category = await Category.findOne({ nameFr: 'Formation' });
    if (!category) {
      console.error('❌ Catégorie "Formation" non trouvée !');
      process.exit(1);
    }
    console.log(`✅ Catégorie trouvée : ${category.nameFr}\n`);

    const ebookSourceDir = path.join(__dirname, '../../ebook');
    const uploadsDir = path.join(__dirname, '../uploads');
    const ebooksDir = path.join(uploadsDir, 'ebooks');
    const previewsDir = path.join(uploadsDir, 'ebook-previews');
    const coversDir = path.join(uploadsDir, 'covers');

    // Créer les dossiers nécessaires
    [ebooksDir, previewsDir, coversDir].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });

    let importedCount = 0;

    // Importer chaque ebook
    for (const ebookData of ebooksData) {
      console.log(`\n📚 Traitement : ${ebookData.name}`);
      console.log('─'.repeat(60));

      const sourcePdfPath = path.join(ebookSourceDir, ebookData.fileName);
      const sourceCoverPath = path.join(ebookSourceDir, ebookData.coverImage);

      // Vérifier si les fichiers source existent
      if (!fs.existsSync(sourcePdfPath)) {
        console.warn(`⚠️  Fichier PDF non trouvé : ${ebookData.fileName}`);
        continue;
      }

      // Générer les chemins de destination
      const ebookFileName = `ebook_${Date.now()}_${ebookData.fileName}`;
      const coverFileName = `cover_${Date.now()}_${ebookData.coverImage}`;
      const previewFileName = `preview_${Date.now()}_${ebookData.fileName}`;

      const destPdfPath = path.join(ebooksDir, ebookFileName);
      const destCoverPath = path.join(coversDir, coverFileName);
      const destPreviewPath = path.join(previewsDir, previewFileName);

      // Copier le fichier PDF original
      if (!copyFile(sourcePdfPath, destPdfPath)) {
        console.warn(`⚠️  Échec de la copie du PDF, passage au suivant...`);
        continue;
      }

      // Copier la couverture si elle existe
      let coverPath = null;
      if (fs.existsSync(sourceCoverPath)) {
        if (copyFile(sourceCoverPath, destCoverPath)) {
          coverPath = `/uploads/covers/${coverFileName}`;
        }
      }

      // Générer le mot de passe
      const password = generatePassword();
      console.log(`🔑 Mot de passe généré : ${password}`);

      // Générer le lien de téléchargement
      const downloadLink = `https://api.marxgeek.com/uploads/ebooks/${ebookFileName}`;

      // Créer le PDF preview
      const previewCreated = await createPreviewPDF(
        ebookData,
        destPreviewPath,
        password,
        downloadLink
      );

      if (!previewCreated) {
        console.warn(`⚠️  Échec de la création du preview, passage au suivant...`);
        continue;
      }

      // Créer le produit dans la base de données
      const product = new Product({
        category: category.nameFr,
        name: ebookData.name,
        nameEn: ebookData.nameEn,
        description: ebookData.description,
        descriptionEn: ebookData.descriptionEn,
        price: ebookData.price,
        pricePromo: ebookData.pricePromo,
        photos: coverPath ? [coverPath] : [],
        ebookFile: `/uploads/ebooks/${ebookFileName}`,
        ebookPreview: `/uploads/ebook-previews/${previewFileName}`,
        ebookPassword: password,
        downloadLink: downloadLink,
        saleDocument: [`/uploads/ebook-previews/${previewFileName}`],
        advantage: ebookData.advantage,
        advantageEn: ebookData.advantageEn,
        productStatus: 'active',
        state: 'available',
        productType: 'standard',
        isSubscriptionBased: false,
      });

      await product.save();
      console.log(`✅ Produit créé dans la base de données`);
      console.log(`   ID : ${product._id}`);
      console.log(`   Mot de passe : ${password}`);

      importedCount++;
    }

    // Mettre à jour le compteur de produits de la catégorie
    const totalProducts = await Product.countDocuments({
      category: category.nameFr,
      isDeleted: false
    });

    category.totalProduct = totalProducts;
    await category.save();

    console.log('\n' + '='.repeat(60));
    console.log(`🎉 Import terminé !`);
    console.log(`   ${importedCount} ebooks importés avec succès`);
    console.log(`   Catégorie "${category.nameFr}" mise à jour (${totalProducts} produits)`);
    console.log('='.repeat(60));

  } catch (error) {
    console.error('\n❌ Erreur lors de l\'import :', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ Déconnexion de MongoDB');
  }
}

// Exécuter le script
importEbooks();
