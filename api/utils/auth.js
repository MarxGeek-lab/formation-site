const jwt = require("jsonwebtoken");

// Générer le token d'accès
const generateAccessToken = (user) => {
	const payload = {
		user: {
			...user
		},
	};

	return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: "90d",
	});
};

const generateToken = (data) => {
	const payload = { data };
	const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: "90d",
	});
	return token;
};

// Générer le refresh token
const generateRefreshToken = (user) => {
	const payload = {
		user: {
			id: user.id,
			email: user.email,
			userRole: user.userRole,
			name: user.name,
			country: user.country,
		},
		type: "refresh",
	};

	return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
		expiresIn: "90d",
	});
};

module.exports = {
	generateAccessToken,
	generateRefreshToken,
	generateToken,
};
