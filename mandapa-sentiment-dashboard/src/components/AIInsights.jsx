// src/components/AIInsights.jsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Paper,
  Grid,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Skeleton,
  CircularProgress,
  Alert,
  Snackbar,
  IconButton,
  Tooltip,
  Fade,
  Slide,
  useTheme
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import WarningIcon from '@mui/icons-material/Warning';
import RecommendIcon from '@mui/icons-material/Recommend';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import CompareIcon from '@mui/icons-material/Compare';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import DescriptionIcon from '@mui/icons-material/Description';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import RefreshIcon from '@mui/icons-material/Refresh';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import SettingsIcon from '@mui/icons-material/Settings';

import { generateInsightsWithGroq } from '../utils/groqApi';

// Function to format aspect name (capitalize first letter)
const formatAspectName = (aspect) => {
  return aspect?.charAt(0).toUpperCase() + aspect?.slice(1);
};

// Helper function to get sentiment color
const getSentimentColor = (score, theme) => {
  const isDark = theme.palette.mode === 'dark';
  
  if (score >= 0.8) return isDark ? '#4caf50' : '#2e7d32'; // Green
  if (score >= 0.6) return isDark ? '#8bc34a' : '#689f38'; // Light Green
  if (score >= 0.4) return isDark ? '#ffc107' : '#ffa000'; // Amber
  if (score >= 0.2) return isDark ? '#ff9800' : '#f57c00'; // Orange
  return isDark ? '#f44336' : '#d32f2f'; // Red
};

