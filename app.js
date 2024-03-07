const express = require('express');
const mongoose = require('mongoose')
const app = express();
const port = 8080

const indexRouter = require('./routes/index');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

app.use('/', indexRouter);

app.listen(port,() => console.log('Server Is listening'))
mongoose.connect('mongodb://localhost:27017/RECIPE')
.then(() => console.log('Database Connected'))
.catch((err) => console.log('Databse Connected Failed',err))