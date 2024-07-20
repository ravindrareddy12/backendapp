const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Owner = require('../models/OwnerSchema');
const Apartment = require('../models/ApartmentSchema');
const jwtSecret = 'your_jwt_secret'; 



// Login Owner
exports.loginOwner = async (req, res) => {
    try {
      const { email, password, apartmentId } = req.body;
      console.log(email, password, apartmentId);
      
      const apartment = await Apartment.findById(apartmentId).populate('owner');
      if (!apartment) {
        return res.status(401).json({ message: 'Apartment not found' });
      }
  
      const owner = apartment.owner;
      if (!owner || owner.email !== email) {
        return res.status(401).json({ message: 'Invalid credentials email' });
      }
  
      const isMatch = await bcrypt.compare(password, owner.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials password' });
      }
  
      const token = jwt.sign({ id: owner._id }, jwtSecret, { expiresIn: '1d' }); // Token expires in 1 day
  
      res.json({ token });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
