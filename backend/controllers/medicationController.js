const Medication = require('../models/Medication');

// @desc    Get all medications for a user
// @route   GET /api/medications
// @access  Private
exports.getMedications = async (req, res) => {
  try {
    const medications = await Medication.find({ user: req.user.id });

    res.status(200).json({
      success: true,
      count: medications.length,
      data: medications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single medication
// @route   GET /api/medications/:id
// @access  Private
exports.getMedication = async (req, res) => {
  try {
    const medication = await Medication.findById(req.params.id);

    if (!medication) {
      return res.status(404).json({
        success: false,
        message: 'Medication not found'
      });
    }

    // Make sure user owns the medication
    if (medication.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this medication'
      });
    }

    res.status(200).json({
      success: true,
      data: medication
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new medication
// @route   POST /api/medications
// @access  Private
exports.createMedication = async (req, res) => {
  try {
    // Add user to req.body
    req.body.user = req.user.id;

    const medication = await Medication.create(req.body);

    res.status(201).json({
      success: true,
      data: medication
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update medication
// @route   PUT /api/medications/:id
// @access  Private
exports.updateMedication = async (req, res) => {
  try {
    let medication = await Medication.findById(req.params.id);

    if (!medication) {
      return res.status(404).json({
        success: false,
        message: 'Medication not found'
      });
    }

    // Make sure user owns the medication
    if (medication.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this medication'
      });
    }

    medication = await Medication.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      data: medication
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete medication
// @route   DELETE /api/medications/:id
// @access  Private
exports.deleteMedication = async (req, res) => {
  try {
    const medication = await Medication.findById(req.params.id);

    if (!medication) {
      return res.status(404).json({
        success: false,
        message: 'Medication not found'
      });
    }

    // Make sure user owns the medication
    if (medication.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this medication'
      });
    }

    await medication.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
