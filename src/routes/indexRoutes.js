const express = require('express');
const User = require('../models/User');
const Project = require('../models/Project');
const SerpTask = require('../models/SerpTask');

const router = express.Router();

router.get('/', async (req, res) => {
  const [userCount, projectCount, taskCount, recentTasks] = await Promise.all([
    User.countDocuments(),
    Project.countDocuments(),
    SerpTask.countDocuments(),
    SerpTask.find().populate('project').sort({ createdAt: -1 }).limit(10)
  ]);

  res.render('dashboard', { userCount, projectCount, taskCount, recentTasks });
});

module.exports = router;
