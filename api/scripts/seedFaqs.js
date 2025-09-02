const mongoose = require('mongoose');
const Faq = require('../models/Faqs');
require('dotenv').config();

const faqs = [
  // Création de compte et Profil
  {
    question: "Comment créer un compte sur ReserveTout ?",
    answer: "Pour créer un compte sur ReserveTout, cliquez sur 'S'inscrire' en haut à droite de la page d'accueil. Remplissez le formulaire avec vos informations personnelles (nom, prénom, email, mot de passe). Validez votre email via le lien envoyé à votre adresse pour activer votre compte."
  },
  {
    question: "Comment devenir propriétaire sur ReserveTout ?",
    answer: "Pour devenir propriétaire, connectez-vous à votre compte et accédez à votre profil. Cliquez sur 'Devenir propriétaire' et fournissez les documents requis : pièce d'identité, justificatif de domicile, et informations bancaires. Votre demande sera examinée sous 48h ouvrées."
  },
  {
    question: "Comment modifier mes informations personnelles ?",
    answer: "Connectez-vous à votre compte, cliquez sur votre profil en haut à droite, puis sur 'Paramètres'. Vous pourrez y modifier vos informations personnelles, votre photo de profil, et vos préférences de notification."
  },

  // Publication et Gestion des Biens
  {
    question: "Comment publier un bien sur ReserveTout ?",
    answer: "Une fois votre statut de propriétaire validé, cliquez sur 'Publier un bien' dans votre tableau de bord. Remplissez les informations détaillées (localisation, description, équipements, photos, prix), définissez vos conditions de réservation, et validez la publication."
  },
  {
    question: "Quels types de biens puis-je mettre en location ?",
    answer: "ReserveTout accepte divers types de biens : appartements, maisons, chambres privées, espaces de coworking, salles de réunion, et espaces événementiels. Chaque bien doit respecter nos conditions d'utilisation et normes de sécurité."
  },
  {
    question: "Comment modifier les informations de mon bien ?",
    answer: "Accédez à votre tableau de bord propriétaire, sélectionnez le bien concerné dans 'Mes biens', puis cliquez sur 'Modifier'. Vous pouvez mettre à jour les photos, la description, les tarifs et la disponibilité."
  },

  // Réservations
  {
    question: "Comment effectuer une réservation ?",
    answer: "Sélectionnez un bien qui vous intéresse, vérifiez sa disponibilité avec vos dates souhaitées, cliquez sur 'Réserver'. Remplissez les informations nécessaires, acceptez les conditions, et procédez au paiement sécurisé pour confirmer votre réservation."
  },
  {
    question: "Comment annuler une réservation ?",
    answer: "Connectez-vous à votre compte, allez dans 'Mes réservations', sélectionnez la réservation à annuler et cliquez sur 'Annuler'. Les conditions de remboursement dépendent du délai d'annulation et de la politique du propriétaire."
  },
  {
    question: "Quels sont les modes de paiement acceptés ?",
    answer: "ReserveTout accepte les cartes bancaires (Visa, Mastercard), PayPal, et les virements bancaires pour certaines réservations longue durée. Tous les paiements sont sécurisés et cryptés."
  },

  // Sécurité et Support
  {
    question: "Comment fonctionne la garantie ReserveTout ?",
    answer: "La garantie ReserveTout couvre les dommages matériels jusqu'à 10 000€, les annulations de dernière minute, et assure une médiation en cas de litige. Une assurance complémentaire peut être souscrite pour une protection supplémentaire."
  },
  {
    question: "Comment contacter le support client ?",
    answer: "Le support client est disponible 24/7 via le chat en ligne, par email à support@reservetout.com, ou par téléphone au 01 23 45 67 89. Pour les urgences, un numéro prioritaire est fourni après la confirmation de réservation."
  }
];

const seedFaqs = async () => {
  console.log("Seeding FAQs...");
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('Connected to MongoDB');

    // Clear existing FAQs
    await Faq.deleteMany({});
    console.log('Cleared existing FAQs');

    // Add admin ID to each FAQ
    const faqsWithAdmin = faqs.map(faq => ({
      ...faq,
      admin: null
    }));

    // Insert new FAQs
    const insertedFaqs = await Faq.insertMany(faqsWithAdmin);
    console.log(`Successfully inserted ${insertedFaqs.length} FAQs`);

    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding FAQs:', error);
    process.exit(1);
  }
};

// seedFaqs();
// Pour exécuter le script, vous devez fournir l'ID d'un admin existant
// Exemple: node seedFaqs.js 60a23c5e9f7a8b1234567890

