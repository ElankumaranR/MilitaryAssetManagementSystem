const Purchase = require('../models/Purchase');
const Transfer = require('../models/Transfer');
const Assignment = require('../models/Assignment');
const Expenditure = require('../models/Expenditure');
const Equipment = require('../models/Equipment');

exports.getDashboardMetrics = async (req, res) => {
  const { baseId, equipmentId, fromDate, toDate } = req.query;

  const purchaseFilter = { base: baseId, equipment: equipmentId, purchaseDate: { $lte: toDate } };
  const transferInFilter = { toBase: baseId, equipment: equipmentId, transferDate: { $lte: toDate } };
  const transferOutFilter = { fromBase: baseId, equipment: equipmentId, transferDate: { $lte: toDate } };
  const assignmentFilter = { base: baseId, equipment: equipmentId, assignmentDate: { $lte: toDate } };
  const expenditureFilter = { base: baseId, equipment: equipmentId, expenditureDate: { $lte: toDate } };

  // Opening Balance is sum of all In - sum of all Out up to fromDate
  const openingDateFilter = (dateKey) => ({ ...dateKey, $lt: fromDate });
  const openingBalance = 
      await Purchase.aggregate([{ $match: { ...purchaseFilter, purchaseDate: openingDateFilter(purchaseFilter.purchaseDate) } }, { $group: { _id: null, qty: { $sum: "$quantity" } } }])
    + await Transfer.aggregate([{ $match: { ...transferInFilter, transferDate: openingDateFilter(transferInFilter.transferDate) } }, { $group: { _id: null, qty: { $sum: "$quantity" } } }])
    - await Transfer.aggregate([{ $match: { ...transferOutFilter, transferDate: openingDateFilter(transferOutFilter.transferDate) } }, { $group: { _id: null, qty: { $sum: "$quantity" } } }])
    - await Assignment.aggregate([{ $match: { ...assignmentFilter, assignmentDate: openingDateFilter(assignmentFilter.assignmentDate) } }, { $group: { _id: null, qty: { $sum: "$quantity" } } }])
    - await Expenditure.aggregate([{ $match: { ...expenditureFilter, expenditureDate: openingDateFilter(expenditureFilter.expenditureDate) } }, { $group: { _id: null, qty: { $sum: "$quantity" } } }]);

  // Net Movement in the period
  const purchases = await Purchase.aggregate([{ $match: { ...purchaseFilter, purchaseDate: { $gte: fromDate, $lte: toDate } } }, { $group: { _id: null, qty: { $sum: "$quantity" } } }]);
  const transfersIn = await Transfer.aggregate([{ $match: { ...transferInFilter, transferDate: { $gte: fromDate, $lte: toDate } } }, { $group: { _id: null, qty: { $sum: "$quantity" } } }]);
  const transfersOut = await Transfer.aggregate([{ $match: { ...transferOutFilter, transferDate: { $gte: fromDate, $lte: toDate } } }, { $group: { _id: null, qty: { $sum: "$quantity" } } }]);
  const netMovement = (purchases + transfersIn - transfersOut);

  // Closing Balance (Opening + Net - Assignments - Expenditure in period)
  const assignments = await Assignment.aggregate([{ $match: { ...assignmentFilter, assignmentDate: { $gte: fromDate, $lte: toDate } } }, { $group: { _id: null, qty: { $sum: "$quantity" } } }]);
  const expended = await Expenditure.aggregate([{ $match: { ...expenditureFilter, expenditureDate: { $gte: fromDate, $lte: toDate } } }, { $group: { _id: null, qty: { $sum: "$quantity" } } }]);
  const closingBalance = openingBalance + netMovement - assignments - expended;

  res.json({
    openingBalance,
    netMovement,
    purchases,
    transfersIn,
    transfersOut,
    assignments,
    expended,
    closingBalance
  });
};
