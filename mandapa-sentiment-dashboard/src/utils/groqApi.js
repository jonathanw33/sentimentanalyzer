// src/utils/groqApi.js

/**
 * Utility file for Groq API integration
 */

import { GROQ_API_KEY, API_CONFIG } from './apiConfig';

/**
 * Make a request to the Groq API
 * @param {Object} options - Request options
 * @param {string} options.prompt - The prompt to send to Groq
 * @param {string} options.model - The model to use (default: 'llama3-70b-8192')
 * @param {number} options.temperature - The temperature setting (default: 0.7)
 * @returns {Promise<Object>} - The response from Groq
 */
export const queryGroq = async ({ 
  prompt, 
  model = API_CONFIG.groq.defaultModel, 
  temperature = 0.7,
  max_tokens = 1024,
}) => {
  try {
    const response = await fetch(`${API_CONFIG.groq.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: 'You are an AI assistant that specializes in sentiment analysis and hospitality insights. Provide detailed, accurate, and helpful analysis.' },
          { role: 'user', content: prompt }
        ],
        temperature,
        max_tokens,
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Groq API Error: ${errorData.error?.message || 'Unknown error'}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error querying Groq API:', error);
    throw error;
  }
};

/**
 * Analyze sentiment of a review text
 * @param {string} reviewText - The review text to analyze
 * @returns {Promise<Object>} - The sentiment analysis results
 */
export const analyzeSentimentWithGroq = async (reviewText) => {
  const prompt = `
    Analyze the following hotel review and provide a detailed sentiment analysis:
    
    Review: "${reviewText}"
    
    Please provide the following in your response as a JSON object:
    - overallSentiment: A score from 0 to 1 where 0 is completely negative and 1 is completely positive
    - estimatedRating: An estimated star rating from 1 to 5
    - aspects: An array of identified aspects (e.g., service, room, food, etc.)
    - aspectScores: An object with scores for each aspect from 0 to 1
    - keywords: An object with "positive" and "negative" arrays of keywords from the review
    - summary: A brief summary of the review
    
    Response format example:
    {
      "overallSentiment": 0.85,
      "estimatedRating": 4.5,
      "aspects": ["service", "room", "location"],
      "aspectScores": {
        "service": 0.9,
        "room": 0.8,
        "location": 0.95
      },
      "keywords": {
        "positive": ["incredible", "amazing", "comfortable"],
        "negative": ["expensive"]
      },
      "summary": "The guest had an excellent stay with exceptional service, though found the pricing to be high."
    }
    
    Only return the JSON, nothing else.
  `;

  try {
    const response = await queryGroq({ 
      prompt, 
      temperature: 0.3, // Lower temperature for more consistent, analytical responses
    });
    
    // Extract the JSON content from the response
    const content = response.choices[0].message.content;
    return JSON.parse(content);
  } catch (error) {
    console.error('Error analyzing sentiment with Groq:', error);
    throw error;
  }
};

/**
 * Generate insights from a collection of reviews
 * @param {Array} reviews - Array of review objects
 * @returns {Promise<Object>} - The generated insights
 */
export const generateInsightsWithGroq = async (reviews) => {
  // Create a summary of the reviews to avoid sending too much data
  const reviewSummary = reviews.map(review => ({
    id: review.id,
    overallSentiment: review.overallSentiment,
    rating: review.rating,
    aspects: review.sentimentByAspect ? Object.keys(review.sentimentByAspect) : [],
    aspectScores: review.sentimentByAspect || {},
    date: review.date,
    tripType: review.tripType
  }));

  const prompt = `
    Based on the following summary of ${reviews.length} hotel reviews, provide business insights:
    
    ${JSON.stringify(reviewSummary)}
    
    Please provide the following in your response as a JSON object:
    - topAspects: Array of top 3 performing aspects with scores
    - bottomAspects: Array of bottom 3 performing aspects with scores
    - trends: Array of identified trends in sentiment over time
    - recommendations: Array of actionable recommendations based on the reviews
    - anomalies: Array of any anomalies or outliers in the reviews
    - competitiveInsights: Analysis of how this hotel might compare to competitors
    
    Response format example:
    {
      "topAspects": [{"aspect": "service", "score": 0.92}, ...],
      "bottomAspects": [{"aspect": "value", "score": 0.65}, ...],
      "trends": [{"type": "overall", "month": "2023-12", "change": 0.06, "message": "Overall sentiment increased by 6.0% in Dec 2023"}, ...],
      "recommendations": [{"aspect": "food", "score": 0.74, "action": "Review restaurant menus and consider bringing in a consulting chef to refresh offerings."}, ...],
      "anomalies": [{"date": "2024-02-05", "aspect": "service", "score": 0.45, "averageScore": 0.82, "message": "Unexpected low rating for usually high-performing service"}, ...],
      "competitiveInsights": {
        "strengths": ["Location and natural setting consistently rated higher than competitors", ...],
        "weaknesses": ["Value perception lags behind two direct competitors with similar price points", ...]
      }
    }
    
    Only return the JSON, nothing else.
  `;

  try {
    const response = await queryGroq({ 
      prompt, 
      temperature: 0.4,
      max_tokens: 2048, // Larger response for detailed insights
    });
    
    // Extract the JSON content from the response
    const content = response.choices[0].message.content;
    return JSON.parse(content);
  } catch (error) {
    console.error('Error generating insights with Groq:', error);
    throw error;
  }
};