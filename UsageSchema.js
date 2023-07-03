const mongoose = require('mongoose');

const usagesSchema = new mongoose.Schema({
  timeStamp: { type: Number, required: true },
  usage: { type: Number, required: false },
  limit: { type: Number, required: true },
});

const Usage = mongoose.model('Usage', usagesSchema);

module.exports = Usage;
