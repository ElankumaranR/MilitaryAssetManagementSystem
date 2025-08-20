const Assignment = require('../models/Assignment');
exports.assignAsset = async (req, res) => {
  const assignment = await Assignment.create(req.body);
  res.status(201).json(assignment);
};
exports.getAssignments = async (req, res) => {
  const assignments = await Assignment.find();
  res.json(assignments);
};
