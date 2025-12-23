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

// Fonction spécialisée pour envoyer un email de panier abandonné
async function sendAbandonedCartEmail(cart) {
	try {
		// Simulation d'envoi d'email (remplacez par votre service email réel)
		console.log('=== EMAIL DE RELANCE PANIER ABANDONNÉ ===');
		console.log(`À: ${cart.email}`);
		console.log(`Panier ID: ${cart._id}`);
		console.log(`Nombre d'articles: ${cart.totalItems}`);
		console.log(`Valeur totale: ${cart.totalPrice}€`);
		console.log(`Abandonné le: ${cart.abandonedAt}`);
		console.log('');
		console.log('Objet: Vous avez oublié quelque chose dans votre panier ! 🛒');
		console.log('');
		console.log('Contenu de l\'email:');
		console.log('---');
		console.log(`Bonjour,`);
		console.log('');
		console.log(`Nous avons remarqué que vous avez laissé ${cart.totalItems} article(s) dans votre panier pour une valeur de ${cart.totalPrice}€.`);
		console.log('');
		console.log('Articles dans votre panier:');
		cart.items.forEach((item, index) => {
			console.log(`${index + 1}. ${item.name} - ${item.quantity}x ${item.price}€`);
		});
		console.log('');
		console.log('Ne les laissez pas s\'échapper ! Finalisez votre commande dès maintenant.');
		console.log('');
		console.log('[BOUTON: Finaliser ma commande]');
		console.log('');
		console.log('Cordialement,');
		console.log('L\'équipe MarxGeek Academy');
		console.log('==========================================');

		// Si vous avez un vrai service email, décommentez et adaptez le code ci-dessous:
		/*
		const emailService = new EmailService();
		
		emailService.setFrom(process.env.EMAIL_FROM || 'noreply@rafly.com', 'MarxGeek Academy');
		emailService.addTo(cart.email);
		emailService.setSubject('Vous avez oublié quelque chose dans votre panier ! 🛒');
		
		const htmlContent = generateAbandonedCartEmailHTML(cart);
		emailService.setHtml(htmlContent);
		
		await emailService.send();
		*/

		return true;
	} catch (error) {
		console.error('Erreur lors de l\'envoi de l\'email de relance:', error);
		throw error;
	}
}

// Fonction pour générer le HTML de l'email de panier abandonné
function generateAbandonedCartEmailHTML(cart) {
	const itemsHTML = cart.items.map(item => `
		<tr>
			<td style="padding: 10px; border-bottom: 1px solid #eee;">
				${item.image ? `<img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; margin-right: 10px;">` : ''}
				<strong>${item.name}</strong>
				${item.category ? `<br><small style="color: #666;">${item.category}</small>` : ''}
			</td>
			<td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
			<td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${item.price}€</td>
		</tr>
	`).join('');

	return `
		<!DOCTYPE html>
		<html>
		<head>
			<meta charset="utf-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>Panier abandonné - MarxGeek Academy</title>
		</head>
		<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
			<div style="background: #f8f9fa; padding: 30px; border-radius: 10px;">
				<h1 style="color: #2c3e50; text-align: center; margin-bottom: 30px;">
					🛒 Vous avez oublié quelque chose !
				</h1>
				
				<p style="font-size: 16px; margin-bottom: 20px;">
					Bonjour,
				</p>
				
				<p style="font-size: 16px; margin-bottom: 30px;">
					Nous avons remarqué que vous avez laissé <strong>${cart.totalItems} article(s)</strong> 
					dans votre panier pour une valeur de <strong>${cart.totalPrice}€</strong>.
				</p>
				
				<div style="background: white; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
					<h3 style="margin-top: 0; color: #2c3e50;">Votre panier :</h3>
					<table style="width: 100%; border-collapse: collapse;">
						<thead>
							<tr style="background: #f8f9fa;">
								<th style="padding: 10px; text-align: left;">Produit</th>
								<th style="padding: 10px; text-align: center;">Qté</th>
								<th style="padding: 10px; text-align: right;">Prix</th>
							</tr>
						</thead>
						<tbody>
							${itemsHTML}
						</tbody>
						<tfoot>
							<tr style="background: #f8f9fa; font-weight: bold;">
								<td style="padding: 15px;">Total</td>
								<td style="padding: 15px; text-align: center;">${cart.totalItems}</td>
								<td style="padding: 15px; text-align: right;">${cart.totalPrice}€</td>
							</tr>
						</tfoot>
					</table>
				</div>
				
				<div style="text-align: center; margin-bottom: 30px;">
					<a href="${process.env.FRONTEND_URL || 'https://rafly.com'}/panier?restore=${cart._id}" 
					   style="background: #3498db; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
						Finaliser ma commande
					</a>
				</div>
				
				<p style="font-size: 14px; color: #666; text-align: center;">
					Ne laissez pas ces articles s'échapper ! Cette offre est valable pendant 48h.
				</p>
				
				<hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
				
				<p style="font-size: 14px; color: #666; text-align: center;">
					Cordialement,<br>
					L'équipe MarxGeek Academy
				</p>
				
				<p style="font-size: 12px; color: #999; text-align: center; margin-top: 30px;">
					Vous recevez cet email car vous avez des articles dans votre panier sur MarxGeek Academy.<br>
					<a href="${process.env.FRONTEND_URL || 'https://rafly.com'}/unsubscribe?email=${cart.email}" style="color: #999;">Se désabonner</a>
				</p>
			</div>
		</body>
		</html>
	`;
}

// Fonction pour envoyer un email de suivi après X jours
async function sendFollowUpEmail(cart, daysAfter = 3) {
	try {
		console.log('=== EMAIL DE SUIVI PANIER ABANDONNÉ ===');
		console.log(`À: ${cart.email}`);
		console.log(`Panier ID: ${cart._id}`);
		console.log(`Suivi après: ${daysAfter} jours`);
		console.log('');
		console.log('Objet: Dernière chance ! Votre panier vous attend 💔');
		console.log('');
		console.log('Contenu de l\'email de suivi...');
		console.log('==========================================');

		// Implémentation similaire avec un template différent
		return true;
	} catch (error) {
		console.error('Erreur lors de l\'envoi de l\'email de suivi:', error);
		throw error;
	}
}

module.exports = {
	EmailService,
	sendAbandonedCartEmail,
	generateAbandonedCartEmailHTML,
	sendFollowUpEmail
};
