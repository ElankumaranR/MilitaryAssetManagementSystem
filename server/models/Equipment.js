const mongoose = require('mongoose');
const equipmentSchema = new mongoose.Schema({
  name: String,
  type: String,
  specifications: String,
  price: Number
});
module.exports = mongoose.model('Equipment', equipmentSchema);
