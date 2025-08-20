const mongoose = require('mongoose');
const transferSchema = new mongoose.Schema({
  fromBase: String,
  toBase: String,
  equipment: String,
  quantity: Number,
  transferDate: Date
});
module.exports = mongoose.model('Transfer', transferSchema);
