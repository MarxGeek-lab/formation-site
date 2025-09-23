const Notifications = require('../models/Notifications');
const Order = require('../models/Order');
const Product = require('../models/Product'); // Optionnel si tu veux valider les produits
const SiteSettings = require('../models/Settings');
const User = require('../models/User');
const { generateTemplateHtml } = require('../services/generateTemplateHtml');
const generatePDF = require('../services/generateContrat');
const { getGreeting, generateVerificationCode } = require('../utils/helpers');
const Cart = require('../models/Cart');
const Affiliate = require('../models/Affiliate');
const Referral = require('../models/Referral');
const path = require('path');
const fs = require('fs');
const archiver = require('archiver');
const { EmailService } = require('../services/emailService');
const Transaction = require('../models/Transaction');

require('dotenv').config();

// Créer une commande
exports.createOrder = async (req, res) => {
  try {
    const affiliateRef = req.headers['x-affiliate-ref'];
    console.log("affiliateRef reçu == ", affiliateRef)

    const {
      customer,
      items,
      email, 
      phoneNumber,
      country,
      city,
      district,
      address,
      fullName,
      note,
      totalAmount,
      totalAmountConvert,
      currency,
      sessionId, // Ajouter sessionId pour lier avec le panier
      typeOrder
    } = req.body;
    console.log("totalAmountConvert == ", req.body)

    let customer_=customer;
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'La commande ne peut pas être vide.' });
    }

    const user = await User.findOne({ email: email });
    if (!customer_) {

      if (!user) {
        // Génération d'un code d'activation pour le compte
        const otp = generateVerificationCode();

        const user = new User({
          email,
          phoneNumber,
          country,
          city,
          district,
          address,
          name: fullName,
          otp,
        });
        await user.save();

         if (affiliateRef) {
            // Chercher l'affilié correspondant
            const affiliate = await Affiliate.findOne({ refCode: affiliateRef });
            if (affiliate) {
              user.referredBy = affiliate._id;
              affiliate.referrals.push(newUser._id);
              await affiliate.save();
            }
          }

        customer_ = user._id;

        const link = `${process.env.URL_APP}/activer-mon-compte`;
        const emailData = { fullname: user?.name, otp, link };
        
        // Configuration de l'email à envoyer
        const emailService = new EmailService();
        emailService.setSubject("Activation de votre compte sur Rafly");
        emailService.setFrom(process.env.EMAIL_HOST_USER, "Rafly");
        emailService.addTo(email);
        emailService.setHtml(generateTemplateHtml("templates/activeAccount.html", emailData));
        await emailService.send(); // Envoi de l'email
      } else {
        customer_ = user?._id;
      }
    }

    const productItems = []
    // const itemsProduct = typeOrder === 'abonnement' ? 
    for(const item of items){
      const product = await Product.findById(item.id);

      if (item.type !== 'abonnement') {
        if (!product) {
          return res.status(404).json({ message: 'Produit introuvable' });
        }
      }

      const isSubscription = item.type === 'abonnement' || item.subscription;
      
      productItems.push({
        product: isSubscription ? null : product._id,
        quantity: isSubscription ? 1 : item.quantity,
        price: item?.price || product.price || 0,
        options: item?.options,
        category: product?.category,
        subscription: isSubscription ? JSON.parse(item.subscription) : '',
        nameSubs: isSubscription ? JSON.parse(item.subscription)?.title : '',
        productList: isSubscription ? JSON.stringify(JSON.parse(item.subscription).products) : "",
        type: item.type || 'achat',
      })
    }

    let affiliate_ = null;
    if (affiliateRef) {
      const affiliate = await Affiliate.findOne({ refCode: affiliateRef });
      if (affiliate) {
        affiliate_ = affiliate._id;
      }
    }

    const expiredAt = typeOrder === 'abonnement' ? new Date(new Date().getTime() + JSON.parse(items[0].subscription)?.duration * 24 * 60 * 60 * 1000) : '';

    const order = new Order({
      customer: customer_,
      items: productItems,
      totalAmount,
      description: note,
      email,
      fullName,
      address,
      city,
      district,
      country,
      phoneNumber,
      totalAmountConvert,
      currency,
      affiliate: affiliate_ || null,
      typeOrder,
      subscriptionExpiredAt: expiredAt,
      fromOrder: 'from site'
    });

    const savedOrder = await order.save();

    // Marquer le panier comme converti après création de commande réussie
    if (sessionId) {
      try {
        const cart = await Cart.findOne({ 
          sessionId, 
          status: 'active' 
        });
        
        if (cart) {
          await cart.markAsConverted(savedOrder._id);
          console.log(`Panier ${cart._id} marqué comme converti pour la commande ${savedOrder._id}`);
        }
      } catch (cartError) {
        console.error('Erreur lors de la conversion du panier:', cartError);
        // Ne pas faire échouer la commande si la conversion du panier échoue
      }
    }

    const statusObj = {
      pending: 'En attente',
      confirmed: 'Confirmée',
      shipped: 'Expédiée',
      delivered: 'Livrée',
      cancelled: 'Annulée',
    }
    // Notification for user
    const templateData = {
      fullname: user.fullName,
      amount: totalAmount,
      orderId: "ORD-" + savedOrder._id.toString().slice(0, 6).toUpperCase(),
      status: statusObj[savedOrder.status],
      createdAt: savedOrder.createdAt,
      nbItems: savedOrder.items.length,
      salutation: getGreeting(),
    };

    const emailService = new EmailService();
    emailService.setSubject(`Nouvelle commande sur Rafly`);
    emailService.setFrom(process.env.EMAIL_HOST_USER, "Rafly");
    emailService.addTo(user.email);
    emailService.setHtml(generateTemplateHtml("templates/notificationOrderCustomer.html", templateData));
    await emailService.send();

    // Notification for admin
    const emailServiceAdmin = new EmailService();
    emailServiceAdmin.setSubject(`Nouvelle commande sur Rafly`);
    emailServiceAdmin.setFrom(process.env.EMAIL_HOST_USER, "Rafly");
    // emailServiceAdmin.addTo('mgangbala610@gmail.com');
    emailServiceAdmin.addTo('1enockbotoyiye@gmail.com');
    emailServiceAdmin.setHtml(generateTemplateHtml("templates/notificationOrderAdmin.html", templateData));
    await emailServiceAdmin.send();

    const notification = new Notifications({
      type: 'order',
      message: `Nouvelle commande sur Rafly. ID: ORD-${savedOrder._id.toString().slice(0, 6).toUpperCase()}`,
      user: null,
      data: JSON.stringify(savedOrder),
    });
    await notification.save();

    // Affiliation
    if (affiliateRef) {
      const affiliate = await Affiliate.findOne({ refCode: affiliateRef });
      const settings = await SiteSettings.findOne();

      if (affiliate) {
        const referral = await Referral.create({
          affiliate: affiliate._id,
          refCode: affiliateRef,
          type: "order",
          orderId: savedOrder._id,
          amount: savedOrder.totalAmount,
          commissionAmount: Number(((savedOrder.totalAmount * settings.percentAffiliate)/100).toFixed(2)),
          status: "pending",
        });

        await referral.save();
      }
    }

    // Générer le contrat
    const contrat = await generateContrat(savedOrder._id);
    console.log('Contrat généré à :', contrat);

    res.status(201).json(savedOrder);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Créer une commande par l'admin pour un utilisateur
