const jwt = require("jsonwebtoken");

const authenticateAdminToken = (req, res, next) => {
	try {
		const token = req.headers.authorization?.split(" ")[1];
		if (!token) {
			return res.status(401).json({ msg: "Token manquant" });
		}

		jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
			if (err) {
				return res.status(401).json({ msg: "Token invalide" });
			}

			// Vérification du rôle
			/* if (!['super_admin', 'admin', 'moderator'].includes(decoded?.user?.role)) {
				return res.status(403).json({ msg: "Accès interdit" });
			} */

			req.user = decoded.user;
			next();
		});
	} catch (error) {
		console.error("Erreur lors de la vérification du token administrateur:", error);
		res.status(500).json({ msg: "Erreur interne du serveur" });
	}
};

module.exports = authenticateAdminToken;
