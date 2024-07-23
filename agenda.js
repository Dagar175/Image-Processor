// agenda.js
const Agenda = require('agenda');
const dotenv = require('dotenv');
const { v4: uuidv4 } = require('uuid');
const Image = require('./models/Image');
const { compressImage, removeFile, downloadImage } = require('./services/imageService');
const Request = require('./models/Request');
const Sheet = require('./models/Sheet');
const path = require('path');; 
const { parseCSV, writeCsv } = require('./utils/csvParser');
const axios = require('axios');

dotenv.config();

// Initialize Agenda
const agenda = new Agenda({ db: { address: process.env.MONGO_URI || 'mongodb://localhost:27017/image-processor' } });

// Define the job
agenda.define('process-sheet', async (job) => {
    console.log("Job started Data:", job.attrs.data);
    const {sheet, requestId } = job.attrs.data;
    const result = await Request.updateOne(
        {sheet_id: requestId }, // Filter
        { $set: { status: 'processing' } } // Update action
      );
  try {
    let storeRowArray = [];
    for (const row of sheet) {
        const imageUrlsArray = row['Input Image Urls'].split(',').filter(url => url.trim() !== '');
        const productName = row['Product Name'];
        const serial_no = row['S. No.'];
        let compressedImageUrlsArray = [];

        // Process each image URL
        const processingPromises = imageUrlsArray.map(async (imageUrl) => {
            try {
                // console.log("Image url " + imageUrl);
                const inputImagePath = path.join('uploads', `${uuidv4()}-${path.basename(imageUrl)}`);
                const uniqueFilename = `${uuidv4()}-compressed-${path.basename(inputImagePath)}`;
                const outputImagePath = path.join('uploads', uniqueFilename);

                await downloadImage(imageUrl, inputImagePath);
                await compressImage(inputImagePath, outputImagePath);

                await Image.create({
                    originalUrl: imageUrl,
                    downloadedImagePath: inputImagePath,
                    compressedUrl: outputImagePath,
                    sheetId: requestId,
                    productName: productName
                });

                // console.log("Output " + outputImagePath);
                compressedImageUrlsArray.push(outputImagePath);

            } catch (err) {
                console.error('Error processing image:', err);
            }
        });

        await Promise.all(processingPromises);

        storeRowArray.push({
            serial_no: serial_no,
            product_name: productName,
            image_urls: imageUrlsArray,
            compressed_image_urls: compressedImageUrlsArray,
        });

        // console.log("Compressed " + JSON.stringify(compressedImageUrlsArray));
    }

        const success =  await Sheet.create({sheet_id: requestId, 
            upload_date : requestId,
            compressed_date : new Date(),
            rows : storeRowArray,
            });
            if(success){
                const request = await Request.findOne({ sheet_id : requestId });
                if (request) {
                    request.status = 'completed';
                    await request.save();
                    await initiateWebhook(requestId);
                    await writeCsv(storeRowArray, requestId);
                    console.log("Completed");
                }
            }
    }
     catch (error) {
     console.error(`Error processing image at line ${error.stack}`, error);
  }
});


async function initiateWebhook(requestId) {
    const baseUrl = window.location.protocol + "//" + window.location.hostname;
    const webhookUrl = `${baseUrl}/api/webhook`;

    try {
        const response = await axios.post(webhookUrl, { requestId });
        console.log('Webhook initiated successfully:', response.data);
    } catch (error) {
        console.error('Error initiating webhook:', error);
    }
}

// Start Agenda
agenda.on('ready', () => {
    agenda.start().then(() => {
      console.log('Agenda started');
    }).catch(err => {
      console.error('Error starting Agenda:', err);
    });
  });
// Export the initialized Agenda instance
module.exports = agenda;