exports.createOrderByAdmin = async (req, res) => {
  try {
    const {
      userId, // ID de l'utilisateur pour qui créer la commande
      items,
      note,
      typeOrder = 'achat',
      autoConfirm = false // Si true, marque automatiquement la commande comme confirmée et payée
    } = req.body;

    // Vérifier les permissions admin
    if (!req.user || (req.user.role !== 'super_admin' && req.user.role !== 'admin')) {
      return res.status(403).json({ message: 'Accès non autorisé. Seuls les admins peuvent créer des commandes.' });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'La commande ne peut pas être vide.' });
    }

    if (!userId) {
      return res.status(400).json({ message: 'L\'ID utilisateur est requis.' });
    }

    // Récupérer l'utilisateur
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur introuvable.' });
    }

    const productItems = [];
    let totalAmount = 0;

    // Traiter les items de la commande
    for (const item of items) {
      let product = null;
      const isSubscription = item.type === 'abonnement' || item.subscription;
      
      if (!isSubscription) {
        product = await Product.findById(item.id);
        if (!product) {
          return res.status(404).json({ message: `Produit introuvable: ${item.id}` });
        }

        // Vérifier les permissions admin pour ce produit
        if (req.user.role === 'admin' && product.assignedAdminId?.toString() !== req.user._id.toString()) {
          return res.status(403).json({ message: `Vous n'avez pas accès au produit: ${product.name}` });
        }
      }

      const itemPrice = item.price || product?.price || 0;
      const itemQuantity = isSubscription ? 1 : (item.quantity || 1);
      
      productItems.push({
        product: isSubscription ? null : product._id,
        quantity: itemQuantity,
        price: itemPrice,
        options: item.options,
        category: product?.category,
        subscription: isSubscription ? (typeof item.subscription === 'string' ? JSON.parse(item.subscription) : item.subscription) : '',
        nameSubs: isSubscription ? (typeof item.subscription === 'string' ? JSON.parse(item.subscription)?.title : item.subscription?.title) : '',
        productList: isSubscription ? JSON.stringify(typeof item.subscription === 'string' ? JSON.parse(item.subscription).products : item.subscription.products) : "",
        type: item.type || 'achat',
      });

      totalAmount += itemPrice * itemQuantity;
    }

    // Calculer la date d'expiration pour les abonnements
    const expiredAt = typeOrder === 'abonnement' ? 
      new Date(new Date().getTime() + (typeof items[0].subscription === 'string' ? JSON.parse(items[0].subscription) : items[0].subscription)?.duration * 24 * 60 * 60 * 1000) : 
      null;

    // Créer la commande
    const order = new Order({
      customer: userId,
      items: productItems,
      totalAmount,
      description: note || `Commande créée par l'admin ${req.user.name || req.user.email}`,
      email: user.email,
      fullName: user.name,
      address: user.address,
      city: user.city,
      district: user.district,
      country: user.country,
      phoneNumber: user.phoneNumber,
      totalAmountConvert: totalAmount,
      currency: 'XOF',
      typeOrder,
      subscriptionExpiredAt: expiredAt,
      status: autoConfirm ? 'confirmed' : 'pending',
      paymentStatus: autoConfirm ? 'paid' : 'pending',
      paidAmount: autoConfirm ? totalAmount : 0,
      completedAt: autoConfirm ? new Date() : null,
      fromOrder: 'from admin'
    });

    const savedOrder = await order.save();

    // Si auto-confirmation, générer les fichiers et envoyer l'email
    if (autoConfirm) {
      try {
        // Transaction
        const transaction = new Transaction({
          order: savedOrder._id,
          amount: totalAmount,
          type: 'payment',
          status: 'success',
          paymentMethod: 'Monero',
          paymentDate: new Date(),
        });

        await transaction.save();

        savedOrder.paymentStatus = 'paid';
        savedOrder.paidAmount = totalAmount;
        savedOrder.completedAt = new Date();
        savedOrder.payments.push({
          transaction: transaction._id,
          amount: totalAmount,
          status: 'success',
          paymentMethod: 'Monero',
        })
        await savedOrder.save();

        // Générer le contrat
        const contrat = await generateContrat(savedOrder._id);
        console.log('Contrat généré à :', contrat);

        // Générer et envoyer l'email avec les fichiers
        const orderWithPopulatedData = await Order.findById(savedOrder._id)
          .populate('customer')
          .populate('items.product');

        await sendOrderEmailByAdmin(orderWithPopulatedData, req.user);
        
        console.log('Email de confirmation envoyé avec succès');
      } catch (emailError) {
        console.error('Erreur lors de l\'envoi de l\'email:', emailError);
        // Ne pas faire échouer la création de commande si l'email échoue
      }
    }

    // Notification pour l'utilisateur
    const statusObj = {
      pending: 'En attente',
      confirmed: 'Confirmée',
      shipped: 'Expédiée',
      delivered: 'Livrée',
      cancelled: 'Annulée',
    };

    const templateData = {
      fullname: user.name,
      amount: totalAmount,
      orderId: "ORD-" + savedOrder._id?.toString().slice(0, 6).toUpperCase(),
      status: statusObj[savedOrder.status],
      createdAt: savedOrder.createdAt,
      nbItems: savedOrder.items.length,
      salutation: getGreeting(),
      adminCreated: true,
      adminName: req.user.name || req.user.email
    };

    // Email de notification à l'utilisateur
    const emailService = new EmailService();
    emailService.setSubject(`${autoConfirm ? 'Nouvelle commande confirmée' : 'Nouvelle commande'} sur Rafly`);
    emailService.setFrom(process.env.EMAIL_HOST_USER, "Rafly");
    emailService.addTo(user.email);
    emailService.setHtml(generateTemplateHtml("templates/notificationOrderCustomer.html", templateData));
    await emailService.send();

    // Notification dans l'app
    const notification = new Notifications({
      type: 'order',
      message: `${autoConfirm ? 'Commande confirmée' : 'Nouvelle commande'} créée par l'admin. ID: ORD-${savedOrder._id}`,
      user: userId,
      data: JSON.stringify(savedOrder),
    });
    await notification.save();

    // Notification pour les autres admins
    const emailServiceAdmin = new EmailService();
    emailServiceAdmin.setSubject(`Commande créée par admin sur Rafly`);
    emailServiceAdmin.setFrom(process.env.EMAIL_HOST_USER, "Rafly");
    emailServiceAdmin.addTo('1enockbotoyiye@gmail.com');
    emailServiceAdmin.setHtml(generateTemplateHtml("templates/notificationOrderAdmin.html", {
      ...templateData,
      adminAction: true,
      createdBy: req.user.name || req.user.email
    }));
    await emailServiceAdmin.send();

    res.status(201).json({
      success: true,
      message: `Commande ${autoConfirm ? 'créée et confirmée' : 'créée'} avec succès`,
      order: savedOrder
    });

  } catch (error) {
    console.error('Erreur lors de la création de commande par admin:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erreur serveur lors de la création de la commande', 
      error: error.message 
    });
  }
};

