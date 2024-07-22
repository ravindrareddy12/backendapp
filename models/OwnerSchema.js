const mongoose = require('mongoose');

const OwnerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: { type: String },
  apartment: { type: mongoose.Schema.Types.ObjectId, ref: 'Apartment' }
});

module.exports = mongoose.model('Owner', OwnerSchema);
