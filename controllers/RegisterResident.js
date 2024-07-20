const express = require('express');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Apartment = require('../models/ApartmentSchema');
const Resident = require('../models/ResidentSchema');
const Worker = require('../models/WorkerSchema');
const router = express.Router();
const jwtSecret = 'your_jwt_secret'; 
// Multer configuration for PDF upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'documents/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});

router.post('/add-resident', upload.single('aadhaarCard'), async (req, res) => {
  const { apartmentId, name, email, password, monthlyPayment } = req.body;

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
    const aadhaarCard = req.file.filename;

    const newResident = new Resident({ name, email, password: hashedPassword, aadhaarCard, monthlyPayment });
    await newResident.save();

    apartment.residents.push(newResident._id);
    await apartment.save();

    res.status(201).json({ message: 'Resident added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/add-worker', upload.single('aadhaarCard'), async (req, res) => {
  const { apartmentId, name, email, password, monthlyPayment } = req.body;

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
    const aadhaarCard = req.file.filename;

    const newWorker = new Worker({ name, email, password: hashedPassword, aadhaarCard, monthlyPayment });
    await newWorker.save();

    apartment.workers.push(newWorker._id);
    await apartment.save();

    res.status(201).json({ message: 'Worker added successfully' });
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

module.exports = router;
