const { imageHash } = require("image-hash");

/**
 * Calcule le pourcentage de similarité entre deux images en utilisant les empreintes hash.
 * @param {string} image1 - Chemin de l'image 1.
 * @param {string} image2 - Chemin de l'image 2.
 * @returns {number} - Pourcentage de similarité entre les deux images.
 */
async function similarityPercentage(image1, image2) {
    try {
        // Générer les empreintes hash des deux images
        const hash1 = await generateImageHash(image1);
        const hash2 = await generateImageHash(image2);

        // Vérifier si les empreintes hash sont valides
        if (!hash1 || !hash2) {
            console.log("Au moins l'une des images est vide.");
            return -1;
        }

        // Vérifier si les empreintes hash ont la même longueur
        if (hash1.length !== hash2.length) {
            console.log("Les deux empreintes hash doivent avoir la même longueur.");
            return -1;
        }

        // Calculer la distance de Hamming entre les empreintes hash
        let hammingDistance = 0;
        const length = hash1.length;

        for (let i = 0; i < length; i++) {
            if (hash1[i] !== hash2[i]) {
                hammingDistance++; // Incrémenter la distance de Hamming
            }
        }

        // Calculer le pourcentage de similarité
        const similarity = (length - hammingDistance) / length;
        const percentageSimilarity = similarity * 100;

        console.group(percentageSimilarity)
        return percentageSimilarity;
    } catch (error) {
        console.error("Une erreur est survenue lors du calcul du pourcentage de similarité :", error);
        return -1;
    }
}

/**
 * Génère l'empreinte hash d'une image.
 * @param {string} imagePath - Chemin de l'image.
 * @returns {Promise<string>} - Empreinte hash de l'image.
 */
function generateImageHash(imagePath) {
    return new Promise((resolve, reject) => {
        imageHash(imagePath, 16, true, (error, data) => {
            if (error) {
                reject(error);
            } else {
                resolve(data);
            }
        });
    });
}

// Exemple d'utilisation de la fonction


module.exports = {similarityPercentage};