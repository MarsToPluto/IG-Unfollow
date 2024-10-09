// models/Init.js
const mongoose = require('mongoose');

const initSchema = new mongoose.Schema({
  isTrue: {
    type: Boolean,
    default: true
  }
});

const Init = mongoose.model('init', initSchema);
module.exports = Init;
