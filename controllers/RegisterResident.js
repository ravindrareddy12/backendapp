const Resident = require('../models/Resident');

router.post('/register-resident', async (req, res) => {
  try {
    const { name, email, password, aadhaarCard, monthlyPayment, apartmentId } = req.body;

    const resident = new Resident({ name, email, password, aadhaarCard, monthlyPayment });
    await resident.save();

    await Apartment.findByIdAndUpdate(apartmentId, { $push: { residents: resident._id } });

    res.status(201).json({ message: 'Resident registered successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
