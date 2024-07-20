const express = require('express');
const router = express.Router();

const passport = require('../config/passport');
const {  loginOwner } = require('../controllers/ownerController');


router.post('/login', loginOwner);

// Protected route example
router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({ owner: req.user });
});
module.exports = router;