// Fonction pour envoyer l'email de commande créée par admin
const sendOrderEmailByAdmin = async (order, admin) => {
  const items = order.items || [];
  const products = items.map(item => item.product);

  const isSubscription = order.typeOrder === 'abonnement';

  // Récupérer tous les fichiers produits
  let fileSale = [];
  if (!isSubscription) {
    fileSale = products
    .filter(product => product && product.saleDocument)
    .map(product => product.saleDocument);
  } else {
    fileSale = order.items[0].subscription?.relatedProducts?.map(item => item.saleDocument);
  }

  const allFiles = fileSale.flat();
  const fileContrat = order.contrat || null;

  // Créer le ZIP des fichiers produits
  const zipDir = path.join(__dirname, "../uploads/zips");
  if (!fs.existsSync(zipDir)) fs.mkdirSync(zipDir, { recursive: true });

  const startNameFile = order.typeOrder === 'abonnement' ? 'abonnement-rafly-ORD-':'produits-rafly-ORD-';
  const zipPath = path.join(zipDir, `${startNameFile}${order._id}_${new Date().toISOString()}.zip`);
  const output = fs.createWriteStream(zipPath);
  const archive = archiver("zip", { zlib: { level: 9 } });
  archive.pipe(output);

  const basePath = path.join(__dirname, "../uploads/documents");

  for (const fileUrl of allFiles) {
    const fileName = decodeURIComponent(path.basename(fileUrl));
    const filePath = path.join(basePath, fileName);

    if (fs.existsSync(filePath)) {
      archive.file(filePath, { name: fileName });
    } else {
      console.log("File not found:", filePath);
    }
  }

  await archive.finalize();

  const fileNameZip = decodeURIComponent(path.basename(zipPath));
  const fileZipLink = `${process.env.API_URL}${fileNameZip}`;
  const fileNameContrat = fileContrat ? decodeURIComponent(path.basename(fileContrat)) : null;
  let fileContratLink = fileContrat ? `${process.env.API_URL}${fileNameContrat}` : null;

  if (!fileContratLink) {
    // Générer le fichier contrat
    const pdfFileName = await generatePDF({
      clientName: order?.customer?.name,
      clientEmail: order.customer.email,
      orderNumber: 'ORD-' + order._id.toString().slice(0, 6).toUpperCase(),
      purchaseDate: order.createdAt.toLocaleDateString(),
      productName: order.typeOrder === 'abonnement' ? order?.items[0].nameSubs : order.items.map(i => i.product.name).join(', '),
      licenceType: 'Licence de revente'
    });

    const contratFile = process.env.API_URL+pdfFileName.filename;
    order.contrat = contratFile;
    fileContratLink = contratFile;
  }
  
  order.productZip = fileZipLink;
  await order.save();

  // Générer le mail HTML
  const html = `
  <!DOCTYPE html>
  <html lang="fr">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Commande Confirmée par Admin</title>
    </head>
    <body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color:#f7f7f7;">
      <table style="margin: 0 auto;" role="presentation" cellspacing="0" cellpadding="0" border="0" width="600">
        <tr>
          <td align="center" style="height: 60px; display: flex; align-items: center; justify-content: center; gap: 10px; padding:2px 0; background: #5E3AFC;">
            <img src="https://api.rafly.me/logo/icon.webp" alt="Logo" style="width:40px; height:auto;" />
            <h3 style="color: #fff; font-size: 24px;">Rafly</h3>
          </td>
        </tr>

        <tr>
          <td align="center">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="background:#fff; border-radius:8px; overflow:hidden; box-shadow:0 2px 6px rgba(0,0,0,0.1);">
              <tr>
                <td style="padding:30px; text-align:center;">
                  <h2 style="margin-bottom:15px; color:#333;">Commande confirmée par l'administrateur 🎉</h2>
                  <p style="color:#555; font-size:16px; margin-bottom:25px;">
                    Votre ${isSubscription ? 'abonnement ':'commande '} a été créée et confirmée par notre équipe administrative. Vous pouvez télécharger vos fichiers en utilisant les boutons ci-dessous :
                  </p>
                  <p style="color:#555; font-size:14px; margin-bottom:25px;">
                    <strong>Créée par:</strong> ${admin.name || admin.email}<br/>
                    <strong>Date:</strong> ${order.createdAt.toLocaleDateString()}
                  </p>

                  <!-- Button Produits -->
                  <a href="${fileZipLink}" 
                     target="_blank"
                     download="${startNameFile}${order._id}_${new Date().toISOString()}.zip"
                     style="display:inline-block; background:#007bff; color:#fff; padding:12px 20px; border-radius:6px; text-decoration:none; font-size:16px; font-weight:bold; margin-bottom:15px;">
                     📄 Télécharger Produits (PDF)
                  </a>
                  <br />

                  <!-- Button Contrat -->
                  ${fileContratLink ? `
                  <a href="${fileContratLink}" 
                     target="_blank"
                     download="contrat-rafly-ORD-${order._id}_${new Date().toISOString()}.pdf"
                     style="display:inline-block; background:#28a745; color:#fff; padding:12px 20px; border-radius:6px; text-decoration:none; font-size:16px; font-weight:bold;">
                     📑 Télécharger Contrat (PDF)
                  </a>` : ''}
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <tr>
          <td align="center" style="padding:20px; font-size:12px; color:#888;">
            © 2025 Rafly. Tous droits réservés.
          </td>
        </tr>
      </table>
    </body>
  </html>
  `;

  // Envoyer le mail
  const emailService = new EmailService();
  emailService.setSubject(`${isSubscription ? 'Abonnement ':'Commande '} ORD-${order?._id?.toString().toUpperCase()} confirmée par l'admin sur Rafly`);
  emailService.setFrom(process.env.EMAIL_HOST_USER, "Rafly");
  emailService.addTo(order?.customer?.email || order?.email);
  emailService.setHtml(html);

  await emailService.send();
  console.log("Email de commande admin envoyé avec succès");

  return { zipPath, fileContratLink };
};

