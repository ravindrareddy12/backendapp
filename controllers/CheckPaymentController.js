const express = require('express');
const router = express.Router();
const Transaction = require('../models/TransactionSchema');

// Check payments for a resident
router.get('/resident-payments/:residentId', async (req, res) => {
  try {
    const { residentId } = req.params;
    const transactions = await Transaction.find({ from: residentId, fromModel: 'Resident' });

    res.status(200).json({ transactions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Check payments for a worker
router.get('/worker-payments/:workerId', async (req, res) => {
  try {
    const { workerId } = req.params;
    const transactions = await Transaction.find({ to: workerId, toModel: 'Worker' });

    res.status(200).json({ transactions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
