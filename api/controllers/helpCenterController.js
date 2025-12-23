const Admin = require("../models/Admin");
const HelpCenter = require("../models/helpCenter");
const Notifications = require("../models/Notifications");
const User = require("../models/User");
const { EmailService } = require("../services/emailService");
const { generateTemplateHtml } = require("../services/generateTemplateHtml");
const { getGreeting } = require("../utils/helpers");

// Créer une question
exports.createQuestion = async (req, res) => {
  try {
    console.log(req.body)
    const { user, quiz } = req.body;
    const newQuestion = new HelpCenter({
      user: user,
      quiz
    });
    await newQuestion.save();

    const userN = await User.findOne({ _id: user });

    const emailService = new EmailService();
    emailService.setSubject(`Assistance sur MarxGeek Academy`);
    emailService.setFrom(process.env.EMAIL_HOST_USER, "MarxGeek Academy");
    emailService.addTo('mgangbala610@gmail.com');
    const message = `Vous avez reçu un nouveau message d'assistance de l'utilisateur ${userN?.name}.
    Veuillez vous rendre dans votre espace personnelle pour y répondre.`
    
    emailService.setHtml(generateTemplateHtml("templates/notificationAssistance.html", {
      message: message,
      salutation: getGreeting()
    }));
    await emailService.send();

    res.status(201).json(newQuestion);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Erreur lors de la création de la question', error });
  }
};

exports.addMessageToChatSupport = async (req, res) => {
  try {
    console.log(req.body)
    console.log(req.params)
      const { type, content, user } = req.body;

      if (!type || !content) {
          return res.status(400).json({ message: "Le type et le contenu sont requis." });
      }

      // on vérifie si le support de ce client existe ou pas
      let userSupport = await HelpCenter.findOne({ user: user });
      
      if (!userSupport) { // ça n'xiste pas, on créer
        const newSupport = await HelpCenter.create({ user });
        await newSupport;

        userSupport = newSupport;
      }

      userSupport.chat.push({ type, content, createdAt: new Date() });
      await userSupport.save();

      const userData = await User.findOne({ _id: user });

      let msg='';
      let title='';
      if (type === 'message') {
        title='Demande d\'assistance sur MarxGeek Academy'
        msg = `Vous avez reçu un nouveau message d'assistance de l'utilisateur ${userData?.name}.
        Veuillez vous rendre dans votre espace personnelle pour y répondre.`
      } else {
        title='Réponse suite à votre demande d\'assistance sur MarxGeek Academy';
        msg = `Le support a répondu à votre demande. Veuillez consulter votre boîte d'assistance.`;
      }

      // récupérer les admins
      const admins = await Admin.find();

      const emailsAdmin = admins.map(item => item.email);

      const emailService = new EmailService();
      emailService.setSubject(title);
      emailService.setFrom(process.env.EMAIL_HOST_USER, "MarxGeek Academy");
      if (type === 'message') {
        emailService.addTo(emailsAdmin);
      } else {
        emailService.addTo(userData?.email);
      }
      
      emailService.setHtml(generateTemplateHtml("templates/notificationAssistance.html", {
        message: msg,
        salutation: getGreeting(),
      }));

      await emailService.send();

      // Notifications
      const notification = new Notifications({
        title: type === 'message' ? 'Demande d\'assistance sur MarxGeek Academy' : 'Réponse suite à votre demande d\'assistance sur MarxGeek Academy',
        content: msg,
        user: type === 'message' ? null : user,
        type: type === 'message' ? 'user': 'admin',
        activity: 'helpCenter',
        data: JSON.stringify(userSupport)
      })
      await notification.save();

      res.status(200).json(userSupport);
  } catch (error) {
    console.log(error)
      res.status(500).json({ message: "Erreur serveur", error });
  }
};

// Récupérer toutes les questions
exports.getAllQuestions = async (req, res) => {
  try {
    const questions = await HelpCenter.find()
        .populate('user', 'name email');
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des questions', error });
  }
};

exports.getDiscussionByUser = async (req, res) => {
    try {
      const questions = await HelpCenter.find({ user: req.params.id })
          .populate('user', 'name email')
          .populate('chat.adminId', 'name email');
          
      res.status(200).json(questions);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération des questions', error });
    }
  };

// Ajouter une réponse à une question
exports.addAnswer = async (req, res) => {
  try {
    const { questionId, response } = req.body;
    const question = await HelpCenter.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: 'Question non trouvée' });
    }
    question.answers.push({ adminId: req.user.id, response });
    question.status = 'answered';
    await question.save();
    res.status(200).json(question);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'ajout de la réponse', error });
  }
};

// Fermer une question
exports.closeQuestion = async (req, res) => {
  try {
    const { questionId } = req.body;
    const question = await HelpCenter.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: 'Question non trouvée' });
    }
    question.status = 'closed';
    await question.save();
    res.status(200).json({ message: 'Question fermée avec succès', question });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la fermeture de la question', error });
  }
};
