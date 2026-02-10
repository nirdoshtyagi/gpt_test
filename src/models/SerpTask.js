const mongoose = require('mongoose');

const serpTaskSchema = new mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    dataforseoTaskId: { type: String, index: true },
    tag: { type: String, trim: true },
    keyword: { type: String, required: true, trim: true },
    locationCode: { type: Number, required: true },
    languageCode: { type: String, required: true },
    device: { type: String, enum: ['desktop', 'mobile'], default: 'desktop' },
    os: { type: String, enum: ['windows', 'macos', 'android', 'ios'], default: 'windows' },
    status: { type: String, enum: ['queued', 'processing', 'done', 'failed'], default: 'queued' },
    dataforseoResponse: { type: mongoose.Schema.Types.Mixed },
    postbackPayload: { type: mongoose.Schema.Types.Mixed }
  },
  { timestamps: true }
);

module.exports = mongoose.model('SerpTask', serpTaskSchema);
