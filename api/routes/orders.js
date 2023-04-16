const express = require('express');
const router = express.Router();

const OrdersController = require('../controllers/orders');

router.get('/', OrdersController.orders_get_all);

router.post('/', OrdersController.orders_create_order);

router.get('/:orderId', OrdersController.orders_get_order);

router.delete('/:orderId', OrdersController.orders_delete_order);

router.patch('/:orderId', OrdersController.orders_edit_order);

module.exports = router;