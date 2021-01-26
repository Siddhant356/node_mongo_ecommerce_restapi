const express = require('express')
const actions = require('../method/actions')
const router = express.Router()
const checkAuth = require('../middleware/check_auth')

router.get('/', (req,res)=> {
    res.send('It\'s up and running!!')
})

router.get('/dashboard', (req, res)=>{
    res.send('Dashbord')
})

//@desc Adding new User
router.post('/adduser', actions.addNew)

//@desc Authenticating User
router.post('/authenticate', actions.authenticate)

//@desc Get info on the user
router.get('/getinfo', checkAuth, actions.getinfo)


module.exports = router