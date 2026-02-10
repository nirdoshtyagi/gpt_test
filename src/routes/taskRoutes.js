const express = require('express');
const Joi = require('joi');
const Project = require('../models/Project');
const SerpTask = require('../models/SerpTask');
const { createGoogleOrganicTask } = require('../services/dataforseo');

const router = express.Router();

router.get('/', async (req, res) => {
  const tasks = await SerpTask.find().populate('project createdBy').sort({ createdAt: -1 });
  const projects = await Project.find().sort({ name: 1 });
  res.render('tasks/index', { tasks, projects, error: null });
});

router.post('/', async (req, res) => {
  const schema = Joi.object({
    project: Joi.string().required(),
    keyword: Joi.string().required(),
    locationCode: Joi.number().required(),
    languageCode: Joi.string().required(),
    device: Joi.string().valid('desktop', 'mobile').default('desktop'),
    os: Joi.string().valid('windows', 'macos', 'android', 'ios').default('windows'),
    tag: Joi.string().allow('')
  });

  const { error, value } = schema.validate(req.body);
  if (error) {
    const tasks = await SerpTask.find().populate('project createdBy').sort({ createdAt: -1 });
    const projects = await Project.find().sort({ name: 1 });
    return res.status(400).render('tasks/index', { tasks, projects, error: error.message });
  }

  const localTask = await SerpTask.create({ ...value, createdBy: req.currentUser.id });

  try {
    const response = await createGoogleOrganicTask(value);
    const taskInfo = response.tasks?.[0];

    localTask.dataforseoTaskId = taskInfo?.id;
    localTask.status = taskInfo?.status_code === 20100 ? 'processing' : 'failed';
    localTask.dataforseoResponse = response;
    await localTask.save();
  } catch (apiError) {
    localTask.status = 'failed';
    localTask.dataforseoResponse = { error: apiError.message };
    await localTask.save();
  }

  return res.redirect('/tasks');
});

module.exports = router;
