const mongoose = require('mongoose');

const ecoActionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  actionId: { type: String, required: true },
  actionName: { type: String, required: true },
  geneType: { type: String, enum: ['excellent', 'good', 'bad', 'terrible'], required: true },
  points: { type: Number, required: true },

  timestamp: { type: Date, default: Date.now },
  photoUrl: { type: String }, // Need to figure out the photostorage
  challengeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Challenges' }
});

module.exports = mongoose.model('EcoAction', ecoActionSchema);
