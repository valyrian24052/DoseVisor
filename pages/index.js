import React, { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [ocrResult, setOcrResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setOcrResult(''); // Clear previous result when a new file is selected
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      alert('Please select a file first.');
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setOcrResult(response.data.response);
    } catch (error) {
      console.error('Error processing the image:', error);
      setOcrResult('Failed to process the image.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 className="title">OCR Image Processor</h1>
      <p className="subtitle">Upload a file or drop it here to extract text using OCR.</p>
      <form onSubmit={handleSubmit} className="form">
        <label className="file-input-label">
          <input type="file" accept="image/*" onChange={handleFileChange} className="file-input" />
          {selectedFile ? selectedFile.name : 'Choose File'}
        </label>
        <button type="submit" className="submit-button" disabled={isLoading}>
          {isLoading ? 'Processing...' : 'Upload and Process'}
        </button>
      </form>
      {ocrResult && (
        <div className="result">
          <h2>Extracted Text:</h2>
          <pre>{ocrResult}</pre>
        </div>
      )}
      <style jsx>{`
        html, body {
          margin: 0;
          height: 100%;
          font-family: 'Roboto', sans-serif;
          background: linear-gradient(135deg, #0f0f0f, #1e1e1e);
          color: #ffffff;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        body {
          display: flex;
          flex-direction: column;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 30px;
          background-color: #2b2b2b;
          border-radius: 15px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
          text-align: center;
        }
        .title {
          font-size: 2.5rem;
          margin-bottom: 10px;
          color: #ffffff;
          font-weight: bold;
        }
        .subtitle {
          font-size: 1.25rem;
          margin-bottom: 30px;
          color: #bbbbbb;
        }
        .form {
          margin-bottom: 30px;
        }
        .file-input-label {
          display: block;
          margin: 0 auto 20px;
          padding: 12px 20px;
          border: 2px solid #0070f3;
          border-radius: 8px;
          background-color: #3c3c3c;
          color: #ffffff;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
        .file-input-label:hover {
          background-color: #4a4a4a;
        }
        .file-input {
          display: none;
        }
        .submit-button {
          padding: 12px 24px;
          font-size: 1rem;
          color: #ffffff;
          background-color: #0070f3;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
        .submit-button:disabled {
          background-color: #555555;
          cursor: not-allowed;
        }
        .submit-button:not(:disabled):hover {
          background-color: #0056b3;
        }
        .result {
          margin-top: 30px;
          text-align: left;
          background-color: #3c3c3c;
          padding: 20px;
          border-radius: 8px;
        }
        .result h2 {
          font-size: 1.5rem;
          color: #0070f3;
          margin-bottom: 10px;
        }
        .result pre {
          background-color: #2b2b2b;
          padding: 15px;
          border-radius: 8px;
          white-space: pre-wrap;
          word-wrap: break-word;
          color: #ffffff;
        }
      `}</style>
    </div>
  );
}
