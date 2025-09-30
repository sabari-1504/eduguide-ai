import type { Handler } from '@netlify/functions';
import { GoogleGenAI } from '@google/genai';

export const handler: Handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return { statusCode: 500, body: 'Server misconfiguration: missing GEMINI_API_KEY' };
    }

    const body = event.body ? JSON.parse(event.body) : {};
    const {
      prompt,
      contents,
      generationConfig,
      model = 'gemini-1.5-flash'
    } = body || {};

    const ai = new GoogleGenAI({ apiKey });

    // Support both simple prompt and low-level contents
    if (prompt && typeof prompt === 'string') {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        // Node SDK accepts generationConfig too
        generationConfig: generationConfig || {
          temperature: 0.7,
          maxOutputTokens: 300,
          topP: 0.8,
          topK: 10,
        },
      });

      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: response.text })
      };
    }

    if (!contents || (Array.isArray(contents) && contents.length === 0)) {
      return { statusCode: 400, body: 'Invalid request: provide either prompt (string) or contents (array)' };
    }

    const response = await ai.models.generateContent({
      model,
      contents,
      generationConfig: generationConfig || {
        temperature: 0.7,
        maxOutputTokens: 300,
        topP: 0.8,
        topK: 10,
      },
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: response.text })
    };
  } catch (err: any) {
    return { statusCode: 500, body: err?.message || 'Unknown server error' };
  }
};

