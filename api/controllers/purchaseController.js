const Sale = require("../models/Sale");


const purchaseController = {
    getPurchaseByTenant: async (req, res) => {
        try {
            const purchase = await Sale.find({ buyer: req.params.id })
              .populate({
                path: 'property',
                populate: 'owner'
              })
              .populate('payment');

            return res.status(200).json(purchase);
        } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error', error });
        }
    },

    getPurchaseById: async (req, res) => {
      try {
          const purchase = await Sale.findOne({ _id: req.params.id })
            .populate('property')
            .populate('payment')
            .populate('buyer')
            .populate('seller');

          return res.status(200).json(purchase);
      } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error', error });
      }
  }
}

module.exports = purchaseController;