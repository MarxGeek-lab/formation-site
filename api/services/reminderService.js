const Cart = require('../models/Cart');
const Settings = require('../models/Settings');
const nodemailer = require('nodemailer');

class ReminderService {
  constructor() {
    // Configuration du service d'email (à adapter selon votre fournisseur)
    this.emailTransporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  // Traiter les relances en attente
  async processReminders() {
    try {
      console.log('🔄 Traitement des relances en attente...');
      
      const now = new Date();
      const pendingCarts = await Cart.find({
        status: 'abandoned',
        'reminderConfig.sent': false,
        'reminderConfig.scheduledDate': { $lte: now }
      }).populate('userId', 'firstName lastName email');

      console.log(`📧 ${pendingCarts.length} relance(s) à traiter`);

      for (const cart of pendingCarts) {
        await this.sendReminder(cart);
      }

      return {
        processed: pendingCarts.length,
        success: true
      };
    } catch (error) {
      console.error('❌ Erreur lors du traitement des relances:', error);
      return {
        processed: 0,
        success: false,
        error: error.message
      };
    }
  }

  // Envoyer une relance spécifique
  async sendReminder(cart) {
    try {
      const { type } = cart.reminderConfig;

      switch (type) {
        case 'email':
          await this.sendEmailReminder(cart);
          break;
        case 'sms':
          await this.sendSMSReminder(cart);
          break;
        case 'notification':
          await this.sendPushNotification(cart);
          break;
        default:
          console.warn(`⚠️ Type de relance non supporté: ${type}`);
          return;
      }

      // Marquer la relance comme envoyée
      await Cart.findByIdAndUpdate(cart._id, {
        'reminderConfig.sent': true,
        'reminderConfig.sentAt': new Date()
      });

      console.log(`✅ Relance ${type} envoyée pour le panier ${cart._id}`);
    } catch (error) {
      console.error(`❌ Erreur envoi relance pour panier ${cart._id}:`, error);
    }
  }

  // Envoyer une relance par email
  async sendEmailReminder(cart) {
    const userEmail = cart.email || cart.userId?.email;
    
    if (!userEmail) {
      console.warn(`⚠️ Aucun email trouvé pour le panier ${cart._id}`);
      return;
    }

    // Récupérer les paramètres de configuration
    const settings = await Settings.findOne();
    const reminderSettings = settings?.cartReminderSettings || {};

    const userName = cart.userId ? 
      `${cart.userId.firstName} ${cart.userId.lastName}` : 
      'Cher client';

    const totalPrice = cart.totalPrice.toLocaleString('fr-FR');
    const customMessage = cart.reminderConfig.message || reminderSettings.defaultEmailMessage || '';
    const emailSubject = reminderSettings.defaultEmailSubject || 'Votre panier vous attend - Finalisez votre commande !';

    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Votre panier vous attend ! 🛒</h2>
        
        <p>Bonjour ${userName},</p>
        
        <p>Vous avez laissé ${cart.totalItems} article(s) dans votre panier pour un montant de <strong>${totalPrice} FCFA</strong>.</p>
        
        ${customMessage ? `<p style="background: #f5f5f5; padding: 15px; border-radius: 5px;">${customMessage}</p>` : ''}
        
        <div style="margin: 20px 0;">
          <h3>Articles dans votre panier :</h3>
          ${cart.items.map(item => `
            <div style="border: 1px solid #ddd; padding: 10px; margin: 10px 0; border-radius: 5px;">
              <strong>${item.name}</strong><br>
              Quantité: ${item.quantity} - Prix: ${item.price.toLocaleString('fr-FR')} FCFA
            </div>
          `).join('')}
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL}/fr/panier" 
             style="background: #007bff; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Finaliser ma commande
          </a>
        </div>
        
        <p style="color: #666; font-size: 12px;">
          Si vous ne souhaitez plus recevoir ces emails, vous pouvez vous désabonner en cliquant 
          <a href="${process.env.FRONTEND_URL}/unsubscribe?session=${cart.sessionId}">ici</a>.
        </p>
      </div>
    `;

    const mailOptions = {
      from: process.env.SMTP_FROM || 'noreply@academy.marxgeek.com.me',
      to: userEmail,
      subject: emailSubject,
      html: emailContent
    };

    await this.emailTransporter.sendMail(mailOptions);
  }

  // Envoyer une relance par SMS (à implémenter avec votre fournisseur SMS)
  async sendSMSReminder(cart) {
    // Implémentation SMS avec votre fournisseur (Twilio, etc.)
    console.log(`📱 SMS reminder for cart ${cart._id} - À implémenter`);
  }

  // Envoyer une notification push (à implémenter)
  async sendPushNotification(cart) {
    // Implémentation push notification
    console.log(`🔔 Push notification for cart ${cart._id} - À implémenter`);
  }

  // Marquer automatiquement les paniers comme abandonnés
  async markAbandonedCarts() {
    try {
      // Récupérer les paramètres de configuration
      const settings = await Settings.findOne();
      const abandonmentHours = settings?.cartReminderSettings?.abandonmentThreshold || 24;
      
      const abandonmentThreshold = new Date();
      abandonmentThreshold.setHours(abandonmentThreshold.getHours() - abandonmentHours);

      const result = await Cart.updateMany(
        {
          status: 'active',
          lastActivity: { $lt: abandonmentThreshold }
        },
        {
          status: 'abandoned'
        }
      );

      console.log(`🗂️ ${result.modifiedCount} panier(s) marqué(s) comme abandonné(s) (seuil: ${abandonmentHours}h)`);
      return result.modifiedCount;
    } catch (error) {
      console.error('❌ Erreur marquage paniers abandonnés:', error);
      return 0;
    }
  }

  // Nettoyer les anciens paniers
  async cleanupOldCarts() {
    try {
      const cleanupThreshold = new Date();
      cleanupThreshold.setDate(cleanupThreshold.getDate() - 30); // 30 jours

      const result = await Cart.deleteMany({
        status: { $in: ['abandoned', 'converted'] },
        lastActivity: { $lt: cleanupThreshold }
      });

      console.log(`🧹 ${result.deletedCount} ancien(s) panier(s) supprimé(s)`);
      return result.deletedCount;
    } catch (error) {
      console.error('❌ Erreur nettoyage paniers:', error);
      return 0;
    }
  }
}

module.exports = new ReminderService();
