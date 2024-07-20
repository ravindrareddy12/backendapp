const ResidentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    aadhaarCard: { type: String, required: true },
    monthlyPayment: { type: Number, required: true },
    paymentStatus: { type: String, enum: ['Paid', 'Unpaid'], default: 'Unpaid' }
  });
  
  module.exports = mongoose.model('Resident', ResidentSchema);
  