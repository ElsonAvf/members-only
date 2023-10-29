const mongoose = require('mongoose');
const { format } = require('date-fns'); 
const Schema = mongoose.Schema

const MessageSchema = new mongoose.Schema({
  author: { type: Schema.Types.ObjectId, ref: 'user' },
  title: {
    type: String,
    minLength: 3,
    maxLength: 20,
    required: true,
  },
  message: {
    type: String,
    minLength: 3,
    maxLength: 100,
    required: true
  },
}, { timestamps: true });

MessageSchema.virtual('createdAtFormatted').get(function() {
  return format(this.createdAt, 'PPpp');
});

module.exports = mongoose.model('message', MessageSchema);
