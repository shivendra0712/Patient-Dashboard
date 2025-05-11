const express = require('express');
const {
  getShipments,
  getShipment,
  createShipment,
  updateShipment,
  deleteShipment
} = require('../controllers/shipmentController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(protect, getShipments)
  .post(protect, createShipment);

router.route('/:id')
  .get(protect, getShipment)
  .put(protect, updateShipment)
  .delete(protect, deleteShipment);

module.exports = router;
