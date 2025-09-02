const UserVisit = require("../models/UserVisit");

const userVisitControllers = {

    saveUserVisit: async (req, res) => {
      try {
        const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.ip;
        const userAgent = req.headers['user-agent'] || 'unknown';
            
        console.log(req.ip);
        console.log(req.socket.remoteAddress);
        console.log(req.headers['x-forwarded-for']);
        console.log(ip, userAgent);

        const visitExist = await UserVisit.findOne({ ip, userAgent });

        if (visitExist) {
          return res.status(200).json({ message: "Visite enregistrée avec succès." });
        }

        const userVisit = new UserVisit({ ip, userAgent });
        await userVisit.save();
        return res.status(200).json({ message: "Visite enregistrée avec succès." });
      } catch (error) {
        console.error("Erreur lors de l'enregistrement de la visite:", error);
        return res.status(500).json({ message: `Erreur lors de l'enregistrement de la visite.\n détails:\n ${error}` });
      }
    },

    getUserVisitRequests: async (req, res) => {
      try {
        const userVisitRequests = await UserVisit.find({});
        return res.status(200).json(userVisitRequests);
      } catch (error) {
        console.error("Erreur lors de la récupération des visites:", error);
        return res.status(500).json({ message: `Erreur lors de la récupération des visites.\n détails:\n ${error}` });
      }
    },
    
};

module.exports = userVisitControllers;
