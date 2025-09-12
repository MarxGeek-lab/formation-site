const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const config = require('../config/config');
require('dotenv').config();

async function generateInvoice(data) {
    // Vérifier et créer le dossier uploads/tickets s'il n'existe pas
    const basePath = config.upload.path || '/var/www/kaadeiafrica/uploads';
    const invoicesDir = path.join(basePath, 'invoices');
    if (!fs.existsSync(invoicesDir)) {
        fs.mkdirSync(invoicesDir, { recursive: true });
    }

    const templatePath = path.join(__dirname, '../templates/invoice.html'); 
    let htmlTemplate = fs.readFileSync(templatePath, 'utf8');

    // Remplacement des valeurs dynamiques
    Object.keys(data).forEach(key => {
        htmlTemplate = htmlTemplate.replace(new RegExp(`{{${key}}}`, 'g'), data[key]);
    });

    // Génération du PDF avec Playwright
    let browser;
    let filename;
    let pdfBuffer;
    try {
        // Augmenter les timeouts et options pour améliorer la stabilité
        browser = await chromium.launch({ 
            headless: true,
            timeout: 60000, // 60 secondes de timeout pour le lancement
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
        });
        
        const context = await browser.newContext();
        const page = await context.newPage();
        
        // Utiliser une approche plus simple pour le chargement du contenu
        await page.setContent(htmlTemplate, { 
            waitUntil: 'domcontentloaded',
            timeout: 30000 // 30 secondes de timeout
        });
        
        console.log('Contenu HTML chargé avec succès');
        
        // Générer le buffer PDF avec un timeout plus long
        pdfBuffer = await page.pdf({ 
            format: 'A4', 
            printBackground: true,
            timeout: 60000 // 60 secondes de timeout
        });
        
        console.log('PDF généré avec succès');
        
        // Sauvegarder le fichier localement
        filename = `facture_${new Date().toISOString()}.pdf`;
        const pdfPath = path.join(basePath, `invoices/${filename}`);
        fs.writeFileSync(pdfPath, pdfBuffer);
        
        console.log('✅ facture généré:', filename);
        await browser.close();
    } catch (error) {
        console.error('Erreur lors de la génération du PDF:', error);
        // Fermer le navigateur si une erreur se produit
        if (browser) {
            await browser.close().catch(e => console.error('Erreur lors de la fermeture du navigateur:', e));
        }
        throw error;
    }
    
    // Retourner le buffer pour le téléchargement
    return {filename, pdfBuffer};
}

module.exports = generateInvoice;
