// pages/api/upload.js

import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { detectText } from '../../utils/vision';
import { generateContent } from '../../utils/gemini';

// Disable Next.js' built-in bodyParser to handle file uploads manually
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
      const fileName = file.originalFilename;
      const newFilePath = path.join(process.cwd(), 'public', fileName);

      // Move the uploaded file to the public directory
      fs.rename(tempPath, newFilePath, async (err) => {
        if (err) {
          console.error('Error moving the file:', err);
          return res.status(500).json({ error: 'Error processing the uploaded file' });
        }

        try {
          // Perform OCR on the uploaded image
          const ocrText = await detectText(newFilePath);
          console.log('OCR Text:', ocrText);
          // Generate content based on the OCR text using Gemini
          const modelResponse = await generateContent(ocrText);
          console.log('Model Response:', modelResponse); // In your backend code before sending the response


          // Send the model's response back to the frontend
          res.status(200).json({ response: modelResponse });

        } catch (error) {
          console.error(`Error during processing: ${error.message}`);
          res.status(500).json({ error: 'Failed to generate response from AI model' });
        } finally {
          // Clean up the uploaded file (optional)
          fs.unlink(newFilePath, (err) => {
            if (err) console.error('Error deleting the file:', err);
          });
        }
      });
    });
  } else {
    res.status(405).json({ error: 'Only POST requests are allowed' });
  }
}
