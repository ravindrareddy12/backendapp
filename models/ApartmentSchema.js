const mongoose = require('mongoose');

const ApartmentSchema = new mongoose.Schema({
  name: { type: String, required: true,unique: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'Owner', required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  profilePicture: { type: String }, // URL to profile picture
  apartmentPicture: { type: String }, // URL to apartment picture
  residents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Resident' }],
  workers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Worker' }]
});

module.exports = mongoose.model('Apartment', ApartmentSchema);
