const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authenticateToken = async (req, res, next) => {
	try {
		const token = req.headers.authorization?.split(" ")[1]; // Utiliser le chaînage optionnel pour accéder en toute sécurité au token
		const userId = req.headers["user-id"]; // Récupérer l'identifiant de l'utilisateur

		if (userId) {
			// Si l'identifiant du client existe, c'est un token d'authentification sociale
			const userExisting = await User.findOne({
				where: { id: userId },
				attributes: ["expires_in"],
			});

			if (!userExisting) {
				return res.status(401).json({ msg: "Token invalide" });
			}

			const currentTime = Date.now(); // Timestamp actuel en millisecondes
			const userExpiresIn = Number.parseInt(userExisting.expires_in, 10); // Convertir expires_in de la base de données en entier

			if (userExpiresIn < currentTime) {
				return res.status(401).json({ msg: "Token expiré" });
			}

			// Le token est valide
			return next();
		}

		if (!token) {
			return res.status(401).json({ msg: "Token manquant" });
		}

		jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
			if (err) {
				return res.status(401).json({ msg: "Token invalide" });
			}
			req.user = decoded;

			next();
		});
	} catch (error) {
		console.error("Erreur lors de la vérification du token:", error);
		res.status(500).json({ msg: "Erreur interne du serveur" });
	}
};

module.exports = authenticateToken;
