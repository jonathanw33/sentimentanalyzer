// src/utils/sentimentAnalyzer.jsx
import { analyzeSentimentWithGroq } from './groqApi';

// Determine if we should use the Groq API or fallback to local methods
let USE_GROQ_API = true;

// Toggle API usage (useful for development or if API is down)
export const toggleGroqApi = (useApi) => {
  USE_GROQ_API = useApi;
};

// Main sentiment analysis function
export const analyzeSentiment = async (text) => {
  try {
    if (USE_GROQ_API) {
      return await analyzeSentimentWithGroq(text);
    } else {
      // Fallback to local analysis if API is disabled
      return localAnalyzeSentiment(text);
    }
  } catch (error) {
    console.error('Error in sentiment analysis:', error);
    // Fallback to local method if API fails
    return localAnalyzeSentiment(text);
  }
};

// Extract key aspects from review text
export const extractKeyAspects = (text) => {
  // List of common aspects in hotel reviews
  const aspects = [
    'service', 'staff', 'room', 'food', 'restaurant', 'breakfast', 
    'amenities', 'cleanliness', 'location', 'value', 'price',
    'pool', 'spa', 'bed', 'bathroom', 'view', 'ambiance', 'activities'
  ];
  
  // Check which aspects are mentioned in the text
  const mentionedAspects = aspects.filter(aspect => 
    new RegExp(`\\b${aspect}\\b`, 'i').test(text)
  );
  
  return mentionedAspects;
};

// Local sentiment analysis as a fallback (simplified version)
const localAnalyzeSentiment = (text) => {
  // Very simplified sentiment analysis
  // In a real implementation, this would be more sophisticated
  const positiveKeywords = [
    'amazing', 'excellent', 'great', 'good', 'fantastic', 'wonderful',
    'beautiful', 'exceptional', 'perfect', 'incredible', 'lovely', 
    'enjoyed', 'clean', 'comfortable', 'friendly', 'helpful', 'professional',
    'recommend', 'impressive', 'delicious', 'spacious', 'stunning'
  ];
  
  const negativeKeywords = [
    'poor', 'bad', 'terrible', 'awful', 'horrible', 'disappointing',
    'dirty', 'uncomfortable', 'unfriendly', 'unhelpful', 'unprofessional',
    'expensive', 'overpriced', 'small', 'noisy', 'broken', 'slow',
    'rude', 'mediocre', 'average', 'not worth', 'never', 'wouldn\'t'
  ];
  
  const words = text.toLowerCase().match(/\b(\w+)\b/g) || [];
  
  // Count occurrences of positive and negative keywords
  const foundPositive = words.filter(word => 
    positiveKeywords.includes(word)
  );
  
  const foundNegative = words.filter(word => 
    negativeKeywords.includes(word)
  );
  
  // Calculate simple sentiment score
  const positiveCount = foundPositive.length;
  const negativeCount = foundNegative.length;
  
  let score;
  if (positiveCount === 0 && negativeCount === 0) {
    score = 0.5; // Neutral if no keywords found
  } else {
    score = positiveCount / (positiveCount + negativeCount);
  }
  
  // Ensure score is within 0-1 range
  score = Math.max(0.1, Math.min(0.9, score));
  
  // Extract aspects
  const aspects = extractKeyAspects(text);
  
  // Generate aspect scores (simplified)
  const aspectScores = {};
  aspects.forEach(aspect => {
    // Look for keywords near the aspect
    const aspectIndex = text.toLowerCase().indexOf(aspect);
    if (aspectIndex !== -1) {
      // Get 10 words before and after the aspect
      const window = 10;
      const start = Math.max(0, aspectIndex - window);
      const end = Math.min(text.length, aspectIndex + aspect.length + window);
      const contextText = text.slice(start, end).toLowerCase();
      
      // Count positive and negative keywords in context
      const contextWords = contextText.match(/\b(\w+)\b/g) || [];
      const posCount = contextWords.filter(word => positiveKeywords.includes(word)).length;
      const negCount = contextWords.filter(word => negativeKeywords.includes(word)).length;
      
      if (posCount === 0 && negCount === 0) {
        aspectScores[aspect] = score; // Use overall score if no keywords found
      } else {
        aspectScores[aspect] = posCount / (posCount + negCount);
        aspectScores[aspect] = Math.max(0.1, Math.min(0.9, aspectScores[aspect]));
      }
    } else {
      aspectScores[aspect] = score; // Fallback to overall score
    }
  });
  
  // Estimate star rating (1-5)
  const estimatedRating = Math.max(1, Math.min(5, Math.round(score * 5)));
  
  return {
    score: parseFloat(score.toFixed(2)),
    estimatedRating,
    aspects,
    aspectScores,
    keywords: {
      positive: foundPositive,
      negative: foundNegative
    },
    summary: generateSummary(text, score, aspects, aspectScores)
  };
};

// Generate a simple summary of the review
const generateSummary = (text, score, aspects, aspectScores) => {
  let sentiment = 'neutral';
  if (score >= 0.8) sentiment = 'extremely positive';
  else if (score >= 0.6) sentiment = 'positive';
  else if (score <= 0.2) sentiment = 'very negative';
  else if (score <= 0.4) sentiment = 'negative';
  
  // Find best and worst aspects
  let bestAspect = null;
  let worstAspect = null;
  
  if (aspects.length > 0) {
    const aspectScoreEntries = Object.entries(aspectScores);
    if (aspectScoreEntries.length > 0) {
      bestAspect = aspectScoreEntries.reduce((a, b) => a[1] > b[1] ? a : b)[0];
      worstAspect = aspectScoreEntries.reduce((a, b) => a[1] < b[1] ? a : b)[0];
    }
  }
  
  let summary = `The review is generally ${sentiment}.`;
  
  if (bestAspect && aspectScores[bestAspect] >= 0.6) {
    summary += ` The guest particularly appreciated the ${bestAspect}.`;
  }
  
  if (worstAspect && aspectScores[worstAspect] <= 0.4) {
    summary += ` However, there were concerns about the ${worstAspect}.`;
  }
  
  return summary;
};