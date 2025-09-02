const crypto = require("node:crypto");
const EmailService = require("../services/emailService");
const { generateTemplateHtml } = require("../services/generateTemplateHtml");
const axios = require("axios")
require("dotenv").config();'f'

function generateVerificationCode() {
	let code = "";
	for (let i = 0; i < 4; i++) {
		code += Math.floor(Math.random() * 9) + 1;
	}
	return code;
}

// Fonction pour "crypter" le mot de passe
function encryptPassword(password) {
	console.log(password);
	const hash = crypto
		.createHmac("sha256", "password@@marxgeek##")
		.update(password)
		.digest("hex");
	return hash;
}

// Vérification du mot de passe lors de la connexion
function verifyPassword(plainPassword, hashedPassword) {
	const hash = crypto
		.createHmac("sha256", "password@@marxgeek##")
		.update(plainPassword)
		.digest("hex");
	return hash === hashedPassword;
}

const encryptData = (data) =>
	Buffer.from(JSON.stringify(data)).toString("base64");

const decryptData = (encodedData) => {
	try {
		return Buffer.from(encodedData, "base64").toString("ascii");
	} catch (error) {
		reject("Erreur de décodage");
	}
};

// send mail notificaton
const sendMailNotification = async (emailArray, subject, message) => {
	const recipient = Array.isArray(emailArray)
		? emailArray.join(", ")
		: emailArray;
	const year = new Date().getFullYear();
	const data = { subject, message, year };

	const emailService = new EmailService();

	emailService.setSubject(subject);
	emailService.setFrom(process.env.EMAIL_HOST_USER, "E-Constructiv");
	emailService.addTo(recipient);
	emailService.setHtml(generateTemplateHtml("templates/notify.html", data));

	await emailService.send();
};

const getGreeting = () => {
	const hour = new Date().getHours();
	if (hour < 12) return "Bonjour,";
	if (hour < 18) return "Bon après-midi,";
	return "Bonsoir,";
  };

const getStatusPayout = async(reference) => {
  const res = await axios.get(`https://api.feexpay.me/api/payouts/public/single/status/${reference}`, {
	headers: {
	  "Authorization": `Bearer ${process.env.API_KEY}`
	}
  });
  
  return res;
}

const getStatusPayment = async(reference) => {
  const res = await axios.get(`https://api.feexpay.me/api/transactions/public/single/status/${reference}`, {
	headers: {
	  "Authorization": `Bearer ${process.env.API_KEY}`
	}
  });
  
  return res;
}

module.exports = {
	generateVerificationCode,
	encryptPassword,
	verifyPassword,
	encryptData,
	decryptData,
	sendMailNotification,
	getGreeting,
	getStatusPayout,
	getStatusPayment
};
