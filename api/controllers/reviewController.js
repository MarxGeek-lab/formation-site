const { default: mongoose } = require("mongoose");
const Product = require("../models/Product");
const Review = require("../models/Review");

const reviewController = {
    // Gestion des avis
  addReview: async (req, res) => {
    try {
      console.log(req.body)
      const { rating, comment, userId, productId } = req.body;
      const product = await Product.findById(productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Produit non trouvée'
        });
      }

      const reviewsExist = await Review.findOne({ product: productId, user: userId });

      if (reviewsExist) {
        return res.status(400).json({
          success: false,
          message: 'Vous avez déjà laissé un avis'
        });
      }

      const review = new Review({
        product: productId,
        user: userId,
        rating,
        comment
      });

      await review.save();

      product.reviews.push({review: review._id});
      await product.save();

      res.status(201).json({
        success: true,
        data: review
      });
    } catch (error) {
      console.log(error)
      res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'ajout de l\'avis',
        error: error.message
      });
    }
  },

  updateReview: async (req, res) => {
    try {
      const { rating, comment } = req.body;
      const review = await Review.findOneAndUpdate(
        {
          _id: req.params.reviewId,
          user: req.user.id
        },
        { rating, comment },
        { new: true }
      );

      if (!review) {
        return res.status(404).json({
          success: false,
          message: 'Avis non trouvé ou non autorisé'
        });
      }

      res.status(200).json({
        success: true,
        data: review
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la mise à jour de l\'avis',
        error: error.message
      });
    }
  },

  deleteReview: async (req, res) => {
    try {
      const review = await Review.findOne({
        _id: req.params.id,
      });

      if (!review) {
        return res.status(404).json({
          success: false,
          message: 'Avis non trouvé ou non autorisé'
        });
      }

      await review.deleteOne();

      res.status(200).json({
        success: true,
        message: 'Avis supprimé avec succès'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la suppression de l\'avis',
        error: error.message
      });
    }
  },

  getPropertyReviews: async (req, res) => {
    try {
      console.log("===", req.params)
      const reviews = await Review.find({ product: req.params.id })
        .populate('user', 'name email picture')
        .sort({ createdAt: -1 });

      res.status(200).json(reviews);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des avis',
        error: error.message
      });
    }
  },

  getProductReviews: async (req, res) => {
    try {
      const reviews = await Review.find()
        .populate('product')
        .populate('user')
        .sort({ createdAt: -1 });
  
      res.status(200).json(reviews);
    } catch (error) {
      console.log(error)
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des avis',
        error: error.message
      });
    }
  },

  getReviewById: async (req, res) => {
    console.log(req.params)
    try {
      const review = await Review.findById(req.params.id)
        .populate({
          path: 'product',
          populate: { path: 'owner' }
        })
        .populate('user')
        .sort({ createdAt: -1 });
  
      res.status(200).json(review);
    } catch (error) {
      console.log(error)
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des avis',
        error: error.message
      });
    }
  },

  likeReview: async (req, res) => {
    try {
      const review = await Review.findById(req.params.id);
      if (!review) {
        return res.status(404).json({
          success: false,
          message: 'Avis non trouvé'
        });
      }

      // Vérifier si l'utilisateur a déjà liké
      const isLiked = review.likes.includes(req.body.userId);
      // Vérifier si l'utilisateur a déjà disliké
      const isDisliked = review.dislikes.includes(req.body.userId);

      if (isLiked) {
        // Retirer le like
        review.likes = review.likes.filter(id => id.toString() !== req.body.userId);
      } else {
        // Ajouter le like et retirer le dislike s'il existe
        if (isDisliked) {
          review.dislikes = review.dislikes.filter(id => id.toString() !== req.body.userId);
        }
        review.likes.push(req.body.userId);
      }

      await review.save();
      res.status(200).json(review);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la mise à jour du like',
        error: error.message
      });
    }
  },

  dislikeReview: async (req, res) => {
    try {
      const review = await Review.findById(req.params.id);
      if (!review) {
        return res.status(404).json({
          success: false,
          message: 'Avis non trouvé'
        });
      }

      // Vérifier si l'utilisateur a déjà disliké
      const isDisliked = review.dislikes.includes(req.body.userId);
      // Vérifier si l'utilisateur a déjà liké
      const isLiked = review.likes.includes(req.body.userId);

      if (isDisliked) {
        // Retirer le dislike
        review.dislikes = review.dislikes.filter(id => id.toString() !== req.body.userId);
      } else {
        // Ajouter le dislike et retirer le like s'il existe
        if (isLiked) {
          review.likes = review.likes.filter(id => id.toString() !== req.body.userId);
        }
        review.dislikes.push(req.body.userId);
      }

      await review.save();
      res.status(200).json(review);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la mise à jour du dislike',
        error: error.message
      });
    }
  }
};

module.exports = reviewController;