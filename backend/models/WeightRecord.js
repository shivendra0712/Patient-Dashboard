const mongoose = require('mongoose');

const WeightRecordSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  weight: {
    type: Number,
    required: [true, 'Please add a weight value']
  },
  date: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String
  },
  startingWeight: {
    type: Number,
    description: 'Initial weight when the user began tracking'
  },
  currentWeight: {
    type: Number,
    description: 'Most recent weight measurement'
  },
  weightGoal: {
    type: Number,
    description: 'Target weight the user wants to achieve'
  },
  weightChange: {
    type: Number,
    default: 0,
    description: 'Difference between starting weight and current weight'
  }
});

// Pre-save middleware to calculate weightChange if startingWeight and currentWeight exist
WeightRecordSchema.pre('save', function(next) {
  if (this.startingWeight && this.currentWeight) {
    this.weightChange = this.currentWeight - this.startingWeight;
  }
  next();
});

module.exports = mongoose.model('WeightRecord', WeightRecordSchema);
