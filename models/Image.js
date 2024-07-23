const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true },
  downloadedImagePath: { type: String, required: true },
  compressedUrl: { type: String, required: true },
  sheetId: { type: Number, required: true },
  productName: { type: String, required: true },
});

module.exports = mongoose.model('Image', imageSchema);
