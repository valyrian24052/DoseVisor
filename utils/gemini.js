// utils/gemini.js

import { GoogleGenerativeAI } from '@google/generative-ai';
import { SYSTEM_TEXT, GENERATION_CONFIG } from './generation_config';

export async function generateContent(ocrText) {
    // Initialize the GoogleGenerativeAI client with the API key
    const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Create the prompt combining system and user input
    const prompt = `System: ${SYSTEM_TEXT}\nUser: ${ocrText}\nAssistant:`;

    try {
        // Generate content using the prompt
        const result = await model.generateContent(prompt);

        // Return the generated text from the response
        return result.response.text();
    } catch (error) {
        console.error('Error during content generation:', error);
        throw new Error('Failed to generate content');
    }
}
