const Transfer = require('../models/Transfer');
exports.recordTransfer = async (req, res) => {
  const transfer = await Transfer.create(req.body);
  res.status(201).json(transfer);
};
exports.getTransfers = async (req, res) => {
  const transfers = await Transfer.find();
  res.json(transfers);
};