// Récupérer les commandes d’un utilisateur
exports.getUserOrders = async (req, res) => {
  try {
    const customerId = req.params.customerId;

    const orders = await Order.find({ customer: customerId })
      .populate('items.product', 'name price photos')
      .populate('payments.transaction')
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des commandes', error: error.message });
  }
};

exports.getUserOrdersSubscription = async (req, res) => {
  try {
    const customerId = req.params.customerId;

    const orders = await Order.find({ customer: customerId, typeOrder: 'abonnement' })
      .populate('payments.transaction')
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des commandes', error: error.message });
  }
};

// Récupérer une commande par ID
exports.getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;

    const order = await Order.findById(orderId)
      .populate('items.product')
      .populate('customer')
      .populate('payments.transaction');

    if (!order) return res.status(404).json({ message: 'Commande introuvable' });

    
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Mettre à jour le statut d’une commande
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: 'Commande introuvable' });

    order.status = status;
    await order.save();

    res.status(200).json({ message: 'Statut mis à jour', order });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour du statut', error: error.message });
  }
};

// Marquer comme livrée
exports.markAsDelivered = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: 'Commande introuvable' });

    order.status = 'delivered';
    order.isDelivered = true;
    order.deliveredAt = new Date();

    await order.save();

    res.status(200).json({ message: 'Commande marquée comme livrée', order });
  } catch (error) {
    res.status(500).json({ message: 'Erreur', error: error.message });
  }
};

 // Rappel au client par rapport à la réservation déjà confirmé
