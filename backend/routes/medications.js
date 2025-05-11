const express = require('express');
const {
  getMedications,
  getMedication,
  createMedication,
  updateMedication,
  deleteMedication
} = require('../controllers/medicationController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(protect, getMedications)
  .post(protect, createMedication);

router.route('/:id')
  .get(protect, getMedication)
  .put(protect, updateMedication)
  .delete(protect, deleteMedication);

module.exports = router;
