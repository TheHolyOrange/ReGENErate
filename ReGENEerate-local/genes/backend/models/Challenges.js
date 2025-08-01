const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  goal: { type: String },
  duration: { type: Number },

  creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  public: { type: Boolean, default: true },

  startDate: { type: Date, required: true },

  participants: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    progress: { type: Number, default: 0 },
    joinedAt: { type: Date, default: Date.now }
  }]
});

module.exports = mongoose.model('Challenge', challengeSchema);
