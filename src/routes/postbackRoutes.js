const express = require('express');
const PostbackLog = require('../models/PostbackLog');
const SerpTask = require('../models/SerpTask');

const router = express.Router();

router.post('/dataforseo/postback', async (req, res) => {
  const payload = req.body;
  const sourceIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  const externalTaskId = payload?.tasks?.[0]?.id || payload?.id;
  let matchedTask = null;

  if (externalTaskId) {
    matchedTask = await SerpTask.findOne({ dataforseoTaskId: externalTaskId });
    if (matchedTask) {
      matchedTask.postbackPayload = payload;
      matchedTask.status = 'done';
      await matchedTask.save();
    }
  }

  await PostbackLog.create({
    sourceIp,
    headers: req.headers,
    payload,
    matchedTask: matchedTask?._id
  });

  res.status(200).json({ received: true });
});

router.get('/postbacks', async (req, res) => {
  const logs = await PostbackLog.find().populate('matchedTask').sort({ createdAt: -1 }).limit(100);
  res.render('postbacks/index', { logs });
});

module.exports = router;
