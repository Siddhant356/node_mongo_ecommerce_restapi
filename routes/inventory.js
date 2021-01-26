const express = require('express')
const router = express.Router()
const multer = require('multer')
const checkAuth = require('../middleware/check_auth')


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-')+file.originalname)
    }
})

const fileFilter = (req, file, cb)=>{
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true)
    } else {
        cb(null, false)
    }
}
const upload = multer({
    storage: storage, 
    limits:{
        fileSize: 1024*1024*5
    },
    fileFilter: fileFilter
})

const inventioryAction = require('../method/inventory_action')

router.get('/', inventioryAction.getAllProduct)

router.post('/', checkAuth, upload.single('productImage'), inventioryAction.addNewProduct) 

router.get('/:productId', inventioryAction.getProductById)


//request example
/* 
    [
        'propName':'name || price',
        'value': 
    ]
*/
router.patch('/:productId', checkAuth, inventioryAction.updateProductById)

router.delete('/:productId', checkAuth, inventioryAction.deleteProductById)

module.exports = router

