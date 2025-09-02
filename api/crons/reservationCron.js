const cron = require('node-cron');
const Reservation = require('../models/Reservation');
const Product = require('../models/Product');
const { generateTemplateHtml } = require('../services/generateTemplateHtml');
const EmailService = require('../services/emailService');
const Notifications = require('../models/Notifications');

// Fonction pour annuler les réservations en attente depuis plus de 24h
const cancelPendingReservations = async () => {
    try {
        // 1. Trouver les réservations pour l'avertissement
        const warningReservations = await Reservation.find({
            status: 'pending',
            'notifications.warningReminder': { $ne: true }
        }).populate('property tenant owner');

        console.log(`Found ${warningReservations.length} reservations to warn`);

        for (const reservation of warningReservations) {
            try {
                const property = reservation.property;
                const tenant = reservation.tenant;
                const owner = reservation.owner;

                if (!property || !tenant || !owner) {
                    console.log(`Missing data for reservation ${reservation._id}`);
                    continue;
                }

                // Utiliser deadlinePending au lieu de acquisitionDeadline
                const deadlinePending = property?.deadlinePending || 24; // Valeur par défaut de 24h si non défini
                
                // Calculer la date limite pour cette réservation spécifique
                const deadline = new Date(reservation.createdAt);
                deadline.setHours(deadline.getHours() + deadlinePending);
                
                // Calculer le moment d'avertissement (50% du temps avant deadline)
                const warningThreshold = deadlinePending / 2;
                const now = new Date();
                
                // Vérifier si nous sommes dans la période d'avertissement
                // (entre 50% et 100% du temps écoulé depuis la création)
                const hoursElapsed = (now - reservation.createdAt) / (1000 * 60 * 60);
                const shouldWarn = hoursElapsed >= warningThreshold && hoursElapsed < deadlinePending;
                
                if (!shouldWarn) {
                    continue; // Pas encore le moment d'avertir
                }

                // Préparer les données pour le template
                const templateData = {
                    title: "Rappel important : Réservation en attente",
                    fullname: tenant.name,
                    message: `Votre réservation est toujours en attente de paiement. Elle sera automatiquement annulée dans ${Math.round(deadlinePending - hoursElapsed)} heures si la confirmation n'est pas effectuée.`,
                    id_reservation: "RES-" + reservation._id?.toString().slice(0, 6).toUpperCase(),
                    propertyName: property.name,
                    category: property.category + ", " + property.subCategory,
                    amount: reservation.totalAmount,
                    deadline: deadline.toLocaleString(),
                    warning: `⚠️ Il vous reste moins de ${Math.round(deadlinePending - hoursElapsed)} heures pour effectuer le paiement avant l'annulation automatique de votre réservation.`,
                    warningColor: "#ff9800"
                };

                // Envoyer l'email
                const html = await generateTemplateHtml(
                    "templates/reservation-pending-warning.html",
                    templateData
                );

                const emailService = new EmailService();
                emailService.setSubject(`Rappel urgent : Votre réservation sera bientôt annulée`);
                emailService.setFrom(process.env.EMAIL_HOST_USER, "STORE");
                emailService.addTo(tenant.email);
                emailService.setHtml(html);
                await emailService.send();

                // Créer une notification dans l'app
                const notification = new Notifications({
                    title: `Rappel urgent : Paiement en attente`,
                    content: `Votre réservation ID: ${"RES-" + reservation._id?.toString().slice(0, 6).toUpperCase()} sera annulée dans ${Math.round(deadlinePending - hoursElapsed)} heures si la confirmation n'est pas effectuée.`,
                    user: tenant._id,
                    type: 'user',
                    activity: 'payment warning',
                    data: JSON.stringify(reservation),
                    read: false
                });
                await notification.save();

                // Marquer l'avertissement comme envoyé
                reservation.notifications = {
                    ...reservation.notifications,
                    warningReminder: true
                };
                await reservation.save();

                console.log(`Successfully sent warning for reservation ${reservation._id}`);
            } catch (error) {
                console.error(`Error sending warning for reservation ${reservation._id}:`, error);
            }
        }

        // 2. Trouver et annuler les réservations dont le délai est dépassé
        // Nous devons vérifier chaque réservation individuellement car le délai dépend de la propriété
        const pendingReservations = await Reservation.find({
            status: 'pending'
        }).populate('property tenant');

        console.log(`Found ${pendingReservations.length} pending reservations to check for cancellation`);

        for (const reservation of pendingReservations) {
            try {
                const property = reservation.property;
                const tenant = reservation.tenant;
                
                if (!property) {
                    console.log(`Missing property data for reservation ${reservation._id}`);
                    continue;
                }
                
                // Utiliser deadlinePending au lieu de acquisitionDeadline
                const deadlinePending = property?.deadlinePending || 24; // Valeur par défaut de 24h si non défini
                
                // Calculer la date limite pour cette réservation spécifique
                const deadline = new Date(reservation.createdAt);
                deadline.setHours(deadline.getHours() + deadlinePending);
                
                const now = new Date();
                
                // Vérifier si le délai est dépassé
                if (now < deadline) {
                    continue; // Pas encore le moment d'annuler
                }

                // Mettre à jour le statut de la réservation
                reservation.status = 'cancelled';
                await reservation.save();

                // Mettre à jour le stock de la propriété
                if (property) {
                    property.stock.available = property.stock.available + reservation.quantity;
                    property.stock.rented = property.stock.rented - reservation.quantity;
                    
                    if (property.stock.available > 0 && property.state === 'unavailable') {
                        property.state = 'available';
                    }
                    
                    await property.save();
                }

                if (tenant) {
                    // Envoyer notification d'annulation
                    const templateData = {
                        title: "Réservation annulée",
                        fullname: tenant.name,
                        message: `Votre réservation a été automatiquement annulée car le paiement n'a pas été effectué dans les délais impartis (${deadlinePending} heures).`,
                        id_reservation: "RES-" + reservation._id?.toString().slice(0, 6).toUpperCase(),
                        propertyName: property.name,
                        category: property.category + ", " + property.subCategory,
                        amount: reservation.totalAmount,
                        deadline: deadline.toLocaleString(),
                        warning: "❌ Cette réservation a été annulée. Vous pouvez effectuer une nouvelle réservation si vous le souhaitez.",
                        warningColor: "#f44336"
                    };

                    const html = await generateTemplateHtml(
                        "templates/reservation-pending-warning.html",
                        templateData
                    );

                    const emailService = new EmailService();
                    emailService.setSubject(`Réservation annulée : Délai de paiement dépassé`);
                    emailService.setFrom(process.env.EMAIL_HOST_USER, "STORE");
                    emailService.addTo(tenant.email);
                    emailService.setHtml(html);
                    await emailService.send();

                    // Créer une notification dans l'app
                    const notification = new Notifications({
                        title: `Réservation annulée`,
                        content: `Votre réservation ID: ${"RES-" + reservation._id?.toString().slice(0, 6).toUpperCase()} a été annulée car le paiement n'a pas été effectué dans les délais.`,
                        user: tenant._id,
                        type: 'user',
                        activity: 'reservation cancelled',
                        data: JSON.stringify(reservation),
                        read: false
                    });
                    await notification.save();
                }

                console.log(`Successfully cancelled reservation ${reservation._id}`);
            } catch (error) {
                console.error(`Error cancelling reservation ${reservation._id}:`, error);
            }
        }
    } catch (error) {
        console.error('Error in cancelPendingReservations cron job:', error);
    }
};

