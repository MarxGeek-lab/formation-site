// services/uniMessageService.js
const { UniClient } = require('uni-sdk');

class UniMessageService {
  constructor() {
    this.client = new UniClient();
  }

  /**
   * Envoyer un SMS
   * @param {string} phoneNumber - numéro au format E.164 (+1206880xxxx)
   * @param {string} message - texte du SMS
   * @returns {Promise<Object>} résultat de l'envoi
   */
  async sendMessage(phoneNumber, message) {
    try {
      const result = await this.client.messages.send({
        to: phoneNumber,
        text: message,
      });
      console.log('Message envoyé avec succès:', result);
      return result;
    } catch (error) {
      console.error('Erreur lors de l’envoi du SMS:', error);
      throw error;
    }
  }
}

module.exports = UniMessageService;
