const Shipment = require('../models/Shipment');
const Medication = require('../models/Medication');

// @desc    Get all shipments for a user
// @route   GET /api/shipments
// @access  Private
exports.getShipments = async (req, res) => {
  try {
    const shipments = await Shipment.find({ user: req.user.id })
      .populate('medication')
      .sort({ shipmentDate: -1 });

    res.status(200).json({
      success: true,
      count: shipments.length,
      data: shipments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single shipment
// @route   GET /api/shipments/:id
// @access  Private
exports.getShipment = async (req, res) => {
  try {
    const shipment = await Shipment.findById(req.params.id)
      .populate('medication', 'name dosage frequency');

    if (!shipment) {
      return res.status(404).json({
        success: false,
        message: 'Shipment not found'
      });
    }

    // Make sure user owns the shipment
    if (shipment.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this shipment'
      });
    }

    res.status(200).json({
      success: true,
      data: shipment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new shipment
// @route   POST /api/shipments
// @access  Private
exports.createShipment = async (req, res) => {
  try {
    // Add user to req.body
    req.body.user = req.user.id;

    // Check if medication exists and belongs to user
    const medication = await Medication.findById(req.body.medication);

    if (!medication) {
      return res.status(404).json({
        success: false,
        message: 'Medication not found'
      });
    }

    if (medication.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to create shipment for this medication'
      });
    }

    const shipment = await Shipment.create(req.body);

    res.status(201).json({
      success: true,
      data: shipment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update shipment
// @route   PUT /api/shipments/:id
// @access  Private
exports.updateShipment = async (req, res) => {
  try {
    let shipment = await Shipment.findById(req.params.id);

    if (!shipment) {
      return res.status(404).json({
        success: false,
        message: 'Shipment not found'
      });
    }

    // Make sure user owns the shipment
    if (shipment.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this shipment'
      });
    }

    // If medication is being updated, check if it exists and belongs to user
    if (req.body.medication) {
      const medication = await Medication.findById(req.body.medication);

      if (!medication) {
        return res.status(404).json({
          success: false,
          message: 'Medication not found'
        });
      }

      if (medication.user.toString() !== req.user.id) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized to update shipment with this medication'
        });
      }
    }

    shipment = await Shipment.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      data: shipment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete shipment
// @route   DELETE /api/shipments/:id
// @access  Private
exports.deleteShipment = async (req, res) => {
  try {
    const shipment = await Shipment.findById(req.params.id);

    if (!shipment) {
      return res.status(404).json({
        success: false,
        message: 'Shipment not found'
      });
    }

    // Make sure user owns the shipment
    if (shipment.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this shipment'
      });
    }

    await shipment.deleteOne();

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