// Fonction pour notifier les utilisateurs avant la fin de leur réservation
const notifyEndingReservations = async () => {
    try {
        // Calculer la date pour dans 24h
        const oneDayFromNow = new Date(Date.now() + 24 * 60 * 60 * 1000);
        
        // Trouver toutes les réservations qui se terminent dans 24h
        const endingReservations = await Reservation.find({
            status: 'confirmed',
            endDate: {
                $gte: new Date(),
                $lte: oneDayFromNow
            },
            'notifications.endReminder': { $ne: true } // Vérifier si la notification n'a pas déjà été envoyée
        }).populate('property owner tenant');

        console.log(`Found ${endingReservations.length} reservations ending soon`);

        for (const reservation of endingReservations) {
            if (!reservation.endReminder) {
                try {
                    const property = reservation.property;
                    const tenant = reservation.tenant;
                    const owner = reservation.owner;

                    if (!property || !tenant || !owner) {
                        console.log(`Missing data for reservation ${reservation._id}`);
                        continue;
                    }

                    // Préparer les données pour le template
                    const endDate = new Date(reservation.endDate).toLocaleDateString();
                    const endTime = reservation.endTime || "Non spécifié";

                    // Envoyer email au locataire
                    const tenantTemplateData = {
                        id_reservation: "RES-"+reservation._id?.toString().slice(0, 6).toUpperCase(),
                        category: property.category+", "+property.subCategory,
                        fullname: tenant.name,
                        message: "Nous tenons à vous informer que votre réservation se termine dans 24h.",
                        propertyName: property.name,
                        endDate: endDate+" "+endTime,
                    };

                    const tenantHtml = await generateTemplateHtml(
                        "templates/reservation-end-notification.html",
                        tenantTemplateData
                    );

                    const emailService = new EmailService();
                    emailService.setSubject(`Rappel : Fin de votre réservation sur STORE`);
                    emailService.setFrom(process.env.EMAIL_HOST_USER, "STORE");
                    emailService.addTo(tenant.email);
                    emailService.setHtml(tenantHtml);
            
                    await emailService.send();

                    const notificationTenant = new Notifications({
                        title: `Fin de votre réservation`,
                        content: `Votre réservation ID: ${"RES-"+reservation._id?.toString().slice(0, 6).toUpperCase()} se termine dans 24h.`,
                        user: tenant?._id,
                        type: 'user',
                        activity: 'end reservation',
                        data: JSON.stringify(reservation),
                        read: false
                    })
                    await notificationTenant.save();

                    // Envoyer email au propriétaire
                    const ownerTemplateData = {
                        id_reservation: "RES-"+reservation._id?.toString().slice(0, 6).toUpperCase(),
                        category: property.category+", "+property.subCategory,
                        fullname: owner.name,
                        message: "Nous tenons à vous informer que cette réservation se termine dans 24h.",
                        propertyName: property.name,
                        endDate: endDate+" "+endTime,
                    };

                    const ownerHtml = await generateTemplateHtml(
                        "templates/reservation-end-notification.html",
                        ownerTemplateData
                    );

                    const emailService2 = new EmailService();
                    emailService2.setSubject(`Rappel : Fin de réservation sur STORE`);
                    emailService2.setFrom(process.env.EMAIL_HOST_USER, "STORE");
                    emailService2.addTo(owner.email);
                    emailService2.setHtml(ownerHtml);
            
                    await emailService2.send();

                    const notificationOwner = new Notifications({
                        title: `Fin de réservation`,
                        content: `La réservation ID: ${"RES-"+reservation._id?.toString().slice(0, 6).toUpperCase()} se termine dans 24h.`,
                        user: owner?._id,
                        type: 'owner',
                        activity: 'end reservation',
                        data: JSON.stringify(reservation),
                        read: false
                    })
                    await notificationOwner.save();

                    // Marquer la notification comme envoyée
                    reservation.notifications.warningReminder = true;
                    await reservation.save();

                    console.log(`Successfully sent notifications for reservation ${reservation._id}`);
                } catch (error) {
                    console.error(`Error sending notifications for reservation ${reservation._id}:`, error);
                }
            }
        }
    } catch (error) {
        console.error('Error in notifyEndingReservations cron job:', error);
    }
};

