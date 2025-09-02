const HelpCenter = require("../models/helpCenter");
const Messages = require("../models/Messages");
const Notifications = require("../models/Notifications");
const User = require("../models/User");
const EmailService = require("../services/emailService");
const { generateTemplateHtml } = require("../services/generateTemplateHtml");
const { getGreeting } = require("../utils/helpers");

// Créer une message
exports.createMessage = async (req, res) => {
  try {
    console.log(req.body)
      const { type, user, owner, message } = req.body;

      if (!user || !owner || !message) {
          return res.status(400).json({ message: "Tous les champs sont requis." });
      }

      const messageExist = await Messages.findOne({ user: user, owner: owner });
      if (messageExist) {
        messageExist.chat.push({ type: type, content: message, createdAt: new Date() });
        await messageExist.save();
      } else {
        const newMessage = new Messages({ 
          user, owner, 
          chat: [{ 
            type: type, 
            content: message, 
            createdAt: new Date() }] 
        });
        await newMessage.save();
      }

      const data = type === 'message' ? await User.findOne({ _id: user }) : await User.findOne({ _id: owner });

      const emailService = new EmailService();
      emailService.setSubject(`Nouveau message sur STORE`);
      emailService.setFrom(process.env.EMAIL_HOST_USER, "STORE");
      emailService.addTo(data?.email);
      // emailService.addTo('mgangbala610@gmail.com');
      const msg = `Vous avez reçu un nouveau message , 
      ${type === 'response' ? 'du propiétaire ':'de l\'utilisateur '} ${data?.name} sur STORE.
      Veuillez vous rendre dans votre espace personnelle pour y répondre.`
      emailService.setHtml(generateTemplateHtml("templates/notificationMessage.html", {
        message: msg,
        salutation: getGreeting(),
      }));

      await emailService.send();

      // Notifications
      const notification = new Notifications({
        title: `Nouveau message de ${data?.name}`,
        content: `Vous avez reçu un nouveau message ${type === 'response' ? 'du propiétaire':'de l\'utilisateur'} ${data?.name}, 
Veuillez le consulter dans l'onglet Messages.`,
        user: type === 'message' ? data?._id : null,
        type: type === 'message' ? 'user':'owner',
        activity: 'message',
        data: JSON.stringify(message),
        read: false
      })
      await notification.save();

      res.status(200).json();
  } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error });
  }
};

exports.addMessageToChat = async (req, res) => {
  try {
      const { id } = req.params;
      const { type, content } = req.body;

      if (!type || !content) {
          return res.status(400).json({ message: "Le type et le contenu sont requis." });
      }

      const message = await Messages.findById(id)
        .populate('user', 'name email phoneNumber picture country address role')
        .populate('owner', 'name email phoneNumber picture country address role');

      if (!message) {
          return res.status(404).json({ message: "Conversation non trouvée." });
      }

      message.chat.push({ type, content, createdAt: new Date() });
      await message.save();

      let data = null;

      if (type === 'response') {
        data = await User.findOne({ _id: message?.owner });
      } else {
        data = await User.findOne({ _id: message?.user})
      }

      const emailService = new EmailService();
      emailService.setSubject(`Nouveau message sur STORE`);
      emailService.setFrom(process.env.EMAIL_HOST_USER, "STORE");
      emailService.addTo(data?.email);
      // emailService.addTo('mgangbala610@gmail.com');
      const msg = `Vous avez reçu un nouveau message , 
      ${type === 'response' ? 'du propiétaire ':'de l\'utilisateur '} ${data?.name} sur STORE.
      Veuillez vous rendre dans votre espace personnelle pour y répondre.`
      emailService.setHtml(generateTemplateHtml("templates/notificationMessage.html", {
        message: msg,
        salutation: getGreeting(),
      }));

      await emailService.send();

      // Notifications
      const notification = new Notifications({
        title: `Nouveau message de ${data?.name}`,
        content: `Vous avez reçu un nouveau message ${type === 'response' ? 'du propiétaire':'de l\'utilisateur'} ${data?.name}, 
Veuillez le consulter dans l'onglet Messages.`,
        user: type === 'message' ? data?._id : null,
        type: type === 'message' ? 'user':'owner',
        activity: 'message',
        data: JSON.stringify(message),
        read: false
      })
      await notification.save();

      res.status(200).json(message);
  } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error });
  }
};

