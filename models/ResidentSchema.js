const mongoose = require('mongoose');

const ResidentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  profilePic: { type: String },
  password: { type: String, required: true },
  aadhaarCard: { type: String, required: true },
  monthlyPayment: { type: Number, required: true },
  paymentStatus: { type: String, enum: ['Paid', 'Unpaid'], default: 'Unpaid' },
  paymentDueDate: { type: Date, required: true }
});

module.exports = mongoose.model('Resident', ResidentSchema);
