const mongoose = require('mongoose');
const expenditureSchema = new mongoose.Schema({
  base: String,
  equipment: String,
  quantity: Number,
  expenditureDate: Date,
  reason: String
});
module.exports = mongoose.model('Expenditure', expenditureSchema);
