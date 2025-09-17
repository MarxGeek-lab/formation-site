const NewsletterMessage = require('../models/NewsletterMessage');
const Newsletter = require('../models/Newsletter');
const nodemailer = require('nodemailer');
const { EmailService } = require('../services/emailService');
const path = require('path');
const fs = require('fs');
const { generateTemplateHtml } = require('../services/generateTemplateHtml');
const Notifications = require('../models/Notifications');
const SiteSettings = require('../models/Settings');
const UniMessageService = require('../services/uniMessageService');

const newsletterMessageController = {
    // Créer un nouveau message
    createMessage: async (req, res) => {
        try {
            console.log(req.body)
            console.log(req.file)
            const image = req.file ? process.env.API_URL+req.file.filename:"";
            const { subject, htmlContent, createdBy } = req.body;

            const message = new NewsletterMessage({
                createdBy,
                subject,
                htmlContent,
                image
            });

            await message.save();

            res.status(201).json({
                success: true,
                message: 'Message créé avec succès',
                data: message
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la création du message',
                error: error.message
            });
        }
    },

    // Envoyer un message
    sendMessage: async (req, res) => {
        try {
            console.log("=== ", req.body)
            const { id, byEmail, bySMS } = req.body;
            const message = await NewsletterMessage.findById(id);

            if (!message) {
                return res.status(404).json({
                    success: false,
                    message: 'Message non trouvé'
                });
            }

            // if (message.status === 'published') {
            //     return res.status(400).json({ msg: 'déjà publier' });
            // }

            const siteSettings = await SiteSettings.findOne();

            // Récupérer tous les abonnés actifs
            const subscribers = await Newsletter.find({ isActive: true });

            // Configuration de l'email
            // if (byEmail) {
            if (subscribers.length > 0) {
                const emailService = new EmailService();
                emailService.setFrom(process.env.EMAIL_HOST_USER, siteSettings?.websiteTitle);
                emailService.addTo(subscribers.map(subscriber => subscriber.email));
                emailService.setSubject(message.subject);
                emailService.setHtml(generateTemplateHtml('templates/newsletter.html', {
                    image: message.image,
                    title: message.subject,
                    content: message.htmlContent,
                    logoUrl: siteSettings?.logoUrl,
                    websiteTitle: siteSettings?.websiteTitle,
                    contactEmail: siteSettings?.supportEmail
                }));

                emailService.send();
            }

            // if (bySMS) {
            //     const result = await UniMessageService.sendMessage('+2290169816413', 'Votre code de vérification est 2048.');
            //     console.log('Résultat:', result);
            // }

            // Mise à jour de la date du dernier email pour l'abonné
            for (const subscriber of subscribers) {
                subscriber.lastEmailSent = new Date();
                await subscriber.save();
            }

            message.status = 'published';
            message.publishedDate = new Date();
            await message.save();

            // Notifications
            for (const subscriber of subscribers) {
                const notification = new Notifications({
                    message: `Newsletter`,
                    user: subscriber._id,
                    type: 'user',
                    activity: 'newsletter',
                    read: false
                });
                await notification.save();
            }

            // Envoie du SMS
            // const result = await UniMessageService.sendMessage('+2290169816413', 'Votre code de vérification est 2048.');
            // console.log('Résultat:', result);

            res.status(200).json({
                success: true,
                message: 'Newsletter envoyée avec succès',
                totalSent: subscribers.length,
                messageDetails: message
            });

        } catch (error) {
            console.log(error)
            res.status(500).json({
                success: false,
                message: 'Erreur lors de l\'envoi de la newsletter',
                error: error.message
            });
        }
    },

    // Obtenir tous les messages
    getAllMessages: async (req, res) => {
        try {
            const messages = await NewsletterMessage.find()
                .sort({ createdAt: -1 });

            res.status(200).json(messages);
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la récupération des messages',
                error: error.message
            });
        }
    },

    // Obtenir un message spécifique
    getMessage: async (req, res) => {
        try {
            const message = await NewsletterMessage.findById(req.params.id);

            if (!message) {
                return res.status(404).json({
                    success: false,
                    message: 'Message non trouvé'
                });
            }

            res.status(200).json({
                success: true,
                data: message
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la récupération du message',
                error: error.message
            });
        }
    },

    // Mettre à jour un message
    updateMessage: async (req, res) => {
        try {
            console.log(req.body)
            console.log(req.file)

            const { subject, htmlContent } = req.body;
            const image = req.file ? process.env.API_URL+req.file.filename:"";
            const message = await NewsletterMessage.findById(req.params.id);
            console.log(image)
            if (!message) {
                return res.status(404).json({
                    success: false,
                    message: 'Message non trouvé'
                });
            }

            if (message.status === 'published') {
                return res.status(400).json({
                    success: false,
                    message: 'Impossible de modifier un message déjà envoyé'
                });
            }

            // Suppression des images
            const uploadDir = path.join(__dirname, '..', 'uploads', 'pictures');
            if (image) {
                if (message.image) {
                    const oldFile = path.join(uploadDir, message.image);
                    if (fs.existsSync(oldFile)) {
                        try {
                            fs.unlinkSync(oldFile);
                        } catch (error) {
                            console.error('Erreur lors de la suppression du fichier :', error);
                        }
                    }
                }

                message.image = image;
            }

            message.subject = subject || message.subject;
            message.htmlContent = htmlContent || message.htmlContent;

            await message.save();

            res.status(200).json({
                success: true,
                message: 'Message mis à jour avec succès',
                data: message
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la mise à jour du message',
                error: error.message
            });
        }
    },

    deleteMessage: async (req, res) => {
        try {
            const message = await NewsletterMessage.findById(req.params.id);
              if (!message) {
                return res.status(404).json({
                    success: false,
                    message: 'Message non trouvé'
                });
            }

            await message.deleteOne();

            res.status(200).json();
        } catch (error) {
            console.log(error);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la mise à jour du message',
                error: error.message
            });
        }
    }
};

module.exports = newsletterMessageController; 