exports.reminderOrder = async (req, res) => {
    try {
      const order = await Order.findById(req.params.id)
      .populate('customer');
      if (!order) {
        return res.status(400).json({
          success: false,
          message: 'Commande non trouvée'
        });
      }

      const siteSetting = await SiteSettings.findOne();

      const templateData = {
        title: "Rappel pour votre commande ORD-" + order._id?.toString().slice(0, 6).toUpperCase()+" sur " + siteSetting?.websiteTitle,
        fullname: order.customer.name,
        message: `Votre commande ORD- ${order._id?.toString().slice(0, 6).toUpperCase()} sur ${siteSetting?.websiteTitle} est en attente de confirmation.
        Veuillez confirmer votre commande en passant au paiement en passant par votre tableau de bord.`,
        orderId: "ORD-" + order._id?.toString().slice(0, 6).toUpperCase(),
        numberArticle: order.items.length,
        amount: order.totalAmount,
        paidAmount: order.paidAmount,
        createdAt: order.createdAt.toLocaleString(),
      };

      const html = await generateTemplateHtml(
        "templates/orderReminder.html",
        templateData
      );

      const emailService = new EmailService();
      emailService.setSubject(`Rappel pour votre commande ORD-${order?._id?.toString().slice(0, 6).toUpperCase()} sur ${siteSetting?.websiteTitle}`);
      emailService.setFrom(process.env.EMAIL_HOST_USER, siteSetting.websiteTitle);
      emailService.addTo(order.customer.email);
      emailService.setHtml(html);

      await emailService.send();
      
      // Créer une notification dans l'app
      const notification = new Notifications({
          title: `Rappel pour votre commande ORD-${order?._id?.toString().slice(0, 6).toUpperCase()} sur ${siteSetting?.websiteTitle}`,
          message: `Votre commande ORD- ${order._id?.toString().slice(0, 6).toUpperCase()} sur ${siteSetting?.websiteTitle} est en attente de confirmation.
          Veuillez confirmer votre commande en passant au paiement en passant par votre tableau de bord.`,
          user: order.customer._id,
          type: 'user',
          activity: 'order reminder',
          data: JSON.stringify(order),
          read: false
      });
      await notification.save();

      return res.status(200).json({
        success: true,
        message: 'Rappel envoyé avec succès'
      });
    } catch (error) {
      console.log(error)
      res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'envoi du rappel',
        error: error.message
      });
    }
  }


  exports.cancelOrder = async (req, res) => {
    try {
      const { id } = req.params;
      const { reason, rejectedBy, cancelledByType } = req.body;
      const order = await Order.findById(id).populate('customer');
      
      if (!order) return res.status(404).json({ message: 'Commande introuvable' });

      if (cancelledByType === 'user') {
        order.cancelInfos.cancelledBy = rejectedBy;
      } else {
        order.cancelInfos.cancelledByAdmin = rejectedBy;
      }
      order.cancelInfos.reason = reason;
      order.cancelInfos.cancelledAt = new Date();
      order.status = 'cancelled';

      await order.save();

      const siteSetting = await SiteSettings.findOne();

      const templateData = {
        title: "Annulation de votre commande ORD-" + order._id?.toString().slice(0, 6).toUpperCase()+" sur " + siteSetting?.websiteTitle,
        fullname: order.customer.name,
        message: `Votre commande ORD- ${order._id?.toString().slice(0, 6).toUpperCase()} sur ${siteSetting?.websiteTitle} a été annulée. <br/>
        Raison: ${reason}`,
        orderId: "ORD-" + order._id?.toString().slice(0, 6).toUpperCase(),
        numberArticle: order.items.length,
        amount: order.totalAmount,
        paidAmount: order.paidAmount,
        createdAt: order.createdAt.toLocaleString(),
      };

      const html = await generateTemplateHtml(
        "templates/orderCancel.html",
        templateData
      );

      const emailService = new EmailService();
      emailService.setSubject(`Annulation de votre commande ORD-${order?._id?.toString().slice(0, 6).toUpperCase()} sur ${siteSetting?.websiteTitle}`);
      emailService.setFrom(process.env.EMAIL_HOST_USER, siteSetting.websiteTitle);
      emailService.addTo(order.customer.email);
      emailService.setHtml(html);

      await emailService.send();
      
      // Créer une notification dans l'app
      const notification = new Notifications({
          title: `Annulation de votre commande ORD-${order?._id?.toString().slice(0, 6).toUpperCase()} sur ${siteSetting?.websiteTitle}`,
          message: `Votre commande ORD- ${order._id?.toString().slice(0, 6).toUpperCase()} sur ${siteSetting?.websiteTitle} a été annulée. <br/>
          Raison: ${reason}`,
          user: order.customer._id,
          type: 'user',
          activity: 'order cancel',
          data: JSON.stringify(order),
          read: false
      });
      await notification.save();

      return res.status(200).json({
        success: true,
        message: 'Commande annulée'
      });
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Erreur', error: error.message });
    }
  }

  exports.sendInvoice = async (req, res) => {
    try {
      const { id } = req.params;
      const order = await Order.findById(id)
      .populate('customer')
      .populate('items.product');
      
      if (!order) return res.status(404).json({ message: 'Commande introuvable' });

      const siteSetting = await SiteSettings.findOne();

      const templateData = {
        title: "Facture de votre commande ORD-" + order._id?.toString().slice(0, 6).toUpperCase()+" sur " + siteSetting?.websiteTitle,
        fullname: order.customer.name,
        message: `Veuillez télécharger la facture de votre commande ORD- ${order._id?.toString().slice(0, 6).toUpperCase()} sur ${siteSetting?.websiteTitle}.`,
        orderId: "ORD-" + order._id?.toString().slice(0, 6).toUpperCase(),
        items: `${order?.items?.map(item => {
          return `<tr>
          <td>${item.product.name}</td>
          <td>${item.quantity}</td>
          <td>${item.price} FCFA</td>
          <td>${item.price * item.quantity} FCFA</td>
          </tr>`;
        }).join('')}`,
        numberArticle: order?.items?.length,
        amount: order?.totalAmount,
        paidAmount: order?.paidAmount,
        createdAt: order?.createdAt?.toLocaleString(),
        siteSetting: siteSetting,
        websiteTitle: siteSetting?.websiteTitle,
        websiteLogo: siteSetting?.logo,
        websiteAddress: [siteSetting?.address || '', siteSetting?.city || '', siteSetting?.country || ''].join(', '),
        websitePhone: siteSetting?.contactPhoneCall,
        websiteEmail: siteSetting?.supportEmail,
        client_name: order.shippingAddress.fullName || order.customer.name,
        client_email: order.shippingAddress.email || order.customer.email,
        client_phone: order.shippingAddress.phone || order.customer.phone,
        client_address: [order.shippingAddress.address || "", order.shippingAddress.city || "", order.shippingAddress.district || "", order.shippingAddress.postalCode || "", order.shippingAddress.country || ""].join(", ") || [order.customer.address || "", order.customer.city || "", order.customer.district || "", order.customer.postalCode || "", order.customer.country || ""].join(", "),
        subtotal: order.items.reduce((total, item) => total + item.price * item.quantity, 0),
        taxe: siteSetting?.taxe,
        taxeAmount: Math.round(order.totalAmount * siteSetting?.taxe / 100),
        totalAmount: order.totalAmount,
        shipping: order.shippingMethod.fee === 0 ? "Gratuit" : order.shippingMethod.fee+ " FCFA",
      };

      const html = await generateTemplateHtml(
        "templates/invoice.html",
        templateData
      );

      const emailService = new EmailService();
      emailService.setSubject(`Facture de votre commande ORD-${order?._id?.toString().slice(0, 6).toUpperCase()} sur ${siteSetting?.websiteTitle}`);
      emailService.setFrom(process.env.EMAIL_HOST_USER, siteSetting.websiteTitle);
      emailService.addTo(order.customer.email);
      emailService.setHtml(html);

      await emailService.send();
      
      // Créer une notification dans l'app
      const notification = new Notifications({
          title: `Facture de votre commande ORD-${order?._id?.toString().slice(0, 6).toUpperCase()} sur ${siteSetting?.websiteTitle}`,
          message: `Veuillez télécharger la facture de votre commande ORD- ${order._id?.toString().slice(0, 6).toUpperCase()} sur ${siteSetting?.websiteTitle}.`,
          user: order.customer._id,
          type: 'user',
          activity: 'order cancel',
          data: JSON.stringify(order),
          read: false
      });
      await notification.save();

      return res.status(200).json({
        success: true,
        message: 'Commande annulée'
      });
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Erreur', error: error.message });
    }
  }

  // Cron job pour vérifier le statut des commandes en attente avec paiements
