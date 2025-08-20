const mongoose = require('mongoose');
const assignmentSchema = new mongoose.Schema({
  base: String,
  equipment: String,
  personnel: String,
  quantity: Number,
  assignmentDate: Date
});
module.exports = mongoose.model('Assignment', assignmentSchema);
