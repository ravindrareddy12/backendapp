const express = require('express');
const multer = require('multer');
const router = express.Router();
const Apartment = require('../models/ApartmentSchema');
const Owner = require('../models/OwnerSchema');

// Set up multer for image upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/register-apartment', upload.fields([{ name: 'profilePicture' }, { name: 'apartmentPicture' }]), async (req, res) => {
  try {
    const { apartmentName, ownerName, phoneNumber, email, password } = req.body;
    const profilePicture = req.files.profilePicture ? req.files.profilePicture[0].buffer : null;
    const apartmentPicture = req.files.apartmentPicture ? req.files.apartmentPicture[0].buffer : null;

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
