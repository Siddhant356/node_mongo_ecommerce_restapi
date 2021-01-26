const express = require('express')
const router = express.Router()
const orderAction = require('../method/order_action')
const checkAuth = require('../middleware/check_auth')

router.get('/', checkAuth, orderAction.getAllOrders)

router.post('/', checkAuth, orderAction.createOrder) 

router.get('/:orderId', checkAuth, orderAction.getOrderById)

router.delete('/:productId', checkAuth, orderAction.deleteOrderById)

module.exports = router

