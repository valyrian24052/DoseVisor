import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { detectText } from '../../utils/vision';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Error parsing the form:', err);
        return res.status(500).json({ error: 'Error parsing the form data' });
      }

      const file = files.image;
      const tempPath = file.filepath;

      try {
        // Process the file directly from the tempPath
        const ocrText = await detectText(tempPath);

        // Send the OCR text or any other response back to the frontend
        res.status(200).json({ response: ocrText });
      } catch (error) {
        console.error('Error during processing:', error);
        res.status(500).json({ error: 'Failed to process the image' });
      }
    });
  } else {
    res.status(405).json({ error: 'Only POST requests are allowed' });
  }
}
