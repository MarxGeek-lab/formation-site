const handlebars = require("handlebars");
const fs = require("fs");

/**
 * fonction pour envoyer un mail SMS via nodemailer.
 * @param {string} template - le template de message
 * @param {string} data - les données à renseigné dans le template
 */

const generateTemplateHtml = (templates, data) => {
	const template = fs.readFileSync(templates, "utf-8");
	const compiledTemplate = handlebars.compile(template);
	return compiledTemplate(data);
};

module.exports = {
	generateTemplateHtml,
};
