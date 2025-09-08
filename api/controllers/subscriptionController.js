const Subscription = require("../models/Subscription");

exports.create = async (req, res) => {
    console.log(req.body);
    try {
        const verify = await Subscription.findOne({ title: req.body.title });
        if (verify) return res.status(409).send();

        const newPlan = new Subscription({ ...req.body });
        await newPlan.save();

        return res.status(201).json(newPlan);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Erreur lors de la création' });   
    }
}

exports.update = async (req, res) => {
    try {
        const subscription = await Subscription.findById(req.params.id);
        if (!subscription) return res.status(404).send();

        await subscription.updateOne(
            { ...req.body },
            {new: true}
        );

        return res.json(subscription);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Erreur lors de la mise à jour' }); 
    }
}

exports.delete = async (req, res) => {
    try {
        const subscription = await Subscription.findById(req.params.id);
        if (!subscription) return res.status(404).send();

        await subscription.deleteOne();

        return res.status(200).send();
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Erreur lors de la mise à jour' }); 
    }
}

exports.publishOrUnpublish = async (req, res) => {
    try {
      const subscription = await Subscription.findById(req.params.id)
  
      if (!subscription) {
        return res.status(404).json({ message: 'Cours non trouvé' });
      }
  
      subscription.is_active = !subscription.is_active;
      await subscription.save();
  
      res.json(subscription);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'État de publication' });
    }
}

exports.getAllSubscription = async (req, res) => {
    try {
        const subscriptions = await Subscription.find().populate('product');

        return res.json(subscriptions)
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Erreur lors de la récupération' });
    }
}