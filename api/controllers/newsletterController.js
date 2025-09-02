const Newsletter = require('../models/Newsletter');

const newsletterController = {
    // Inscription à la newsletter
    subscribe: async (req, res) => {
        try {
            const { email } = req.body;
            console.log(req.body);
            
            // Vérifier si l'email existe déjà
            const existingSubscriber = await Newsletter.findOne({ email });
            if (existingSubscriber) {
                if (existingSubscriber.isActive) {
                    return res.status(400).json({ 
                        success: false,
                        message: 'Cet email est déjà inscrit à la newsletter' 
                    });
                } 
                // Réactiver l'abonnement si désactivé
                existingSubscriber.isActive = true;
                await existingSubscriber.save();
                return res.status(200).json({ 
                    success: true,
                    message: 'Réabonnement effectué avec succès' 
                });
            }

            // Créer un nouveau subscriber
            const newSubscriber = new Newsletter({
                email,
                subscriptionDate: new Date(),
                isActive: true
            });

            await newSubscriber.save();
            res.status(201).json({ 
                success: true,
                message: 'Inscription à la newsletter réussie' 
            });
        } catch (error) {
            res.status(500).json({ 
                success: false,
                message: 'Erreur lors de l\'inscription à la newsletter', 
                error: error.message 
            });
        }
    },

    // Désabonnement de la newsletter
    unsubscribe: async (req, res) => {
        try {
            const { email } = req.body;
            const subscriber = await Newsletter.findOne({ email });
            
            if (!subscriber) {
                return res.status(404).json({ 
                    success: false,
                    message: 'Email non trouvé dans la liste des abonnés' 
                });
            }

            if (!subscriber.isActive) {
                return res.status(400).json({ 
                    success: false,
                    message: 'Cet email est déjà désabonné' 
                });
            }

            subscriber.isActive = false;
            await subscriber.save();
            
            res.status(200).json({ 
                success: true,
                message: 'Désabonnement réussi' 
            });
        } catch (error) {
            res.status(500).json({ 
                success: false,
                message: 'Erreur lors du désabonnement', 
                error: error.message 
            });
        }
    },

    // Obtenir la liste des abonnés actifs
    getActiveSubscribers: async (req, res) => {
        try {
            const subscribers = await Newsletter.find({ isActive: true })
                .select('email subscriptionDate lastEmailSent')
                .sort({ subscriptionDate: -1 });

            res.status(200).json({ 
                success: true,
                count: subscribers.length,
                data: subscribers 
            });
        } catch (error) {
            res.status(500).json({ 
                success: false,
                message: 'Erreur lors de la récupération des abonnés', 
                error: error.message 
            });
        }
    },

    // Mettre à jour la date du dernier email envoyé
    updateLastEmailSent: async (req, res) => {
        try {
            const { email } = req.body;
            const subscriber = await Newsletter.findOne({ email });

            if (!subscriber) {
                return res.status(404).json({ 
                    success: false,
                    message: 'Abonné non trouvé' 
                });
            }

            subscriber.lastEmailSent = new Date();
            await subscriber.save();

            res.status(200).json({ 
                success: true,
                message: 'Date de dernier envoi mise à jour' 
            });
        } catch (error) {
            res.status(500).json({ 
                success: false,
                message: 'Erreur lors de la mise à jour', 
                error: error.message 
            });
        }
    },

    
};

module.exports = newsletterController; 