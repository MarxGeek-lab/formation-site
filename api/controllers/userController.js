require("dotenv").config();
const User = require('../models/User');
const { generateTemplateHtml } = require('../services/generateTemplateHtml');
const { generateAccessToken, generateToken } = require('../utils/auth');
const { encryptPassword, generateVerificationCode, verifyPassword, decryptData, encryptData } = require('../utils/helpers');
const path = require("path");
const fs = require("fs");
const { EmailService } = require("../services/emailService");
const Affiliate = require("../models/Affiliate");
const { generateRefCode } = require("../utils/generateRefCode");
const SiteSettings = require("../models/Settings");

const userController = {
  // Fonction pour créer un utilisateur
  signUp: async (req, res) => {
    try {
      const { name, email, password, phoneNumber, origin, affiliate  } = req.body;

      // Lire le cookie envoyé automatiquement
      const affiliateRef = req.headers['x-affiliate-ref'];
      console.log("affiliateRef reçu == ", affiliateRef)

      // Vérifier si l'email est déjà utilisé
      const existingUser = await User.findOne({ email: email });
      if (existingUser) {
        return res.status(409).json({ message: 'Email already exists' });
      }

      // Hashage du mot de passe
      const hashedPassword = await encryptPassword(password);

       // Génération d'un code d'activation pour le compte
      const otp = generateVerificationCode();

      // Créer un nouvel utilisateur
      const newUser = new User({
        name,
        email,
        phoneNumber,
        password: hashedPassword,
        otp,
        isActive: true,
        isAffiliate: affiliate ? true : false
      });
      
      // Préparation des données pour le service d'email
      const link = `${origin}/activer-mon-compte`;
      const emailData = { fullname: name, otp };

      // Configuration de l'email à envoyer
      const emailService = new EmailService();
      emailService.setSubject("Activation de votre compte sur Rafly");
      emailService.setFrom(process.env.EMAIL_HOST_USER, "Rafly");
      emailService.addTo(email);
      emailService.setHtml(generateTemplateHtml("templates/activeAccount.html", emailData));
      await emailService.send(); // Envoi de l'email

      if (affiliateRef) {
        // Chercher l'affilié correspondant
        const affiliate = await Affiliate.findOne({ refCode: affiliateRef });
        if (affiliate) {
          newUser.referredBy = affiliate._id;
          affiliate.referrals.push(newUser._id);
          await affiliate.save();
        }
      }

      // generate unique refCode
      if (affiliate) {
        let refCode = generateRefCode();
        while (await Affiliate.findOne({ refCode })) {
            refCode = generateRefCode();
        }

        const baseUrl = process.env.URL_APP || "https://rafly.me";
        let affiliate_user = await Affiliate.findOne({ user: newUser._id });
        if (!affiliate_user) {
          const settings = await SiteSettings.findOne();
          affiliate_user = await Affiliate.create({
            user: newUser._id,
            refCode,
            referralLink: `${baseUrl}?ref=${refCode}`,
            commissionRate: settings.percentAffiliate,
          });

          await affiliate_user.save();

          newUser.isAffiliate = true;
          await newUser.save()
        }
      }

      // Sauvegarder l'utilisateur dans la base de données
      await newUser.save();
      return res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Server error', error });
    }
  },

  signIn: async (req, res) => {
    const { email, password, fullname, id, country, phone, roles, authToken, typeAuth, affiliate } = req.body;
    console.log(req.body);
    try {
      const affiliateRef = req.headers['x-affiliate-ref'];
      // lors d'une connexion, si l'id renvoyé n'est pas null, alors il s'agit d'une connexion par réseaux social
      if (id) {
        // on vérifie d'abord s'il s'est déjà connecté une fois
        const cond = {
          ...(typeAuth === "google" ? { googleId: id } : { facebookId: id })
        };
        const userExisting = await User.findOne(cond);

        if (userExisting) {
          console.log(req.body);
          // si oui, alors on return un token
          const user = {
            email: userExisting.email,
            role: userExisting.roles,
            id: userExisting._id,
            fullName: userExisting.fullName,
            country: userExisting.country,
          };

          console.log("userExisting======", userExisting);

          userExisting.authToken = authToken;
          userExisting.expiresIn = Date.now() + 39551000;
          await userExisting.save();

          const accessToken = generateAccessToken(user);

          return res.status(200).json({
            accessToken,
            typeAccount: "clientAuth",
          });
        } // sinon, on créer l'utilisateur

        const newUser = new User({
          ...(typeAuth === "google" ? { googleId: id } : { facebookId: id }),
          fullname,
          country,
          phone,
          roles,
          typeAccount: "clientAuth",
          authToken: authToken,
          expiresIn: Date.now() + 39551000,
          isActive: true,
        });

        await newUser.save();

        const accessToken = generateToken(newUser);

        return res.status(200).json({
          accessToken,
          typeAccount: "clientAuth",
        });
      } // si l'id est null, alors c'est connexion par défaut

      // Recherche de l'utilisateur par email
      const userExisting = await User.findOne({ email: email });

      if (!userExisting) return res.status(404).json({ error: "no email" });

      // Vérification du mot de passe
      const isPasswordValid = await verifyPassword(password, userExisting.password);
      if (!isPasswordValid) {
        return res.status(400).json({ error: "mot de passe incorrect" });
      }

      // mise à jour des information relative à la connexion
      userExisting.lastLogin +=1;
      userExisting.lastLogin = new Date();
      await userExisting.save();

      if (affiliate) {
        let refCode = generateRefCode();
        while (await Affiliate.findOne({ refCode })) {
            refCode = generateRefCode();
        }

        const baseUrl = process.env.URL_APP || "https://rafly.me";
        let affiliate_user = await Affiliate.findOne({ user: userExisting._id });
        if (!affiliate_user) {
          const settings = await SiteSettings.findOne();

          affiliate_user = await Affiliate.create({
            user: userExisting._id,
            refCode,
            referralLink: `${baseUrl}?ref=${refCode}`,
            commissionRate: settings.percentAffiliate,
          });

          await affiliate_user.save();

          userExisting.isAffiliate = true;
          await userExisting.save()
        }
      }

      // Génération du token JWT avec une durée d'une journée
      const user = await User.findOne({ email: email }).lean();
      const accessToken = generateAccessToken(user);

      return res.status(200).json({ accessToken, typeAccount: userExisting.typeAccount });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Une erreur est survenue lors de la connexion" });
    }
  },

  activeAccount: async (req, res) => {
    const { code } = req.body;
    console.log(req.body)
    try {
      // Recherche de l'utilisateur avec le code d'activation spécifié
      const userVerify = await User.findOne({ otp: Number(code) });

      // Si aucun utilisateur n'est trouvé avec le code d'activation spécifié, retourner une réponse sans contenu
      if (!userVerify) {
        return res.status(404).json({});
      }

      // Activation du compte de l'utilisateur 
      userVerify.isActive = true;
      userVerify.otp = 0;
      await userVerify.save();

      // Répondre avec un message de confirmation
      return res.status(200).json({ msg: "Compte activé avec succès." });
    } catch (error) {
      console.error("Erreur lors de l'activation du compte:", error);
      return res.status(500).json({ error: "Une erreur est survenue lors de l'activation du compte." });
    }
  },

  resendCodeOtp: async (req, res) => {
    const { email, action } = req.body;
    console.log(req.body)
    try {
      const userVerify = await User.findOne({ email: email });
  
      if (!userVerify) {
        return res.status(404).json();
      }
  
      const otp = generateVerificationCode();
      const fullName = userVerify.name
      const data = { fullname: fullName, otp };
  
      const emailService = new EmailService();
      emailService.setSubject(`${action ? "Confirmation de votre mail":"Activation de votre compte"} sur Rafly`);
      emailService.setFrom(process.env.EMAIL_HOST_USER, "Rafly");
      emailService.addTo(email);
      emailService.setHtml(
        generateTemplateHtml(action ? "templates/resetPwdMobile.html":"templates/activeAccount.html", data),
      );
      await emailService.send();
  
      userVerify.otp = otp;
      await userVerify.save();
  
      return res.status(200).json({ msg: "ok" });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "Une erreur est survenue lors de la création du compte" });
    }
  },
  
  resendActivationCode: async (req, res) => {
    const { email } = req.body;
    console.log(req.body);
    try {
      // Recherche de l'utilisateur avec l'email spécifié
      const user = await User.findOne({ email: email });

      if (!user) {
        return res.status(404).json({});
      }

      // Génération d'un code d'activation pour le compte
      const otp = generateVerificationCode();
      
      const fullname = `${user.name}`;

      // Préparation des données pour le service d'email
      const link = `${process.env.URL_APP}activer-mon-compte`;
      const emailData = { fullname, otp, link };

      // Configuration de l'email à envoyer
      const emailService = new EmailService();
      emailService.setSubject("Activation de votre compte sur Rafly");
      emailService.setFrom(process.env.EMAIL_HOST_USER, "Rafly");
      emailService.addTo(email);
      emailService.setHtml(generateTemplateHtml("templates/activeAccount.html", emailData));
      await emailService.send(); // Envoi de l'email

      // Mise à jour du code d'activation de l'utilisateur
      user.otp = otp;
      await user.save();

      // Répondre avec un message de confirmation
      return res.status(200).json({ msg: "Code renvoyé." });
    } catch (error) {
      console.error("Erreur lors de l'envoi du code d'activation:", error);
      return res.status(500).json({ error: "Une erreur est survenue lors de l'envoi du code d'activation." });
    }
  },

  verifyEmailLoginClientAuth: async (req, res) => {
    const { id, expiresIn, authToken, typeAuth } = req.body;

    // Vérification de la présence des données dans le corps de la requête
    if (!id || !authToken) {
      return res.status(400).json({ message: 'ID and authToken are required' });
    }

    console.log(req.body);

    try {
      // Chercher l'utilisateur par ID
      const cond = {
        ...(typeAuth === "google" ? { googleId: id } : { facebookId: id })
      };

      const userExisting = await User.findOne(cond);

      if (!userExisting) {
        return res.status(204).json({ message: 'User not found' }); // Utilisation de 204 avec un message approprié
      }

      if (userExisting.typeAccount !== "clientAuth") {
        return res.status(400).json({ message: 'Invalid account type' }); // Si le type de compte n'est pas "clientAuth"
      }

      // Vérifier si le type de compte est "clientAuth"
      const user = {
        id: userExisting._id,
        email: userExisting.email,
        fullname: userExisting.fullName,
        roles: userExisting.roles,
        country: userExisting.country,
      };

      // Mettre à jour le token d'authentification et l'expiration
      userExisting.clientAuthToken = authToken;

      if (expiresIn) {
        userExisting.expiresIn = Date.now() + Number(expiresIn) * 1000;
      } else {
        userExisting.expiresIn = Date.now() + 3955000; // Temps par défaut si expiresIn n'est pas fourni
      }

      // Sauvegarder les modifications
      await userExisting.save(); // Ajout de `await` pour assurer l'attente de la sauvegarde

      // Générer le token d'accès
      const accessToken = generateAccessToken(user);

      // Retourner la réponse avec le token et le type de compte
      return res.status(200).json({
        accessToken,
        typeAccount: "clientAuth",
      });
    
    } catch (error) {
      console.error(error); // Log de l'erreur pour le débogage
      return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  },

  // Vérifier l'email
  verifyEmail: async (req, res) => {
    const { email } = req.body;
    try {
      const userVerify = await User.findOne({ email });

      if (!userVerify) {
        return res.status(204).json();
      }

      const token = encryptData({email, id: userVerify._id});
      const emailData = { 
        fullname: `${userVerify.name}`, 
        link: `${process.env.URL_APP}reinitialiser-mot-de-passe?cod=${token}`   
      };

      const emailService = new EmailService();
      emailService.setSubject("Confirmation de votre email sur Rafly");
      emailService.setFrom(process.env.EMAIL_HOST_USER, "Rafly");
      emailService.addTo(email);
      emailService.setHtml(generateTemplateHtml("templates/verifyEmail.html", emailData));
      await emailService.send();

      await userVerify.save();

      return res.status(200).json({ msg: "Code de vérification envoyé." });
    } catch (error) {
      console.error("Erreur lors de la vérification de l'email:", error);
      return res.status(500).json({ error: "Une erreur est survenue lors de la vérification de l'email." });
    }
  },

  // Confirmer l'email du marchand
  confirmEmail: async (req, res) => {
    const { code } = req.body;
    try {
      const userVerify = await User.findOne({ otp: Number(code) });

      if (!userVerify) {
        return res.status(204).json();
      }

      userVerify.otp = 0;
      await userVerify.save();

      return res.status(200).json({ email: userVerify.email });
    } catch (error) {
      console.error("Erreur lors de la confirmation de l'email:", error);
      return res.status(500).json({ error: "Une erreur est survenue lors de la confirmation de l'email." });
    }
  },

  // Réinitialiser le mot de passe
  resetPwd: async (req, res) => {
    const { password, token } = req.body;
    console.log(req.body)
    try {
      const decoded = JSON.parse(decryptData(token));
      console.log(decoded);
      console.log(decoded.email);
      const userVerify = await User.findOne({ email: decoded.email });

      if (!userVerify) {
        return res.status(204).json();
      }

      userVerify.password = await encryptPassword(password);
      await userVerify.save();

      return res.status(200).json({ msg: "Mot de passe réinitialisé" });
    } catch (error) {
      console.error("Erreur lors de la réinitialisation du mot de passe:", error);
      return res.status(500).json({ error: "Une erreur est survenue lors de la réinitialisation du mot de passe." });
    }
  },

  resetPwdMobile: async (req, res) => {
    const { password, email } = req.body;
    console.log(req.body)
    try {
      const userVerify = await User.findOne({ email: email });

      if (!userVerify) {
        return res.status(204).json();
      }

      userVerify.password = await encryptPassword(password);
      await userVerify.save();

      return res.status(200).json({ msg: "Mot de passe réinitialisé" });
    } catch (error) {
      console.error("Erreur lors de la réinitialisation du mot de passe:", error);
      return res.status(500).json({ error: "Une erreur est survenue lors de la réinitialisation du mot de passe." });
    }
  },

  // Désactiver un utilisateur
  desactiveUser: async (req, res) => {
    try {
      console.log(req.params)
      // Désactivation de l'utilisateur par ID
      const user = await User.findOneAndUpdate(
        { _id: req.params.id },
        { $set: { isActive: false } },
        { new: true }
      );

      // Vérification si l'utilisateur a été désactivé
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé pour désactivation' });
      }

      return res.status(200).json({ message: 'Utilisateur désactivé avec succès' });
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Erreur lors de la désactivation de l\'utilisateur', error });
    }
  },

  // Marquer un utilisateur comme supprimé
  deleteUser: async (req, res) => {
    try {
      console.log(req.params)
      // Marquer l'utilisateur comme supprimé par ID
      const userExisting = await User.findOneAndUpdate(
        { _id: req.params.id },
        { $set: { isDeleted: true } },
        { new: true }
      );

      // Vérification si l'utilisateur a été marqué comme supprimé
      if (!userExisting) {
        return res.status(404).json({ message: 'Utilisateur non trouvé pour suppression' });
      }

      return res.status(200).json({ message: 'Utilisateur marqué comme supprimé avec succès' });
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Erreur lors de la suppression de l\'utilisateur', error });
    }
  },

  validUser: async (req, res) => {
    const { status } = req.body;

    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.id },
        { $set: { status: status } },
        { new: true }
      );
      
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé pour validation' });
      }
      
      return res.status(200).json({ message: 'Utilisateur validé ou rejeté avec succès' });
    } catch (error) {
      return res.status(500).json({ message: 'Erreur lors de la validation ou du rejet de l\'utilisateur', error });
    }
  },

  // get user by id
  getUserById: async (req, res) => {
    try {
      const user = await User.findById(req.params.id)
        .lean();
      return res.json(user)
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Erreur lors de la validation ou du rejet de l\'utilisateur', error });
    }
  },

  updateUser: async (req, res) => {
    try {
      const photo = req.files?.images?.map((file) => file.filename)[0] || '';

      // Trouver l'utilisateur par son ID
      const userExisting = await User.findById(req.params.id);
      if (!userExisting) {
        return res.status(404).json({ message: 'Utilisateur non trouvé pour la mise à jour' });
      }

      let addressShipping = userExisting.addressShipping;
      if (req.body.action === 'addAddress') {
        addressShipping.push(req.body.addressShipping);
      } else if (req.body.action === 'updateAddress') {
        addressShipping = addressShipping.map((address) => {
          if (String(address._id) === String(req.body.id)) {
            return req.body.addressShipping;
          }
          return address;
        });
      } else if (req.body.action === 'deleteAddress') {
        addressShipping = addressShipping.filter((address) => String(address._id) !== String(req.body.id));
      } else if (req.body.action === 'setDefaultAddress') {
        addressShipping = addressShipping.map((address) => {
          if (String(address._id) === String(req.body.id)) {
            return { ...address, isDefault: true };
          }
          return { ...address, isDefault: false };
        });
      }

      // Mettre à jour les informations
      Object.assign(userExisting, 
        { 
          ...req.body, 
          ...(photo ? { pictureBack: photo }:{}),
          ...(req.body.notifications ? { preferences: {notifications: req.body.notifications} } :{}), 
          ...(req.body.language ? { preferences: {language: req.body.language} } :{}), 
          ...(['updateAddress', 'deleteAddress', 'addAddress', 'setDefaultAddress'].includes(req.body.action) ? { addressShipping: addressShipping } : {}),
        });
      await userExisting.save();

      return res.status(200).json(userExisting);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Erreur lors de la mise à jour de l'utilisateur",
        error,
      });
    }
  },


  updateUserPhoto: async (req, res) => {
    try {
      const picture = req.file?.filename || '';
      // Trouver l'utilisateur par son ID
      const userExisting = await User.findById(req.params.id);
      if (!userExisting) {
        return res.status(404).json({ message: 'User non trouvé pour la mise à jour' });
      }

       // Suppression des images
       const uploadDir = path.join(__dirname, '..', 'uploads', 'profile');
       if (userExisting.picture) {
         const oldFile = path.join(uploadDir, userExisting.picture);

          if (fs.existsSync(oldFile)) {
            try {
                fs.unlinkSync(oldFile);
            } catch (error) {
                console.error('Erreur lors de la suppression du fichier :', error);
            }
          }
        }
      // Mettre à jour les informations de l'utilisateur
      await userExisting.updateOne(
        { picture: picture },
        { new: true }
      );

      return res.status(200).json(picture);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'utilisateur', error });
    } 
  },

  desactiveUser: async (req, res) => {
    try {
      const user = await User.findOne({ _id: req.params.id });
      
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé pour désactivation' });
      }
      
      user.isActive = !user.isActive;
      await user.save();
      
      return res.status(200).json({ message: 'Utilisateur désactivé avec succès' });
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Erreur lors de la désactivation de l\'utilisateur', error });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const userExisting = await User.deleteOne(
        { _id: req.params.id }
      );
      
      if (!userExisting) {
        return res.status(404).json({ message: 'Utilisateur non trouvé pour suppression' });
      }
      
      return res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
    } catch (error) {
      return res.status(500).json({ message: 'Erreur lors de la suppression de l\'utilisateur', error });
    }
  },
};

module.exports = userController;
