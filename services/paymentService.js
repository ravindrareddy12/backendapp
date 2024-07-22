const Resident = require('../models/ResidentSchema');
const Worker = require('../models/WorkerSchema');
const Owner = require('../models/OwnerSchema');
const nodemailer = require('nodemailer');

async function sendPaymentNotifications() {
  try {
    const residents = await Resident.find({ paymentStatus: 'Unpaid' });
    const workers = await Worker.find({ paymentStatus: 'Unpaid' });

    for (const resident of residents) {
      await sendEmail(resident.email, 'Pending Payment Reminder', `Dear ${resident.name}, your payment is pending. Please pay by ${resident.paymentDueDate}.`);
    }

    for (const worker of workers) {
      await sendEmail(worker.email, 'Pending Payment Reminder', `Dear ${worker.name}, your payment is pending. Please pay by ${worker.paymentDueDate}.`);
    }
  } catch (error) {
    console.error('Error sending payment notifications:', error);
  }
}

async function sendPaymentConfirmation(email, name, role) {
  try {
    await sendEmail(email, 'Payment Confirmation', `Dear ${name}, your ${role} payment has been received.`);
  } catch (error) {
    console.error('Error sending payment confirmation:', error);
  }
}

async function sendEmail(to, subject, text) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'your-email@gmail.com',
      pass: 'your-email-password',
    },
  });

  const mailOptions = {
    from: 'your-email@gmail.com',
    to,
    subject,
    text,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
}

module.exports = {
  sendPaymentNotifications,
  sendPaymentConfirmation,
};
