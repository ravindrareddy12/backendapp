const mongoose = require('mongoose');
const WorkerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  aadhaarCard: { type: String, required: true },
  monthlyPayment: { type: Number, required: true },
  paymentStatus: { type: String, enum: ['Paid', 'Unpaid'], default: 'Unpaid' },
  paymentDueDate: { type: Date, required: true } // Add due date for payments
});
  
  module.exports = mongoose.model('Worker', WorkerSchema);
  