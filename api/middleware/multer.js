const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Définition des répertoires de stockage
const uploadDir = path.join(__dirname, '..', 'uploads');
const pictureDir = path.join(uploadDir, 'pictures');
const documentDir = path.join(uploadDir, 'documents');
const profilDir = path.join(uploadDir, 'profile');

// Création des répertoires nécessaires
[uploadDir, pictureDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configuration du stockage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log(req.files)
    // Sélection du répertoire en fonction du type de fichier
    switch (file.fieldname) {
      case 'images':
        cb(null, pictureDir);
        break;
      case 'pdf':
        cb(null, documentDir);
        break;
      case 'profile':
        cb(null, profilDir);
        break;
      default:
        cb(new Error('Type de fichier non supporté'), null);
    }
  },
  filename: function (req, file, cb) {
    cb(null, `${file.originalname}`);
  }
});

// Filtre des fichiers
const fileFilter = (req, file, cb) => {
  console.log('Fichier reçu:', file);

  const allowedTypes = {
    images: /\.(jpg|jpeg|png|webp)$/i,
    profile: /\.(jpg|jpeg|png|webp)$/i,
    // videos: /\.(mp4|webm|mov)$/i,
    pdf: /\.pdf$/i,
  };

  const typeRegex = allowedTypes[file.fieldname];
  
  if (!typeRegex) {
    return cb(new Error(`Type de fichier non supporté: ${file.fieldname}`), false);
  }

  if (!file.originalname.match(typeRegex)) {
    return cb(new Error(`Format de fichier non autorisé pour ${file.fieldname}`), false);
  }

  cb(null, true);
};

// Configuration de Multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB max par fichier
    files: 20 // Maximum 20 fichiers
  }
});

module.exports = upload;
