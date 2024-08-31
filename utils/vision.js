// utils/vision.js
const vision = require('@google-cloud/vision');
if (!process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
  console.error('GOOGLE_APPLICATION_CREDENTIALS_JSON is not defined.');
} else {
  console.log('GOOGLE_APPLICATION_CREDENTIALS_JSON:', process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
}
const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);

const client = new vision.ImageAnnotatorClient({
  credentials: credentials
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
