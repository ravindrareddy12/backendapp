const express = require('express');
const router = express.Router();
const Transaction = require('../models/TransactionSchema');
const Resident = require('../models/ResidentSchema');
const Worker = require('../models/WorkerSchema');

// Record a payment from resident to owner
router.post('/record-resident-payment', async (req, res) => {
  try {
    const { residentId, ownerId, amount } = req.body;

    // Create and save the transaction
    const transaction = new Transaction({
      from: residentId,
      to: ownerId,
      fromModel: 'Resident',
      toModel: 'Owner',
      amount,
      status: 'Completed'
    });

    await transaction.save();

    // Update the resident's payment status
    await Resident.findByIdAndUpdate(residentId, { paymentStatus: 'Paid' });

    res.status(201).json({ message: 'Payment recorded successfully', transaction });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Record a payment from owner to worker
router.post('/record-worker-payment', async (req, res) => {
  try {
    const { ownerId, workerId, amount } = req.body;

    // Create and save the transaction
    const transaction = new Transaction({
      from: ownerId,
      to: workerId,
      fromModel: 'Owner',
      toModel: 'Worker',
      amount,
      status: 'Completed'
    });

    await transaction.save();

    // Update the worker's payment status
    await Worker.findByIdAndUpdate(workerId, { paymentStatus: 'Paid' });

    res.status(201).json({ message: 'Payment recorded successfully', transaction });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
