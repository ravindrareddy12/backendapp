const cron = require('node-cron');
const { sendPaymentNotifications } = require('./paymentService');

cron.schedule('0 0 5 * *', () => {
  console.log('Running pending payment notification task...');
  sendPaymentNotifications();
});
