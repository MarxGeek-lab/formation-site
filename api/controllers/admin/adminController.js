const Admin = require('../../models/Admin');
const { sendNotificationByMail } = require('../../utils/sendNotificationByMail');
const User = require('../../models/User');
const Transaction = require('../../models/Transaction');
const { generateToken, generateAccessToken } = require('../../utils/auth');
const { verifyPassword, getGreeting, encryptData, encryptPassword, getStatusPayout } = require('../../utils/helpers');
const EmailService = require('../../services/emailService');
const { generateTemplateHtml } = require('../../services/generateTemplateHtml');
const Sale = require('../../models/Sale');
const Product = require('../../models/Product');
const HelpCenter = require('../../models/helpCenter');
const Notifications = require('../../models/Notifications');

const SiteSettings = require('../../models/Settings');
const Order = require('../../models/Order');

require('dotenv').config();

const adminController = {
  // ====== GESTION DES ADMINS ======

  // Obtenir la liste des admins
  async getAllAdmins(req, res) {
    try {
      const admins = await Admin.find()
        .select('-password')
        .sort({ createdAt: -1 });
      res.json(admins);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Obtenir un admin par ID
  async getAdminById(req, res) {
    try {
      console.log(req.params)
      const admin = await Admin.findById(req.params.id).select('-password');
      if (!admin) return res.status(404).json({ message: 'Admin non trouvé' });
      res.json(admin);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Création d'un admin avec envoi d'email pour définir le mot de passe
  async createAdmin(req, res) {
    try {
      console.log(req.body)
      const { email, phoneNumber, name, role, permissions, createdBy } = req.body;

      // Vérifier si l'email existe déjà
      const existingAdmin = await Admin.findOne({ email: email });
      if (existingAdmin) {
        return res.status(400).json({ message: 'Cet email est déjà utilisé' });
      }

       // Générer un token temporaire pour la définition du mot de passe
       const passwordToken = encryptData({ email });
       const passwordTokenExpiry = Date.now() + 24 * 60 * 60 * 1000; // 24 heures 

      const newAdmin = new Admin({
        email,
        name,
        role,
        phoneNumber,
        permissions,
        passwordToken,
        passwordTokenExpiry,
        createdBy: createdBy 
      });

      await newAdmin.save();

      const siteSettings = await SiteSettings.findOne();

      // Envoyer l'email avec le lien de définition du mot de passe
      const resetLink = `${process.env.URL_ADMIN}${process.env.URL_RESET_PWD}?token=${passwordToken}`;
      // Configuration de l'email à envoyer
      const emailService = new EmailService();
      emailService.setSubject(`Activation de votre compte sur ${siteSettings?.websiteTitle}`);
      emailService.setFrom(process.env.EMAIL_HOST_USER, siteSettings?.websiteTitle);
      emailService.addTo(email);
      emailService.setHtml(generateTemplateHtml("templates/adminPassword.html", {
        salutation: getGreeting(),
        fullname: newAdmin?.name,
        link: resetLink,
        logo: process.env.API_URL+siteSettings?.logoUrl
      }));
      await emailService.send(); // Envoi de l'email
      

      res.status(201).json({ 
        message: 'Admin créé avec succès. Un email a été envoyé pour la définition du mot de passe' 
      });
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: error.message });
    }
  },

  // Connexion admin
  async login(req, res) {
    try {
      console.log("=== ", req.body)
      const { email, password } = req.body;

      const admin = await Admin.findOne({ email: email });
      if (!admin) {
        return res.status(401).json({ message: 'Identifiants invalides' });
      }

      if (!admin.isActive) {
        return res.status(401).json({ message: 'Ce compte est désactivé' });
      }

      const isValidPassword = await verifyPassword(password, admin.password);
      if (!isValidPassword) {
        return res.status(400).json({ message: 'Identifiants invalides' });
      }

      // Mise à jour de la dernière connexion
      admin.lastLogin = Date.now();
      await admin.save();

      // Générer le JWT
      const data = {
        ...(await Admin.findOne({email: email}).lean())
      }
      const accessToken = generateAccessToken(data);

      res.json({ accessToken });
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: error.message });
    }
  },

  // Modification d'un admin
  async updateAdmin(req, res) {
    try {
      const { id } = req.params;
      const { name, phoneNumber, role, permissions } = req.body;

      const admin = await Admin.findById(id);
      if (!admin) {
        return res.status(404).json({ message: 'Admin non trouvé' });
      }

      // Mise à jour des champs
      admin.name = name || admin.name;
      admin.role = role || admin.role;
      admin.phoneNumber = phoneNumber || admin.phoneNumber;
      admin.permissions = permissions || admin.permissions;

      await admin.save();

      res.status(200).json({ message: 'Admin mis à jour avec succès', admin });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  },

  async updateStatusAdmin(req, res) {
    try {
      const { id } = req.params;
      const { isActive } = req.body;

      const admin = await Admin.findById(id);
      if (!admin) {
        return res.status(404).json({ message: 'Admin non trouvé' });
      }

      // Mise à jour des champs
      admin.isActive = isActive;
      await admin.save();

      res.json({ message: 'Admin mis à jour avec succès', admin });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  },

  // delete
  async deleteAdmin(req, res) {
    try {
      const admin = await Admin.findById(req.params.id);

      if (!admin) return res.status(404).json({msg: ''});

      await admin.deleteOne();

      res.status(200).json({msg: ''});
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  },

  // Activation/Désactivation d'un admin
  async toggleActivation(req, res) {
    try {
      const { id } = req.params;
      const admin = await Admin.findById(id);

      if (!admin) {
        return res.status(404).json({ message: 'Admin non trouvé' });
      }

      admin.isActive = !admin.isActive;
      await admin.save();

      res.json({ 
        message: `Admin ${admin.isActive ? 'activé' : 'désactivé'} avec succès`,
        isActive: admin.isActive 
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Demande de réinitialisation de mot de passe
  async requestPasswordReset(req, res) {
    try {
      console.log(req.body)
      const { email } = req.body;
      const admin = await Admin.findOne({ email: email });

      if (!admin) {
        return res.status(404).json({ message: 'Admin non trouvé' });
      }

      const data = {
        email: admin.email,
      }

      const resetToken = await encryptData(data);
      admin.passwordToken = resetToken;
      admin.passwordTokenExpiry = Date.now() + 3600000; // 1 heure

      await admin.save();

      const siteSettings = await SiteSettings.findOne();

      // Envoyer l'email avec le lien de définition du mot de passe
      const resetLink = `${process.env.URL_ADMIN}${process.env.URL_RESET_PWD}?token=${resetToken}`;
      // Configuration de l'email à envoyer
      const emailService = new EmailService();
      emailService.setSubject(`Réinitialiser votre mot de passe sur ${siteSettings?.websiteTitle}`);
      emailService.setFrom(process.env.EMAIL_HOST_USER, siteSettings?.websiteTitle);
      emailService.addTo(admin.email);
      emailService.setHtml(generateTemplateHtml("templates/adminPassword.html", {
        salutation: getGreeting(),
        fullname: admin?.name,
        link: resetLink,
        logo: process.env.API_URL+siteSettings?.logoUrl,
        websiteTitle: siteSettings?.websiteTitle
      }));
      await emailService.send();

      res.status(200).json({ message: 'Email de réinitialisation envoyé' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Réinitialisation du mot de passe
  async resetPassword(req, res) {
    try {
      console.log(req.body)
      const { token, password } = req.body;

      const admin = await Admin.findOne({
        passwordToken: token
        // resetPasswordExpires: { $gt: Date.now() }
      });

      if (!admin) {
        return res.status(400).json({ 
          message: 'Token invalide ou expiré' 
        });
      }

      // Hachage du nouveau mot de passe
      const hashedPassword = await encryptPassword(password);
      admin.password = hashedPassword;
      admin.passwordToken = "";
      admin.passwordTokenExpiry = "";

      await admin.save();

      res.json({ message: 'Mot de passe modifié avec succès' });
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: error.message });
    }
  },

 
   // ====== GESTION DES UTILISATEURS ======

  // Obtenir tous les utilisateurs avec filtres
  async getUsers(req, res) {
    try {
      const users = await User.find()
        .select('-password')
        .sort({ createdAt: -1 });

      res.json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Approuver/Rejeter un utilisateur
  async updateUserStatus(req, res) {
    try {
      console.log(req.body)
      const { status, reason, userId, admin } = req.body;

      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

      user.managedBy.push({
        admin: admin,
        action: status,
        date: new Date()
      });

      if (reason) user.rejectionReason = reason;
      user.status = status;
      if (status === 'approved') user.isVerified = true
      await user.save();

     // Envoyer un email de notification à l'utilisateur
      const emailSubject = status === 'approved' 
      ? 'Compte approuvé' 
      : status === 'rejected' 
        ? 'Compte rejeté' 
        : 'Compte supprimé';

      const emailText = status === 'approved'
      ? 'Votre compte a été approuvé. Vous pouvez maintenant vous connecter.'
      : status === 'rejected'
        ? `Votre compte a été rejeté pour la raison suivante : ${reason}. Veuillez contacter le support si vous avez des questions.`
        : 'Votre compte a été supprimé. Si vous pensez qu\'il s\'agit d\'une erreur, veuillez contacter notre support.'; 


      const emailService = new EmailService();
      emailService.setSubject(`${emailSubject} sur STORE`);
      emailService.setFrom(process.env.EMAIL_HOST_USER, "STORE");
      emailService.addTo(user?.email);
      emailService.setHtml(generateTemplateHtml("templates/notificationMessage.html", {
        salutation: getGreeting(),
        message: emailText,
        fullname: user?.name
      }));
      await emailService.send();

      // Notifications
      const notification = new Notifications({
        content: emailText,
        title: status === 'approved' ? 'Compte approuvé' : status === 'rejected' ? 'Compte rejeté' : 'Compte supprimé',
        user: user?._id,
        type: 'user',
        activity: 'account'
      });

      await notification.save();

      res.json({ message: 'Statut utilisateur mis à jour avec succès' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  
  async getStatsEarning (req, res) {
    try {
      // const revenue = await Transaction.
    } catch (error) {
      console.log(error) 
      res.status(500).json({ message: error.message });
    }
  },
  /**
   * Product
   */

  getAllProducts: async (req, res) => {
    try {
      const products = await Product.find()
                .sort({ createdAt: -1 });

      res.json(products);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error', error });
    }
  },

  /**
   * Orders
   */
  async getAllOrders(req, res) {
    try {
      const orders = await Order.find()
        .populate('customer')
        .populate('payments.transaction')
        .sort({ createdAt: -1 });

      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async getOrdersById(req, res) {
    try {
      const order = await Order.findById(req.params.id)
        .populate('customer', 'name email picture')
        .populate('payments.transaction')
        .populate('items.product', 'name price photos')
        .populate('payments.transaction')
        .sort({ createdAt: -1 });

      res.json(order);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  /**
   * transactions
   */

  async getAllTransactions(req, res) {
    try {
      const transactions = await Transaction.find()
        .populate({ path: 'Order', populate: { path: 'items.product' } })
        .populate('Order.customer')
        .sort({ createdAt: -1 })

      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async getTransactionsById(req, res) {
    try {
      const transactions = await Transaction.findOne({ _id: req.params.id })
        .populate({ path: 'reservation', populate: { path: 'property' } })
        .populate('seller', 'name phoneNumber email picture country city district')
        .populate('buyer', 'name phoneNumber email picture country city district')
        .populate('user', 'name phoneNumber email picture country city district');

      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  /****
   * Supports
   */
  async getSupportsMessage(req, res) {
    try {
      const messages = await HelpCenter.find().populate('user');

      res.json(messages);
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: error.message });
    }
  },

};

module.exports = adminController; 