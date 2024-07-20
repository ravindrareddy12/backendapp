const express = require('express');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const router = express.Router();
const Apartment = require('../models/ApartmentSchema');
const Owner = require('../models/OwnerSchema');
const upload = require('../config/upload');


// const validateApartmentRegistration = [
//   body('apartmentName').notEmpty().withMessage('Apartment name is required'),
//   body('ownerName').notEmpty().withMessage('Owner name is required'),
//   body('phoneNumber').notEmpty().withMessage('Phone number is required').isNumeric().withMessage('Phone number must be numeric'),
//   body('email').isEmail().withMessage('Valid email is required'),
//   body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
// ];
router.post('/register-apartment', upload.fields([{ name: 'profilePicture',maxCount:1 }, { name: 'apartmentPicture',maxCount:1 }]), async (req, res) => {
  try {
    const { apartmentName, ownerName, phoneNumber, email, password } = req.body;
    const profilePicture = req.files['profilePicture'] ? req.files['profilePicture'][0].filename : null;
    const apartmentPicture = req.files['apartmentPicture'] ? req.files['apartmentPicture'][0].filename : null;
    const hashedPassword = await bcrypt.hash(password, 10);
    const owner = new Owner({ name: ownerName, phoneNumber, email, password:hashedPassword, profilePicture });
    await owner.save();

    const apartment = new Apartment({ name: apartmentName, owner: owner._id, phoneNumber, email, profilePicture, apartmentPicture });
    await apartment.save();

    res.status(201).json({ message: 'Apartment and Owner registered successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
