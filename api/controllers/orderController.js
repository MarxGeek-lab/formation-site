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
const { EmailService } = require('../services/emailService');

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
      orderId: savedOrder._id,
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
      message: `Nouvelle commande sur Rafly. ID: ORD-${savedOrder._id}`,
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