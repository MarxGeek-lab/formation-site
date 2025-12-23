require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const { execSync } = require('child_process');

async function testPDFEncryption() {
  try {
    console.log('🧪 Test de cryptage PDF...\n');

    // Créer un PDF simple
    const pdfDoc = await PDFDocument.create();
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const page = pdfDoc.addPage([595, 842]);
    const { width, height } = page.getSize();

    page.drawRectangle({
      x: 0,
      y: 0,
      width: width,
      height: height,
      color: rgb(0.98, 0, 0.25),
    });

    page.drawText('Test de Cryptage PDF', {
      x: 50,
      y: height - 100,
      size: 30,
      font: helveticaBold,
      color: rgb(1, 1, 1),
    });

    page.drawText('Ce PDF est protege par un mot de passe', {
      x: 50,
      y: height - 150,
      size: 16,
      font: helveticaBold,
      color: rgb(1, 1, 1),
    });

    // Sauvegarder le PDF temporaire
    const testDir = path.join(__dirname, '../uploads/test');
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }

    const tempPath = path.join(testDir, 'test_temp.pdf');
    const encryptedPath = path.join(testDir, 'test_encrypted.pdf');

    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync(tempPath, pdfBytes);
    console.log(`✅ PDF temporaire créé : ${tempPath}`);

    // Crypter le PDF
    const password = 'TEST1234';
    console.log(`\n🔐 Cryptage du PDF avec le mot de passe : ${password}\n`);

    // Utiliser qpdf directement via la ligne de commande avec AES-256
    execSync(`qpdf --encrypt "${password}" "${password}" 256 -- "${tempPath}" "${encryptedPath}"`, {
      stdio: 'pipe'
    });

    console.log(`✅ PDF crypté créé : ${encryptedPath}`);
    console.log(`   🔐 Mot de passe : ${password}`);

    // Supprimer le fichier temporaire
    fs.unlinkSync(tempPath);
    console.log(`\n✅ Fichier temporaire supprimé`);

    console.log(`\n🎉 Test réussi ! Le PDF crypté est disponible à :`);
    console.log(`   ${encryptedPath}`);
    console.log(`\nVous pouvez l'ouvrir avec le mot de passe : ${password}`);

  } catch (error) {
    console.error('\n❌ Erreur lors du test :', error.message);
    console.error(error);
  }
}

testPDFEncryption();
