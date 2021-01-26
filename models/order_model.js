const mongoose = require('mongoose')
var Schema = mongoose.Schema
var orderSchema = Schema({
    product:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        require:true
    },
    quantity: {
        type: Number,
        default: 1
    }
})

module.exports = mongoose.model('Order', orderSchema);

// var orderSchema = Schema({
//     user:{
//         type: Schema.Types.ObjectId,
//         ref: 'User'
//     },
//     totalUnits: {
//         type: Number,
//         default: 0,
//     },
//     items:[
//         {
//             product:{
//                 type: Schema.Types.ObjectId,
//                 ref: 'Product',
//                 require:true
//             },
//             quantity: {
//                 type: Number,
//                 default: 1
//             }
//         }
//     ]
// })