const WeightRecord = require('../models/WeightRecord');

// @desc    Get all weight records for a user
// @route   GET /api/weight
// @access  Private
exports.getWeightRecords = async (req, res) => {
  try {
    const weightRecords = await WeightRecord.find({ user: req.user.id })
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: weightRecords.length,
      data: weightRecords
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get weight goals and current status
// @route   GET /api/weight/goals
// @access  Private
exports.getWeightGoals = async (req, res) => {
  try {
    // Find the most recent weight record with goals set
    const weightGoals = await WeightRecord.findOne({
      user: req.user.id,
      $or: [
        { startingWeight: { $exists: true, $ne: null } },
        { weightGoal: { $exists: true, $ne: null } }
      ]
    }).sort({ date: -1 });

    // Find the most recent weight record for current weight
    const latestWeight = await WeightRecord.findOne({
      user: req.user.id,
      weight: { $exists: true }
    }).sort({ date: -1 });

    // Combine the data
    const goalData = {
      startingWeight: weightGoals?.startingWeight || null,
      currentWeight: latestWeight?.weight || null,
      weightGoal: weightGoals?.weightGoal || null,
      weightChange: weightGoals && latestWeight ?
        latestWeight.weight - weightGoals.startingWeight : 0
    };

    res.status(200).json({
      success: true,
      data: goalData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single weight record
// @route   GET /api/weight/:id
// @access  Private
exports.getWeightRecord = async (req, res) => {
  try {
    const weightRecord = await WeightRecord.findById(req.params.id);

    if (!weightRecord) {
      return res.status(404).json({
        success: false,
        message: 'Weight record not found'
      });
    }

    // Make sure user owns the weight record
    if (weightRecord.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this weight record'
      });
    }

    res.status(200).json({
      success: true,
      data: weightRecord
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new weight record
// @route   POST /api/weight
// @access  Private
exports.createWeightRecord = async (req, res) => {
  try {
    // Add user to req.body
    req.body.user = req.user.id;

    // If this is a new weight entry, update currentWeight
    if (req.body.weight) {
      req.body.currentWeight = req.body.weight;
    }

    // If no startingWeight is provided, try to get it from the most recent record
    if (!req.body.startingWeight) {
      const latestRecord = await WeightRecord.findOne({
        user: req.user.id,
        startingWeight: { $exists: true, $ne: null }
      }).sort({ date: -1 });

      if (latestRecord && latestRecord.startingWeight) {
        req.body.startingWeight = latestRecord.startingWeight;
      }
    }

    // If no weightGoal is provided, try to get it from the most recent record
    if (!req.body.weightGoal) {
      const latestRecord = await WeightRecord.findOne({
        user: req.user.id,
        weightGoal: { $exists: true, $ne: null }
      }).sort({ date: -1 });

      if (latestRecord && latestRecord.weightGoal) {
        req.body.weightGoal = latestRecord.weightGoal;
      }
    }

    // Calculate weight change if starting weight exists
    if (req.body.startingWeight && req.body.currentWeight) {
      req.body.weightChange = req.body.currentWeight - req.body.startingWeight;
    }

    const weightRecord = await WeightRecord.create(req.body);

    res.status(201).json({
      success: true,
      data: weightRecord
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update weight goals
// @route   POST /api/weight/goals
// @access  Private
exports.updateWeightGoals = async (req, res) => {
  try {
    const { startingWeight, weightGoal } = req.body;

    if (!startingWeight && !weightGoal) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least one of startingWeight or weightGoal'
      });
    }

    // Get the latest weight for current weight
    const latestWeight = await WeightRecord.findOne({
      user: req.user.id,
      weight: { $exists: true }
    }).sort({ date: -1 });

    const currentWeight = latestWeight ? latestWeight.weight : startingWeight;

    // Create a new weight record with goals
    const weightRecord = await WeightRecord.create({
      user: req.user.id,
      startingWeight,
      currentWeight,
      weightGoal,
      weight: currentWeight,
      weightChange: currentWeight - startingWeight,
      date: new Date()
    });

    res.status(201).json({
      success: true,
      data: weightRecord
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update weight record
// @route   PUT /api/weight/:id
// @access  Private
exports.updateWeightRecord = async (req, res) => {
  try {
    let weightRecord = await WeightRecord.findById(req.params.id);

    if (!weightRecord) {
      return res.status(404).json({
        success: false,
        message: 'Weight record not found'
      });
    }

    // Make sure user owns the weight record
    if (weightRecord.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this weight record'
      });
    }

    // If weight is being updated, also update currentWeight
    if (req.body.weight) {
      req.body.currentWeight = req.body.weight;
    }

    // Calculate weight change if startingWeight and currentWeight exist
    if (
      (req.body.startingWeight || weightRecord.startingWeight) &&
      (req.body.currentWeight || weightRecord.currentWeight)
    ) {
      const startingWeight = req.body.startingWeight || weightRecord.startingWeight;
      const currentWeight = req.body.currentWeight || weightRecord.currentWeight;
      req.body.weightChange = currentWeight - startingWeight;
    }

    weightRecord = await WeightRecord.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      data: weightRecord
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete weight record
// @route   DELETE /api/weight/:id
// @access  Private
exports.deleteWeightRecord = async (req, res) => {
  try {
    const weightRecord = await WeightRecord.findById(req.params.id);

    if (!weightRecord) {
      return res.status(404).json({
        success: false,
        message: 'Weight record not found'
      });
    }

    // Make sure user owns the weight record
    if (weightRecord.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this weight record'
      });
    }

    await weightRecord.deleteOne();

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
