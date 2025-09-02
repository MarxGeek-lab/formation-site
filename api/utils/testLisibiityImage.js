const Tesseract = require('tesseract.js');
const fs = require('fs');
const path = require('path');


/**
 * Teste la lisibilité d'une image en détectant le texte.
 * @param {string} imagePath - Chemin de l'image à tester.
 * @param {number} minConfidence - Confiance minimale pour considérer le texte comme lisible (0-100).
 * @returns {boolean} - Vrai si le texte est détecté avec une confiance suffisante, faux sinon.
 */

async function testLisibiliteImage(imagePath, minConfidence=70) {
    try {
        if (path.extname(imagePath).toLowerCase() === ".pdf") {}
        // Utiliser tesseract.js pour détecter le texte dans l'image
        const { data: { text, confidence } } = await Tesseract.recognize(imagePath, 'fra', { logger: m => console.log(m) });

        console.log(confidence)
        // Vérifier si le texte a été détecté avec une confiance suffisante
        return text.length > 0 && confidence >= minConfidence;
        
    } catch (error) {
        console.error("Une erreur est survenue lors du test de lisibilité de l'image :", error);
        return false;
    }
}

module.exports = {testLisibiliteImage};
