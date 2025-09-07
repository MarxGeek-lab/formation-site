require('dotenv').config();
const {EmailService} = require('../services/emailService');
const logger = require('../utils/logger');

// Middleware de gestion des erreurs
module.exports = async (err, req, res, next) => {
    // console.log(req)
    if (!err) return next(); // Passe à la prochaine middleware si aucune erreur n'est présente

    logger.error(err.message, { stack: err.stack });
    // console.error(err);

    // Extraire les informations de l'erreur
    const { message, stack } = err;
    const stackLines = stack.split('\n');
    const errorLine = stackLines[1] || 'Ligne non disponible';
    const fileInfo = stackLines[0].match(/\(([^)]+)\)/) ? stackLines[0].match(/\(([^)]+)\)/)[1] : 'Fichier non disponible';

    // Configurer le service d'email
    const emailService = new EmailService();
    emailService.setSubject('Erreur critique dans l’application api.feexpay.me payment-gateway-service');
    emailService.setBody(`Une erreur critique est survenue :\n\nMessage : ${message}\nFichier : ${fileInfo}\nDétail : ${errorLine}`);
    emailService.setFrom(process.env.EMAIL_HOST_USER, 'Service d\'Erreur');
    emailService.addTo(['mgangbala610@gmail.com']);

    try {
        await emailService.send();
        console.log('Alerte email envoyée pour une erreur critique.');
    } catch (emailError) {
        console.error('Erreur lors de l’envoi de l’email d’alerte :', emailError);
    } 

    // Répondre avec un statut 500
    res.status(500).json({ error: 'Une erreur est survenue, les administrateurs ont été notifiés.' });
};
