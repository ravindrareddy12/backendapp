const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  from: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'fromModel' }, // Owner or Resident
  to: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'toModel' }, // Worker or Owner
  fromModel: { type: String, required: true, enum: ['Owner', 'Resident'] },
  toModel: { type: String, required: true, enum: ['Owner', 'Worker'] },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ['Pending', 'Completed'], default: 'Pending' }
});

module.exports = mongoose.model('Transaction', TransactionSchema);
