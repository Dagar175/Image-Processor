const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  sheet_id : {type: Number , required: true}
});

module.exports = mongoose.model('Request', requestSchema);
