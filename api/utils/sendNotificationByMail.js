const { EmailService } = require("../services/emailService");

const sendNotificationByMail = async (subject, message, email = "arnaudaboha91@gmail.com") => {
    try {
        // Configuration de l'email à envoyer
        const emailService = new EmailService();
        emailService.setSubject(subject);
        emailService.setFrom(process.env.EMAIL_HOST_USER, "E-SMART");
        emailService.addTo(email);
        emailService.setHtml(message);
        await emailService.send();
        
    } catch (error) {
        console.log("Une erreur est survenue lors de l'envoie de notification : ", error);
        return error;   
    }
}

module.exports = {
    sendNotificationByMail
}
    