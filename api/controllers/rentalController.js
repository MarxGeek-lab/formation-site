const Rental = require("../models/Rental");
const EmailService = require("../services/emailService");
const { generateTemplateHtml } = require("../services/generateTemplateHtml");

const rentalController = {
    getRentalByOwner: async (req, res) => {
        try {
            const rentals = await Rental.find({ owner: req.params.id })
              .populate('property')
              .populate('tenant')
              .populate('payment');

            return res.status(200).json(rentals);
        } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error', error });
        }
    },

    getRentalByTenant: async (req, res) => {
        try {
            console.log("== ", req.params)
            const status = req.params.status;
            console.log(status)

            const rentals = await Rental.find({ 
                tenant: req.params.id,
                ...( status !== 'tout' ? { status: status }: {} )
            })
              .populate('property')
              .populate('tenant')
              .populate('payment');

            return res.status(200).json(rentals);
        } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error', error });
        }
    },

    getRentalById: async (req, res) => {
        try {
            const rental = await Rental.findOne({ _id: req.params.id })
              .populate('property')
              .populate('tenant')
              .populate('owner')
              .populate('payment');

            return res.status(200).json(rental);
        } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error', error });
        }
    },

     // Annuler une réservation
  cancelRental: async (req, res) => {
    console.log(req.params)
    try {
      // Trouver la réservation par ID
      const rental = await Rental.findById(req.params.id)
        .populate('property')
        .populate('tenant');

      if (!rental) {
        return res.status(404).json({
          success: false,
          message: 'Réservation non trouvée'
        });
      }

      // Mettre à jour le statut de la location
      rental.status = 'cancelled';
      rental.cancelledAt = Date.now();
      await rental.save();

      // Envoyer email de confirmation d'annulation
      const templateData = {
        fullname: rental?.tenant?.name,
        type_demande: 'Location', 
        reference: rental?._id,
        nom_bien: rental?.property?.name,
        date_annulation: new Date(rental?.cancelledAt).toLocaleString()
      };
      const emailService = new EmailService();
      emailService.setSubject(`Annulation de votre Location sur STORE`);
      emailService.setFrom(process.env.EMAIL_HOST_USER, "STORE");
      emailService.addTo(rental?.tenant?.email);
      
      emailService.setHtml(generateTemplateHtml("templates/CancelledReservation.html", templateData));
      await emailService.send();

      // Répondre avec succès et les données de la réservation annulée
      res.status(200).json({
        success: true,
        data: rental,
      });
    } catch (error) {
      // Répondre avec une erreur en cas d'échec
      console.log(error)
      res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'annulation de la réservation',
        error: error.message
      });
    }
  },
}

module.exports = rentalController;