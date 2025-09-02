const SiteSettings = require("../models/Settings");

// Récupérer les paramètres du site
exports.getSiteSettings = async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();

    if (!settings) {
      // Si aucun paramètre n'existe, créez un document par défaut
      settings = await SiteSettings.create({});
    }

    res.status(200).json(settings);
  } catch (err) {
    console.log(err)
    res.status(500).json({
      status: 'fail',
      message: err.message,
    });
  }
};

// Mettre à jour les paramètres du site
exports.updateSiteSettings = async (req, res) => {
  try {
    console.log(req.body)
    const logoUrl = req.file ? process.env.API_URL+req.file.filename:"";
    console.log("file == ", logoUrl)

    const shipping = req.body.shipping ? JSON.parse(req.body.shipping) : [];
    console.log(shipping)

    const updateData = {
      ...req.body,
      ...(shipping.length > 0 ? { shippingMethods: shipping } : {}),
      ...(logoUrl ? { logoUrl } : {}),
    };

    const updatedSettings = await SiteSettings.findOneAndUpdate(
      {}, // Sélectionne le premier document (ou crée-le s'il n'existe pas)
      updateData,
      { new: true, runValidators: true, upsert: true } // Renvoie le document mis à jour, exécute les validateurs, crée si n'existe pas
    );

    console.log("update")

    res.status(200).json({
      status: 'success',
      data: {
        settings: updatedSettings,
      },
    });
  } catch (err) {
    console.log(err)
    res.status(500).json({
      status: 'fail',
      message: err.message,
    });
  }
};