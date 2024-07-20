const TransactionSchema = new mongoose.Schema({
    from: { type: mongoose.Schema.Types.ObjectId, required: true }, // Owner or Resident
    to: { type: mongoose.Schema.Types.ObjectId, required: true }, // Worker or Owner
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    status: { type: String, enum: ['Pending', 'Completed'], default: 'Pending' }
  });
  
  module.exports = mongoose.model('Transaction', TransactionSchema);
  