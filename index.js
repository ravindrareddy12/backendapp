const express = require('express')
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const apartmentRoutes = require('./controllers/ApartmentController');
const db= require('./config/db')
const app = express()
const port = 5500

app.use(cors());
app.use(bodyParser.json());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads')); 

app.use('/api', apartmentRoutes);
app.get('/',(req,res)=>{
    res.send("Hello")
})

app.listen(port,()=>{
    console.log(`Server started on port ${port}`);
})
