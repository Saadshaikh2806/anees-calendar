const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  date: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true }
});

module.exports = mongoose.model('Activity', activitySchema);