// Fonction pour gérer les réservations terminées
const handleCompletedReservations = async () => {
    try {
        // Trouver toutes les réservations en cours qui sont terminées
        const completedReservations = await Reservation.find({
            status: 'progress',
            endDate: { $lt: new Date() }
        }).populate('property owner tenant');

        for (const reservation of completedReservations) {
            try {
                const property = reservation.property;
                const tenant = reservation.tenant;
                const owner = reservation.owner;

                if (!property || !tenant || !owner) {
                    console.log(`Missing data for reservation ${reservation._id}`);
                    continue;
                }

                // Mettre à jour le statut de la réservation
                reservation.status = 'completed';
                await reservation.save();

                // Mettre à jour le stock de la propriété
                property.stock.available = property.stock.available + reservation.quantity;
                property.stock.rented = property.stock.rented - reservation.quantity;
                
                if (property.stock.available > 0 && property.state === 'unavailable') {
                    property.state = 'available';
                }
                await property.save();

                // Préparer les données pour les notifications
                const endDate = new Date(reservation.endDate).toLocaleDateString();
                const endTime = reservation.endTime || "Non spécifié";

                // Notification au locataire
                const tenantTemplateData = {
                    id_reservation: "RES-"+reservation._id?.toString().slice(0, 6).toUpperCase(),
                    category: property.category + ", " + property.subCategory,
                    fullname: tenant.name,
                    message: "Votre période de réservation est maintenant terminée.",
                    propertyName: property.name,
                    endDate: endDate + " " + endTime,
                    additionalInfo: "Nous vous remercions d'avoir utilisé nos services et espérons vous revoir bientôt."
                };

                const tenantHtml = await generateTemplateHtml(
                    "templates/reservation-completed-notification.html",
                    tenantTemplateData
                );

                const emailService = new EmailService();
                emailService.setSubject(`Fin de votre réservation sur STORE`);
                emailService.setFrom(process.env.EMAIL_HOST_USER, "STORE");
                emailService.addTo(tenant.email);
                emailService.setHtml(tenantHtml);
                await emailService.send();

                const notificationTenant = new Notifications({
                    title: `Réservation terminée`,
                    content: `Votre réservation ID: ${"RES-"+reservation._id?.toString().slice(0, 6).toUpperCase()} est maintenant terminée.`,
                    user: tenant?._id,
                    type: 'user',
                    activity: 'reservation completed',
                    data: JSON.stringify(reservation),
                    read: false
                });
                await notificationTenant.save();

                // Notification au propriétaire
                const ownerTemplateData = {
                    id_reservation: "RES-"+reservation._id?.toString().slice(0, 6).toUpperCase(),
                    category: property.category + ", " + property.subCategory,
                    fullname: owner.name,
                    message: "Une réservation de votre bien est maintenant terminée.",
                    propertyName: property.name,
                    endDate: endDate + " " + endTime,
                    additionalInfo: "Votre bien est maintenant disponible pour de nouvelles réservations."
                };

                const ownerHtml = await generateTemplateHtml(
                    "templates/reservation-completed-notification.html",
                    ownerTemplateData
                );

                const emailService2 = new EmailService();
                emailService2.setSubject(`Réservation terminée sur STORE`);
                emailService2.setFrom(process.env.EMAIL_HOST_USER, "STORE");
                emailService2.addTo(owner.email);
                emailService2.setHtml(ownerHtml);
                await emailService2.send();

                const notificationOwner = new Notifications({
                    title: `Réservation terminée`,
                    content: `La réservation ID: ${"RES-"+reservation._id?.toString().slice(0, 6).toUpperCase()} est maintenant terminée.`,
                    user: owner?._id,
                    type: 'owner',
                    activity: 'reservation completed',
                    data: JSON.stringify(reservation),
                    read: false
                });
                await notificationOwner.save();

                // Sauvegarder les changements
                await Promise.all([
                    reservation.save(),
                    property.save()
                ]);

                console.log(`Successfully completed reservation ${reservation._id}`);
            } catch (error) {
                console.error(`Error handling completed reservation ${reservation._id}:`, error);
            }
        }
    } catch (error) {
        console.error('Error in handleCompletedReservations cron job:', error);
    }
};

// Exécuter les crons
const initReservationCron = () => {
    // Annulation des réservations en attente - toutes les minutes
    cron.schedule('* * * * *', async () => {
        console.log('Running cancelPendingReservations cron job...');
        await cancelPendingReservations();
    });

    // Notification de fin de réservation - toutes les minutes
    cron.schedule('* * * * *', async () => {
        console.log('Running notifyEndingReservations cron job...');
        await notifyEndingReservations();
    });

    // Gestion des réservations terminées - toutes les minutes
    cron.schedule('* * * * *', async () => {
        console.log('Running handleCompletedReservations cron job...');
        await handleCompletedReservations();
    });
};

module.exports = {
    initReservationCron
};
