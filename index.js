const express = require('express')
const mongoose = require('mongoose');
const session = require('express-session');
const cors = require('cors');
const bodyParser = require('body-parser');
const apartmentRoutes = require('./controllers/ApartmentController');
const resWorkRoutes = require('./controllers/RegisterResident');
const routes = require('./routers');
const db= require('./config/db')
const app = express()
const port = 5500
const passport = require('./config/passport')

app.use(cors());

app.use(bodyParser.json());

app.use(express.json());


app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'your_session_secret', // Replace with your secret
    resave: false,
    saveUninitialized: true,
  }));
  
app.use(passport.initialize());

app.use('/uploads', express.static('uploads')); 
app.use('/documents', express.static('documents')); 

app.use('/api', apartmentRoutes);
app.use('/owner',routes)
app.use('/api/worres', resWorkRoutes);

app.get('/',(req,res)=>{
    res.send("Hello")
})

app.listen(port,()=>{
    console.log(`Server started on port ${port}`);
})
