require("dotenv").config();
const nodemailer = require("nodemailer");

/**
 * class pour envoyer un mail SMS via nodemailer.
 */

class EmailService {
	constructor() {
		this.transporter = nodemailer.createTransport({
			host: process.env.EMAIL_HOST,
			port: process.env.EMAIL_PORT || 465,
			secure: true,
			auth: {
				user: process.env.EMAIL_HOST_USER,
				pass: process.env.EMAIL_HOST_PASSWORD,
			},
			logger: true, // Active le journal de bord pour le débogage
		});
	}

	// Méthodes pour configurer l'e-mail
	setSubject(subject) {
		this.subject = subject;
	}

	setBody(body) {
		this.body = body;
	}

	setFrom(email, name) {
		this.from = {
			address: email,
			name,
		};
	}

	addTo(to) {
		this.to = to;
	}

	setHtml(html) {
		this.html = html;
	}

	attachFile(filename, content, contentType) {
		if (!this.attachments) {
            this.attachments = [];
        }
        this.attachments.push({
            filename: filename,
            content: content,
            contentType: contentType,
        });
	}

	async send() {
		const mailOptions = {
			from: this.from,
			to: this.to,
			subject: this.subject,
			text: this.body,
			html: this.html,
			attachments: this.attachments,
		};

		try {
			await this.transporter.sendMail(mailOptions);
		} catch (error) {
			console.error;
			throw error;
		}
	}
}

module.exports = EmailService;
