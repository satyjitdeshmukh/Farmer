import React, { useState, useRef } from 'react';
import Tesseract from 'tesseract.js';
import Groq from 'groq-sdk';

const PesticideScannerApp = () => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState(null);
  const [aiGuidance, setAiGuidance] = useState(null);
  const fileInputRef = useRef(null);

  const translations = {
    title: 'पीक सुरक्षा स्कॅनर आणि शेती मार्गदर्शन',
    uploadButton: 'प्रतिमा अपलोड करा',
    scanButton: 'स्कॅन करा',
    guidanceButton: 'शेती मार्गदर्शन घ्या',
    loading: 'प्रतिमा स्कॅन केली जात आहे...',
    guidanceLoading: 'शेती मार्गदर्शन तयार केले जात आहे...',
    ingredients: 'घटक',
    safetyRating: 'सुरक्षा रेटिंग',
    warnings: 'इशारा',
    noWarnings: 'कोणतेही धोके आढळले नाहीत',
    uploadError: 'कृपया वैध प्रतिमा अपलोड करा',
    farmingGuidance: 'शेती मार्गदर्शन',
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image')) {
      setImage(URL.createObjectURL(file));
      setError(null);
    } else {
      setError(translations.uploadError);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const performScan = async () => {
    if (!image) {
      setError(translations.uploadError);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const imgElement = new Image();
      imgElement.src = image;

      await new Promise((resolve) => (imgElement.onload = resolve));

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = imgElement.width;
      canvas.height = imgElement.height;
      ctx.drawImage(imgElement, 0, 0);
      const dataUrl = canvas.toDataURL();

      const { data: { text } } = await Tesseract.recognize(dataUrl, 'eng', {
        logger: (info) => console.log(info),
      });

      console.log('Extracted Text:', text);

      const safetyScore = text.includes('safe') ? 8 : 4;
      const ingredients = text.match(/ingredients:\s*(.*)/i) || ['No ingredients found'];
      const warningMessage = text.includes('warning') ? 'Take precautions while using this pesticide.' : null;

      setScanResult({
        text,
        safetyScore,
        ingredients: ingredients[1] ? ingredients[1].split(',') : [],
        warningMessage,
      });
    } catch (err) {
      console.error('OCR Error:', err);
      setError('An error occurred during scanning.');
    } finally {
      setLoading(false);
    }
  };

  const generateComprehensiveFarmingGuidance = async () => {
    if (!scanResult || !scanResult.text) {
      setError('Please scan the product first.');
      return;
    }

    setLoading(true);
    setAiGuidance('');

    try {
      const groq = new Groq({
        apiKey: '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',
        dangerouslyAllowBrowser: true,
      });

      const prompt = `Provide a comprehensive farming strategy based on the following text Give PROCUT name frist Like for what types of crop the fertilizer is used in 3-4 lines only :
      ${scanResult.text}
      Include:
      1. Crop protection techniques
      2. Water management advice
      3. Precautions for pesticide use
      4. Environmentally friendly farming practices`;

      const result = await groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'mixtral-8x7b-32768',
        temperature: 0.7,
        max_tokens: 3072,
        top_p: 1,
      });

      const guidance = result.choices[0]?.message?.content;
      setAiGuidance(guidance || 'Failed to generate farming guidance.');
    } catch (error) {
      console.error('AI Guidance Error:', error);
      setAiGuidance('An error occurred while generating farming guidance.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center p-4">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-green-700 text-center mb-4">
          {translations.title}
        </h1>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        <div className="mb-4">
          <button
            onClick={triggerFileInput}
            className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition"
          >
            {translations.uploadButton}
          </button>
        </div>

        {image && (
          <div className="mb-4 text-center">
            <img
              src={image}
              alt="Uploaded"
              className="max-w-full max-h-64 mx-auto rounded-lg"
            />
          </div>
        )}

        {image && (
          <div className="space-y-4">
            <button
              onClick={performScan}
              disabled={loading}
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition disabled:opacity-50"
            >
              {translations.scanButton}
            </button>
            <button
              onClick={generateComprehensiveFarmingGuidance}
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition disabled:opacity-50"
            >
              {translations.guidanceButton}
            </button>
          </div>
        )}

        {loading && (
          <div className="text-center text-green-600 mb-4">
            {translations.loading}
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
        )}

        {scanResult && (
          <div className="bg-green-100 rounded-lg p-4 mb-4">
            <h2 className="text-xl font-semibold text-green-800 mb-3">
              Scan Result
            </h2>
            <p>{scanResult.text}</p>
          </div>
        )}

        {aiGuidance && (
          <div className="bg-blue-100 rounded-lg p-4">
            <h2 className="text-xl font-semibold text-blue-800 mb-3">
              {translations.farmingGuidance}
            </h2>
            <p>{aiGuidance}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PesticideScannerApp;
