const mongoose = require('mongoose');

const postbackLogSchema = new mongoose.Schema(
  {
    sourceIp: String,
    headers: mongoose.Schema.Types.Mixed,
    payload: mongoose.Schema.Types.Mixed,
    matchedTask: { type: mongoose.Schema.Types.ObjectId, ref: 'SerpTask' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('PostbackLog', postbackLogSchema);