exports.addMessageToChat2 = async (req, res) => {
  try {
      const { type, content, customer, owner } = req.body;

      if (!type || !content) {
          return res.status(400).json({ message: "Le type et le contenu sont requis." });
      }

      const messageExist = await Messages.findOne({ user: customer, owner: owner });
      console.log(messageExist)
      if (!messageExist) {
          return res.status(400).json({ message: "Une conversation existe deja." });
      }

      const message = await Messages.findById(messageExist?._id)
        .populate('user', 'name email phoneNumber picture country address role')
        .populate('owner', 'name email phoneNumber picture country address role');

      if (!message) {
          return res.status(404).json({ message: "Conversation non trouvée." });
      }

      message.chat.push({ type, content, createdAt: new Date() });
      await message.save();

      let data = null;

      if (type === 'response') {
        data = await User.findOne({ _id: message?.owner });
      } else {
        data = await User.findOne({ _id: message?.user})
      }

      const emailService = new EmailService();
      emailService.setSubject(`Nouveau message sur STORE`);
      emailService.setFrom(process.env.EMAIL_HOST_USER, "STORE");
      emailService.addTo(data?.email);
      // emailService.addTo('mgangbala610@gmail.com');
      const msg = `Vous avez reçu un nouveau message , 
      ${type === 'response' ? 'du propiétaire ':'de l\'utilisateur '} ${data?.name} sur STORE.
      Veuillez vous rendre dans votre espace personnelle pour y répondre.`
      
      emailService.setHtml(generateTemplateHtml("templates/notificationMessage.html", {
        message: msg,
        salutation: getGreeting(),
      }));

      await emailService.send();

      // Notifications
      const notification = new Notifications({
        title: `Nouveau message de ${data?.name}`,
        content: `Vous avez reçu un nouveau message ${type === 'response' ? 'du propiétaire':'de l\'utilisateur'} ${data?.name}, 
Veuillez le consulter dans l'onglet Messages.`,
        user: type === 'message' ? data?._id : null,
        type: type === 'message' ? 'user':'owner',
        activity: 'message',
        data: JSON.stringify(message),
        read: false
      })
      await notification.save();

      res.status(200).json(message);
  } catch (error) {
    console.log(error)
      res.status(500).json({ message: "Erreur serveur", error });
  }
};

// Récupérer toutes les questions
exports.getAllMessageByOwner = async (req, res) => {
  const  { owner } = req.params
  console.log(req.params)
  try {
    const messages = await Messages.find({ owner: owner })
        .populate('user', 'name email phoneNumber picture country address role')
        .sort({ 'chat.createdAt': -1 }); // Tri par date de création du dernier message

    // Tri supplémentaire basé sur le dernier message de chaque conversation
    const sortedMessages = messages.sort((a, b) => {
      const lastMessageA = a.chat[a.chat.length - 1];
      const lastMessageB = b.chat[b.chat.length - 1];
      
      if (!lastMessageA) return 1;  // Si A n'a pas de messages, le mettre à la fin
      if (!lastMessageB) return -1; // Si B n'a pas de messages, le mettre à la fin
      
      return new Date(lastMessageB.createdAt) - new Date(lastMessageA.createdAt);
    });

    res.status(200).json(sortedMessages);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des questions', error });
  }
};

exports.getAllMessageByTenant = async (req, res) => {
  const  { id } = req.params
  console.log(req.params)
  try {
    const messages = await Messages.find({ user: id })
        .populate('owner', 'name email phoneNumber picture country address role')
        .sort({ 'chat.createdAt': -1 }); // Tri par date de création du dernier message

    // Tri supplémentaire basé sur le dernier message de chaque conversation
    const sortedMessages = messages.sort((a, b) => {
      const lastMessageA = a.chat[a.chat.length - 1];
      const lastMessageB = b.chat[b.chat.length - 1];
      
      if (!lastMessageA) return 1;  // Si A n'a pas de messages, le mettre à la fin
      if (!lastMessageB) return -1; // Si B n'a pas de messages, le mettre à la fin
      
      return new Date(lastMessageB.createdAt) - new Date(lastMessageA.createdAt);
    });

    res.status(200).json(sortedMessages);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des questions', error });
  }
};

exports.getDiscussionByUser = async (req, res) => {
    try {
      const questions = await HelpCenter.find({ user: req.params.id })
          .populate('user', 'name email');
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
