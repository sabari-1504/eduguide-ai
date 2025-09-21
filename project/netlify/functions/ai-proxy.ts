import type { Handler } from '@netlify/functions';

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
    const { contents, generationConfig } = body || {};
    if (!contents || !Array.isArray(contents)) {
      return { statusCode: 400, body: 'Invalid request: contents array required' };
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents,
        generationConfig: generationConfig || {
          temperature: 0.7,
          maxOutputTokens: 300,
          topP: 0.8,
          topK: 10
        },
      }),
    });

    const text = await response.text();
    return {
      statusCode: response.status,
      headers: { 'Content-Type': 'application/json' },
      body: text,
    };
  } catch (err: any) {
    return { statusCode: 500, body: err?.message || 'Unknown server error' };
  }
};


