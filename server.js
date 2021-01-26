const express = require('express')
const morgon = require('morgan')
const cors = require('cors')
const connectDB = require('./config/db')
const passport = require('passport')
const bodyParser = require('body-parser')
const routes = require('./routes/index')
const inventoryRoutes = require('./routes/inventory')
const orderRoutes = require('./routes/orders')

connectDB()

const app = express()

if(process.env.NODE_ENV === 'development') {
    app.use(morgon('dev'))
}

app.use(cors())
app.use('/uploads',express.static('uploads'))
app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json())
app.use(routes)
app.use('/inventory', inventoryRoutes)
app.use('/orders', orderRoutes)
app.use(passport.initialize())

// Error handeling
app.use((req, res, next)=>{
    const error = new Error('Not found')
    error.status = 404
    next(error)
})



require('./config/passport')

const PORT = process.env.PORT || 3000

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))


