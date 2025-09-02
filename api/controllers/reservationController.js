const path = require('path');
const fs = require('fs');
const Product = require('../models/Product');
const Rental = require('../models/Rental');
const Reservation = require('../models/Reservation');
const User = require('../models/User');
const EmailService = require('../services/emailService');
const emailService = require('../services/emailService');
const { generateTemplateHtml } = require('../services/generateTemplateHtml');
const generatePDF = require('../services/generateTicket');
const Customers = require('../models/Customers');
const Messages = require('../models/Messages');
const SiteSettings = require('../models/Settings');
const Notifications = require('../models/Notifications');
const Transaction = require('../models/Transaction');
const { getStatusPayout, getGreeting } = require('../utils/helpers');
const { urls_payout } = require('../utils/constant');
const commonService = require('../services/commonService');
const Admin = require('../models/Admin');

/*   const isAvailable = await checkAvailability(propertyId, startDate, endDate);
      if (!isAvailable) {
        return res.status(400).json({
          success: false,
          message: 'La propriété n\'est pas disponible pour ces dates'
        });
      } */

const days = {
  day: 'Jour',
  hour: 'Heure',
  week: 'Semaine',
  month: 'Mois',
}

const formatAmount = (amount) => {
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

const reservationController = {
  // Créer une nouvelle réservation

  createReservation: async (req, res) => {
    try {
        const {
          propertyId,
          startDate,
          endDate,
          email,
          fullName,
          phoneNumber,
          user,
          paymentMethod,
          agreeTerms,
          country, city, address,
          sexe, district,
          optionPay,
          duration,
          durationType,
          totalAmount,
          startTime,
          endTime,
          quantity
        } = req.body;

        /* const checkAvailabilityy = await checkAvailability(propertyId, startDate, endDate, startTime, endTime, quantity);
        if (!checkAvailabilityy) {
          return res.status(400).json({
            success: false,
            message: 'La propriété n\'est pas disponible pour ces dates'
          });
        } */

        // Vérifier si le bien est disponible
        const property = await Product.findOne({ _id: propertyId }).populate('owner');
        if (!property) {
          return res.status(404).json({
            success: false,
            message: 'Bien non trouvé'
          });
        }

        // if (property.stock.available <= property.stock.total) {
          if (property.stock.available < quantity) {
            return res.status(400).json({
              success: false,
              message: 'Le bien n\'est pas disponible pour ces quantités'
            });
          }
        // } else {
        //   return res.status(400).json({
        //     success: false,
        //     message: 'Le bien n\'est pas disponible'
        //   });
        // }

        const userInfo = { email, fullName, phoneNumber, country, city, district, address, sexe };

        const reservation = await Reservation.create({
            property: propertyId,
            tenant: user,
            owner: property?.owner?._id,
            startDate,
            endDate,
            totalAmount,
            paymentMethod,
            userInfo: JSON.stringify(userInfo),
            status: 'pending',
            optionPay,
            agreeTerms,
            duration,
            durationType,
            startTime,
            endTime,
            quantity
        });

        await reservation.save();

        const templateData = {
          fullname: fullName,
          type_demande: 'Réservation',
          reference: reservation?._id.toString().slice(0, 6).toUpperCase(),
          nom_bien: property?.name,
          date_demande: new Date(reservation?.createdAt).toLocaleString()
        };

        // **2. Configurer et envoyer l'email avec le PDF en pièce jointe**
        const emailService = new EmailService();
        emailService.setSubject(`Demande de réservation sur STORE`);
        emailService.setFrom(process.env.EMAIL_HOST_USER, "STORE");
        emailService.addTo(email);
        emailService.setHtml(generateTemplateHtml("templates/general.html", templateData));

        await emailService.send();

        // Création du client
        const customerExist = await Customers.findOne({ seller: property?.owner?._id, buyer: user });

        if (!customerExist) {
          const newCustomer = await Customers.create({
            seller: property?.owner?._id,
            buyer: user
          });
  
          await newCustomer.save();
        }

        // Création du contact
        const contactExist = await Messages.findOne({ owner: property?.owner?._id, user: user });
        if (!contactExist) {
          const newContact = await Messages.create({
            owner: property?.owner?._id,
            user: user
          });

          await newContact.save();
        }

        // Enrégistrement des notifications
        const notification = new Notifications({
          title: `Nouvelle demande de reservation`,
          content: `Vous avez reçu une nouvelle demande de reservation sur STORE, details : Type de bien: ${property?.category}, Nom du bien: ${property?.name}, ID: ${reservation?._id}`,
          user: property?.owner?._id,
          type: 'owner',
          activity: 'reservation',
          data: JSON.stringify(reservation),
          read: false
        })
        await notification.save();
        
        const booking = await Reservation.findById(reservation?._id);

        // **3. Réponse au client**
        res.status(201).json(booking);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la création de la réservation',
            error: error.message
        });
    }
  },

  // Vérifier la disponibilité
  checkAvailabilityProperty: async (req, res) => {
    try {
      const { propertyId, checkIn, checkOut, startTime, endTime, quantity } = req.query;
      
      // Vérifier la disponibilité de la propriété pour les dates données
      const isAvailable = await checkAvailability(propertyId, checkIn, checkOut, startTime, endTime, quantity);

      // Répondre avec succès et la disponibilité
      res.status(200).json({
        success: true,
        available: isAvailable
      });
    } catch (error) {
      // Répondre avec une erreur en cas d'échec
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la vérification de disponibilité',
        error: error.message
      });
    }
  },

  externeRouteVerifyTransaction: async (req, res) => {
    try {
      const { id } = req.params;
      const resId = id.split('-')[1].toLowerCase().trim();
      console.log("== ", resId);

      const reservations = await Reservation.find()
      const searchRes = reservations.find(r => r._id.toString().includes(resId))

      const reservation = await Reservation.findOne({_id: searchRes._id})
            .populate('property', '-_id -__v')
            .populate('tenant', '-_id -__v')
            .populate('owner', '-_id -__v')
            .populate('payments.transaction', '-_id -__v');

      if (!reservation) {
        return res.status(404).json({
          success: false,
          message: 'Reservation non trouvée'
        });
      }

      // Calculer le montant total payé
      const totalPaid = reservation.payments.reduce((sum, payment) => {
        if (payment.transaction && payment.transaction.status === 'success') {
          return sum + payment.amount;
        }
        return sum;
      }, 0);

      // Vérifier si au moins un paiement est réussi
      const hasSuccessfulPayment = reservation.payments.some(
        payment => payment.transaction && payment.transaction.status === 'success'
      );

      // Préparer le message de début de réservation
      let startMessage = '';
      if (hasSuccessfulPayment) {
        const startDate = new Date(reservation.startDate);
        const startTime = reservation.startTime || "00:00";
        const [hours, minutes] = startTime.split(':');
        startDate.setHours(parseInt(hours), parseInt(minutes));
        const now = new Date();
        
        if (now < startDate) {
          startMessage = `La réservation débutera le ${startDate.toLocaleDateString()} à ${startTime}`;
        } else {
          const days = Math.floor((now - startDate) / (1000 * 60 * 60 * 24));
          startMessage = `La réservation a débuté il y a ${days} jour(s) (${startDate.toLocaleDateString()} à ${startTime})`;
        }
      }

      // Vérifier si le montant total est payé
      if (totalPaid >= reservation.totalAmount && reservation.status === 'confirmed') {
        reservation.status = 'progress';
        await reservation.save();
      }

      res.status(200).json({
        totalAmount: reservation.totalAmount,
          totalPaid: totalPaid,
          remainingAmount: Math.max(0, reservation.totalAmount - totalPaid),
          status: reservation.status,
          startMessage: hasSuccessfulPayment ? startMessage : null,
          paymentStatus: hasSuccessfulPayment ? 'Au moins un paiement effectué' : 'Aucun paiement effectué',
          isFullyPaid: totalPaid >= reservation.totalAmount,
          reservation: reservation
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la vérification de transaction',
        error: error.message
      });
    }
  },

  // générer et télécharger le ticket de reservation
  generateReservationTicket: async (req, res) => {
    try {
      console.log(req.params)
      const reservation = await Reservation.findById(req.params.id)
                                .populate('property')
                                .populate('tenant', 'name picture email phoneNumber')
                                .populate('owner', 'name picture email phoneNumber')
                                .populate('payments.transaction')
      if (!reservation) {
        return res.status(404).json({
          success: false,
          message: 'Réservation non trouvée'
        });
      }

      const paidAmount = reservation?.payments?.reduce((acc, payment) => {
        return payment?.transaction?.status === 'success' && payment?.type !== 'cancellation' ? acc + Number(payment?.transaction?.amount) : acc;
      }, 0);

      // générer le fichier
      const pdfFileName = await generatePDF({
        reservationNumber: "RES-"+reservation?._id?.toString().slice(0, 6).toUpperCase(),
        clientName: reservation?.tenant?.name || 'Non spécifié',
        ownerName: reservation?.owner?.name || 'Non spécifié',
        propertyName: reservation?.property?.name || 'Non spécifié',
        propertyType: reservation?.property?.category || 'Non spécifié',
        propertyId: "PTY-"+reservation?.property?._id?.toString().slice(0, 6).toUpperCase(),
        propertyAddress: `${reservation?.location?.city || '--'}, ${reservation?.location?.district || '--'}, ${reservation?.location?.address || '--'}`,
        totalAmount: formatAmount(reservation?.totalAmount) + ' F CFA',
        paidAmount: formatAmount(paidAmount) + ' F CFA',
        quantity: reservation?.quantity,
        remainingAmount: formatAmount(reservation?.totalAmount - paidAmount) + ' F CFA',
        paymentMethod: reservation?.payments?.paymentMethod || '--',
        paymentDate: reservation?.payments?.createdAt ? new Date(reservation?.payments?.createdAt).toLocaleDateString() : '--',
        startDate: new Date(reservation?.startDate).toLocaleDateString(),
        endDate: new Date(reservation?.endDate).toLocaleDateString(),
        duration: reservation?.duration + days[reservation?.durationType],
        paymentOption: reservation?.optionPay === 'full' ? 'Paiement complet' : 'Paiement partiel',
        createdAt: new Date(reservation?.createdAt).toLocaleString()
      });

      console.log('PDF généré à :', pdfFileName.filename);

      // Chemin du fichier PDF
      const pdfFilePath = path.join(__dirname, "../uploads/tickets/", pdfFileName.filename); 

      // Vérifier si le fichier existe
      if (!fs.existsSync(pdfFilePath)) {
        console.error("❌ Le fichier PDF n'existe pas !");
      } else {
          console.log("✅ Le fichier PDF existe !");
      }

      reservation.ticketName = pdfFileName.filename;
      await reservation.save();

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="ticket.pdf"');
      return res.status(200).json({ filename: pdfFileName.filename });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la génération du ticket de reservation',        error: error.message
      });
    }
  },

  // Obtenir toutes les réservations d'un utilisateur
  getTenantReservations: async (req, res) => {
    try {
      console.log(req.params)
      const status = req.params.status;
      // Trouver toutes les réservations de l'utilisateur connecté
      const reservations = await Reservation.find({ 
        tenant: req.params.id,
        ...( status !== 'tout' ? { status: status }: {} )
      })
        .populate('property')
        .populate('owner')
        .populate('payments')
        .sort({ createdAt: -1 });

      // Répondre avec succès et les données des réservations
      res.status(200).json(reservations);
    } catch (error) {
      // Répondre avec une erreur en cas d'échec
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des réservations',
        error: error.message
      });
    }
  },

  getOwnerReservationsMobile: async (req, res) => {
    try {
      const status = req.params.status;
      // Trouver toutes les réservations de l'utilisateur connecté
      const reservations = await Reservation.find({ 
        owner: req.params.id,
        ...( status !== 'tout' ? { status: status }: {} )
      })
        .populate('property')
        .populate('tenant')
        .populate('payments')
        .sort({ createdAt: -1 });

      // Répondre avec succès et les données des réservations
      res.status(200).json(reservations);
    } catch (error) {
      // Répondre avec une erreur en cas d'échec
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des réservations',
        error: error.message
      });
    }
  },

  getOwnerReservations: async (req, res) => {
    try {
      // Trouver toutes les réservations de l'utilisateur connecté
      const reservations = await Reservation.find({ owner: req.params.id })
        .populate('property')
        .populate('payments')
        .populate('tenant')
        .sort({ createdAt: -1 });

      // Répondre avec succès et les données des réservations
      res.status(200).json(reservations);
    } catch (error) {
      console.log(error)
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des réservations',
        error: error.message
      });
    }
  },

  getReservationsById: async (req, res) => {
    try {
      // Trouver toreservationutes les réservations de l'utilisateur connecté
      const reservation = await Reservation.findOne({ _id: req.params.id })
        .populate('property')
        .populate('payments.transaction')
        .populate('tenant')
        .populate('owner')
        .sort({ createdAt: -1 });

        if (!reservation) {
          return res.status(404).json({
            success: false,
            message: 'Réservation non trouvée'
          });
        }

      // Répondre avec succès et les données des réservations
      res.status(200).json(reservation);
    } catch (error) {
      console.log(error)
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des réservations',
        error: error.message
      });
    }
  },

  // Obtenir les réservations pour une propriété
  getPropertyReservations: async (req, res) => {
    try {
      // Trouver la propriété par ID
      const property = await Product.findById(req.params.propertyId);
      if (!property || property.owner.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Accès non autorisé'
        });
      }

      // Trouver les réservations pour la propriété
      const reservations = await Reservation.find({ property: req.params.propertyId })
        .populate('user', 'firstName lastName email')
        .sort({ checkIn: 1 });

      // Répondre avec succès et les données des réservations
      res.status(200).json({
        success: true,
        data: reservations
      });
    } catch (error) {
      // Répondre avec une erreur en cas d'échec
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des réservations',
        error: error.message
      });
    }
  },

  // Obtenir une réservation spécifique
  getReservation: async (req, res) => {
    try {
      // Trouver la réservation par ID
      const reservation = await Reservation.findById(req.params.id)
        .populate('property')
        .populate('user', 'firstName lastName email');

      if (!reservation) {
        return res.status(404).json({
          success: false,
          message: 'Réservation non trouvée'
        });
      }

      // Vérifier l'autorisation
      if (reservation.user._id.toString() !== req.user.id && 
          reservation.property.owner.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Accès non autorisé'
        });
      }

      // Répondre avec succès et les données de la réservation
      res.status(200).json({
        success: true,
        data: reservation
      });
    } catch (error) {
      // Répondre avec une erreur en cas d'échec
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération de la réservation',
        error: error.message
      });
    }
  },

  // Mettre à jour une réservation
  updateReservation: async (req, res) => {
    try {
      const {
        startDate,
        endDate,
        email,
        fullName,
        phoneNumber,
        address,
        sexe,
        country,
        city,
        district,
        note,
        optionPay,
        duration,
        durationType,
        totalAmount,
        startTime,
        endTime
      } = req.body;

      // Trouver la réservation par ID
      const reservation = await Reservation.findById(req.params.id);

      if (!reservation) {
        return res.status(404).json({
          success: false,
          message: 'Réservation non trouvée'
        });
      }

      // Vérifier si la modification est encore possible
      if (reservation.status !== 'pending') {
        return res.status(400).json({
          success: false,
          message: 'La réservation ne peut plus être modifiée'
        });
      }

      const userInfo = { 
        email: email || reservation.userInfo.email, 
        fullName: fullName || reservation.userInfo.fullName, 
        phoneNumber: phoneNumber || reservation.userInfo.phoneNumber, 
        address: address || reservation.userInfo.address,
        sexe: sexe || reservation.userInfo.sexe,
        country: country || reservation.userInfo.country,
        city: city || reservation.userInfo.city,
        district: district || reservation.userInfo.district,
      };

      // Mettre à jour la réservation

      reservation.startDate = startDate || reservation.startDate;
      reservation.endDate = endDate || reservation.endDate;
      reservation.userInfo = JSON.stringify(userInfo) || reservation.userInfo;
      reservation.duration = duration || reservation.duration;
      reservation.durationType = durationType || reservation.durationType;
      reservation.totalAmount = totalAmount || reservation.totalAmount;
      reservation.startTime = startTime || reservation.startTime;
      reservation.endTime = endTime || reservation.endTime;
      reservation.optionPay = optionPay || reservation.optionPay;
      reservation.note = note || reservation.note;

      await reservation.save();

      res.status(200).json({
        success: true,
        data: reservation
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la mise à jour de la réservation',
        error: error.message
      });
    }
  },

  // Annuler une réservation
  cancelReservation: async (req, res) => {
    const { reason, rejectionBy, cancelledByType } = req.body;

    try {
      // Trouver la réservation par ID
      const reservation = await Reservation.findById(req.params.id)
        .populate({
          path: 'property',
          populate: {
            path: 'owner'
          }
        })
        .populate('tenant')
        .populate('payments.transaction');

      if (!reservation) {
        return res.status(404).json({
          success: false,
          message: 'Réservation non trouvée'
        });
      }

      if (['progress', 'completed', 'cancelled'].includes(reservation.status)) {
        return res.status(400).json({msg: ''});
      }

      // récupérer le propriétaire du bien
      const owner = reservation.property.owner;

      // Vérifier la politique d'annulation
      const cancellationFee = await calculateCancellationFee(reservation, reservation?.property?.owner?.cancellationFees);

      // Mettre à jour le statut de la réservation 
      reservation.cancellationFee = cancellationFee ? Math.round(cancellationFee) : 0;
      reservation.status = 'cancelled';
      reservation.cancelledInfos = {
        cancelledAt: Date.now(),
        cancelledBy: rejectionBy,
        cancellationReason: reason || "",
        cancelledByType: cancelledByType,
      }

      await reservation.save();

      // Création des transactions d'annulation
      const amountTenant = reservation.totalAmount - cancellationFee;
      if (amountTenant > 0) {
        // Utilisateur
        const userTransaction = new Transaction({
          reservation: reservation._id,
          buyer: reservation.tenant,
          seller: reservation.property.owner,
          amount: amountTenant,
          status: 'success',
          balanceImpact: 'credit',
          isRefundTransaction: true,
          paymentMethod: reservation.payments[0].transaction.paymentMethod || 'MTN',
          type: 'RefundCancelation',
          withdrawable: true,
          createdAt: Date.now(),
          updatedAt: Date.now()
        });
        await userTransaction.save();
  
        reservation.payments.push({
          transaction: userTransaction._id,
          amount: userTransaction.amount,
          paymentDate: Date.now(),
          type: 'RefundCancelation'
        });
        await reservation.save();

      }

      // Proprietaire
      if (reservation.cancellationFee > 0) {
        const ownerTransaction = new Transaction({
          reservation: reservation._id,
          buyer: reservation.property.owner,
          seller: reservation.tenant,
          amount: Number(reservation.cancellationFee) || 0,
          status: 'success',
          balanceImpact: 'credit',
          type: 'RefundCancelation',
          paymentMethod: reservation.payments[0].transaction.paymentMethod || 'MTN',
          withdrawable: true,
          createdAt: Date.now(),
          updatedAt: Date.now()
        });
        await ownerTransaction.save();

        reservation.payments.push({
          transaction: ownerTransaction._id,
          amount: ownerTransaction.amount,
          paymentDate: Date.now(),
          type: 'RefundCancelation'
        });
        await reservation.save();
      }
      
      // Mettre les transaction de base
      for (let i = 0; i < reservation.payments.length; i++) {
        const payment = reservation.payments[i];
        const transaction = await Transaction.findById(payment.transaction);

        if (transaction && transaction.type === "Payment") {
          transaction.balanceImpact = 'debit';
          await transaction.save();
        }
      }

      // Mettre à jour la balance de l'utilisateur
      await commonService.updateBalanceTenant(reservation.tenant);

      // Mettre à jour la balance du propriétaire
      await commonService.updateBalanceOwner(reservation.property.owner);

      // Mettre à jour le bien
      const property = await Product.findById(reservation.property._id);
      if (property) {
        property.stock.available = Number(property.stock.available) + Number(reservation.quantity);
        property.stock.rented = Number(property.stock.rented) - Number(reservation.quantity);
        
        if (property.stock.available > 0 && property.state === 'unavailable') {
            property.state = 'available';
        }
        
        await property.save();
      }

      // Envoyer email de confirmation d'annulation
      const templateData = {
        fullname: reservation?.tenant?.name,
        type_demande: 'Réservation', 
        reference: reservation?._id,
        nom_bien: reservation?.property?.name,
        date_annulation: new Date(reservation?.cancelledAt).toLocaleString(),
        reason: reason
      };
      
      const emailService = new EmailService();
      emailService.setSubject(`Annulation de votre réservation sur STORE`);
      emailService.setFrom(process.env.EMAIL_HOST_USER, "STORE");
      
      if (reason) {
        emailService.setHtml(generateTemplateHtml("templates/CancelledReservationByOwner.html", templateData));
        emailService.addTo(reservation?.tenant?.email);
      } else {
        emailService.setHtml(generateTemplateHtml("templates/CancelledReservation.html", templateData));
        emailService.addTo(owner?.email);
      }
      
      await emailService.send();

      // Enrégistrement de la notification
      const notification = new Notifications({
        title: `Demande de reservation annulée`,
        content: reason ? `Le propriétaire ${reservation?.property?.owner?.name} a annulé votre demande de reservation, details : Type de bien: ${reservation?.property?.category}, Nom du bien: ${reservation?.property?.name}, ID: ${reservation?._id}.
          Consulter la demande de reservation.` 
            : `Le client ${reservation?.tenant?.name} a annulé sa demande de reservation, details : Type de bien: ${reservation?.property?.category}, Nom du bien: ${reservation?.property?.name}, ID: ${reservation?._id}`,
        user: reason ? reservation?.tenant?._id : reservation?.property?.owner?._id,
        type: reason ? 'user' : 'owner',
        activity: 'reservation',
        data: JSON.stringify(reservation),
        read: false
      })
      await notification.save();

      // Répondre avec succès et les données de la réservation annulée
      res.status(200).json({
        success: true,
        data: reservation,
        cancellationFee
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

  // Supprimer
  deleteReservation: async (req, res) => {
    try {
      console.log(req.params)
      const { id } = req.params;
      const reservation = await Reservation.findById(id);
      if (!reservation) {
        return res.status(404).json({
          success: false,
          message: 'Reservation non trouvée'
        });
      }

      if (reservation.status !== 'pending') {
        return res.status(400).json({
          success: false,
          message: 'Reservation non trouvée'
        });
      }

      await reservation.deleteOne();

      res.status(200).json({
        success: true,
        data: reservation
      });
    } catch (error) {
      console.log(error)
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la suppression de la reservation',
        error: error.message
      });
    }
  },  

  // Confirmer l'état du bien
  confirmPropertyState: async (req, res) => {
    try {
      const { id } = req.params;
      const { propertyState, rejectionReason } = req.body;
      const files = req.files['images']?.map((file) => process.env.API_URL+file.filename) || [];
      const reservation = await Reservation.findById(id)
        .populate({
          path: 'property',
          populate: {
            path: 'owner',
          }
        })
        .populate('tenant');
      if (!reservation) {
        return res.status(404).json({
          success: false,
          message: 'Réservation non trouvée'
        });
      }
      
      reservation.propertyState = propertyState;
      reservation.rejectionReason = rejectionReason;
      
      // Si le bien est confirmé, enregistrer les fichiers
      if (propertyState === 'confirm') {
        reservation.filesAttachPropertyState = [];
      }

      if (files.length > 0) {
        reservation.filesAttachPropertyState = files;
      }
      
      await reservation.save();

      // Notification pour le propriétaire
      const message = propertyState === 'reject' ? 
      `<p style="font-size: 15px;">Le client qui a fait la demande de reservation <strong>RES-${reservation?._id.toString().slice(0, 6).toUpperCase()}</strong> a jugé que le bien n'est pas conforme à la description.</p>
      <p style="font-size: 15px;"><strong>Raison : ${rejectionReason}</strong></p>` : 
      `<p style="font-size: 15px;">Le client qui a fait la demande de reservation <strong>RES-${reservation?._id.toString().slice(0, 6).toUpperCase()}</strong> a jugé que le bien correspondait à ses attentes.</p>
      <p style="font-size: 15px;">Les fonds seront débloqués par les administrateurs de ReserveTout.</p>`;
      
      const emailService = new EmailService();
      emailService.setSubject(`Confirmation de l'état du bien sur STORE`);
      emailService.setFrom(process.env.EMAIL_HOST_USER, "STORE");
      emailService.setHtml(generateTemplateHtml("templates/ConfirmedPropertyState.html", {
        salutation: `${getGreeting()} Cher propriétaire`,
        message,
        title: `Confirmation de l'état du bien sur STORE`
      }));
      emailService.addTo(reservation?.property?.owner?.email);
      await emailService.send();

      const notification = new Notifications({
        title: `Confirmation de l'état du bien`,
        content: propertyState === 'reject' ? `Le client qui a fait la demande de reservation <strong>RES-${reservation?._id.toString().slice(0, 6).toUpperCase()}</strong> a jugé que le bien n'est pas conforme à la description, details : Type de bien: ${reservation?.property?.category}, Nom du bien: ${reservation?.property?.name}, ID: ${reservation?._id}.` : `Le client qui a fait la demande de reservation <strong>RES-${reservation?._id.toString().slice(0, 6).toUpperCase()}</strong> a jugé que le bien correspondait à ses attentes, details : Type de bien: ${reservation?.property?.category}, Nom du bien: ${reservation?.property?.name}, ID: ${reservation?._id}.`,
        user: reservation?.property?.owner?._id,
        type: 'owner',
        activity: 'reservation',
        data: JSON.stringify(reservation),
        read: false
      })
      await notification.save();

      // Notification pour les administrateurs
      const admins = await Admin.find({isActive: true});
      const emails = admins.map(admin => admin.email);
      const message2 = propertyState === 'reject' ? 
      `<p style="font-size: 15px;">Le client qui a fait la demande de reservation <strong>RES-${reservation?._id.toString().slice(0, 6).toUpperCase()}</strong> a jugé que le bien n'est pas conforme à la description.</p>
      <p style="font-size: 15px;"><strong>Raison : ${rejectionReason}</strong></p>` : 
      `<p style="font-size: 15px;">Le client qui a fait la demande de reservation <strong>RES-${reservation?._id.toString().slice(0, 6).toUpperCase()}</strong> a jugé que le bien correspondait à ses attentes.</p>
      <p style="font-size: 15px;">Veuillez débloquer les fonds au propriétaire.</p>`;

      const emailService2 = new EmailService();
      emailService2.setSubject(`Confirmation de l'état du bien sur STORE`);
      emailService2.setFrom(process.env.EMAIL_HOST_USER, "STORE");
      emailService2.setHtml(generateTemplateHtml("templates/ConfirmedPropertyState.html", {
        salutation: `${getGreeting()} Cher administrateur`,
        message: message2,
        title: `Confirmation de l'état du bien sur STORE`
      }));
      emailService2.addTo(emails);
      await emailService2.send();

      const notification2 = new Notifications({
        title: `Confirmation de l'état du bien`,
        content: propertyState === 'reject' ? `Le client qui a fait la demande de reservation <strong>RES-${reservation?._id.toString().slice(0, 6).toUpperCase()}</strong> a jugé que le bien n'est pas conforme à la description, details : Type de bien: ${reservation?.property?.category}, Nom du bien: ${reservation?.property?.name}, ID: ${reservation?._id}.` : `Le client qui a fait la demande de reservation <strong>RES-${reservation?._id.toString().slice(0, 6).toUpperCase()}</strong> a jugé que le bien correspondait à ses attentes, details : Type de bien: ${reservation?.property?.category}, Nom du bien: ${reservation?.property?.name}, ID: ${reservation?._id}.`,
        user: null,
        type: 'admin',
        activity: 'reservation',
        data: JSON.stringify(reservation),
        read: false
      })
      await notification2.save();
      
      res.status(200).json({
        success: true,
        data: reservation
      });
    } catch (error) {
      console.log(error)
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la confirmation de l\'état du bien',
        error: error.message
      });
    }
  },

  // Répondre au client
  replyToClient: async (req, res) => {
    try {
      const { message, type } = req.body;
      console.log(req.body)
      
      const reservation = await Reservation.findById(req.params.id)
                    .populate('property')
                    .populate('tenant');

      if (!reservation) {
        return res.status(404).json({
          success: false,
          message: 'Réservation non trouvée'
        });
      }

      reservation.answers = {
        message,
        date: new Date()
      }

      await reservation.save();

      // Envoyer un message
      const templateData = {
        fullname: reservation?.tenant?.name,
        type_demande: 'Réservation', 
        nom_bien: reservation?.property?.name,  
        date_demande: reservation?.createdAt,
        reference: reservation?._id,
        message,
        title: `Réponse à votre demande de reservation sur STORE`
      }
      const emailService = new EmailService();
      emailService.setSubject(`Réponse à votre demande de reservation sur STORE`);
      emailService.setFrom(process.env.EMAIL_HOST_USER, "STORE");
      emailService.setHtml(generateTemplateHtml("templates/replyReservation.html", templateData));
      emailService.addTo(reservation?.tenant?.email);

      await emailService.send();

      // Création du message
      let chat = await Messages.findOne({
        user: reservation?.tenant?._id,
        owner: reservation?.property?.owner?._id
      })  ;

      if (!chat) {
          chat = new Messages({
            user: reservation?.tenant?._id,
            owner: reservation?.property?.owner?._id,
            chat: []
          })
          await chat.save();
      }

      chat.chat.push({ type, content: message, createdAt: new Date() });
      await chat.save();

      // Notifier le client
      const notification = new Notifications({
        title: `Réponse à votre demande de reservation`,
        content: `Vous avez reçu une réponse à votre demande de reservation sur STORE, details : Type de bien: ${reservation?.property?.category}, Nom du bien: ${reservation?.property?.name}, ID: ${reservation?._id}`,
        user: reservation?.tenant?._id,
        type: 'user',
        activity: 'reservation',
        data: JSON.stringify(reservation),
        read: false
      })
      await notification.save();

      res.status(200).json({
        success: true
      });
    } catch (error) {
      // Répondre avec une erreur en cas d'échec
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la vérification de disponibilité',
        error: error.message
      });
    }
  },

  // Rappel au client par rapport à la réservation déjà confirmé
  reminderReservation: async (req, res) => {
    try {
      const reservation = await Reservation.findById(req.params.id)
                                .populate('tenant owner property');
      if (!reservation) {
        return res.status(400).json({
          success: false,
          message: 'Réservation non trouvée'
        });
      }

      const tenant = reservation.tenant;
      const property = reservation.property;
      
      if (!tenant || !property) {
        return res.status(400).json({
          success: false,
          message: 'Données de réservation incomplètes'
        });
      }
      
      // Calculer la date limite en fonction du deadlinePending de la propriété
      const acquisitionDeadline = property?.acquisitionDeadline || 24; // Valeur par défaut de 24h si non défini
      const deadline = new Date(reservation.createdAt);
      deadline.setHours(deadline.getHours() + acquisitionDeadline);

      const templateData = {
          title: "Rappel important",
          fullname: tenant.name,
          message: `Le délai d'acquisition du bien réservé est épuisé. Veuillez passer récupérer le bien ou annuler votre réservation.`,
          id_reservation: "RES-" + reservation._id?.toString().slice(0, 6).toUpperCase(),
          propertyName: property.name,
          category: property.category + ", " + property.subCategory,
          amount: reservation.totalAmount,
          deadline: deadline.toLocaleString(),
          warning: "⚠️ Votre réservation nécessite une action immédiate pour éviter son annulation.",
          warningColor: "#ff9800"
      };

      const html = await generateTemplateHtml(
          "templates/reservation-pending-warning.html",
          templateData
      );

      const emailService = new EmailService();
      emailService.setSubject(`Rappel d'acquisition du bien pour la réservation RES-${reservation?._id?.toString().slice(0, 6).toUpperCase()}`);
      emailService.setFrom(process.env.EMAIL_HOST_USER, "STORE");
      emailService.addTo(tenant.email);
      emailService.setHtml(html);

      await emailService.send();
      
      // Créer une notification dans l'app
      const notification = new Notifications({
          title: `Rappel d'acquisition du bien`,
          content: `Votre réservation ID: ${"RES-" + reservation._id?.toString().slice(0, 6).toUpperCase()} nécessite une action immédiate. Veuillez récupérer le bien ou annuler votre réservation.`,
          user: tenant._id,
          type: 'user',
          activity: 'acquisition reminder',
          data: JSON.stringify(reservation),
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
};

// Fonctions utilitaires
const checkAvailability = async (propertyId, checkIn, checkOut, startTime, endTime, quantity = 1) => {
  try {
    console.log(propertyId, checkIn, checkOut, startTime, endTime, quantity)
    // Vérifier d'abord le stock disponible
    const property = await Product.findById(propertyId);
    if (!property || property.stock.available < quantity) {
      return false;
    }

    // Convertir les dates et heures en objets Date
    const checkInDate = startTime ? new Date(`${checkIn}T${startTime}`) : new Date(checkIn);
    const checkOutDate = endTime ? new Date(`${checkOut}T${endTime}`) : new Date(checkOut);

    // Trouver les réservations qui se chevauchent pour la propriété
    const overlappingReservations = await Reservation.find({
      property: propertyId,
      status: { $ne: 'cancelled' },
      $or: [
        {
          $and: [
            {
              $or: [
                { startDate: { $lte: checkOutDate } },
                { 
                  startDate: checkOutDate,
                  startTime: { $lte: endTime }
                }
              ]
            },
            {
              $or: [
                { endDate: { $gte: checkInDate } },
                {
                  endDate: checkInDate,
                  endTime: { $gte: startTime }
                }
              ]
            }
          ]
        }
      ]
    });

    // Calculer le stock total réservé pour cette période
    const reservedQuantity = overlappingReservations.reduce((total, reservation) => total + reservation.quantity, 0);

    // Vérifier si le stock restant est suffisant pour la nouvelle réservation
    const availableQuantity = property.stock.total - reservedQuantity;
    return availableQuantity >= quantity;

  } catch (error) {
    console.error('Erreur lors de la vérification de disponibilité:', error);
    return false;
  }
};

const calculateCancellationFee = async (reservation, cancelledCondition) => {
  const today = new Date();

  // Création d'une date d'arrivée qui combine la date (startDate) et l'heure (startTime)
  let checkIn;
  console.log(reservation.startDate)
  console.log(reservation.startTime)
  if (reservation.startTime) {
    // Si l'heure de début est définie, l'intégrer à la date
    const startDate = new Date(reservation.startDate);
    const [hours, minutes] = reservation.startTime.split(':').map(Number);
    
    checkIn = new Date(startDate);
    checkIn.setHours(hours || 0);
    checkIn.setMinutes(minutes || 0);
    console.log(`Date d'arrivée avec heure: ${checkIn} (date: ${startDate}, heure: ${reservation.startTime})`);
  } else {
    // Sinon, utiliser uniquement la date
    checkIn = new Date(reservation.startDate);
    console.log(`Date d'arrivée sans heure précisée: ${checkIn}`);
  }
  const reservationType = reservation?.durationType;
  
  // Calcul du délai avant réservation en fonction du type de réservation
  const timeUntilCheckInMs = checkIn - today; // Temps en millisecondes
  let timeValue;
  let unitText;
  
  switch(reservationType) {
    case 'hour':
      // Pour les réservations horaires, calculer en heures
      timeValue = Math.ceil(timeUntilCheckInMs / (1000 * 60 * 60));
      unitText = 'heures';
      break;
    case 'week':
      // Pour les réservations hebdomadaires, calculer en semaines
      timeValue = Math.ceil(timeUntilCheckInMs / (1000 * 60 * 60 * 24 * 7));
      unitText = 'semaines';
      break;
    case 'month':
      // Pour les réservations mensuelles, calculer en mois (approximatif)
      timeValue = Math.ceil(timeUntilCheckInMs / (1000 * 60 * 60 * 24 * 30));
      unitText = 'mois';
      break;
    case 'day':
    case 'night':
    default:
      // Par défaut, calculer en jours
      timeValue = Math.ceil(timeUntilCheckInMs / (1000 * 60 * 60 * 24));
      unitText = 'jours';
      break;
  }
  
  console.log(`Délai avant réservation: ${timeValue} ${unitText} (type: ${reservationType})`);

  // Montant payé en tout
  let paidAmount = reservation.payments.reduce((total, payment) => {
    return payment.transaction.status === 'success' &&  !['refundCancelation', 'RefundCancelation'].includes(payment?.transaction?.type) ? total + Number(payment.transaction.amount) : total;
  }, 0);

  if (paidAmount === 0) {
    return 0;
  }

  // obtenir les paramètres du site
  const settings = await SiteSettings.findOne();
  const commissionPlatform = settings?.platformCommission?.owner;
   // Appliquer la commission sur le montant payé
  const commission = Math.round(paidAmount * commissionPlatform / 100);
  paidAmount = paidAmount - commission;

  await Reservation.updateOne({ _id: reservation._id }, { paidAmount, commission });

  const cancellationFees = cancelledCondition;

  console.log("cancellationFees == ", cancellationFees)
  console.log("paidAmount == ", paidAmount)

  // Si aucune condition d'annulation n'est définie, retourner 0
  if (!cancellationFees || !Array.isArray(cancellationFees) || cancellationFees.length === 0) {
    console.log("Aucune condition d'annulation définie, frais = 0");
    return 0;
  }

  // Mapper les types de réservation en anglais vers leurs équivalents en français
  const typeMapping = {
    'hour': 'heure',
    'day': 'jour',
    'night': 'nuité',
    'week': 'semaine',
    'month': 'mois'
  };
  
  // Convertir le type de réservation en anglais vers son équivalent en français
  const reservationTypeFr = typeMapping[reservationType] || reservationType;
  console.log(`Type de réservation: ${reservationType} (en), ${reservationTypeFr} (fr)`);
  
  // Filtrer les conditions qui correspondent au type de réservation actuel
  const applicableConditions = cancellationFees.filter(condition => {
    // Si le type de durée de la condition correspond au type de réservation
    // ou si le type de durée n'est pas spécifié (s'applique à tous les types)
    return !condition.durationType || condition.durationType === reservationTypeFr;
  });

  console.log("Conditions applicables:", applicableConditions);

  // Si aucune condition applicable n'est trouvée, retourner 0
  if (applicableConditions.length === 0) {
    console.log("Aucune condition applicable trouvée, frais = 0");
    return 0;
  }

  // Convertir les délais en millisecondes pour faciliter la comparaison
  const conditionsInMs = applicableConditions.map(condition => {
    let conditionTimeValue;
    const value = Number(condition.value);
    
    // Convertir la valeur en millisecondes selon l'unité
    switch (condition.unit) {
      case 'heure':
        conditionTimeValue = value * 60 * 60 * 1000; // heures en ms
        break;
      case 'jour':
      case 'nuité':
        conditionTimeValue = value * 24 * 60 * 60 * 1000; // jours en ms
        break;
      case 'semaine':
        conditionTimeValue = value * 7 * 24 * 60 * 60 * 1000; // semaines en ms
        break;
      case 'mois':
        conditionTimeValue = value * 30 * 24 * 60 * 60 * 1000; // mois en ms (approximatif)
        break;
      default:
        conditionTimeValue = value * 24 * 60 * 60 * 1000; // par défaut en jours
    }
    
    return {
      ...condition,
      timeValue: conditionTimeValue
    };
  });

  // Trier les conditions par valeur de temps croissante (de la plus courte à la plus longue)
  conditionsInMs.sort((a, b) => a.timeValue - b.timeValue);
  
  // Afficher le temps restant avant l'arrivée
  console.log("Temps restant avant arrivée (ms):", timeUntilCheckInMs);
  console.log("Temps restant avant arrivée selon unité:", timeValue, unitText);
  
  // Parcourir les conditions triées
  for (const condition of conditionsInMs) {
    console.log(`Vérification condition: ${condition.value} ${condition.unit}, seuil: ${condition.timeValue} ms`);
    
    // Si le temps restant avant l'arrivée est inférieur ou égal au seuil de la condition
    if (timeUntilCheckInMs <= condition.timeValue) {
      console.log(`Condition applicable trouvée: ${condition.value} ${condition.unit}, commission: ${condition.commission}%`);
      
      // Calculer les frais d'annulation en multipliant le montant payé par le pourcentage de commission
      const fee = (paidAmount * condition.commission) / 100;
      console.log(`Frais d'annulation calculés: ${fee} (${condition.commission}% de ${paidAmount})`);
      
      return fee;
    }
  }

  // Si aucune condition n'est applicable (temps restant supérieur à tous les seuils), retourner 0
  console.log("Aucune condition applicable (délai trop long), frais = 0");
  return 0;
};

module.exports = reservationController;
