const Transaction = require('../models/Transaction');
const Product = require('../models/Product');
const User = require('../models/User');
const {EmailService} = require('../services/emailService');
const axios = require('axios');
const { getStatusPayment, getGreeting } = require('../utils/helpers');
const Order = require('../models/Order');
const { generateTemplateHtml } = require('../services/generateTemplateHtml');
const { default: MoneroPayment } = require('../services/servicePayment');
const Referral = require('../models/Referral');
const Affiliate = require('../models/Affiliate');

const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const generatePDF = require('../services/generateContrat');

require('dotenv').config();

const transactionController = {
  // Créer une nouvelle transaction
  async createTransaction(req, res) {
    try {
      const {
        amount,
        orderId,
        userId,
        method,
        paymentId,
        totalAmountConvert,
        currency
      } = req.body;

      // Vérifier si la propriété existe
      let order 
      if (method === 'orderId') {
        order = await Order.findById(orderId)
          .populate('customer')
          .populate('items.product');
      } else {
        order = await Order.findOne({ reference: paymentId })
          .populate('customer')
          .populate('items.product');
      }
      
      if (!order) {
        return res.status(404).json({ message: 'Commande non trouvée' });
      }

      // Calculer la commission
      const transaction = new Transaction({
        amount,
        customer: userId,
        order: order._id,
        email: order?.customer?.email || order?.email,
        totalAmountConvert,
        currency
      });

      await transaction.save();

      order.payments.push({
        transaction: transaction._id,
        amount,
        paymentDate: Date.now(),
      });
      await order.save();

      const monero = new MoneroPayment(process.env.MONERO_SECRET_KEY);
      const payment = await monero.initializePayment({
        // amount: 200,
        amount: order?.totalAmount,
        // currency: 'EUR',
        currency: currency || 'XOF',
        description: "Paiement pour la commande ORD-"+order._id?.toString().toUpperCase(),
        customer: {
          email: order?.customer?.email || order?.email,
          first_name: order?.customer?.name || order?.fullName,
          last_name: order?.customer?.name || order?.fullName,
        },
        return_url: process.env.URL_APP+'paiement?orderId='+order._id,
        metadata: {
          order_id: order._id,
          customer_id: userId,
        },
      });
      
      if (payment.success) {
        // const ref = payment.data.reference;
        transaction.reference = payment.data.data.id;
        await transaction.save();
      }

      res.status(201).json({
        success: payment.success,
        statusPayment: transaction.status,
        transactionId: transaction._id,
        url: payment.data.data.checkout_url
      });
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: error.message });
    }
  },

  // Get status
  async getStatusPayment(req, res) {
    try {
      const { paymentId, paymentStatus } = req.body;
      const transaction = await Transaction.findOne({ reference: paymentId });
      if (!transaction) {
        return res.status(404).json({ message: 'Transaction non trouvée' });
      }

      const order = await Order.findById({ _id: transaction.order })
      .populate('customer')
      .populate('items.product');

      if (!order) {
        return res.status(404).json({ message: 'Commande non trouvée' });
      }

      // await sendOrderEmail(order);

      // Enrégistrement de la commission
      let referral = null;
      if (order.affiliate) {
        const affiliate = await Affiliate.findById({ _id: order.affiliate });
        if (affiliate) {
          referral = await Referral.findOne({ orderId: order._id });
        }
      }
     
      if (paymentStatus === 'success')  {
        transaction.status = 'success';
        transaction.completedAt = new Date();

        order.paymentStatus = 'paid';
        order.status = 'confirmed';
        order.paidAmount = order.totalAmount;
        order.completedAt = new Date();

        if (referral) {
          referral.status = 'paid';
          await referral.save();
        }

        const expiredAt = order.typeOrder === 'abonnement' ? new Date(new Date().getTime() + JSON.parse(order.items[0].subscription)?.duration * 24 * 60 * 60 * 1000) : '';
        order.subscriptionExpiredAt = expiredAt;

        await sendOrderEmail(order);

        console.log("Email envoyé avec succès");

        await transaction.save();
        await order.save();
        return res.status(200).json({
          statusPayment: transaction.status,
          orderId: order._id
        });
      }

      const monero = new MoneroPayment(process.env.MONERO_SECRET_KEY);
      const response = await monero.verifyPayment(transaction.reference);
      const status = response.data.data.status;

      if (status === 'success') {
        transaction.status = 'success';
        transaction.completedAt = new Date();

        order.paymentStatus = 'paid';
        order.status = 'confirmed';
        order.paidAmount = order.totalAmount;
        order.completedAt = new Date();

        if (referral) {
          referral.status = 'paid';
          await referral.save();
        }

        await sendOrderEmail(order);
        console.log("Email envoyé avec succès");

        await order.save();
        // Mettre à jour la balance du propriétaire
        // await commonService.updateBalanceOwner(transaction.seller); 
      } else if (status === 'pending') {
        transaction.status = 'pending';
      } else {
        transaction.status = 'failed';
      }

      await transaction.save();

      res.status(200).json({
        statusPayment: transaction.status,
        orderId: order._id
      });
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: error.message });
    }
  },

  // Obtenir les rapports de commission
  async getCommissionReports(req, res) {
    try {
      const { startDate, endDate, period } = req.query;
      
      let dateFilter = {};
      if (startDate && endDate) {
        dateFilter = {
          completedAt: {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
          }
        };
      }

      // Aggrégation selon la période
      const groupBy = {
        day: { $dateToString: { format: "%Y-%m-%d", date: "$completedAt" } },
        week: { $week: "$completedAt" },
        month: { $dateToString: { format: "%Y-%m", date: "$completedAt" } },
        year: { $dateToString: { format: "%Y", date: "$completedAt" } }
      };

      const reports = await Transaction.aggregate([
        { 
          $match: { 
            ...dateFilter,
            status: 'COMPLETED'
          } 
        },
        {
          $group: {
            _id: groupBy[period || 'day'],
            totalTransactions: { $sum: 1 },
            totalAmount: { $sum: "$amount" },
            totalCommission: { $sum: "$commission.amount" },
            transactions: {
              $push: {
                id: "$_id",
                amount: "$amount",
                commission: "$commission",
                type: "$transactionType"
              }
            }
          }
        },
        { $sort: { _id: -1 } }
      ]);

      // Calculer les totaux globaux
      const totals = await Transaction.aggregate([
        {
          $match: {
            ...dateFilter,
            status: 'COMPLETED'
          }
        },
        {
          $group: {
            _id: null,
            totalTransactions: { $sum: 1 },
            totalAmount: { $sum: "$amount" },
            totalCommission: { $sum: "$commission.amount" },
            averageCommission: { $avg: "$commission.amount" }
          }
        }
      ]);

      res.json({
        reports,
        summary: totals[0] || {
          totalTransactions: 0,
          totalAmount: 0,
          totalCommission: 0,
          averageCommission: 0
        }
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Mettre à jour le statut d'une transaction
  async updateTransactionStatus(req, res) {
    try {
      const { id } = req.params;
      const { status, reference } = req.body;
      console.log(req.params)

      const transaction = await Transaction.findById(id);
      if (!transaction) {
        return res.status(404).json({ message: 'Transaction non trouvée' });
      }


      transaction.status = status;
      if (reference) transaction.reference = reference;
      if (status === 'success') {
        transaction.completedAt = new Date();
      }

      await transaction.save();

      res.json({
        message: 'Statut de la transaction mis à jour',
        transaction
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Obtenir les détails d'une transaction
  async getTransactionDetails(req, res) {
    try {
      const transaction = await Transaction.findById(req.params.transactionId)
        .populate('property')
        .populate('seller', 'firstName lastName email phoneNumber country city address')
        .populate('buyer', 'firstName lastName email phoneNumber country city address');

      if (!transaction) {
        return res.status(404).json({ message: 'Transaction non trouvée' });
      }

      res.json(transaction);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async getPaymentsByUserTenant(req, res) {
    try {
      const transaction = await Transaction.find({ buyer: req.params.id })
        .populate({ path: 'reservation', populate: { path: 'property' }})
        .populate('seller', 'name phoneNumber email picture phoneNumber country city address')
        .sort({ createdAt: -1 })

      res.json(transaction);
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: error.message });
    }
  },

  async getPaymentsByUserOwner(req, res) {
    try {
      const transaction = await Transaction.find({ buyer: req.params.id })
        .populate({ path: 'reservation', populate: { path: 'property' }})
        .populate('seller', 'name phoneNumber email picture phoneNumber country city address')
        .populate('buyer', 'firstName lastName email phoneNumber country city address')
        .sort({ createdAt: -1 });

      res.json(transaction);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },


  async getPaymentsBySeller(req, res) {
    try {
      let transactions;

      // Si l'utilisateur est super_admin, il voit toutes les transactions
      if (req?.user?.role === 'super_admin') {
        transactions = await Transaction.find()
          .populate('order')
          .populate('customer')
          .sort({ createdAt: -1 });
      }
      // Si l'utilisateur est admin, il ne voit que les transactions liées à ses produits
      else if (req?.user?.role === 'admin') {
        const adminId = req?.user?._id;
        
        // Récupérer les produits assignés à cet admin
        const Product = require('../models/Product');
        const adminProducts = await Product.find({ assignedAdminId: adminId }).select('_id');
        const productIds = adminProducts.map(product => product._id);

        // Récupérer les commandes contenant les produits de cet admin
        const Order = require('../models/Order');
        const adminOrders = await Order.find({
          'items.product': { $in: productIds }
        }).select('_id');
        const orderIds = adminOrders.map(order => order._id);

        // Récupérer les transactions liées à ces commandes
        transactions = await Transaction.find({
          order: { $in: orderIds }
        })
          .populate('order')
          .populate('customer')
          .sort({ createdAt: -1 });
      } else {
        // Si le rôle n'est ni super_admin ni admin
        return res.status(403).json({ 
          success: false,
          message: "Accès non autorisé" 
        });
      }

      res.json(transactions);
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: error.message });
    }
  },

  async getPaymentsById(req, res) {
    try {
      const transaction = await Transaction.findOne({ _id: req.params.id })
        .populate('order')
        .populate('customer')

      res.json(transaction);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // 
  async updateWithdrawableAmount(req, res) {
    try {
      const { id, adminId, owner } = req.params;
  
      const transaction = await Transaction.findById(id);
      if (!transaction) {
        return res.status(404).json({ message: 'Transaction non trouvée' });
      }
  
      transaction.withdrawable = !transaction.withdrawable;
      transaction.withdrawableBy = adminId;
      await transaction.save();
  
      const ownerUser = await User.findById(owner);
      if (!ownerUser) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }
  
      if (!ownerUser.balance) {
        ownerUser.balance = { totalWithdrawable: 0 };
      }
  
      if (transaction.withdrawable) {
        ownerUser.balance.totalWithdrawable += transaction.amount;
      } else {
        ownerUser.balance.totalWithdrawable = Math.max(0, ownerUser.balance.totalWithdrawable - transaction.amount);
      }
  
      await ownerUser.save();
  
      res.json({
        message: 'Statut de la transaction mis à jour avec succès.',
        transaction
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  
};

const sendOrderEmail = async (order) => {
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
    console.log("product abo == ", order.items[0].subscription?.relatedProducts)
    fileSale = order.items[0].subscription?.relatedProducts?.map(item => item.saleDocument);
    console.log('fileSale abo == ', fileSale)
  }

  const allFiles = fileSale.flat(); // tout mettre dans un seul tableau
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

  console.log("debu mail == ")
  if (!fileContratLink) {
        // générer le fichier
        const pdfFileName = await generatePDF({
          clientName: order?.customer?.name,
          clientEmail: order.customer.email,
          orderNumber: 'ORD-' + order._id.toString().toUpperCase(),
          purchaseDate: order.createdAt.toLocaleDateString(),
          productName: order.typeOrder === 'abonnement' ? order?.items[0].nameSubs : order.items.map(i => i.product.name).join(', '),
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
        fileContratLink = contratFile;

        console.log("fileContratLink ==", fileContratLink)
  }
  
  console.log("debu mail 1 == " )
  order.productZip = fileZipLink;
  await order.save();

  console.log("debu mail 2 == ")
  // Générer le mail HTML
  const html = `
  <!DOCTYPE html>
  <html lang="fr">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Email Confirmation</title>
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
                  <h2 style="margin-bottom:15px; color:#333;">Merci pour votre ${isSubscription ? 'abonnement ':'achat '} 🎉</h2>
                  <p style="color:#555; font-size:16px; margin-bottom:25px;">
                    Votre ${isSubscription ? 'abonnement ':'commande '} a bien été enregistrée et traitée. Vous pouvez télécharger vos fichiers en utilisant les boutons ci-dessous :
                  </p>
                  <p style="color:#555; font-size:16px; margin-bottom:25px;">
                    Veuillez noter que si vous n'avez encore un compte utilisateur, un compte vous a été créer automatiquement avec le email fourni lors de votre achat.
                    Réinitialisez le mot de passe pour vous connecter.
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

  console.log("debu mail 3 == ")
  // Envoyer le mail
  const emailService = new EmailService();
  emailService.setSubject(`${isSubscription ? 'Abonnement ':'Commande '} ORD-${order?._id?.toString().toUpperCase()} confirmée sur Rafly`);
  emailService.setFrom(process.env.EMAIL_HOST_USER, "Rafly");
  emailService.addTo(order?.customer?.email || order?.email);
  emailService.setHtml(html);

  console.log("debu mail 4 == ")
  await emailService.send();
console.log("Email envoyé avec succès 22222")

  return { zipPath, fileContratLink };
};


module.exports = transactionController; 