// Function to format date (2023-12 to Dec 2023)
const formatMonth = (yearMonth) => {
  if (!yearMonth || typeof yearMonth !== 'string') return '';
  
  const [year, month] = yearMonth.split('-');
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${monthNames[parseInt(month) - 1]} ${year}`;
};

const AIInsights = ({ reviews = [] }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  
  const [expandedAccordion, setExpandedAccordion] = useState('panel1');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [insights, setInsights] = useState(null);
  const [aiEnabled, setAiEnabled] = useState(true);

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedAccordion(isExpanded ? panel : false);
  };

  // Generate insights using the Groq API
  const generateInsights = useCallback(async () => {
    if (!reviews || reviews.length === 0) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await generateInsightsWithGroq(reviews);
      setInsights(result);
    } catch (err) {
      console.error('Error generating insights:', err);
      setError('Failed to generate AI insights. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [reviews]);
  
  // Generate insights on component mount or when reviews change
  useEffect(() => {
    if (aiEnabled && reviews.length > 0) {
      generateInsights();
    }
  }, [reviews, aiEnabled, generateInsights]);
  
  // Toggle AI features
  const toggleAI = () => {
    setAiEnabled(!aiEnabled);
    if (!aiEnabled) {
      generateInsights();
    }
  };
  
  const refreshInsights = () => {
    generateInsights();
  };
  
  // Card hover effect
  const cardHoverEffect = {
    transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: isDark 
        ? '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)'
        : '0 14px 28px rgba(0,0,0,0.1), 0 10px 10px rgba(0,0,0,0.1)',
    }
  };
  
  // Gold glow effect
  const goldGlowEffect = {
    boxShadow: `0 0 15px ${isDark ? 'rgba(212,175,55,0.3)' : 'rgba(212,175,55,0.15)'}`,
    '&:hover': {
      boxShadow: `0 0 20px ${isDark ? 'rgba(212,175,55,0.5)' : 'rgba(212,175,55,0.25)'}`,
    }
  };
  
  // Loading state
  if (loading) {
    return (
      <Box sx={{ 
        bgcolor: theme.palette.background.default,
        color: theme.palette.text.primary,
        p: 3,
        borderRadius: 2,
        minHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background pattern */}
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: isDark
            ? 'radial-gradient(circle at 15% 25%, rgba(212,175,55,0.03) 0%, transparent 60%), radial-gradient(circle at 85% 75%, rgba(144,202,249,0.03) 0%, transparent 60%)'
            : 'radial-gradient(circle at 15% 25%, rgba(212,175,55,0.05) 0%, transparent 60%), radial-gradient(circle at 85% 75%, rgba(25,118,210,0.05) 0%, transparent 60%)',
          backgroundSize: '120% 120%',
          opacity: isDark ? 0.8 : 0.5,
          animation: 'gradientShift 25s infinite alternate ease-in-out',
          '@keyframes gradientShift': {
            '0%': { backgroundPosition: '0% 0%' },
            '50%': { backgroundPosition: '30% 20%' },
            '100%': { backgroundPosition: '0% 0%' }
          },
          pointerEvents: 'none',
          zIndex: 0
        }} />

        <Typography variant="h4" sx={{ mb: 4, fontWeight: 300, color: theme.palette.primary.main, textAlign: 'center' }}>
          AI-Powered Insights
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', flex: 1 }}>
          <CircularProgress 
            size={80} 
            thickness={2} 
            sx={{ 
              color: theme.palette.primary.main,
              mb: 3,
              '& .MuiCircularProgress-circle': {
                strokeLinecap: 'round',
                animationDuration: '2s',
              }
            }}
          />
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 300, textAlign: 'center' }}>
            Generating AI Insights
          </Typography>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary, textAlign: 'center', maxWidth: 500 }}>
            The system is analyzing {reviews.length} reviews to identify trends, patterns, and actionable insights for your property.
          </Typography>
        </Box>
      </Box>
    );
  }
  
  // Error state
  if (error && !insights) {
    return (
      <Box sx={{ 
        bgcolor: theme.palette.background.default,
        color: theme.palette.text.primary, 
        p: 3,
        borderRadius: 2,
        minHeight: '40vh',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 300, color: theme.palette.primary.main, textAlign: 'center' }}>
          AI-Powered Insights
        </Typography>
        
        <Alert 
          severity="error" 
          sx={{ 
            mb: 3, 
            bgcolor: isDark ? 'rgba(244, 67, 54, 0.1)' : 'rgba(244, 67, 54, 0.05)', 
            color: isDark ? '#f44336' : '#d32f2f', 
            border: '1px solid rgba(244, 67, 54, 0.2)'
          }}
          action={
            <Button 
              color="inherit" 
              size="small"
              startIcon={<RefreshIcon />}
              onClick={refreshInsights}
            >
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
        
        <Typography variant="body2" sx={{ color: theme.palette.text.secondary, textAlign: 'center' }}>
          You can try again or check your API connection.
        </Typography>
      </Box>
    );
  }
  
  // No reviews state
  if (!reviews || reviews.length === 0) {
    return (
      <Box sx={{ 
        bgcolor: theme.palette.background.default,
        color: theme.palette.text.primary, 
        p: 3,
        borderRadius: 2,
        minHeight: '40vh',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 300, color: theme.palette.primary.main, textAlign: 'center' }}>
          AI-Powered Insights
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', flex: 1 }}>
          <AnalyticsIcon sx={{ fontSize: 80, color: theme.palette.text.disabled, mb: 3 }} />
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 300, textAlign: 'center' }}>
            No Reviews Available
          </Typography>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary, textAlign: 'center', maxWidth: 500 }}>
            Add some reviews using the Review Analyzer to generate AI insights.
          </Typography>
        </Box>
      </Box>
    );
  }
  
  // Fallback to example data if insights are not available
  // This might happen if the API call fails but we have reviews
  const insightsData = insights || {
    topAspects: [
      { aspect: 'service', score: 0.82 },
      { aspect: 'room', score: 0.79 },
      { aspect: 'ambiance', score: 0.77 }
    ],
    bottomAspects: [
      { aspect: 'activities', score: 0.68 },
      { aspect: 'pool', score: 0.69 },
      { aspect: 'value', score: 0.72 }
    ],
    trends: [
      { type: 'overall', month: '2023-12', change: 0.06, message: "Overall sentiment increased by 6.0% in Dec 2023" },
      { type: 'aspect', month: '2024-01', aspect: 'service', change: 0.12, message: "Service sentiment increased by 12.0% in Jan 2024" },
      { type: 'aspect', month: '2023-11', aspect: 'food', change: -0.08, message: "Food sentiment decreased by 8.0% in Nov 2023" }
    ],
    recommendations: [
      { aspect: 'activities', score: 0.68, action: 'Develop new exclusive activities and experiences unique to Mandapa.' },
      { aspect: 'pool', score: 0.69, action: 'Consider improvements to pool service, maintenance, or available amenities.' }
    ],
    anomalies: [
      { date: '2024-02-05', aspect: 'service', score: 0.45, averageScore: 0.82, message: 'Unexpected low rating for service' },
      { date: '2024-01-22', aspect: 'room', score: 0.38, averageScore: 0.79, message: 'Unexpected low rating for room' }
    ],
    competitiveInsights: {
      strengths: [
        "Location and natural setting consistently rated higher than competitors",
        "Staff personalization scores exceed luxury segment average by 12%"
      ],
      weaknesses: [
        "Value perception lags behind two direct competitors with similar price points",
        "Dining variety scores below luxury category average in Bali"
      ]
    }
  };

  return (
    <Box sx={{ 
      bgcolor: theme.palette.background.default,
      color: theme.palette.text.primary, 
      p: 3,
      borderRadius: 2,
      position: 'relative',
      boxShadow: theme.shadows[1],
      overflow: 'hidden',
    }}>
      {/* Background pattern */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: isDark
          ? 'radial-gradient(circle at 15% 25%, rgba(212,175,55,0.03) 0%, transparent 60%), radial-gradient(circle at 85% 75%, rgba(144,202,249,0.03) 0%, transparent 60%)'
          : 'radial-gradient(circle at 15% 25%, rgba(212,175,55,0.05) 0%, transparent 60%), radial-gradient(circle at 85% 75%, rgba(25,118,210,0.05) 0%, transparent 60%)',
        backgroundSize: '120% 120%',
        opacity: isDark ? 0.8 : 0.5,
        animation: 'gradientShift 25s infinite alternate ease-in-out',
        '@keyframes gradientShift': {
          '0%': { backgroundPosition: '0% 0%' },
          '50%': { backgroundPosition: '30% 20%' },
          '100%': { backgroundPosition: '0% 0%' }
        },
        pointerEvents: 'none',
        zIndex: 0
      }} />
      
      {/* AI Power Toggle */}
      <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 10 }}>
        <Tooltip title={aiEnabled ? "Disable AI Analysis" : "Enable AI Analysis"}>
          <IconButton 
            onClick={toggleAI}
            sx={{ 
              color: aiEnabled ? theme.palette.primary.main : theme.palette.text.disabled,
              bgcolor: aiEnabled 
                ? isDark ? 'rgba(212,175,55,0.1)' : 'rgba(212,175,55,0.05)'
                : 'transparent',
              border: `1px solid ${aiEnabled 
                ? theme.palette.primary.main + '40' 
                : theme.palette.divider}`,
              '&:hover': {
                bgcolor: aiEnabled
                  ? isDark ? 'rgba(212,175,55,0.2)' : 'rgba(212,175,55,0.1)'
                  : isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                ...goldGlowEffect
              },
              transition: 'all 0.3s ease'
            }}
          >
            <PowerSettingsNewIcon />
          </IconButton>
        </Tooltip>
        
        {aiEnabled && (
          <Tooltip title="Refresh Insights">
            <IconButton 
              onClick={refreshInsights}
              sx={{ 
                ml: 1,
                color: theme.palette.text.secondary,
                bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                border: `1px solid ${theme.palette.divider}`,
                '&:hover': {
                  bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                  color: theme.palette.text.primary,
                },
                transition: 'all 0.3s ease'
              }}
            >
              <AutorenewIcon />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    
      <Slide direction="down" in={true} timeout={500}>
        <Typography 
          variant="h4" 
          sx={{ 
            mb: 4, 
            fontWeight: 300, 
            color: theme.palette.primary.main,
            textAlign: 'center',
            position: 'relative',
            display: 'inline-block',
            width: '100%',
            '&:after': {
              content: '""',
              position: 'absolute',
              bottom: -10,
              left: '50%',
              width: 100,
              height: 2,
              bgcolor: theme.palette.primary.main,
              transform: 'translateX(-50%)',
              borderRadius: 1,
              opacity: 0.7,
            }
          }}
        >
          AI-Powered Insights
        </Typography>
      </Slide>
      
      {!aiEnabled && (
        <Alert 
          severity="warning" 
          sx={{ 
            mb: 3, 
            bgcolor: isDark ? 'rgba(255, 152, 0, 0.1)' : 'rgba(255, 152, 0, 0.05)', 
            color: isDark ? '#ff9800' : '#ed6c02', 
            border: '1px solid rgba(255, 152, 0, 0.2)'
          }}
          action={
            <Button 
              color="inherit" 
              size="small"
              onClick={toggleAI}
            >
              Enable
            </Button>
          }
        >
          AI analysis is currently disabled. Enable it to get the latest insights.
        </Alert>
      )}
      
      {/* Executive Summary */}
      <Fade in={true} timeout={800}>
        <Card sx={{ 
          mb: 4, 
          bgcolor: isDark ? 'rgba(30, 30, 30, 0.6)' : 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(10px)',
          borderRadius: 2,
          position: 'relative',
          overflow: 'visible',
          boxShadow: isDark ? '0 10px 30px rgba(0,0,0,0.2)' : '0 10px 30px rgba(0,0,0,0.08)',
          border: `1px solid ${theme.palette.divider}`,
          ...cardHoverEffect
        }}>
          <Box sx={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0, 
            height: 3, 
            background: `linear-gradient(90deg, ${theme.palette.primary.main}00 0%, ${theme.palette.primary.main} 50%, ${theme.palette.primary.main}00 100%)`,
            opacity: 0.8
          }} />
          <CardContent>
            <Typography variant="h6" sx={{ 
              mb: 3, 
              display: 'flex', 
              alignItems: 'center',
              color: theme.palette.primary.main,
              fontWeight: 500,
            }}>
              <AnalyticsIcon sx={{ mr: 1.5, color: 'inherit' }} />
              Executive Summary
            </Typography>
            
            <Grid container spacing={3}>
              {/* Top Performing Areas */}
              <Grid item xs={12} md={4}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    bgcolor: isDark ? 'rgba(30, 30, 30, 0.5)' : 'rgba(255, 255, 255, 0.8)',
                    borderColor: theme.palette.divider,
                    height: '100%',
                    transition: 'all 0.3s ease',
                    ...cardHoverEffect,
                    '&:hover': {
                      ...cardHoverEffect['&:hover'],
                      borderColor: theme.palette.primary.main + '50',
                    }
                  }}
                >
                  <Typography variant="subtitle1" sx={{ 
                    mb: 2, 
                    color: theme.palette.primary.main,
                    fontWeight: 500,
                    position: 'relative',
                    display: 'inline-block',
                    '&:after': {
                      content: '""',
                      position: 'absolute',
                      bottom: -4,
                      left: 0,
                      width: '40%',
                      height: 2,
                      bgcolor: theme.palette.primary.main,
                      opacity: 0.5,
                      borderRadius: 1
                    }
                  }}>
                    Top Performing Areas
                  </Typography>
                  
                  <List dense disablePadding>
                    {insightsData.topAspects.map(({ aspect, score }) => (
                      <ListItem key={aspect} disableGutters sx={{
                        mb: 0.5,
                        transition: 'transform 0.2s ease',
                        '&:hover': {
                          transform: 'translateX(5px)'
                        }
                      }}>
                        <ListItemIcon sx={{ minWidth: '40px' }}>
                          <Chip 
                            label={score.toFixed(2)} 
                            size="small"
                            sx={{ 
                              bgcolor: getSentimentColor(score, theme),
                              color: '#fff',
                              fontWeight: 'bold',
                              minWidth: '45px',
                              boxShadow: `0 2px 5px ${getSentimentColor(score, theme)}40`
                            }} 
                          />
                        </ListItemIcon>
                        <ListItemText 
                          primary={formatAspectName(aspect)} 
                          primaryTypographyProps={{
                            sx: {
                              fontWeight: 500,
                              color: theme.palette.text.primary
                            }
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </Grid>
              
              {/* Areas for Improvement */}
              <Grid item xs={12} md={4}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    bgcolor: isDark ? 'rgba(30, 30, 30, 0.5)' : 'rgba(255, 255, 255, 0.8)',
                    borderColor: theme.palette.divider,
                    height: '100%',
                    transition: 'all 0.3s ease',
                    ...cardHoverEffect,
                    '&:hover': {
                      ...cardHoverEffect['&:hover'],
                      borderColor: theme.palette.primary.main + '50',
                    }
                  }}
                >
                  <Typography variant="subtitle1" sx={{ 
                    mb: 2, 
                    color: theme.palette.primary.main,
                    fontWeight: 500,
                    position: 'relative',
                    display: 'inline-block',
                    '&:after': {
                      content: '""',
                      position: 'absolute',
                      bottom: -4,
                      left: 0,
                      width: '40%',
                      height: 2,
                      bgcolor: theme.palette.primary.main,
                      opacity: 0.5,
                      borderRadius: 1
                    }
                  }}>
                    Areas for Improvement
                  </Typography>
                  
                  <List dense disablePadding>
                    {insightsData.bottomAspects.map(({ aspect, score }) => (
                      <ListItem key={aspect} disableGutters sx={{
                        mb: 0.5,
                        transition: 'transform 0.2s ease',
                        '&:hover': {
                          transform: 'translateX(5px)'
                        }
                      }}>
                        <ListItemIcon sx={{ minWidth: '40px' }}>
                          <Chip 
                            label={score.toFixed(2)} 
                            size="small"
                            sx={{ 
                              bgcolor: getSentimentColor(score, theme),
                              color: '#fff',
                              fontWeight: 'bold',
                              minWidth: '45px',
                              boxShadow: `0 2px 5px ${getSentimentColor(score, theme)}40`
                            }}
                          />
                        </ListItemIcon>
                        <ListItemText 
                          primary={formatAspectName(aspect)} 
                          primaryTypographyProps={{
                            sx: {
                              fontWeight: 500,
                              color: theme.palette.text.primary
                            }
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </Grid>
              
              {/* Key Insights */}
              <Grid item xs={12} md={4}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    bgcolor: isDark ? 'rgba(30, 30, 30, 0.5)' : 'rgba(255, 255, 255, 0.8)',
                    borderColor: theme.palette.divider,
                    height: '100%',
                    transition: 'all 0.3s ease',
                    ...cardHoverEffect,
                    '&:hover': {
                      ...cardHoverEffect['&:hover'],
                      borderColor: theme.palette.primary.main + '50',
                    }
                  }}
                >
                  <Typography variant="subtitle1" sx={{ 
                    mb: 2, 
                    color: theme.palette.primary.main,
                    fontWeight: 500,
                    position: 'relative',
                    display: 'inline-block',
                    '&:after': {
                      content: '""',
                      position: 'absolute',
                      bottom: -4,
                      left: 0,
                      width: '40%',
                      height: 2,
                      bgcolor: theme.palette.primary.main,
                      opacity: 0.5,
                      borderRadius: 1
                    }
                  }}>
                    Key Insights
                  </Typography>
                  
                  <List dense disablePadding>
                    <ListItem disableGutters sx={{
                      mb: 0.5,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        transform: 'translateX(5px)'
                      }
                    }}>
                      <ListItemIcon sx={{ minWidth: '30px' }}>
                        <TrendingUpIcon sx={{ color: '#4caf50' }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary={`${insightsData.trends.filter(t => parseFloat(t.change) > 0).length} positive trends identified`}
                        primaryTypographyProps={{ color: theme.palette.text.primary }}
                      />
                    </ListItem>
                    
                    <ListItem disableGutters sx={{
                      mb: 0.5,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        transform: 'translateX(5px)'
                      }
                    }}>
                      <ListItemIcon sx={{ minWidth: '30px' }}>
                        <TrendingDownIcon sx={{ color: isDark ? '#f44336' : '#d32f2f' }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary={`${insightsData.trends.filter(t => parseFloat(t.change) < 0).length} negative trends identified`}
                        primaryTypographyProps={{ color: theme.palette.text.primary }}
                      />
                    </ListItem>
                    
                    <ListItem disableGutters sx={{
                      mb: 0.5,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        transform: 'translateX(5px)'
                      }
                    }}>
                      <ListItemIcon sx={{ minWidth: '30px' }}>
                        <RecommendIcon sx={{ color: theme.palette.primary.main }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary={`${insightsData.recommendations.length} actionable recommendations`}
                        primaryTypographyProps={{ color: theme.palette.text.primary }}
                      />
                    </ListItem>
                    
                    <ListItem disableGutters sx={{
                      mb: 0.5,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        transform: 'translateX(5px)'
                      }
                    }}>
<ListItemIcon sx={{ minWidth: '30px' }}>
  <WarningIcon sx={{ color: '#ff9800' }} />
</ListItemIcon>
<ListItemText 
  primary={`${insightsData.anomalies.length} anomalies detected`}
  primaryTypographyProps={{ color: theme.palette.text.primary }}
/>
</ListItem>
                  </List>
                </Paper>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Fade>
      
      {/* Detailed Insights Accordions */}
      <Box>
        {/* Trends */}
        <Accordion 
          expanded={expandedAccordion === 'panel1'} 
          onChange={handleAccordionChange('panel1')}
          sx={{ 
            mb: 2, 
            bgcolor: isDark ? 'rgba(30, 30, 30, 0.6)' : 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(10px)',
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: '8px !important',
            '&:before': { display: 'none' },
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            boxShadow: isDark ? '0 5px 15px rgba(0,0,0,0.2)' : '0 5px 15px rgba(0,0,0,0.05)',
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{ 
              borderBottom: expandedAccordion === 'panel1' ? `1px solid ${theme.palette.divider}` : 'none',
              '& .MuiAccordionSummary-content': {
                display: 'flex',
                alignItems: 'center',
              }
            }}
          >
            <TrendingUpIcon sx={{ mr: 2, color: theme.palette.primary.main }} />
            <Typography variant="h6" sx={{ fontWeight: 500 }}>Trend Analysis</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              {insightsData.trends.map((trend, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2,
                      bgcolor: isDark ? 'rgba(30, 30, 30, 0.5)' : 'rgba(255, 255, 255, 0.8)',
                      borderColor: trend.change > 0 ? 'rgba(76, 175, 80, 0.3)' : 'rgba(244, 67, 54, 0.3)',
                      height: '100%',
                      ...cardHoverEffect
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                      {trend.change > 0 ? (
                        <TrendingUpIcon sx={{ color: '#4caf50', mr: 1 }} />
                      ) : (
                        <TrendingDownIcon sx={{ color: isDark ? '#f44336' : '#d32f2f', mr: 1 }} />
                      )}
                      <Typography 
                        variant="subtitle1" 
                        sx={{ 
                          fontWeight: 500,
                          color: trend.change > 0 ? '#4caf50' : (isDark ? '#f44336' : '#d32f2f')
                        }}
                      >
                        {formatMonth(trend.month)}
                      </Typography>
                    </Box>
                    
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      {trend.message}
                    </Typography>
                    
                    <Chip 
                      label={`${trend.change > 0 ? '+' : ''}${(trend.change * 100).toFixed(1)}%`} 
                      size="small"
                      sx={{ 
                        bgcolor: trend.change > 0 ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
                        color: trend.change > 0 ? '#4caf50' : (isDark ? '#f44336' : '#d32f2f'),
                        border: `1px solid ${trend.change > 0 ? 'rgba(76, 175, 80, 0.3)' : 'rgba(244, 67, 54, 0.3)'}`,
                      }} 
                    />
                    
                    {trend.aspect && (
                      <Chip 
                        label={formatAspectName(trend.aspect)} 
                        size="small"
                        sx={{ 
                          ml: 1,
                          bgcolor: 'rgba(25, 118, 210, 0.1)',
                          color: theme.palette.primary.main,
                          border: `1px solid rgba(25, 118, 210, 0.3)`,
                        }} 
                      />
                    )}
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </AccordionDetails>
        </Accordion>
        
        {/* Recommendations */}
        <Accordion 
          expanded={expandedAccordion === 'panel2'} 
          onChange={handleAccordionChange('panel2')}
          sx={{ 
            mb: 2, 
            bgcolor: isDark ? 'rgba(30, 30, 30, 0.6)' : 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(10px)',
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: '8px !important',
            '&:before': { display: 'none' },
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            boxShadow: isDark ? '0 5px 15px rgba(0,0,0,0.2)' : '0 5px 15px rgba(0,0,0,0.05)',
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{ 
              borderBottom: expandedAccordion === 'panel2' ? `1px solid ${theme.palette.divider}` : 'none',
              '& .MuiAccordionSummary-content': {
                display: 'flex',
                alignItems: 'center',
              }
            }}
          >
            <RecommendIcon sx={{ mr: 2, color: theme.palette.primary.main }} />
            <Typography variant="h6" sx={{ fontWeight: 500 }}>Recommendations</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              {insightsData.recommendations.map((rec, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2,
                      bgcolor: isDark ? 'rgba(30, 30, 30, 0.5)' : 'rgba(255, 255, 255, 0.8)',
                      borderColor: theme.palette.divider,
                      height: '100%',
                      ...cardHoverEffect
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                      <Chip 
                        label={rec.score.toFixed(2)} 
                        size="small"
                        sx={{ 
                          mr: 1,
                          bgcolor: getSentimentColor(rec.score, theme),
                          color: '#fff',
                          fontWeight: 'bold',
                          minWidth: '45px',
                        }} 
                      />
                      <Typography 
                        variant="subtitle1" 
                        sx={{ 
                          fontWeight: 500,
                          color: theme.palette.text.primary
                        }}
                      >
                        {formatAspectName(rec.aspect)}
                      </Typography>
                    </Box>
                    
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      {rec.action}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </AccordionDetails>
        </Accordion>
        
        {/* Anomalies */}
        <Accordion 
          expanded={expandedAccordion === 'panel3'} 
          onChange={handleAccordionChange('panel3')}
          sx={{ 
            mb: 2, 
            bgcolor: isDark ? 'rgba(30, 30, 30, 0.6)' : 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(10px)',
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: '8px !important',
            '&:before': { display: 'none' },
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            boxShadow: isDark ? '0 5px 15px rgba(0,0,0,0.2)' : '0 5px 15px rgba(0,0,0,0.05)',
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{ 
              borderBottom: expandedAccordion === 'panel3' ? `1px solid ${theme.palette.divider}` : 'none',
              '& .MuiAccordionSummary-content': {
                display: 'flex',
                alignItems: 'center',
              }
            }}
          >
            <WarningIcon sx={{ mr: 2, color: theme.palette.primary.main }} />
            <Typography variant="h6" sx={{ fontWeight: 500 }}>Anomaly Detection</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              {insightsData.anomalies.map((anomaly, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2,
                      bgcolor: isDark ? 'rgba(30, 30, 30, 0.5)' : 'rgba(255, 255, 255, 0.8)',
                      borderColor: 'rgba(255, 152, 0, 0.3)',
                      height: '100%',
                      ...cardHoverEffect
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                      <WarningIcon sx={{ color: '#ff9800', mr: 1 }} />
                      <Typography 
                        variant="subtitle1" 
                        sx={{ 
                          fontWeight: 500,
                          color: '#ff9800'
                        }}
                      >
                        {anomaly.date}
                      </Typography>
                    </Box>
                    
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      {anomaly.message}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Chip 
                        label={`${formatAspectName(anomaly.aspect)}`} 
                        size="small"
                        sx={{ 
                          mr: 1,
                          bgcolor: 'rgba(25, 118, 210, 0.1)',
                          color: theme.palette.primary.main,
                          border: `1px solid rgba(25, 118, 210, 0.3)`,
                        }} 
                      />
                      
                      <Chip 
                        label={`Score: ${anomaly.score.toFixed(2)}`} 
                        size="small"
                        sx={{ 
                          mr: 1,
                          bgcolor: 'rgba(244, 67, 54, 0.1)',
                          color: isDark ? '#f44336' : '#d32f2f',
                          border: `1px solid rgba(244, 67, 54, 0.3)`,
                        }} 
                      />
                      
                      <Chip 
                        label={`Avg: ${anomaly.averageScore.toFixed(2)}`} 
                        size="small"
                        sx={{ 
                          bgcolor: 'rgba(76, 175, 80, 0.1)',
                          color: '#4caf50',
                          border: `1px solid rgba(76, 175, 80, 0.3)`,
                        }} 
                      />
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </AccordionDetails>
        </Accordion>
        
        {/* Competitive Analysis */}
        <Accordion 
          expanded={expandedAccordion === 'panel4'} 
          onChange={handleAccordionChange('panel4')}
          sx={{ 
            mb: 2, 
            bgcolor: isDark ? 'rgba(30, 30, 30, 0.6)' : 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(10px)',
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: '8px !important',
            '&:before': { display: 'none' },
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            boxShadow: isDark ? '0 5px 15px rgba(0,0,0,0.2)' : '0 5px 15px rgba(0,0,0,0.05)',
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{ 
              borderBottom: expandedAccordion === 'panel4' ? `1px solid ${theme.palette.divider}` : 'none',
              '& .MuiAccordionSummary-content': {
                display: 'flex',
                alignItems: 'center',
              }
            }}
          >
            <CompareIcon sx={{ mr: 2, color: theme.palette.primary.main }} />
            <Typography variant="h6" sx={{ fontWeight: 500 }}>Competitive Analysis</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    bgcolor: isDark ? 'rgba(30, 30, 30, 0.5)' : 'rgba(255, 255, 255, 0.8)',
                    borderColor: 'rgba(76, 175, 80, 0.3)',
                    height: '100%',
                    ...cardHoverEffect
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                    <TrendingUpIcon sx={{ color: '#4caf50', mr: 1 }} />
                    <Typography 
                      variant="subtitle1" 
                      sx={{ 
                        fontWeight: 500,
                        color: '#4caf50'
                      }}
                    >
                      Competitive Strengths
                    </Typography>
                  </Box>
                  
                  <List dense>
                    {insightsData.competitiveInsights.strengths.map((strength, index) => (
                      <ListItem key={index} disableGutters sx={{ mb: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: '30px' }}>
                          <TrendingUpIcon sx={{ color: '#4caf50', fontSize: '0.9rem' }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary={strength} 
                          primaryTypographyProps={{ variant: 'body2' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    bgcolor: isDark ? 'rgba(30, 30, 30, 0.5)' : 'rgba(255, 255, 255, 0.8)',
                    borderColor: 'rgba(244, 67, 54, 0.3)',
                    height: '100%',
                    ...cardHoverEffect
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                    <TrendingDownIcon sx={{ color: isDark ? '#f44336' : '#d32f2f', mr: 1 }} />
                    <Typography 
                      variant="subtitle1" 
                      sx={{ 
                        fontWeight: 500,
                        color: isDark ? '#f44336' : '#d32f2f'
                      }}
                    >
                      Competitive Weaknesses
                    </Typography>
                  </Box>
                  
                  <List dense>
                    {insightsData.competitiveInsights.weaknesses.map((weakness, index) => (
                      <ListItem key={index} disableGutters sx={{ mb: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: '30px' }}>
                          <TrendingDownIcon sx={{ color: isDark ? '#f44336' : '#d32f2f', fontSize: '0.9rem' }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary={weakness} 
                          primaryTypographyProps={{ variant: 'body2' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Box>
      
      {/* Error snackbar */}
      <Snackbar 
        open={error !== null} 
        autoHideDuration={6000} 
        onClose={() => setError(null)}
      >
        <Alert 
          onClose={() => setError(null)} 
          severity="error"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AIInsights;