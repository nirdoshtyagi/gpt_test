const express = require('express');
const Joi = require('joi');
const User = require('../models/User');
const { requireRole } = require('../middleware/auth');

const router = express.Router();

router.get('/', requireRole('admin', 'manager'), async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.render('users/index', { users, error: null });
});

router.post('/', requireRole('admin'), async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().min(2).required(),
    email: Joi.string().email().required(),
    role: Joi.string().valid('admin', 'manager', 'analyst').required(),
    password: Joi.string().min(8).required()
  });

  const { error, value } = schema.validate(req.body);
  if (error) {
    const users = await User.find().sort({ createdAt: -1 });
    return res.status(400).render('users/index', { users, error: error.message });
  }

  const passwordHash = await User.hashPassword(value.password);
  await User.create({ ...value, passwordHash });
  return res.redirect('/users');
});

module.exports = router;
