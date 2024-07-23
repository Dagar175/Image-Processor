const express = require('express');
const router = express.Router();
const upload = require('../middlewares/fileUpload');
const { uploadCSV, checkStatus, fetchSheetData, downloadSheet } = require('../controllers/sheetController');

// Route for uploading CSV file
router.post('/upload', upload.single('csv-file'), uploadCSV);

// Route for checking status
router.get('/status/:requestId', checkStatus);


router.get('/:sheetId', fetchSheetData);

// Route for downloading sheet
router.get('/download/:sheetId', downloadSheet);

module.exports = router;
