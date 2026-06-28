const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  text: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  source: { type: String, default: 'website' },
  status: {
    type: String,
    enum: ['new', 'contacted', 'converted'],
    default: 'new',
  },
  notes: [noteSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

leadSchema.pre('save', function () {
  this.updatedAt = Date.now();
});

module.exports = mongoose.model('Lead', leadSchema);
