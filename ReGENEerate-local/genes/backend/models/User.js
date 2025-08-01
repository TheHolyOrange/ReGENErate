const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  passwordHash: { type: String, required: true },

  score: { type: Number, default: 0 },
  streak: { type: Number, default: 0 },
//   avatarUrl: { type: String },
//   privacy: { type: String, default: 'public' }, // or 'private'

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
