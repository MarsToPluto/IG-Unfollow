const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  username: String,
  profilePicture: String,
  href: String,
  follows_back: {
    type: Boolean,
    default: false
  },
  visited: {
    type: Boolean,
    default: false
  },
  visiting: {
    type: Boolean,
    default: false
  }
});

const User = mongoose.model('followings', userSchema);
module.exports = User;