const jwt = require('jsonwebtoken')
var config = require('../config/dbconfig')



module.exports = (req, res, next)=>{
    try {
        var token = req.headers.authorization.split(' ')[1]
        const decodedtoken = jwt.verify(token, config.secret)
        req.userData = decodedtoken
        next()
    } catch (error) {
        return res.status(401).json({
            msg: "Auth failed"
        })
    }
    
}