const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authenticate = require('../middleware/auth');

router.use(authenticate);

router.post('/', orderController.checkout);
router.get('/', orderController.getMyOrders);
router.get('/:id', orderController.getOrder);

module.exports = router;
