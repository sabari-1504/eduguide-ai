# Gemini API Setup Guide

## Prerequisites
- A Gemini API key (get one from [Google AI Studio](https://aistudio.google.com/app/apikey))

## Setup Instructions

### 1. Create Environment File
Create a `.env` file in the project root directory (`education/project/.env`) with the following content:

```env
VITE_GEMINI_API_KEY=AIzaSyAkINsi2RTEEK_KoGhEEpaAMJZtzUZZ1s0

### 2. Replace API Key
Replace `AIzaSyAkINsi2RTEEK_KoGhEEpaAMJZtzUZZ1s0` with your actual Gemini API key.

### 3. Restart Development Server
After creating the `.env` file, restart your development server:

```bash
npm run dev
```

## Security Notes
- Never commit your `.env` file to version control
- The `.env` file is already in `.gitignore` to prevent accidental commits
- Keep your API key secure and don't share it publicly

## Testing
Once configured, you can test the AI chat by:
1. Going to the AI Chat section in your application
2. Asking questions about courses, careers, or admissions
3. The AI should respond with helpful educational guidance

## Troubleshooting
- If you see "API key not configured" message, make sure the `.env` file is in the correct location
- If you get authentication errors, verify your API key is correct
- If you get rate limit errors, wait a moment and try again

## API Usage
The chat uses Google's Gemini 1.5 Flash model with the following configuration:
- Temperature: 0.7 (balanced creativity and consistency)
- Max output tokens: 300 (concise responses)
- Top P: 0.8 (nucleus sampling)
- Top K: 10 (diverse responses)
- System prompt: Educational guidance assistant focused on Indian education system 