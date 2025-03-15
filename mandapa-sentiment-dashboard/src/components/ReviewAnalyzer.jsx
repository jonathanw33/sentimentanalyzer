// src/components/ReviewAnalyzer.jsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  CircularProgress,
  Chip,
  Card,
  CardContent,
  Divider,
  Fade,
  Slide,
  Avatar,
  IconButton,
  Tooltip,
  LinearProgress,
  Alert,
  Snackbar,
  useTheme,
  useMediaQuery
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ReplayIcon from '@mui/icons-material/Replay';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import SaveIcon from '@mui/icons-material/Save';
import HistoryIcon from '@mui/icons-material/History';
import DescriptionIcon from '@mui/icons-material/Description';
import { analyzeSentimentWithGroq } from '../utils/groqApi';

const ReviewAnalyzer = ({ onSaveReview }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [reviewText, setReviewText] = useState('');
  const [sentiment, setSentiment] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzeComplete, setAnalyzeComplete] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);
  const [analyzing, setAnalyzing] = useState({
    status: false,
    step: 0,
    message: ''
  });
  
  // Example reviews for easy testing
  const exampleReviews = [
    "The staff at Mandapa was incredibly attentive and our villa overlooking the river was breathtaking. The traditional Balinese design elements blended beautifully with modern luxury. The only downside was that the restaurants were quite overpriced even for a luxury resort, and we had to make multiple requests for simple service items.",
    "Our honeymoon at Mandapa exceeded all expectations. The private pool villa was spacious and immaculate, with stunning views of the jungle. The spa treatments were divine and the staff remembered our names from day one. However, the nightly turndown service was inconsistent, and the WiFi signal was weak in some areas of the resort.",
    "Disappointed with our stay at Mandapa. While the location is beautiful, the service was subpar for a Ritz-Carlton property. We waited over an hour for room service, housekeeping missed our room one day, and the front desk seemed disorganized. The food was excellent but couldn't make up for the overall poor experience.",
  ];
  
  // Reset animation states when sentiment changes
  useEffect(() => {
    if (sentiment) {
      setAnalyzeComplete(true);
    }
  }, [sentiment]);
  
  const handleAnalyze = useCallback(async () => {
    if (!reviewText.trim()) return;
    
    setIsAnalyzing(true);
    setAnalyzeComplete(false);
    setError(null);
    
    // Initialize analysis state
    setAnalyzing({
      status: true,
      step: 1,
      message: 'Initializing sentiment analysis...'
    });
    
    try {
      // Step 1: Basic text processing
      await new Promise(resolve => setTimeout(resolve, 800));
      setAnalyzing({
        status: true,
        step: 2,
        message: 'Processing text and identifying key language patterns...'
      });
      
      // Step 2: Sending to Groq API
      await new Promise(resolve => setTimeout(resolve, 1200));
      setAnalyzing({
        status: true,
        step: 3,
        message: 'Analyzing sentiment with AI...'
      });
      
      // Step 3: Actual API call to Groq
      const result = await analyzeSentimentWithGroq(reviewText);
      
      // Step 4: Processing results
      await new Promise(resolve => setTimeout(resolve, 600));
      setAnalyzing({
        status: true,
        step: 4,
        message: 'Compiling analysis results...'
      });
      
      // Final step: Set the results
      setSentiment(result);
      
      // Complete the analysis
      await new Promise(resolve => setTimeout(resolve, 400));
      setIsAnalyzing(false);
      setAnalyzing({
        status: false,
        step: 0,
        message: ''
      });
      
    } catch (err) {
      console.error('Error analyzing sentiment:', err);
      setError('An error occurred during sentiment analysis. Please try again.');
      setIsAnalyzing(false);
      setAnalyzing({
        status: false,
        step: 0,
        message: ''
      });
    }
  }, [reviewText]);

  const handleCopy = () => {
    navigator.clipboard.writeText(reviewText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveReview = () => {
    if (sentiment && onSaveReview) {
      // Create a review object with sentiment data and metadata
      const review = {
        id: Date.now().toString(),
        text: reviewText,
        date: new Date().toISOString().split('T')[0],
        overallSentiment: parseFloat(sentiment.overallSentiment),
        rating: parseFloat(sentiment.estimatedRating),
        sentimentByAspect: sentiment.aspectScores,
        tripType: 'Leisure', // Default trip type, could be updated with actual data
        keywords: sentiment.keywords,
        summary: sentiment.summary
      };
      
      onSaveReview(review);
      
      // Show success notification
      setError({ 
        message: 'Review saved successfully!', 
        severity: 'success' 
      });
    }
  };
  
  // Helper function to get sentiment color
  const getSentimentColor = (score) => {
    if (score >= 0.8) return isDark ? '#4caf50' : '#2e7d32'; // Very positive (green)
    if (score >= 0.6) return isDark ? '#8bc34a' : '#689f38'; // Positive (light green)
    if (score >= 0.4) return isDark ? '#ffc107' : '#ffa000'; // Neutral (amber)
    if (score >= 0.2) return isDark ? '#ff9800' : '#f57c00'; // Negative (orange)
    return isDark ? '#f44336' : '#d32f2f'; // Very negative (red)
  };
  
  // Helper function to get sentiment label
  const getSentimentLabel = (score) => {
    if (score >= 0.8) return 'Very Positive';
    if (score >= 0.6) return 'Positive';
    if (score >= 0.4) return 'Neutral';
    if (score >= 0.2) return 'Negative';
    return 'Very Negative';
  };
  
  // Format aspect name for display
  const formatAspectName = (aspect) => {
    return aspect?.charAt(0).toUpperCase() + aspect?.slice(1);
  };
  
  // Loading indicator component
  const AnalysisProgress = () => (
    <Box sx={{ width: '100%', mt: 3 }}>
      <LinearProgress 
        variant="determinate"
        value={(analyzing.step / 4) * 100}
        sx={{ 
          height: 6, 
          borderRadius: 3,
          bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
          '& .MuiLinearProgress-bar': {
            background: 'linear-gradient(90deg, #b18e22, #d4af37)',
            borderRadius: 3
          }
        }} 
      />
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
        <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontStyle: 'italic' }}>
          {analyzing.message}
        </Typography>
      </Box>
    </Box>
  );
  
  return (
    <Box sx={{ 
      display: 'flex',
      flexDirection: 'column',
      minHeight: '85vh',
      position: 'relative',
      color: theme.palette.text.primary,
      p: { xs: 1, sm: 2, md: 3 },
      background: isDark 
        ? 'linear-gradient(135deg, #121212 0%, #1A1A1A 100%)'
        : 'linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)',
      backgroundSize: 'cover',
      borderRadius: 2,
      overflow: 'hidden',
    }}>
      {/* Animated Background Pattern */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: isDark
          ? 'radial-gradient(circle at 25% 25%, rgba(212,175,55,0.03) 0%, transparent 60%), radial-gradient(circle at 75% 75%, rgba(144,202,249,0.03) 0%, transparent 60%)'
          : 'radial-gradient(circle at 25% 25%, rgba(212,175,55,0.05) 0%, transparent 60%), radial-gradient(circle at 75% 75%, rgba(25,118,210,0.05) 0%, transparent 60%)',
        backgroundSize: '100% 100%',
        opacity: isDark ? 0.8 : 0.5,
        animation: 'pulse 15s infinite alternate',
        '@keyframes pulse': {
          '0%': { opacity: isDark ? 0.5 : 0.3, backgroundPosition: '0% 0%' },
          '50%': { opacity: isDark ? 0.8 : 0.5, backgroundPosition: '20% 10%' },
          '100%': { opacity: isDark ? 0.6 : 0.4, backgroundPosition: '0% 0%' }
        },
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <Slide direction="down" in={true} timeout={800} mountOnEnter unmountOnExit>
        <Box sx={{ textAlign: 'center', position: 'relative', zIndex: 1, mb: 4 }}>
          <Typography 
            variant="h3" 
            component="h1" 
            sx={{ 
              fontWeight: 300, 
              color: theme.palette.primary.main, 
              background: `linear-gradient(90deg, ${theme.palette.primary.main}B3 0%, ${theme.palette.primary.main} 50%, ${theme.palette.primary.main}B3 100%)`,
              backgroundClip: 'text',
              textFillColor: 'transparent',
              letterSpacing: '0.05em',
              mb: 1,
              textShadow: `0 0 20px ${theme.palette.primary.main}4D`
            }}
          >
            AI-Powered Review Analyzer
          </Typography>
          <Typography 
            variant="subtitle1" 
            sx={{ 
              maxWidth: '700px', 
              mx: 'auto', 
              color: theme.palette.text.secondary,
              fontStyle: 'italic'
            }}
          >
            Discover detailed guest sentiment insights with advanced AI technology
          </Typography>
        </Box>
      </Slide>
      
      <Fade in={true} timeout={1200}>
        <Card sx={{ 
          mb: 4, 
          bgcolor: isDark ? 'rgba(30, 30, 30, 0.6)' : 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(10px)',
          borderRadius: 3,
          position: 'relative',
          overflow: 'visible',
          boxShadow: isDark ? '0 10px 30px rgba(0,0,0,0.3)' : '0 10px 30px rgba(0,0,0,0.08)',
          border: `1px solid ${theme.palette.divider}`,
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: isDark ? '0 15px 40px rgba(0,0,0,0.4)' : '0 15px 40px rgba(0,0,0,0.12)',
            borderColor: `${theme.palette.primary.main}4D`,
          }
        }}>
          <Box sx={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0, 
            height: 3, 
            background: `linear-gradient(90deg, ${theme.palette.primary.main}00 0%, ${theme.palette.primary.main} 50%, ${theme.palette.primary.main}00 100%)` 
          }} />
          <CardContent sx={{ p: { xs: 2, md: 4 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <FormatQuoteIcon sx={{ color: theme.palette.primary.main, mr: 2, transform: 'scale(1.5)' }} />
              <Typography variant="h5" sx={{ fontWeight: 300 }}>
                Analyze Guest Feedback
              </Typography>
            </Box>
            
            <TextField
              label="Enter or paste a review"
              multiline
              rows={isMobile ? 4 : 6}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              fullWidth
              variant="outlined"
              placeholder="Paste a guest review here or select an example below..."
              InputProps={{
                sx: { 
                  color: theme.palette.text.primary,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: `${theme.palette.divider}`,
                    borderRadius: 2
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: `${theme.palette.text.secondary}`,
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.palette.primary.main,
                    borderWidth: 2
                  },
                  transition: 'all 0.3s ease'
                }
              }}
              InputLabelProps={{
                sx: { color: theme.palette.text.secondary }
              }}
              sx={{ mb: 3 }}
            />
            
            {/* Example Review Buttons */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
              <Typography variant="caption" sx={{ width: '100%', color: theme.palette.text.secondary, mb: 1 }}>
                Try with example reviews:
              </Typography>
              {exampleReviews.map((review, index) => (
                <Button
                  key={index}
                  size="small"
                  variant="outlined"
                  onClick={() => setReviewText(review)}
                  startIcon={<DescriptionIcon />}
                  sx={{ 
                    borderColor: theme.palette.divider,
                    color: theme.palette.text.secondary,
                    borderRadius: 2,
                    fontSize: '0.75rem',
                    py: 0.5,
                    '&:hover': {
                      borderColor: theme.palette.primary.main,
                      color: theme.palette.primary.main,
                      bgcolor: isDark ? 'rgba(212,175,55,0.05)' : 'rgba(212,175,55,0.05)',
                    }
                  }}
                >
                  Example {index + 1} {index === 0 ? '(Positive)' : index === 1 ? '(Mixed)' : '(Negative)'}
                </Button>
              ))}
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Tooltip title="Load Example Review">
                  <Button
                    variant="outlined"
                    startIcon={<LightbulbIcon />}
                    onClick={() => setReviewText(exampleReviews[0])}
                    sx={{ 
                      borderColor: theme.palette.divider,
                      color: theme.palette.text.primary,
                      borderRadius: 2,
                      py: 1,
                      px: 2,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        borderColor: theme.palette.primary.main,
                        color: theme.palette.primary.main,
                        bgcolor: isDark ? 'rgba(212,175,55,0.1)' : 'rgba(212,175,55,0.05)',
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    Example
                  </Button>
                </Tooltip>
                
                <Tooltip title={copied ? "Copied!" : "Copy to Clipboard"}>
                  <span>
                    <Button
                      variant="outlined"
                      startIcon={<ContentCopyIcon />}
                      onClick={handleCopy}
                      disabled={!reviewText.trim()}
                      sx={{ 
                        borderColor: theme.palette.divider,
                        color: theme.palette.text.primary,
                        borderRadius: 2,
                        py: 1,
                        px: 2,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          borderColor: theme.palette.primary.main,
                          color: theme.palette.primary.main,
                          bgcolor: isDark ? 'rgba(212,175,55,0.1)' : 'rgba(212,175,55,0.05)',
                          transform: 'translateY(-2px)'
                        },
                        ...(copied && {
                          borderColor: '#4caf50',
                          color: '#4caf50',
                        })
                      }}
                    >
                      {copied ? "Copied" : "Copy"}
                    </Button>
                  </span>
                </Tooltip>
              </Box>
              
              <Button
                variant="contained"
                endIcon={isAnalyzing ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                onClick={handleAnalyze}
                disabled={!reviewText.trim() || isAnalyzing}
                sx={{ 
                  background: `linear-gradient(45deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 50%, ${theme.palette.primary.dark} 100%)`,
                  backgroundSize: '200% 200%',
                  color: '#000',
                  fontWeight: 500,
                  borderRadius: 2,
                  py: 1.5,
                  px: 3,
                  minWidth: '150px',
                  boxShadow: `0 4px 20px ${theme.palette.primary.main}66`,
                  transition: 'all 0.3s ease',
                  animation: 'shimmer 2s infinite linear',
                  '@keyframes shimmer': {
                    '0%': { backgroundPosition: '0% 0%' },
                    '100%': { backgroundPosition: '200% 0%' }
                  },
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: `0 6px 25px ${theme.palette.primary.main}99`,
                  },
                  '&:active': {
                    transform: 'translateY(-1px)'
                  }
                }}
              >
                {isAnalyzing ? "Analyzing..." : "Analyze Review"}
              </Button>
            </Box>
            
            {isAnalyzing && <AnalysisProgress />}
          </CardContent>
        </Card>
      </Fade>
      
      {/* Results Section */}
      {sentiment && (
        <Fade in={analyzeComplete} timeout={800}>
          <Card sx={{ 
            mb: 4, 
            bgcolor: isDark ? 'rgba(30, 30, 30, 0.6)' : 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(10px)',
            borderRadius: 3,
            position: 'relative',
            overflow: 'visible',
            boxShadow: isDark ? '0 10px 30px rgba(0,0,0,0.3)' : '0 10px 30px rgba(0,0,0,0.08)',
            border: `1px solid ${theme.palette.divider}`,
          }}>
            <Box sx={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              right: 0, 
              height: 3, 
              background: `linear-gradient(90deg, ${theme.palette.primary.main}00 0%, ${theme.palette.primary.main} 50%, ${theme.palette.primary.main}00 100%)` 
            }} />
            <CardContent sx={{ p: { xs: 2, md: 4 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, justifyContent: 'space-between' }}>
                <Typography variant="h5" sx={{ fontWeight: 300 }}>
                  Analysis Results
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Tooltip title="Save this review analysis">
                    <IconButton 
                      onClick={handleSaveReview}
                      sx={{ 
                        color: theme.palette.text.secondary,
                        '&:hover': {
                          color: theme.palette.primary.main,
                          bgcolor: isDark ? 'rgba(212,175,55,0.1)' : 'rgba(212,175,55,0.05)'
                        }
                      }}
                    >
                      <SaveIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Start new analysis">
                    <IconButton 
                      onClick={() => {
                        setAnalyzeComplete(false);
                        setSentiment(null);
                      }}
                      sx={{ 
                        color: theme.palette.text.secondary,
                        '&:hover': {
                          color: theme.palette.primary.main,
                          bgcolor: isDark ? 'rgba(212,175,55,0.1)' : 'rgba(212,175,55,0.05)'
                        } 
                      }}
                    >
                      <ReplayIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
              
              <Grid container spacing={4}>
                {/* Overall Sentiment Score */}
                <Grid item xs={12} md={4}>
                  <Slide direction="up" in={analyzeComplete} timeout={600} mountOnEnter unmountOnExit>
                    <Box sx={{ 
                      textAlign: 'center',
                      p: 3,
                      borderRadius: 3,
                      background: isDark
                        ? 'linear-gradient(145deg, rgba(40,40,40,0.6), rgba(20,20,20,0.6))'
                        : 'linear-gradient(145deg, rgba(245,245,245,0.6), rgba(230,230,230,0.6))',
                      boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.2)' : '0 4px 20px rgba(0,0,0,0.05)',
                      border: `1px solid ${theme.palette.divider}`,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: isDark ? '0 8px 30px rgba(0,0,0,0.3)' : '0 8px 30px rgba(0,0,0,0.08)',
                      }
                    }}>
                      <Typography variant="subtitle1" sx={{ mb: 2, color: theme.palette.text.secondary }}>
                        Overall Sentiment
                      </Typography>
                      <Box sx={{ 
                        position: 'relative', 
                        display: 'inline-flex',
                        mx: 'auto',
                        mb: 2
                      }}>
                        <CircularProgress
                          variant="determinate"
                          value={sentiment.overallSentiment * 100}
                          size={120}
                          thickness={5}
                          sx={{ 
                            color: getSentimentColor(sentiment.overallSentiment),
                            transition: 'all 1s ease-out',
                            boxShadow: `0 0 30px ${getSentimentColor(sentiment.overallSentiment)}40`
                          }}
                        />
                        <Box
                          sx={{
                            top: 0,
                            left: 0,
                            bottom: 0,
                            right: 0,
                            position: 'absolute',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Typography 
                            variant="h4" // Changed from h3 to h4 to make it smaller
                            sx={{ 
                              fontWeight: 300, 
                              color: getSentimentColor(sentiment.overallSentiment),
                              textShadow: `0 0 20px ${getSentimentColor(sentiment.overallSentiment)}80`
                            }}
                          >
                            {sentiment.overallSentiment.toFixed(2)}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          mt: 1, 
                          color: getSentimentColor(sentiment.overallSentiment),
                          fontWeight: 400,
                          textShadow: `0 0 10px ${getSentimentColor(sentiment.overallSentiment)}40`
                        }}
                      >
                        {getSentimentLabel(sentiment.overallSentiment)}
                      </Typography>
                    </Box>
                  </Slide>
                </Grid>
                
                {/* Estimated Rating */}
                <Grid item xs={12} md={4}>
                  <Slide direction="up" in={analyzeComplete} timeout={800} mountOnEnter unmountOnExit>
                    <Box sx={{ 
                      textAlign: 'center',
                      p: 3,
                      borderRadius: 3,
                      background: isDark
                        ? 'linear-gradient(145deg, rgba(40,40,40,0.6), rgba(20,20,20,0.6))'
                        : 'linear-gradient(145deg, rgba(245,245,245,0.6), rgba(230,230,230,0.6))',
                      boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.2)' : '0 4px 20px rgba(0,0,0,0.05)',
                      border: `1px solid ${theme.palette.divider}`,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: isDark ? '0 8px 30px rgba(0,0,0,0.3)' : '0 8px 30px rgba(0,0,0,0.08)',
                      }
                    }}>
                      <Typography variant="subtitle1" sx={{ mb: 2, color: theme.palette.text.secondary }}>
                        Estimated Rating
                      </Typography>
                      <Typography 
                        variant="h3" 
                        sx={{ 
                          fontWeight: 300, 
                          mb: 1, 
                          color: theme.palette.primary.main,
                          textShadow: `0 0 20px ${theme.palette.primary.main}66`
                        }}
                      >
                        {sentiment.estimatedRating.toFixed(1)} <span style={{ fontSize: '60%', opacity: 0.7 }}>/5</span>
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                        {[...Array(5)].map((_, index) => (
                          <Box 
                            key={index}
                            component="span" 
                            sx={{ 
                              color: index < sentiment.estimatedRating ? theme.palette.primary.main : `${theme.palette.primary.main}4D`, 
                              fontSize: '2rem',
                              mx: 0.5,
                              display: 'inline-block',
                              transition: 'all 0.5s ease',
                              animation: index < sentiment.estimatedRating ? 'star-pulse 2s infinite' : 'none',
                              '@keyframes star-pulse': {
                                '0%': { transform: 'scale(1)', opacity: 1 },
                                '50%': { transform: 'scale(1.2)', opacity: 0.8 },
                                '100%': { transform: 'scale(1)', opacity: 1 }
                              },
                              animationDelay: `${index * 0.2}s`
                            }}
                          >
                            ★
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  </Slide>
                </Grid>
                
                {/* Summary */}
                <Grid item xs={12} md={4}>
                  <Slide direction="up" in={analyzeComplete} timeout={1000} mountOnEnter unmountOnExit>
                    <Box sx={{ 
                      textAlign: 'center',
                      p: 3,
                      borderRadius: 3,
                      background: isDark
                        ? 'linear-gradient(145deg, rgba(40,40,40,0.6), rgba(20,20,20,0.6))'
                        : 'linear-gradient(145deg, rgba(245,245,245,0.6), rgba(230,230,230,0.6))',
                      boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.2)' : '0 4px 20px rgba(0,0,0,0.05)',
                      border: `1px solid ${theme.palette.divider}`,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: isDark ? '0 8px 30px rgba(0,0,0,0.3)' : '0 8px 30px rgba(0,0,0,0.08)',
                      }
                    }}>
                      <Typography variant="subtitle1" sx={{ mb: 2, color: theme.palette.text.secondary }}>
                        AI Summary
                      </Typography>
                      <Typography variant="body1" sx={{ fontStyle: 'italic', color: theme.palette.text.primary }}>
                        "{sentiment.summary}"
                      </Typography>
                    </Box>
                  </Slide>
                </Grid>
              </Grid>
              
              <Divider sx={{ my: 4, borderColor: theme.palette.divider }} />
              
              {/* Aspect Analysis */}
              <Grid container spacing={4}>
                {/* Mentioned Aspects */}
                <Grid item xs={12} md={6}>
                  <Slide direction="right" in={analyzeComplete} timeout={1200} mountOnEnter unmountOnExit>
                    <Box>
                      <Typography variant="h6" sx={{ mb: 3, color: theme.palette.primary.main, fontWeight: 300 }}>
                        <Box component="span" sx={{ mr: 1, verticalAlign: 'middle' }}>◈</Box>
                        Mentioned Aspects
                      </Typography>
                      
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 3 }}>
                        {sentiment.aspects && sentiment.aspects.length > 0 ? (
                          sentiment.aspects.map((aspect, index) => (
                            <Fade 
                              key={aspect} 
                              in={true} 
                              timeout={1000 + (index * 200)} 
                              style={{ transitionDelay: `${index * 100}ms` }}
                            >
                              <Chip 
                                label={`${formatAspectName(aspect)}: ${sentiment.aspectScores[aspect] ? sentiment.aspectScores[aspect].toFixed(2) : '0.00'}`}
                                sx={{ 
                                  bgcolor: getSentimentColor(sentiment.aspectScores[aspect] || 0),
                                  color: '#fff',
                                  fontWeight: 500,
                                  px: 1,
                                  borderRadius: 5,
                                  py: 2.5,
                                  boxShadow: `0 3px 10px ${getSentimentColor(sentiment.aspectScores[aspect] || 0)}40`,
                                  transition: 'all 0.3s ease',
                                  '&:hover': {
                                    transform: 'translateY(-3px) scale(1.05)',
                                    boxShadow: `0 5px 15px ${getSentimentColor(sentiment.aspectScores[aspect] || 0)}60`,
                                  }
                                }}
                              />
                            </Fade>
                          ))
                        ) : (
                          <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontStyle: 'italic' }}>
                            No specific aspects detected
                          </Typography>
                        )}
                      </Box>
                      
                      {sentiment.aspects && sentiment.aspects.length > 0 && (
                        <Fade in={analyzeComplete} timeout={1800}>
                          <Paper
                            variant="outlined"
                            sx={{
                              p: 3,
                              bgcolor: isDark ? 'rgba(30, 30, 30, 0.6)' : 'rgba(255, 255, 255, 0.8)',
                              borderColor: theme.palette.divider,
                              borderRadius: 2,
                              boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.2)' : '0 4px 20px rgba(0,0,0,0.05)',
                            }}
                          >
                            <Typography variant="h6" sx={{ mb: 2, color: theme.palette.text.primary, fontWeight: 300 }}>
                              Top Aspect Insights
                            </Typography>
                            
                            {sentiment.aspects.length > 0 && Math.max(...Object.values(sentiment.aspectScores || {}).filter(val => !isNaN(val))) >= 0.7 ? (
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Avatar sx={{ bgcolor: isDark ? '#4caf50' : '#2e7d32', width: 36, height: 36, mr: 2 }}>+</Avatar>
                                <Typography variant="body1" sx={{ color: theme.palette.text.primary }}>
                                  Guests particularly appreciated the {formatAspectName(
                                    sentiment.aspects.find(aspect => 
                                      sentiment.aspectScores[aspect] === Math.max(...Object.values(sentiment.aspectScores || {}).filter(val => !isNaN(val)))
                                    ) || ''
                                  )}
                                </Typography>
                              </Box>
                            ) : null}
                            
                            {sentiment.aspects.length > 0 && Math.min(...Object.values(sentiment.aspectScores || {}).filter(val => !isNaN(val))) <= 0.4 ? (
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar sx={{ bgcolor: isDark ? '#f44336' : '#d32f2f', width: 36, height: 36, mr: 2 }}>!</Avatar>
                                <Typography variant="body1" sx={{ color: theme.palette.text.primary }}>
                                  Attention may be needed to improve {formatAspectName(
                                    sentiment.aspects.find(aspect => 
                                      sentiment.aspectScores[aspect] === Math.min(...Object.values(sentiment.aspectScores || {}).filter(val => !isNaN(val)))
                                    ) || ''
                                  )}
                                </Typography>
                              </Box>
                            ) : null}
                          </Paper>
                        </Fade>
                      )}
                    </Box>
                  </Slide>
                </Grid>
                
                {/* Sentiment Highlights */}
                <Grid item xs={12} md={6}>
                  <Slide direction="left" in={analyzeComplete} timeout={1200} mountOnEnter unmountOnExit>
                    <Box>
                    <Typography variant="h6" sx={{ mb: 3, color: theme.palette.primary.main, fontWeight: 300 }}>
                        <Box component="span" sx={{ mr: 1, verticalAlign: 'middle' }}>◈</Box>
                        Sentiment Highlights
                      </Typography>
                      
                      <Paper
                        variant="outlined"
                        sx={{
                          p: 3,
                          bgcolor: isDark ? 'rgba(30, 30, 30, 0.6)' : 'rgba(255, 255, 255, 0.8)',
                          borderColor: theme.palette.divider,
                          borderRadius: 2,
                          boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.2)' : '0 4px 20px rgba(0,0,0,0.05)',
                          maxHeight: '300px',
                          overflow: 'auto'
                        }}
                      >
                        <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                          {reviewText.split(' ').map((word, index) => {
                            // Remove punctuation for matching
                            const cleanWord = word.toLowerCase().replace(/[^\w]/g, '');
                            
                            if (sentiment.keywords.positive.some(keyword => 
                              keyword.toLowerCase() === cleanWord || cleanWord.includes(keyword.toLowerCase())
                            )) {
                              return (
                                <Fade key={index} in={true} timeout={1000} style={{ transitionDelay: `${index * 20}ms` }}>
                                  <Box 
                                    component="span" 
                                    sx={{ 
                                      color: isDark ? '#4caf50' : '#2e7d32', 
                                      fontWeight: 'bold',
                                      textShadow: isDark ? '0 0 8px rgba(76, 175, 80, 0.3)' : '0 0 8px rgba(76, 175, 80, 0.2)',
                                      position: 'relative',
                                      '&:after': {
                                        content: '""',
                                        position: 'absolute',
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        height: '2px',
                                        bgcolor: isDark ? '#4caf50' : '#2e7d32',
                                        opacity: 0.6,
                                        animation: 'pulse-underline 2s infinite',
                                        '@keyframes pulse-underline': {
                                          '0%': { opacity: 0.3 },
                                          '50%': { opacity: 0.8 },
                                          '100%': { opacity: 0.3 }
                                        }
                                      }
                                    }}
                                  >
                                    {word}{' '}
                                  </Box>
                                </Fade>
                              );
                            }
                            
                            if (sentiment.keywords.negative.some(keyword => 
                              keyword.toLowerCase() === cleanWord || cleanWord.includes(keyword.toLowerCase())
                            )) {
                              return (
                                <Fade key={index} in={true} timeout={1000} style={{ transitionDelay: `${index * 20}ms` }}>
                                  <Box 
                                    component="span" 
                                    sx={{ 
                                      color: isDark ? '#f44336' : '#d32f2f', 
                                      fontWeight: 'bold',
                                      textShadow: isDark ? '0 0 8px rgba(244, 67, 54, 0.3)' : '0 0 8px rgba(244, 67, 54, 0.2)',
                                      position: 'relative',
                                      '&:after': {
                                        content: '""',
                                        position: 'absolute',
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        height: '2px',
                                        bgcolor: isDark ? '#f44336' : '#d32f2f',
                                        opacity: 0.6,
                                        animation: 'pulse-underline 2s infinite',
                                        '@keyframes pulse-underline': {
                                          '0%': { opacity: 0.3 },
                                          '50%': { opacity: 0.8 },
                                          '100%': { opacity: 0.3 }
                                        }
                                      }
                                    }}
                                  >
                                    {word}{' '}
                                  </Box>
                                </Fade>
                              );
                            }
                            
                            return <span key={index}>{word}{' '}</span>;
                          })}
                        </Typography>
                      </Paper>
                      
                      {/* Keyword Summary */}
                      <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Paper
                          variant="outlined"
                          sx={{
                            p: 2,
                            bgcolor: isDark ? 'rgba(30, 30, 30, 0.6)' : 'rgba(255, 255, 255, 0.8)',
                            borderColor: theme.palette.divider,
                            borderRadius: 2,
                            boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.2)' : '0 4px 20px rgba(0,0,0,0.05)',
                          }}
                        >
                          <Grid container spacing={1}>
                            <Grid item xs={6}>
                              <Typography variant="subtitle2" sx={{ color: isDark ? '#4caf50' : '#2e7d32', mb: 1 }}>
                                Positive Keywords
                              </Typography>
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {sentiment.keywords.positive.slice(0, 5).map(keyword => (
                                  <Chip
                                    key={keyword}
                                    label={keyword}
                                    size="small"
                                    sx={{ 
                                      bgcolor: isDark ? 'rgba(76, 175, 80, 0.1)' : 'rgba(76, 175, 80, 0.1)', 
                                      color: isDark ? '#4caf50' : '#2e7d32',
                                      borderRadius: 1
                                    }}
                                  />
                                ))}
                              </Box>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography variant="subtitle2" sx={{ color: isDark ? '#f44336' : '#d32f2f', mb: 1 }}>
                                Negative Keywords
                              </Typography>
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {sentiment.keywords.negative.slice(0, 5).map(keyword => (
                                  <Chip
                                    key={keyword}
                                    label={keyword}
                                    size="small"
                                    sx={{ 
                                      bgcolor: isDark ? 'rgba(244, 67, 54, 0.1)' : 'rgba(244, 67, 54, 0.1)', 
                                      color: isDark ? '#f44336' : '#d32f2f',
                                      borderRadius: 1
                                    }}
                                  />
                                ))}
                              </Box>
                            </Grid>
                          </Grid>
                        </Paper>
                      </Box>
                    </Box>
                  </Slide>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Fade>
      )}
      
      {/* Error Notification */}
      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setError(null)} 
          severity={error?.severity || "error"} 
          sx={{ width: '100%', bgcolor: error?.severity === 'success' ? (isDark ? '#4caf50' : '#2e7d32') : (isDark ? '#f44336' : '#d32f2f'), color: 'white' }}
        >
          {error?.message || 'An error occurred. Please try again.'}
        </Alert>
      </Snackbar>
      
      {/* How It Works */}
      <Fade in={true} timeout={1500}>
        <Card sx={{ 
          bgcolor: isDark ? 'rgba(30, 30, 30, 0.6)' : 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(10px)',
          borderRadius: 3,
          position: 'relative',
          overflow: 'visible',
          boxShadow: isDark ? '0 10px 30px rgba(0,0,0,0.3)' : '0 10px 30px rgba(0,0,0,0.08)',
          border: `1px solid ${theme.palette.divider}`,
          mt: 'auto'
        }}>
          <Box sx={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0, 
            height: 3, 
            background: `linear-gradient(90deg, ${theme.palette.primary.main}00 0%, ${theme.palette.primary.main} 50%, ${theme.palette.primary.main}00 100%)` 
          }} />
          <CardContent sx={{ p: { xs: 2, md: 4 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <HistoryIcon sx={{ color: theme.palette.primary.main, mr: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 300 }}>
                AI-Powered Analysis Technology
              </Typography>
            </Box>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 3,
                    bgcolor: isDark ? 'rgba(30, 30, 30, 0.4)' : 'rgba(255, 255, 255, 0.7)',
                    borderColor: theme.palette.divider,
                    borderRadius: 2,
                    height: '100%',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: isDark ? '0 5px 15px rgba(0,0,0,0.3)' : '0 5px 15px rgba(0,0,0,0.08)'
                    }
                  }}
                >
                  <Typography variant="subtitle1" sx={{ mb: 1, color: theme.palette.primary.main, fontWeight: 400 }}>
                    Advanced AI Language Model
                  </Typography>
                  <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                    This analyzer is powered by Groq's state-of-the-art large language model, fine-tuned specifically for the hospitality industry. It understands context, identifies subtle nuances in guest feedback, and processes natural language with remarkable accuracy.
                  </Typography>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 3,
                    bgcolor: isDark ? 'rgba(30, 30, 30, 0.4)' : 'rgba(255, 255, 255, 0.7)',
                    borderColor: theme.palette.divider,
                    borderRadius: 2,
                    height: '100%',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: isDark ? '0 5px 15px rgba(0,0,0,0.3)' : '0 5px 15px rgba(0,0,0,0.08)'
                    }
                  }}
                >
                  <Typography variant="subtitle1" sx={{ mb: 1, color: theme.palette.primary.main, fontWeight: 400 }}>
                    Luxury Hospitality Context
                  </Typography>
                  <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                    The system is specifically trained on luxury hospitality data from 5-star resorts like Mandapa. It recognizes service standards expected at Ritz-Carlton Reserve properties and can judge reviews in the proper context of ultra-luxury expectations.
                  </Typography>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 3,
                    bgcolor: isDark ? 'rgba(30, 30, 30, 0.4)' : 'rgba(255, 255, 255, 0.7)',
                    borderColor: theme.palette.divider,
                    borderRadius: 2,
                    height: '100%',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: isDark ? '0 5px 15px rgba(0,0,0,0.3)' : '0 5px 15px rgba(0,0,0,0.08)'
                    }
                  }}
                >
                  <Typography variant="subtitle1" sx={{ mb: 1, color: theme.palette.primary.main, fontWeight: 400 }}>
                    Real-Time Business Intelligence
                  </Typography>
                  <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                    Reviews are analyzed in real-time to provide immediate insights. Property management can track sentiment trends, identify operational issues, and implement targeted improvements based on specific guest feedback points.
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Fade>
    </Box>
  );
};

export default ReviewAnalyzer;                      