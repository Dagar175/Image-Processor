const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');
const { parseCSV } = require('../utils/csvParser');
const Request = require('../models/Request');
const Sheet = require('../models/Sheet');
const agenda = require('../agenda');

// Upload CSV and process images
const uploadCSV = async (req, res) => {
  try {
    const csvFilePath = req.file.path;


    // Continue with CSV processing if validation is successful
    const sheet = await parseCSV(csvFilePath);
    console.log("Data " + JSON.stringify(sheet));

    const item = sheet[0];
    const requiredFields = ['S. No.', 'Product Name', 'Input Image Urls'];
    const missingFields = requiredFields.filter(field => !item.hasOwnProperty(field));
  
    if (missingFields.length > 0) {
      console.log(`Missing fields: ${missingFields.join(', ')}`);
      let requestId = "Nan";
      res.status(200).json({ requestId, message: 'Incorrect CSV' });
    }else{
      // Create a unique request ID
      const requestId = new Date().getTime();
      await Request.create({ status: 'processing', sheet_id: requestId });
      
      // Start Agenda job if needed
      if (agenda) {
        console.log("Agenda job started");
        await agenda.now('process-sheet', { sheet, requestId });
      } else {
        console.error('Agenda instance is not available');
      }

      res.status(200).json({ requestId, message: 'CSV uploaded and processing started.' });
    }
    
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Check processing status
const checkStatus = async (req, res) => {
  const { requestId } = req.params;
  const request = await Request.findOne({ sheet_id: requestId });

  if (!request) {
    return res.status(404).json({ error: 'Request not found' });
  }

  res.status(200).json(request);
};

// Fetch sheet data
const fetchSheetData = async (req, res) => {
  const { sheetId } = req.params;

  try {
    const request = await Sheet.findOne({ sheet_id: sheetId });

    if (!request) {
      return res.status(404).json({ error: 'Sheet not found' });
    }

    // Assuming 'sheet' field contains the sheet data
    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Download sheet
const downloadSheet = async (req, res) => {
  const { sheetId } = req.params;

  try {
    const request = await Request.findOne({ sheet_id: sheetId });

    if (!request) {
      return res.status(404).json({ error: 'Sheet not found' });
    }

    if (request.status !== 'completed') {
      return res.status(400).json({ error: 'Sheet is not yet completed' });
    }

    // Path to the sheet file
    const filePath = path.join(__dirname, '../utils/output', `output-${sheetId}.csv`); // Adjust the file path as needed

    res.download(filePath, `${sheetId}.csv`);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { uploadCSV, checkStatus, fetchSheetData, downloadSheet };
