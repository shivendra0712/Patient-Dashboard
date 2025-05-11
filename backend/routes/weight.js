const express = require('express');
const {
  getWeightRecords,
  getWeightRecord,
  createWeightRecord,
  updateWeightRecord,
  deleteWeightRecord,
  getWeightGoals,
  updateWeightGoals
} = require('../controllers/weightController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(protect, getWeightRecords)
  .post(protect, createWeightRecord);

router.route('/goals')
  .get(protect, getWeightGoals)
  .post(protect, updateWeightGoals);

router.route('/:id')
  .get(protect, getWeightRecord)
  .put(protect, updateWeightRecord)
  .delete(protect, deleteWeightRecord);

module.exports = router;