exports.checkPendingOrdersPaymentStatus = async () => {
  try {
    console.log('🔄 Démarrage du cron de vérification des paiements...');
    
    // Récupérer toutes les commandes en attente qui ont des paiements
    const pendingOrders = await Order.find({
      status: 'pending',
      paymentStatus: 'pending',
      'payments.0': { $exists: true } // Au moins un paiement existe
    })
    .populate('payments.transaction')
    .populate('customer')
    .populate('items.product');

    console.log(`📊 ${pendingOrders.length} commandes en attente avec paiements trouvées`);

    let updatedCount = 0;
    let errorCount = 0;

    for (const order of pendingOrders) {
      try {
        // Vérifier chaque transaction de la commande
        for (const payment of order.payments) {
          if (payment.transaction && payment.transaction.reference) {
            const transaction = payment.transaction;
            
            // Utiliser le service MoneroPayment pour vérifier le statut
            const { default: MoneroPayment } = require('../services/servicePayment');
            const monero = new MoneroPayment(process.env.MONERO_SECRET_KEY);
            
            console.log(`🔍 Vérification du paiement ${transaction.reference} pour la commande ${order._id}`);
            
            const response = await monero.verifyPayment(transaction.reference);
            const status = response.data.data.status;
            
            if (transaction.reference === 'py_rpat3sggtd8a') {
              console.log(response.data.data)
            }
            console.log(`📋 Statut reçu: ${status} pour la transaction ${transaction.reference}`);
            // console.log(response.data.data)
            // Mettre à jour selon le statut
            if (status === 'success') {
              // Marquer la transaction comme réussie
              transaction.status = 'success';
              transaction.completedAt = new Date();
              await transaction.save();
              
              // Mettre à jour la commande
              order.paymentStatus = 'paid';
              order.status = 'confirmed';
              order.paidAmount = order.totalAmount;
              order.completedAt = new Date();
              console.log("order updated", order._id)
              
              // Gérer l'expiration d'abonnement si applicable
              if (order.typeOrder === 'abonnement') {
                try {
                  // Vérifier si subscription existe et n'est pas vide
                  if (order.items[0] && order.items[0].subscription) {
                    let subscriptionData;
                    
                    // Si c'est déjà un objet, l'utiliser directement
                    if (typeof order.items[0].subscription === 'object') {
                      subscriptionData = order.items[0].subscription;
                    } else if (typeof order.items[0].subscription === 'string' && order.items[0].subscription.trim() !== '') {
                      // Essayer de parser seulement si c'est une chaîne non vide
                      try {
                        subscriptionData = JSON.parse(order.items[0].subscription);
                      } catch (parseError) {
                        console.error(`❌ Erreur de parsing JSON pour la subscription de la commande ${order._id}:`, parseError.message);
                        console.error(`Données subscription problématiques:`, order.items[0].subscription);
                        // Utiliser une durée par défaut en cas d'erreur
                        subscriptionData = { duration: 30 }; // 30 jours par défaut
                      }
                    } else {
                      console.warn(`⚠️ Données subscription invalides pour la commande ${order._id}, utilisation de la durée par défaut`);
                      subscriptionData = { duration: 30 }; // 30 jours par défaut
                    }
                    
                    const duration = subscriptionData?.duration || 30; // Durée par défaut de 30 jours
                    const expiredAt = new Date(new Date().getTime() + duration * 24 * 60 * 60 * 1000);
                    order.subscriptionExpiredAt = expiredAt;
                    
                    console.log(`📅 Expiration d'abonnement définie pour la commande ${order._id}: ${expiredAt}`);
                  } else {
                    console.warn(`⚠️ Aucune donnée subscription trouvée pour la commande d'abonnement ${order._id}`);
                  }
                } catch (subscriptionError) {
                  console.error(`❌ Erreur lors du traitement de l'abonnement pour la commande ${order._id}:`, subscriptionError.message);
                  // Continuer sans définir d'expiration plutôt que de faire échouer toute la commande
                }
              }
              
              await order.save();
              
              // Gérer les affiliations si applicable
              if (order.affiliate) {
                const referral = await Referral.findOne({ orderId: order._id });
                if (referral) {
                  referral.status = 'paid';
                  await referral.save();
                }
              }
              
              // Envoyer l'email de confirmation
              const transactionController = require('./transactionController');
              await transactionController.sendOrderEmail(order);
              
              console.log(`✅ Commande ${order._id} mise à jour avec succès - Statut: ${order.status}`);
              updatedCount++;
              
            } else if (["cancelled", "failed"].includes(status)) {
              // Marquer la transaction comme échouée
              transaction.status = 'failed';
              order.status = 'cancelled';
              order.paymentStatus = 'failed';
              await transaction.save();
              await order.save();
              
              console.log(`❌ Transaction ${transaction.reference} marquée comme échouée`);
              updatedCount++;
            } else if (status) {
              console.log(`⏳ Transaction ${transaction.reference} toujours en attente`);
            }
          }
        }
      } catch (orderError) {
        console.error(`❌ Erreur lors du traitement de la commande ${order._id}:`, orderError);
        errorCount++;
      }
    }
    
    console.log(`🎯 Cron terminé - ${updatedCount} commandes mises à jour, ${errorCount} erreurs`);
    
    return {
      success: true,
      processedOrders: pendingOrders.length,
      updatedOrders: updatedCount,
      errors: errorCount
    };
  } catch (error) {
    console.error('❌ Erreur dans le cron de vérification des paiements:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// générer le contrat
const generateContrat = async (orderId) => {
  try {
    const order = await Order.findById(orderId)
                  .populate('customer')
                  .populate('items.product')

    console.log(order?.customer)
    // générer le fichier
    const pdfFileName = await generatePDF({
      clientName: order?.customer?.name || order?.email,
      clientEmail: order.customer?.email,
      orderNumber: 'ORD-' + order._id.toString().toUpperCase(),
      purchaseDate: order.createdAt.toLocaleDateString(),
      productName: order.typeOrder === 'abonnement' ? order?.items[0].subscription?.title : order.items.map(i => i.product.name).join(', '),
      licenceType: 'Licence de revente'
    });

    console.log('PDF généré à :', pdfFileName.filename);

    // Chemin du fichier PDF
    const pdfFilePath = path.join(__dirname, "../uploads/contrat/", pdfFileName.filename); 

    // Vérifier si le fichier existe
    if (!fs.existsSync(pdfFilePath)) {
      console.error("❌ Le fichier PDF n'existe pas !");
    } else {
        console.log("✅ Le fichier PDF existe !");
    }

    const contratFile = process.env.API_URL+pdfFileName.filename;
    order.contrat = contratFile;
    console.log(order.contrat)
    await order.save();

    return contratFile;
  } catch (error) {
    console.log(error);

  }
}