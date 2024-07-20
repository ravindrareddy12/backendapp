const express = require('express');
const multer = require('multer');
const router = express.Router();
const Apartment = require('../models/ApartmentSchema');
const Owner = require('../models/OwnerSchema');
const upload = require('../config/upload');
// Set up multer for image upload


router.post('/register-apartment', upload.fields([{ name: 'profilePicture',maxCount:1 }, { name: 'apartmentPicture',maxCount:1 }]), async (req, res) => {
  try {
    const { apartmentName, ownerName, phoneNumber, email, password } = req.body;
    const profilePicture = req.files['profilePicture'] ? req.files['profilePicture'][0].filename : null;
    const apartmentPicture = req.files['apartmentPicture'] ? req.files['apartmentPicture'][0].filename : null;

    const owner = new Owner({ name: ownerName, phoneNumber, email, password, profilePicture });
    await owner.save();

    const apartment = new Apartment({ name: apartmentName, owner: owner._id, phoneNumber, email, profilePicture, apartmentPicture });
    await apartment.save();

    res.status(201).json({ message: 'Apartment and Owner registered successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
