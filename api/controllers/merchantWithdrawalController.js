const Admin = require("../models/Admin");
const Withdrawal = require("../models/Withdrawal");
const Notifications = require("../models/Notifications");
const User = require("../models/User");
const commonService = require("../services/commonService");
const { EmailService } = require("../services/emailService");
const { generateTemplateHtml } = require("../services/generateTemplateHtml");
const { getGreeting } = require("../utils/helpers");

require('dotenv').config();

// Créer une demande de retrait
exports.createWithdrawalRequest = async (req, res) => {
  try {
    const { user, amount, numberWithdraw, method, typeUser } = req.body;

    // Vérifier le montant retirable
    const amountWithdrawal = await commonService.checkBalance(user, typeUser);

    if (amountWithdrawal < amount) {
        return res.status(400).json({msg: ''});
    } 
    
    const withdrawal = await Withdrawal.create({
      user,
      amount,
      numberWithdraw,
      method,
      typeUser
    });

    // Notifications email 
    // Get user owner
    const userOwner = await User.findById(withdrawal?.user?._id).select('email name');

    const admins = await Admin.find({ isActive: true }).select('email name');

    const message = `Une demande de retrait de ${amount} a été effectuée par ${userOwner?.name}.
    Veuillez vous rendre sur votre compte pour analyser cette demande.`;

    const emailService = new EmailService();
    emailService.setSubject("Demande de Retrait");
    emailService.setFrom(process.env.EMAIL_HOST_USER, "Rafly");
    emailService.addTo(admins.map(item => item.email)); 
    emailService.setHtml(generateTemplateHtml('templates/withdrawal.html', {
      salutation: getGreeting(),
      name: '',
      message: message
    }));
    await emailService.send();

    // Notifications
    const notification = new Notifications({
      content: message,
      user: null,
      title: 'Demande de Retrait',
      type: 'admin',
      activity: 'withdrawal',
      data: JSON.stringify(withdrawal),
      read: false
    });

    await notification.save();

    res.status(201).json({ success: true, data: withdrawal });
  } catch (err) {
    console.log(err)
    res.status(500).json({ success: false, error: err.message });
  }
};

// Récupérer toutes les demandes
exports.getAllWithdrawalsByAdmin = async (req, res) => {
  console.log("venir ici")
  try {
    const withdrawals = await Withdrawal.find()
      .populate('user', 'name email picture')
      .populate('validatedBy', 'name email picture');

    res.status(200).json(withdrawals);
  } catch (err) {
    console.log(err)
    res.status(500).json({ success: false, error: err.message });
  }
};

// Récupérer les retraits d’un marchand
exports.getWithdrawalsByMerchant = async (req, res) => {
  try {
    const { id } = req.params;
    const withdrawals = await Withdrawal.find({ user: id })
      .populate('validatedBy', 'name email picture')
      .sort({ createdAt: -1 });
      
    res.status(200).json(withdrawals);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getWithdrawalsById = async (req, res) => {
  try {
    const { id } = req.params;
    const withdrawals = await Withdrawal.findById(id)
        .populate('user', 'name email picture phoneNumber country city district address')
        .populate('validatedBy', 'name email');

    res.status(200).json(withdrawals);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.updateWithdrawal = async (req, res) => {
    try {
      console.log(req.params)
        const { id } = req.params;
        const { amount, numberWithdraw, method } = req.body;
        
        const withdrawal = await Withdrawal.findById(id);
        if (!withdrawal) {
          return res.status(404).json({ success: false, message: 'Demande non trouvée' });
        }
        console.log(withdrawal)
        if (withdrawal.status !== 'pending') {
            return res.status(400).json({ success: false, message: '' });
        }

        withdrawal.amount = amount || withdrawal.amount;
        withdrawal.numberWithdraw = numberWithdraw || withdrawal.numberWithdraw;
        withdrawal.method = method || withdrawal.method;

        await withdrawal.save();
  
      res.status(200).json({ success: true, data: withdrawal });
    } catch (err) {
      console.log(err)
      res.status(500).json({ success: false, error: err.message });
    }
  };

  
// Supprimer une demande
exports.deleteWithdrawal = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await Withdrawal.findById(id);
    if (!result) {
      return res.status(404).json({ success: false, message: 'Demande non trouvée' });
    }
    
    if (result.status !== 'pending') {
        return res.status(400).json({ success: false, message: 'Demande non trouvée' });
    }

    await result.deleteOne();

    res.status(200).json({ success: true, message: 'Demande supprimée' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
