var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var inventorySchema = new Schema({
    name: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    productImage:{
        type: String
    }
})

module.exports = mongoose.model('Product', inventorySchema)
