import React, { useState } from 'react'; // Import useState from React
import axios from 'axios';

export default function Home() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [ocrResult, setOcrResult] = useState('');
  
    const handleFileChange = (event) => {
      setSelectedFile(event.target.files[0]);
    };
  
    const handleSubmit = async (event) => {
      event.preventDefault();
  
      const formData = new FormData();
      formData.append('image', selectedFile);
  
      try {
        const response = await axios.post('/api/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
  
        // Update the state with the response text
        setOcrResult(response.data.response);
        console.log('OCR Result:', ocrResult); // In your frontend code

      } catch (error) {
        console.error('Error processing the image:', error);
        setOcrResult('Failed to process the image.');
      }
    };
  
    return (
      <div>
        <h1>OCR and Content Generation</h1>
        <form onSubmit={handleSubmit}>
          <input type="file" accept="image/*" onChange={handleFileChange} required />
          <button type="submit">Upload and Process</button>
        </form>
        {ocrResult && (
          <div>
            <h2>OCR and Generated Text</h2>
            <p>{ocrResult}</p>
          </div>
        )}
      </div>
    );
  }
  