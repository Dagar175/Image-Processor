const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const parseCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
};

const writeCsv = async (rows, requestId) => {
  const outputDir = path.join(__dirname, 'output');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  const csvWriter = createCsvWriter({
    path: path.join(outputDir, `output-${requestId}.csv`),
    header: [
      { id: 'serial_no', title: 'S. No.' },
      { id: 'product_name', title: 'Product Name' },
      { id: 'image_urls', title: 'Input Image Urls' },
      { id: 'compressed_image_urls', title: 'Compressed Image Urls' }
    ]
  });

  await csvWriter.writeRecords(rows);
  console.log('CSV file written successfully to', path.join(outputDir, `output-${requestId}.csv`));
};

module.exports = { parseCSV, writeCsv };
