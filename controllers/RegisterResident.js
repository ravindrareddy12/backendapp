const express = require('express');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Apartment = require('../models/ApartmentSchema');
const Resident = require('../models/ResidentSchema');
const Worker = require('../models/WorkerSchema');
const jwtSecret = 'your_jwt_secret'; 
const profilePicture= require('../config/upload');
// Multer configuration for PDF upload
const router = express.Router();


// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'aadhaarCard') {
      cb(null, 'uploads/aadhaarCards/');
    } else if (file.fieldname === 'profilePic') {
      cb(null, 'uploads/profilePictures/');
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

router.post('/add-resident', upload.fields([{ name: 'aadhaarCard', maxCount: 1 }, { name: 'profilePic', maxCount: 1 }]), async (req, res) => {
  console.log(req.body)

  console.log("function called 2")
  const { apartmentId, name, email, password, monthlyPayment, paymentDueDate,paymentStatus } = req.body;

  try {
    const apartment = await Apartment.findById(apartmentId).populate('residents').populate('workers');
    if (!apartment) {
      return res.status(404).json({ message: 'Apartment not found' });
    }

    const residentEmailExists = apartment.residents.some(resident => resident.email === email);
    const workerEmailExists = apartment.workers.some(worker => worker.email === email);

     
    if (residentEmailExists || workerEmailExists) {
      return res.status(400).json({ message: 'Email is already used in this apartment' });
    }
    console.log("inside")
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword)
    const aadhaarCard = req.files['aadhaarCard'] ? req.files['aadhaarCard'][0].filename : null;
    console.log(aadhaarCard)
    const profilePicture = req.files['profilePic'] ? req.files['profilePic'][0].filename : null;
    console.log(profilePicture)
    const newResident = new Resident({ 
      name, 
      email, 
      password: hashedPassword, 
      aadhaarCard, 
      monthlyPayment, 
      paymentDueDate, 
      profilePic: profilePicture,
      paymentStatus
    });

    await newResident.save();

    apartment.residents.push(newResident._id);
    await apartment.save();
    console.log("Resident added successfully")
    res.status(201).json({ message: 'Resident added successfully' });
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err.message });
  }
});



router.post('/add-worker', upload.fields([{ name: 'aadhaarCard', maxCount: 1 }, { name: 'profilePic', maxCount: 1 }]), async (req, res) => {
  const { apartmentId, name, email, password, monthlyPayment, paymentDueDate } = req.body;

  try {
    const apartment = await Apartment.findById(apartmentId).populate('residents').populate('workers');
    if (!apartment) {
      return res.status(404).json({ message: 'Apartment not found' });
    }

    const residentEmailExists = apartment.residents.some(resident => resident.email === email);
    const workerEmailExists = apartment.workers.some(worker => worker.email === email);

    if (residentEmailExists || workerEmailExists) {
      return res.status(400).json({ message: 'Email is already used in this apartment' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const aadhaarCard = req.files['aadhaarCard'] ? req.files['aadhaarCard'][0].filename : null;
    const profilePicture = req.files['profilePic'] ? req.files['profilePic'][0].filename : null;

    const newWorker = new Worker({ 
      name, 
      email, 
      password: hashedPassword, 
      aadhaarCard, 
      monthlyPayment, 
      paymentDueDate, 
      profilePic: profilePicture 
    });

    await newWorker.save();

    apartment.workers.push(newWorker._id);
    await apartment.save();

    res.status(201).json({ message: 'worker added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/login-worker', async (req, res) => {
  try {
    const { email, password, apartmentId } = req.body;

    const apartment = await Apartment.findById(apartmentId).populate('workers');
    if (!apartment) {
      return res.status(401).json({ message: 'Apartment not found' });
    }

    const worker = apartment.workers.find(work => work.email === email);
    if (!worker) {
      return res.status(401).json({ message: 'Invalid credentials email' });
    }

    const isMatch = await bcrypt.compare(password, worker.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials password' });
    }

    const token = jwt.sign({ id: worker._id }, jwtSecret, { expiresIn: '1d' }); 

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/login-resident', async (req, res) => {
  try {
    const { email, password, apartmentId } = req.body;

    const apartment = await Apartment.findById(apartmentId).populate('residents');
    if (!apartment) {
      return res.status(401).json({ message: 'Apartment not found' });
    }

    const resident = apartment.residents.find(res => res.email === email);
    if (!resident) {
      return res.status(401).json({ message: 'Invalid credentials email' });
    }

    const isMatch = await bcrypt.compare(password, resident.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials password' });
    }

    const token = jwt.sign({ id: resident._id }, jwtSecret, { expiresIn: '1d' }); 

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/residents/:apartmentId', async (req, res) => {
  try {
    const { apartmentId } = req.params;
    const residents = await Resident.find({ apartment: apartmentId });
    res.status(200).json({ residents });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/workers/:apartmentId', async (req, res) => {
  try {
    const { apartmentId } = req.params;
    const workers = await Worker.find({ apartment: apartmentId });
    res.status(200).json({ workers });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/apartment-details/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const apartment = await Apartment.findById(id)
      .populate('residents')
      .populate('workers');

    if (!apartment) {
      return res.status(404).json({ message: 'Apartment not found' });
    }

    res.status(200).json(apartment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
