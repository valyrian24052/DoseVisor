import React, { useState } from 'react';
import Head from 'next/head';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [ocrResult, setOcrResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const onDrop = (acceptedFiles) => {
    setSelectedFile(acceptedFiles[0]);
    setShowModal(false);
    setOcrResult('');
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setOcrResult('');
    setShowModal(true);  // Show the modal when a file is selected
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

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className={styles.container}>
      <Head>
        <title>DoseVisor</title>
        <link rel="icon" href="/logo.svg" />
      </Head>
      <h1 className={styles.title}>Upload Your Prescription</h1>
      <p className={styles.subtitle}>Simply upload a clear photo or scan of your medical prescription to get started.</p>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <label
          className={styles.fileInputLabel}
          onClick={() => setShowModal(true)} // Show the modal on click
        >
          {selectedFile ? selectedFile.name : 'Choose File'}
        </label>
        <button type="submit" className={styles.submitButton} disabled={isLoading}>
          {isLoading ? 'Processing...' : 'Upload Prescription'}
        </button>
      </form>

      {/* Modal */}
      {showModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div
              {...getRootProps({
                className: `${styles.dropzone} ${
                  isDragActive ? styles.dragActive : ''
                }`,
              })}
            >
              <input {...getInputProps()} />
              <p>Drag & drop your file here, or click to select files</p>
            </div>
            <button className={styles.closeButton} onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}

      {ocrResult && (
        <div className={styles.result}>
          <h2>Extracted Text:</h2>
          <pre>{ocrResult}</pre>
        </div>
      )}
    </div>
  );
}
