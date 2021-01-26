const mongoose = require('mongoose')

const Order = require('../models/order_model')
const Product = require('../models/inventory_model')
var baseOrderUrl = 'http://localhost:3000/orders/'

var functions = {
    createOrder: function (req, res){
        if(!req.body.productId){
            res.json({
                success: false,
                msg: 'Product Id required'
            })
        } else {
            var order = new Order({
                quantity: req.body.quantity,
                product: req.body.productId
            })
            Product.findById(req.body.productId)
            .then(product=>{
                if(product){
                    return order.save()
                    .then(result=>{
                        res.status(201).json({
                            success: true,
                            msg: {
                                _id: result._id,
                                product: result.product,
                                quantity: result.quantity,
                                request: {
                                    type: 'GET',
                                    url: baseOrderUrl+result._id
                                }
                            }
                        })
                    })
                } else {
                    res.status(404).json({
                        success: false,
                        msg: 'Product Not Found'
                    })
                }
            })
            .catch(err =>{
                res.status(500).json({
                    success: false,
                    msg: err.message
                })
            })
        
        }
    },

    getAllOrders: function (req, res) {
        Order.find()
        .select("product quantity _id")
        .populate('product', 'name price')
        .exec()
        .then(docs => {   
            const response = {
                count: docs.length,
                orders: docs.map(doc=>{
                    return {
                        _id: doc._id,
                        product: doc.product,
                        quantity: doc.quantity,
                        request: {
                            type: 'GET',
                            url: baseOrderUrl+doc._id
                        }
                    }
                })
            } 
            res.status(200).json({
                success: true,
                msg: response
            })
        }).catch(err =>{
            res.status(500).json({
                success: false,
                msg: err.message
            })
        })
    },

    getOrderById: function (req, res){
        const id = req.params.orderId;
        Order.findById(id)
            .populate('product', 'name price')
            .exec()
            .then(doc => {
                if(doc){
                    res.status(200).json({
                        success: true,
                        msg: {
                            order: doc,
                            request:{
                                type: 'GET',
                                description: 'GET_ALL_ORDERS',
                                url: baseOrderUrl
                            }
                        }
                    })
                } else {
                    res.status(404).json({
                        success: false,
                        msg: 'Order Not Found'
                    })
                }
            })
            .catch(err =>{
                res.status(500).json({
                    success: false,
                    msg: err.message
                })
            })
    },

    deleteOrderById: function (req, res){
        const id = req.params.productId
        Order.remove({_id: id})
        .exec()
        .then(result => {
            res.status(200).json({
                success: true,
                msg: {
                    request:{
                        type: 'POST',
                        description: 'CREATE_NEW_ORDER',
                        url: baseOrderUrl,
                        body: {
                            productId: "Product ID",
                            quantity: 'Number'
                        }
                    }
                }
            })
        })
        .catch(err =>{
            res.status(500).json({
                success: false,
                msg: err.message
            })
        })
    }
}

module.exports = functions