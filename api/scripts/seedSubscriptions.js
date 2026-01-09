const mongoose = require('mongoose');
const Subscription = require('../models/Subscription');

// Connexion à MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/marxgeek_academy', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('📌 Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Liste des plans d'abonnement
const subscriptions = [
  {
    title: 'Basic',
    description: 'Pour apprendre les bases du développement web à ton rythme.',
    price: 10000, // XOF
    priceEUR: 15,
    period: 'paiement unique',
    popular: false,
    features: [
      'Accès complet aux formations HTML, CSS et JavaScript',
      'Parcours pédagogique structuré et progressif',
      'Exercices pratiques après chaque module',
      'Suivi de progression automatisé',
      'Support par email',
      'Accès à vie aux contenus',
    ],
    products: [
      'HTML',
      'CSS',
      'JavaScript'
    ],
    duration: 365, // 1 an d'accès (ou à vie)
    isPublished: true
  },
  {
    title: 'Populaire',
    description: 'Idéal pour progresser rapidement avec un suivi actif et interactif',
    price: 25000, // XOF
    priceEUR: 38,
    period: '/mois',
    popular: true,
    features: [
      'Accès complet aux formations HTML, CSS et JavaScript',
      'Accès au module de formation React.js',
      'Projets pratiques encadrés (HTML / CSS / JavaScript / React)',
      'Suivi actif et interactif avec retours personnalisés',
      'Corrections détaillées des exercices et projets',
      'Sessions d\'échanges (chat ou visio selon planning)',
      'Support WhatsApp prioritaire',
    ],
    products: [
      'HTML',
      'CSS',
      'JavaScript',
      'React.js'
    ],
    duration: 30, // 30 jours
    isPublished: true
  },
  {
    title: 'Avancé',
    description: 'Un accompagnement intensif pour atteindre un niveau professionnel',
    price: 70000, // XOF
    priceEUR: 107,
    period: '/mois',
    popular: false,
    features: [
      'Toutes les fonctionnalités du plan Populaire',
      'Suivi personnalisé individuel (one-to-one)',
      'Coaching technique régulier',
      'Projets réels simulant des cas professionnels',
      'Revue de code approfondie et bonnes pratiques',
      'Plan de progression personnalisé selon le niveau',
      'Préparation à l\'insertion professionnelle (portfolio, conseils, orientation)',
    ],
    products: [
      'HTML',
      'CSS',
      'JavaScript',
      'React.js',
      'Node.js',
      'MongoDB',
      'Next.js'
    ],
    duration: 30, // 30 jours
    isPublished: true
  },
];

// Fonction de seed
async function seedSubscriptions() {
  try {
    console.log("🗑 Suppression des anciens abonnements...");
    await Subscription.deleteMany({});

    console.log("📥 Insertion des nouveaux abonnements...");
    const insertedSubscriptions = await Subscription.insertMany(subscriptions);

    console.log("✅ Abonnements ajoutés avec succès !");
    console.log("\n📋 Liste des abonnements créés:");
    insertedSubscriptions.forEach((sub, index) => {
      console.log(`\n${index + 1}. ${sub.title}`);
      console.log(`   Prix: ${sub.price} XOF (${sub.priceEUR} EUR) ${sub.period}`);
      console.log(`   ID: ${sub._id}`);
      console.log(`   Populaire: ${sub.popular ? 'Oui' : 'Non'}`);
    });
  } catch (err) {
    console.error("❌ Erreur lors du seed :", err);
  } finally {
    mongoose.connection.close();
  }
}

seedSubscriptions();
