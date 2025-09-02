const Annonce = require("../models/Annonce");
const path = require('path');
const fs = require('fs');

// Créer une nouvelle annonce
exports.createAnnonce = async (req, res) => {
  try {
    console.log(req.body)
    console.log(req.file)
    const image = req.file ? process.env.API_URL+req.file.filename:"";

    const newAnnonce = await Annonce.create({
      typeUser: JSON.parse(req.body.typeUser), image
    });
    
    res.status(201).json({
      status: 'success',
      data: {
        annonce: newAnnonce,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

// Lire toutes les annonces
exports.getAllAnnonces = async (req, res) => {
  try {
    const annonces = await Annonce.find();
    res.status(200).json(annonces);
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

// Lire une annonce par ID
exports.getAnnonce = async (req, res) => {
  try {
    const annonce = await Annonce.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        annonce,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

// Mettre à jour une annonce par ID
exports.updateAnnonce = async (req, res) => {
  try {
    console.log(req.body)
    console.log(req.file)
    const image = req.file ? process.env.API_URL+req.file.filename:"";

    const annonce = await Annonce.findById(req.params.id);
    if (!annonce) return res.status(404).json();

    // Suppression des images
    const uploadDir = path.join(__dirname, '..', 'uploads', 'pictures');
    if (image) {
        if (annonce.image) {
            const oldFile = path.join(uploadDir, annonce.image);
            if (fs.existsSync(oldFile)) {
                try {
                    fs.unlinkSync(oldFile);
                } catch (error) {
                    console.error('Erreur lors de la suppression du fichier :', error);
                }
            }
        }

        annonce.image = image;
    }

    annonce.typeUser = JSON.parse(req.body.typeUser) || annonce.typeUser;
    await annonce.save();

    res.status(200).json({
      status: 'success',
      data: {
        annonce,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

// Supprimer une annonce par ID
exports.deleteAnnonce = async (req, res) => {
  try {
    const annonce = await Annonce.findById(req.params.id);
    if (!annonce) return res.status(400).json();

    await annonce.deleteOne();

    res.status(200).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

// Mettre à jour le statut d'une annonce
exports.updateAnnonceStatus = async (req, res) => {
  try {
    const { statut } = req.body;
    console.log(req.params)
    console.log(req.body)

    if (!['published', 'unPublished'].includes(statut)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Statut invalide.',
      });
    }

    const annonce = await Annonce.findById(req.params.id);
    if (!annonce) return res.status(400).json();

    annonce.statut = statut;
    await annonce.save()

    res.status(200).json({});
  } catch (err) {
    console.log(err)
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};
