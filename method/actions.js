var User = require('../models/user')
var jwt = require('jsonwebtoken')
var config = require('../config/dbconfig')

var functions = {
    addNew:
    function (req,res) {
        if((!req.body.name) || (!req.body.password) || (!req.body.email)){
            res.json({
                success: false,
                msg: 'Enter all fields'
            })
        }
        else {
            var newUser = User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            });
            newUser.save(function(err,newUser){
                if (err){
                    if (err.name === 'MongoError' && err.code === 11000) {
                        // Duplicate username
                        return res.status(422)
                        .send({ 
                            succes: false, 
                            msg: 'User already exist! Try diffrent email' });
                      }
                    else{
                        res.json({
                        success: false,
                        msg: err.message
                        })
                    }   
                }
                else{
                    res.json({
                        success: true,
                        msg: 'Success'
                    })
                }
            })
        }
    },
    authenticate: function(req, res){
        User.findOne({
            email: req.body.email
        }, function(err,user){
            if (err) throw err
            if(!user) {
                res.status(403).send({success:false, msg: 'Authentication Faild, User not found'})
            }
            else {
                user.comparePassword(req.body.password, function(err, isMatch){
                    if(isMatch && !err){
                       var token = jwt.sign({
                           name: user.name,
                            email: user.email,
                            userId: user._id
                        }, 
                        config.secret,
                        )
                        res.json({
                            success:true,
                            token: token
                        })
                    }
                    else{
                        return res.status(403).send({
                            success: false, 
                            msg: 'Authentication Failed, wrong password!'
                        })
                    }
                })
            }
        })
    },
    getinfo: function(req, res){
            res.json({success: true,  msg: `Hello ${req.userData.name}`})
    }
}

module.exports = functions