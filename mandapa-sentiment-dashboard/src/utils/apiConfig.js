// src/utils/apiConfig.js
// Store your API configuration here
// In a production environment, this should be handled with environment variables

// Replace with your actual Groq API key when deploying
export const GROQ_API_KEY = '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'; 

export const API_CONFIG = {
  groq: {
    baseUrl: 'https://api.groq.com/openai/v1',
    defaultModel: 'llama3-70b-8192'
  }
};