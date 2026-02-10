const express = require('express');
const Joi = require('joi');
const Project = require('../models/Project');
const User = require('../models/User');

const router = express.Router();

router.get('/', async (req, res) => {
  const projects = await Project.find().populate('owner members').sort({ createdAt: -1 });
  const users = await User.find().sort({ name: 1 });
  res.render('projects/index', { projects, users, error: null });
});

router.post('/', async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().allow(''),
    clientName: Joi.string().allow(''),
    owner: Joi.string().required(),
    members: Joi.alternatives().try(Joi.array().items(Joi.string()), Joi.string().allow(''))
  });

  const { error, value } = schema.validate(req.body);
  if (error) {
    const projects = await Project.find().populate('owner members').sort({ createdAt: -1 });
    const users = await User.find().sort({ name: 1 });
    return res.status(400).render('projects/index', { projects, users, error: error.message });
  }

  const members = Array.isArray(value.members) ? value.members : value.members ? [value.members] : [];
  await Project.create({ ...value, members });
  return res.redirect('/projects');
});

module.exports = router;
