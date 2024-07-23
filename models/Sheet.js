const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the schema for each row in the sheet
const rowSchema = new Schema({
  serial_no: { type: String, required: true },
  product_name: { type: String, required: true },
  image_urls: [String], // Array of original image URLs
  compressed_image_urls: [String] // Array of compressed image URLs
});

// Define the schema for the sheet document
const sheetSchema = new Schema({
  sheet_id: { type: String, required: true, unique: true },
  upload_date: { type: String, required: true },
  compressed_date: { type: Date, required: true },
  rows: [rowSchema] // Array of rows
});

// Create and export the model
const Sheet = mongoose.model('Sheet', sheetSchema);
module.exports = Sheet;
