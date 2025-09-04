const express = require('express');
const router = express.Router();

const auth = require('../middleware/authenticateAdminToken');

const subscription = require('../controllers/subscriptionController');

router.route('/').get(auth, subscription.getAllSubscription)
                .post(auth, subscription.create)

router.route('/:id').put(auth, subscription.update)
                    .delete(auth, subscription.delete);

router.route('/:id/publishOrUnpublish').put(auth, subscription.publishOrUnpublish)

module.exports = router;