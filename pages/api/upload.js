import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { detectText } from '../../utils/vision';
import { generateContent } from '../../utils/gemini';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Error parsing form:', err);
      return res.status(500).json({ error: 'Error processing file upload' });
    }

    const file = files.image;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = file.filepath || file.path;

    try {
      if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
      }

      // Step 1: Perform OCR to extract text from the image
      const ocrResult = await detectText(filePath);
      console.log(ocrResult)

      // Step 2: Generate content using the extracted text via Gemini model
      const generatedContent = await generateContent(ocrResult);

      // Step 3: Return the generated content as the response
      res.status(200).json({ response: generatedContent });
    } catch (error) {
      console.error('Error during processing:', error);
      res.status(500).json({ error: 'Failed to process the image' });
    }
  });
}
