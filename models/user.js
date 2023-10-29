const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstName: {
    type: String,
    minLength: 3,
    required: true,
  },
  lastName: {
    type: String,
    minLength: 3,
    required: true,
  },
  username: {
    type: String,
    minLength: 6,
    required: true,
  },
  password: {
    type: String,
    minLength: 6,
    required: true,
  },
  isMember: {
    type: Boolean,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    required: true,
  },
});

UserSchema.virtual('fullname').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

module.exports = mongoose.model('user', UserSchema);
