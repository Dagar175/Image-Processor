const sharp = require('sharp');
const fs = require('fs');
const axios = require('axios');
const path = require('path');

// Download image from URL
const downloadImage = async (url, outputPath) => {
    console.log("Download Image");
  const response = await axios({
    url,
    responseType: 'stream',
  });
  const writer = fs.createWriteStream(outputPath);
  response.data.pipe(writer);
  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
};

// Compress image by 50%
const compressImage = async (inputImagePath, outputImagePath) => {
  try {
    const image = sharp(inputImagePath);
    const metadata = await image.metadata();
    const newWidth = Math.round(metadata.width * 0.5);
    const newHeight = Math.round(metadata.height * 0.5);
    
    await image
      .resize(newWidth, newHeight)
      .toFile(outputImagePath);

    console.log(`Compressed image saved to ${outputImagePath}`);
  } catch (error) {
    console.error(`Error compressing image: ${error.message}`);
    throw error;
  }
};

// Remove image file
const removeFile = async (filePath) => {
  try {
    await fs.promises.unlink(filePath);
    console.log(`Removed file at ${filePath}`);
  } catch (error) {
    console.error(`Error removing file: ${error.message}`);
    throw error;
  }
};

module.exports = { compressImage, removeFile, downloadImage };
