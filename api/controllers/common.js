// const { connectToRedis } = require("../config/redis_connection");
const Notifications = require("../models/Notifications");
const Product = require("../models/Product");
const SiteSettings = require("../models/Settings");
const { EmailService } = require("../services/emailService");
const { generateTemplateHtml } = require("../services/generateTemplateHtml");

const controllers = {
    // Fonction de filtrage de propriété
    getPropertyByFilter: async (req, res) => {
        const { location, propertyType, priceLimit, state, availableDates } = req.body;

        try {
            // Créer un objet de filtre dynamique
            const filter = {};

            // Filtrer par localisation (pays, ville, quartier)
            if (location) {
                if (location.country) filter['location.country'] = location.country;
                if (location.city) filter['location.city'] = location.city;
                if (location.district) filter['location.district'] = location.district;
            }

            // Filtrer par type de propriété (appartement, villa, chambre)
            if (propertyType) filter.propertyType = propertyType;

            // Filtrer par état (disponible, réservé, vendu)
            if (state) filter.state = "disponible";

            // Filtrer par limite de prix
            if (priceLimit) {
                const [min, max] = priceLimit.trim().split("-").map(Number);
                if (!Number.isNaN(min) && !Number.isNaN(max)) {
                    filter.price = { $gte: min, $lte: max };
                }
            }

            // Ne renvoyer que les propriétés non supprimées
            filter.isDelete = false;

            const properties = await Product.find(filter);

            return res.status(200).json(properties);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: `Erreur lors du filtrage des propriétés.\n détails:\n ${error}` });
        }
    },

    // Ajout ou suppression des favoris
    addOrRemoveFavorite: async (req, res) => {
        const { userId, propertyId } = req.body;
        let redis;
        try {
            console.log("")
            // redis = await connectToRedis.acquire();

            // Clé Redis unique pour stocker les favoris de l'utilisateur
/*             const userFavoritesKey = getUserKeyFavoris(userId);

            // Vérifier si la propriété est déjà dans les favoris
            const isFavorite = await redis.sIsMember(userFavoritesKey, propertyId);

            if (isFavorite) {
                // Si elle est déjà dans les favoris, la retirer
                await redis.sRem(userFavoritesKey, propertyId);
                return res.status(200).json({ message: "Propriété retirée des favoris." });
            }
            // Sinon, l'ajouter aux favoris
            await redis.sAdd(userFavoritesKey, propertyId); */
            return res.status(200).json({ message: "Propriété ajoutée aux favoris." });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: `Erreur lors de la mise à jour des favoris.\n détails:\n ${error}` });
        } /* finally {
            if (redis) {
                await connectToRedis.release(redis);
            }
        } */
    },

    // Récupérer les propriétés en fonction de la catégorie
    getPropertiesByCategory: async (req, res) => {
        const { category } = req.query; 

        try {
            // Vérifiez que la catégorie est valide avant de procéder
            if (!category) {
                return res.status(400).json({ message: "Veuillez fournir une catégorie." });
            }

            // Rechercher les propriétés en fonction de la catégorie
            const properties = await Product.find({ propertyType: category, isDelete: false });

            // Vérifiez si des propriétés ont été trouvées
            if (properties.length === 0) {
                return res.status(404).json({ message: "Aucune propriété trouvée pour cette catégorie." });
            }

            return res.status(200).json(properties);
        } catch (error) {
            console.error("Erreur lors de la récupération des propriétés par catégorie:", error);
            return res.status(500).json({ message: `Erreur lors de la récupération des propriétés par catégorie.\n détails:\n ${error}` });
        }
    },

    getNotifications: async (req, res) => {
        try {
            console.log(req.params)
            const { id, type } = req.params;

            let notifications;
            if (type !== 'admin') {
                notifications = await Notifications.find({ user: id, type: type })
                   .populate('user')
                   .sort({ createdAt: -1 });

            } else {
                notifications = await Notifications.find({ type: 'admin' })
                    .sort({ createdAt: -1 });
            }

            return res.status(200).json(notifications);
        } catch (error) {
            console.error("Erreur lors de la récupération des propriétés par catégorie:", error);
            return res.status(500).json({ message: `Erreur lors de la récupération des notification.\n détails:\n ${error}` });
        }
    },

    contactUs: async (req, res) => {
        try {
            const { name, email, subject, message } = req.body;
            const templateData = {
                name,
                email,
                subject,
                message
            };

            const emailSupport = await SiteSettings.findOne({});

            const emailService = new EmailService();
            emailService.setSubject(`Nouveau message de contact - ${subject}`);
            emailService.setFrom(process.env.EMAIL_HOST_USER, "Rafly");
            emailService.addTo(emailSupport?.supportEmail);
            emailService.setHtml(generateTemplateHtml("templates/contactus.html", templateData));

            await emailService.send();

            return res.status(200).json({ message: "Message envoyé avec succès." });
        } catch (error) {
            console.error("Erreur lors de l'envoi du message:", error);
            return res.status(500).json({ message: `Erreur lors de l'envoi du message.\n détails:\n ${error}` });
        }
    },

    getAllLocalisation: async (req, res) => {
      try {
        const properties = await Product.find({ statusValidate: 'approved' });
        const locations = properties.map(property => {
            const locationString = property.location.valueSearch || 
              `${property.location.city || ''}-${property.location.district || ''}`.replace(/^-|-$/g, '');
            return locationString && locationString.trim() !== '' ? {
              value: locationString,
              name: locationString
            } : null;
        }).filter(Boolean);

        // Créer un tableau unique basé sur la combinaison ville/quartier
        const uniqueLocations = Array.from(
          new Set(locations.map(loc => JSON.stringify(loc)))
        ).map(str => JSON.parse(str));

        return res.status(200).json(uniqueLocations);
      } catch (err) {
        console.log(err);
        return res.status(404).json({
          status: 'fail',
          message: err.message
        });
      }
    },
};

module.exports = controllers;
