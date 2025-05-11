const mongoose = require('mongoose');

const ShipmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  medication: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Medication',
    required: true
  },
  shipmentDate: {
    type: Date,
    required: true
  },
  expectedDeliveryDate: {
    type: Date,
    required: true
  },
  actualDeliveryDate: {
    type: Date
  },
  trackingNumber: {
    type: String
  },
  status: {
    type: String,
    enum: ['processing', 'shipped', 'in-transit', 'delivered', 'delayed', 'cancelled'],
    default: 'processing'
  },
  quantity: {
    type: Number,
    required: true
  },
  notes: {
    type: String
  }
});

module.exports = mongoose.model('Shipment', ShipmentSchema);
