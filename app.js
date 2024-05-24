const express = require('express');
const mongoose = require('mongoose')
const dotenv = require('dotenv').config()
const cors = require('cors')
const app = express();
const userAuth = require('./controller/userAuth')

const port = process.env.PORT
const user = require('./routes/user');
const admin = require('./routes/admin')

//Applying inbuilt middleware
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

//Linking router
app.use('/admin', admin)
app.use('/', user);

//Connecting mongodb
app.listen(port, () => console.log('Server Is listening at', port))
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('Database Connected'))
    .catch((err) => console.log('Databse Connected Failed', err))