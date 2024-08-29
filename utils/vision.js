const vision = require('@google-cloud/vision');

const client = new vision.ImageAnnotatorClient({
  credentials: {
    private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY,
    client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
  },
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
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
