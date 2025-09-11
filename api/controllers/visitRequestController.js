const VisitRequest = require('../models/VisitRequest');
const Product = require('../models/Product');
const User = require('../models/User');
const EmailService = require('../services/emailService');
const { generateTemplateHtml } = require('../services/generateTemplateHtml');

/**
 * Créer une demande de visite
 */
exports.createVisitRequest = async (req, res) => {
  try {
    console.log(req.body)
    const { property, userId, email, name, ownerEmail, ownerName } = req.body;

    // Vérifier si le bien existe
    const propertyExist = await Product.findById(property);
    if (!propertyExist) {
      return res.status(404).json({ error: "Bien immobilier non trouvé." });
    }

    // Vérifier si l'utilisateur a déjà fait une demande pour ce bien
  /*   const existingRequest = await VisitRequest.findOne({ user: userId, property: property });
    if (existingRequest) {
      return res.status(400).json({ error: "Vous avez déjà une demande en attente pour ce bien." });
    } */

    // Créer une nouvelle demande
    const visitRequest = new VisitRequest({
      ...req.body,
      status: 'pending' // Par défaut en attente
    });

    await visitRequest.save();

    const templateData = {
        fullname: name,
        type_demande: "Demande de viste",
        reference: visitRequest?._id,
        nom_bien: propertyExist?.name,
        date_demande: new Date(visitRequest?.createdAt).toLocaleString()
    };

    // Notification par mail au client
    const emailService = new EmailService();
    emailService.setSubject(`Demande de visite sur Rafly`);
    emailService.setFrom(process.env.EMAIL_HOST_USER, "Rafly");
    emailService.addTo(email);
    emailService.setHtml(generateTemplateHtml("templates/requestVisit.html", templateData));
    emailService.send();

     // Notification par mail au propriétaire

     const templateData2 = {
        fullname: ownerName,
        type_demande: "Demande de viste",
        reference: visitRequest?._id,
        nom_bien: propertyExist?.name,
        date_demande: new Date(visitRequest?.createdAt).toLocaleString()
    };
     const emailService2 = new EmailService();
     emailService2.setSubject(`Demande de visite sur Rafly`);
     emailService2.setFrom(process.env.EMAIL_HOST_USER, "Rafly");
     emailService2.addTo(ownerEmail);
     emailService2.setHtml(generateTemplateHtml("templates/requestVisitNotifyOwner.html", templateData2));
     emailService2.send();

    res.status(201).json({ message: "Demande de visite envoyée avec succès.", visitRequest });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Erreur lors de l'envoi de la demande." });
  }
};

/**
 * Récupérer toutes les demandes de visite (admin)
 */
exports.getAllVisitRequests = async (req, res) => {
  try {
    const requests = await VisitRequest.find()
      .populate('user', 'name email')  // Charger les infos de l'utilisateur
      .populate('property', 'name category location'); // Charger les infos du bien

    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération des demandes." });
  }
};

/**
 * Récupérer les demandes d'un utilisateur
 */
exports.getUserVisitRequests = async (req, res) => {
  try {
    const userId = req.user.id; // ID de l'utilisateur connecté

    const requests = await VisitRequest.find({ user: userId })
      .populate('property', 'name category location typeLocation');

    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération de vos demandes." });
  }
};

exports.getOwnerVisitRequests = async (req, res) => {
    try {
      const userId = req.params.id; // ID de l'utilisateur connecté
  
      const requests = await VisitRequest.find({ user: userId })
        .populate('property', 'name category location typeLocation')
        .populate('requester', 'name email phoneNumber picture')
  
      res.json(requests);
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la récupération de vos demandes." });
    }
  };

/**
 * Accepter ou rejeter une demande de visite
 */
exports.updateVisitRequestStatus = async (req, res) => {
  try {
    const { status } = req.body; // "approved" ou "rejected"
    const { id } = req.params; // ID de la demande

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: "Le statut doit être 'approved' ou 'rejected'." });
    }

    const visitRequest = await VisitRequest.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!visitRequest) {
      return res.status(404).json({ error: "Demande de visite non trouvée." });
    }

    res.json({ message: `Demande ${status} avec succès.`, visitRequest });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la mise à jour de la demande." });
  }
};

/**
 * Supprimer une demande de visite
 */
exports.deleteVisitRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const visitRequest = await VisitRequest.findByIdAndDelete(id);
    if (!visitRequest) {
      return res.status(404).json({ error: "Demande de visite non trouvée." });
    }

    res.json({ message: "Demande supprimée avec succès." });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la suppression de la demande." });
  }
};
