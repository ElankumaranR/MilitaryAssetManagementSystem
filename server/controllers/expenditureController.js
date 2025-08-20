const Expenditure = require('../models/Expenditure');
exports.addExpenditure = async (req, res) => {
  const expenditure = await Expenditure.create(req.body);
  res.status(201).json(expenditure);
};
exports.getExpenditures = async (req, res) => {
  const expenditures = await Expenditure.find();
  res.json(expenditures);
};
