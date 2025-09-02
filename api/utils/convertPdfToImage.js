/* const { convert } = require("pdf-poppler");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const { testLisibiliteImage } = require("./testLisibiityImage");
const path = require("path");

/**
 * 
 * @param {string} pdfFilePath - chemin pour accéder accéder au fichier pdf
 * @param {string} outputDir  - le dossier de sortie 
 */
/* async function convertPDFToImages(pdfFilePath, outputDir) {
    return new Promise( async (resolve, reject) => {
        try {
            // Vérifie si le répertoire de sortie existe, sinon le crée
            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, { recursive: true });
            }

            let id = uuidv4();

            // Options de conversion
            const options = {
                format: "png",  // Format de l'image de sortie (png, jpg, jpeg, tiff)
                out_dir: outputDir,  // Répertoire de sortie pour les images converties
                out_prefix: `page_${id}`  // Préfixe du nom de fichier pour les images converties
            };

            // Conversion du PDF en images
            // Conversion du PDF en images
            const imagePaths = await convert(pdfFilePath, options);

            console.log("Conversion du PDF en images terminée.");
            console.log("Chemins des images converties :", imagePaths);

            // Test de lisibilité des images
            const lisibiliteResults = [];
            for (const imagePath of imagePaths) {
                const isReadable = await testLisibiliteImage(imagePath, minConfidence);
                lisibiliteResults.push({ imagePath, isReadable });
            }

            console.log("Résultats de lisibilité :", lisibiliteResults);
            resolve({ imagePaths, lisibiliteResults });

            // Conversion du PDF en images
            /* convert(pdfFilePath, options)
                .then(imagePaths => {
                    console.log("Conversion du PDF en images terminée.");
                    console.log("Chemins des images converties :", imagePaths);

                    // Renommer les fichiers de sortie pour les rendre uniques
                    for (let i = 0; i < imagePaths.length; i++) {
                        const oldPath = imagePaths[i];
                        const newPath = path.join(outputDir, `page_${i + 1}.png`);
                        fs.renameSync(oldPath, newPath);
                        imagePaths[i] = newPath; // Mettre à jour les chemins avec les nouveaux noms
                    }

                   
                })
                .catch(error => {
                    console.error("Erreur lors de la conversion du PDF en images :", error);
                    reject(error); // Renvoyer l'erreur en cas d'échec de la conversion
                }); */
        } catch (error) {
            console.error("Erreur lors de la conversion du PDF en images :", error);
            reject(error); // Renvoyer l'erreur en cas d'erreur pendant la conversion
        }
    });




/* function getNewestConvertedFile(outputDir, prefix) {
    return new Promise((resolve, reject) => {
        fs.readdir(outputDir, (err, files) => {
            if (err) {
                reject(err);
                return;
            }
            const filteredFiles = files.filter(file => file.startsWith(prefix));
            if (filteredFiles.length === 0) {
                reject(new Error("Aucun fichier correspondant trouvé."));
                return;
            }

            console.log("trouvé", filteredFiles)
            const newestFile = filteredFiles.reduce((prev, curr) => {
                const prevStat = fs.statSync(path.join(outputDir, prev));
                const currStat = fs.statSync(path.join(outputDir, curr));
                return prevStat.mtime > currStat.mtime ? prev : curr;
            });
            resolve(path.join(outputDir, newestFile));
        });
    });
}  */



//module.exports = convertPDFToImages;