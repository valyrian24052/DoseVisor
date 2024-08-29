// utils/vision.js

const vision = require('@google-cloud/vision');

// Initialize the Google Cloud Vision client using the credentials.json file
const client = new vision.ImageAnnotatorClient({
  keyFilename: './config/credentials.json', // Path to your Google Cloud credentials
});

/**
 * Performs text detection (OCR) on the given image file.
 * @param {string} imagePath 
 * @returns {Promise<string>} 
 */
async function detectText(imagePath) {
  try {
    const [result] = await client.textDetection(imagePath);
    const detections = result.textAnnotations;
    if (detections.length > 0) {
      return detections[0].description;
    }
    return '';
  } catch (error) {
    console.error('Error during text detection:', error);
    throw new Error('Failed to perform text detection');
  }
}

module.exports = { detectText };
