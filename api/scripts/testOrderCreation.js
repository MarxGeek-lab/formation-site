require('dotenv').config();
const mongoose = require('mongoose');
const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');

const MONGODB_URI = process.env.MONGODB_URL || process.env.MONGODB_URI || 'mongodb://localhost:27017/marxgeek';

async function testOrderCreation() {
  try {
    console.log('🧪 Test de création de commande...\n');

    // Connexion à MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connecté à MongoDB\n');

    // Récupérer un produit test
    const product = await Product.findOne({ ebookFile: { $exists: true, $ne: null } });

    if (!product) {
      console.log('❌ Aucun ebook trouvé dans la base de données');
      return;
    }

    console.log(`📦 Produit test trouvé: ${product.name}`);
    console.log(`   Prix: ${product.pricePromo || product.price} FCFA`);
    console.log(`   Preview: ${product.ebookPreview ? 'Oui' : 'Non'}`);
    console.log(`   Mot de passe: ${product.ebookPassword || 'N/A'}\n`);

    // Données de test
    const testEmail = `test${Date.now()}@rafly.me`;
    const testPhone = '+229 97 12 34 56';

    console.log('📝 Données de test:');
    console.log(`   Email: ${testEmail}`);
    console.log(`   Téléphone: ${testPhone}\n`);

    // Test 1: Créer un utilisateur
    console.log('👤 Test 1: Création d\'utilisateur...');
    const crypto = require('crypto');
    const bcrypt = require('bcryptjs');
    const randomPassword = crypto.randomBytes(8).toString('hex');
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    const user = new User({
      email: testEmail.toLowerCase(),
      password: hashedPassword,
      phone: testPhone,
      firstName: 'Test',
      lastName: 'User',
      role: 'user',
      isActive: true,
    });

    await user.save();
    console.log(`✅ Utilisateur créé: ${user._id}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Mot de passe (à envoyer): ${randomPassword}\n`);

    // Test 2: Créer une commande
    console.log('🛒 Test 2: Création de commande...');
    const order = new Order({
      customer: user._id,
      email: testEmail,
      phoneNumber: testPhone,
      items: [
        {
          product: product._id,
          quantity: 1,
          price: product.pricePromo || product.price,
        },
      ],
      totalAmount: product.pricePromo || product.price,
      paymentMethod: 'mobile_money',
      paymentStatus: 'pending',
      status: 'pending',
      currency: 'FCFA',
      description: 'Test de commande',
      fromOrder: 'from test script',
    });

    await order.save();
    console.log(`✅ Commande créée: ${order._id}`);
    console.log(`   Statut: ${order.status}`);
    console.log(`   Montant: ${order.totalAmount} FCFA\n`);

    // Test 3: Vérifier les liens de preview
    if (product.ebookPreview) {
      console.log('🔗 Test 3: Lien de téléchargement preview');
      const path = require('path');
      const previewUrl = `${process.env.API_URL || 'https://api.marxgeek.com'}/uploads/ebook-previews/${path.basename(product.ebookPreview)}`;
      console.log(`✅ URL preview: ${previewUrl}\n`);
    }

    // Test 4: Récupérer la commande
    console.log('📄 Test 4: Récupération de la commande...');
    const retrievedOrder = await Order.findById(order._id)
      .populate('customer', 'email firstName lastName phone')
      .populate('items.product', 'name price pricePromo ebookPassword');

    console.log(`✅ Commande récupérée:`);
    console.log(`   Client: ${retrievedOrder.customer.email}`);
    console.log(`   Produits: ${retrievedOrder.items.length}`);
    console.log(`   Mot de passe ebook: ${retrievedOrder.items[0].product.ebookPassword}\n`);

    console.log('🎉 Tous les tests ont réussi !\n');

    // Nettoyage (optionnel - décommenter pour supprimer les données de test)
    // await Order.findByIdAndDelete(order._id);
    // await User.findByIdAndDelete(user._id);
    // console.log('🗑️  Données de test supprimées\n');

  } catch (error) {
    console.error('❌ Erreur lors des tests:', error.message);
    console.error(error);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Déconnexion de MongoDB');
  }
}

testOrderCreation();
