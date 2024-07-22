const express = require('express');
const Resident = require('../models/ResidentSchema');
const Worker = require('../models/WorkerSchema');
const Owner = require('../models/OwnerSchema');
const { sendPaymentConfirmation } = require('../services/paymentService');

const router = express.Router();

router.post('/pay-resident', async (req, res) => {
  const { email, paymentAmount } = req.body;
  try {
    const resident = await Resident.findOne({ email });
    if (resident) {
      resident.paymentStatus = 'Paid';
      resident.monthlyPayment = paymentAmount;
      await resident.save();
      await sendPaymentConfirmation(resident.email, resident.name, 'resident');
      res.status(200).send('Resident payment updated and email sent.');
    } else {
      res.status(404).send('Resident not found.');
    }
  } catch (error) {
    res.status(500).send('Server error.');
  }
});

router.post('/pay-worker', async (req, res) => {
  const { email, paymentAmount } = req.body;
  try {
    const worker = await Worker.findOne({ email });
    if (worker) {
      worker.paymentStatus = 'Paid';
      worker.monthlyPayment = paymentAmount;
      await worker.save();
      await sendPaymentConfirmation(worker.email, worker.name, 'worker');
      res.status(200).send('Worker payment updated and email sent.');
    } else {
      res.status(404).send('Worker not found.');
    }
  } catch (error) {
    res.status(500).send('Server error.');
  }
});

module.exports = router;
