var User = require('../models/user')
var jwt = require('jwt-simple')
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
                        return res.status(422).send({ succes: false, msg: 'User already exist! Try diffrent email' });
                      }
                    else{
                        res.json({
                        success: false,
                        msg: `Faild to save`
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
            name: req.body.name
        }, function(err,user){
            if (err) throw err
            if(!user) {
                res.status(403).send({success:false, msg: 'Authentication Faild, User not found'})
            }
            else {
                user.comparePassword(req.body.password, function(err, isMatch){
                    if(isMatch && !err){
                        var token =jwt.encode(user, config.secret)
                        res.json({
                            success:true,
                            token: token
                        })
                    }
                    else{
                        return res.status(403).send({success: false, msg: 'Authentication Failed, wrong password!'})
                    }
                })
            }
        })
    },
    getinfo: function(req, res){
        if(req.headers.authorization && req.headers.authorization.split(' ')[0]==='Bearer'){
            var token = req.headers.authorization.split(' ')[1]
            var decodedtoken = jwt.decode(token, config.secret)
            return res.json({success: true,  msg: `Hello ${decodedtoken.name}`})
        }
        else{
            return res.json({success: false, msg: `No Headers`})
        }
    }
}

module.exports = functions