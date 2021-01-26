var Product = require('../models/inventory_model')

var baseUrl = 'http://localhost:3000/inventory/'

var functions = {
    addNewProduct: 
    function (req, res, next) {
        if(!req.body.name || !req.body.price){
            res.json({
                success: false,
                msg: 'Enter all fields'
            })
        }
        else {
            var product = Product({
                name: req.body.name,
                price: req.body.price,
                productImage: req.file.path
            })
            product.save()
            .then( result => {
                    res.status(201).json({
                        success: true,
                        msg: {
                            _id: result._id,
                            name: result.name,
                            price: result.price,
                            productImage: result.productImage,
                            request: {
                                type: 'GET',
                                url: baseUrl + result._id
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
    },

    getProductById: function(req, res){
        const id = req.params.productId
        
            Product.findById(id)
            .select('name price _id productImage')
            .exec()
            .then(doc => {
                if(doc){
                    res.status(200).json({
                        success: true,
                        msg: {
                            product: doc,
                            request:{
                                type: 'GET',
                                description: 'GET_ALL_PRODUCTS',
                                url: baseUrl
                            }
                        }
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
    },

    getAllProduct:  function(req, res){
        Product.find()
        .select('name price _id productImage')
        .exec()
        .then(docs => {   
            const response = {
                count: docs.length,
                products: docs.map(doc=>{
                    return {
                        _id: doc._id,
                        name: doc.name,
                        price: doc.price,
                        productImage: doc.productImage,
                        request: {
                            type: 'GET',
                            url: baseUrl+ doc._id
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

    deleteProductById: function(req, res){
        const id = req.params.productId
        Product.remove({_id: id})
        .exec()
        .then(result => {
            res.status(200).json({
                success: true,
                msg: {
                    request:{
                        type: 'POST',
                        description: 'CREATE_NEW_PRODUCT',
                        url: baseUrl,
                        body: {
                            name: "Product name",
                            price: 'Number'
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
    },

    updateProductById: function(req, res){
        const id = req.params.productId
        const updateOps = {}
        for(const ops  of req.body){
            updateOps[ops.propName] = ops.value;
        }
        Product.update({_id: id}, { $set: updateOps})
        .exec()
        .then(result=>{
            res.status(200).json({
                success: true,
                msg: {
                    request: {
                        type: 'GET',
                        url: baseUrl+id
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