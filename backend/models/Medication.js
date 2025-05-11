const mongoose = require('mongoose');

const MedicationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please add a medication name'],
    trim: true
  },
  dosage: {
    type: String,
    required: [true, 'Please add a dosage']
  },
  frequency: {
    type: String,
    required: [true, 'Please add a frequency']
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date
  },
  active: {
    type: Boolean,
    default: true
  },
  notes: {
    type: String
  }
});

module.exports = mongoose.model('Medication', MedicationSchema);
