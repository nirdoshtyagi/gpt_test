const express = require('express');
const Joi = require('joi');
const User = require('../models/User');

const router = express.Router();

router.get('/login', (req, res) => {
  res.render('auth/login', { error: null });
});

router.post('/login', async (req, res) => {
  const schema = Joi.object({ email: Joi.string().email().required(), password: Joi.string().required() });
  const { error, value } = schema.validate(req.body);
  if (error) return res.status(400).render('auth/login', { error: error.message });

  const user = await User.findOne({ email: value.email });
  if (!user || !(await user.verifyPassword(value.password))) {
    return res.status(401).render('auth/login', { error: 'Invalid credentials' });
  }

  req.session.userId = user.id;
  return res.redirect('/');
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
});

module.exports = router;
