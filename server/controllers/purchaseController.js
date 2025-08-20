const Purchase = require('../models/Purchase');
exports.addPurchase = async (req, res) => {
  const purchase = await Purchase.create(req.body);
  res.status(201).json(purchase);
};
exports.getPurchases = async (req, res) => {
  const { base, equipment, fromDate, toDate } = req.query;
  const filter = {};
  if (base) filter.base = base;
  if (equipment) filter.equipment = equipment;
  if (fromDate || toDate) filter.purchaseDate = {};
  if (fromDate) filter.purchaseDate.$gte = new Date(fromDate);
  if (toDate) filter.purchaseDate.$lte = new Date(toDate);
  const purchases = await Purchase.find(filter);
  res.json(purchases);
};

