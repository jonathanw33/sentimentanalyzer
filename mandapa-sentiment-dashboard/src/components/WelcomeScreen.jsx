// src/components/WelcomeScreen.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Divider,
  Fade,
  useTheme,
  Avatar,
  Chip,
  Stack,
  Collapse,
  IconButton,
  Paper,
  Container
} from '@mui/material';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import InsightsIcon from '@mui/icons-material/Insights';
import RateReviewIcon from '@mui/icons-material/RateReview';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const WelcomeScreen = ({ onGetStarted }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  
  // Animation states
  const [showTitle, setShowTitle] = useState(false);
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [showCards, setShowCards] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showPersonal, setShowPersonal] = useState(false);
  const [particles, setParticles] = useState([]);

  // Generate particles for background effect
  useEffect(() => {
    const newParticles = [];
    for (let i = 0; i < 40; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 5 + 1,
        opacity: Math.random() * 0.5 + 0.1,
        speed: Math.random() * 50 + 20
      });
    }
    setParticles(newParticles);
  }, []);

  // Sequence animations
  useEffect(() => {
    const titleTimer = setTimeout(() => setShowTitle(true), 300);
    const subtitleTimer = setTimeout(() => setShowSubtitle(true), 1200);
    const buttonTimer = setTimeout(() => setShowButton(true), 2000);
    const cardsTimer = setTimeout(() => setShowCards(true), 2800);
    const aboutTimer = setTimeout(() => setShowAbout(true), 3400);
    const personalTimer = setTimeout(() => setShowPersonal(true), 4000);
    
    return () => {
      clearTimeout(titleTimer);
      clearTimeout(subtitleTimer);
      clearTimeout(buttonTimer);
      clearTimeout(cardsTimer);
      clearTimeout(aboutTimer);
      clearTimeout(personalTimer);
    };
  }, []);

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      width: '100%',
      position: 'relative',
      overflow: 'visible',
      background: isDark 
        ? 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)' 
        : 'linear-gradient(135deg, #F1F5F9 0%, #E2E8F0 100%)',
    }}>
      {/* Animated particles background */}
      <Box sx={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0
      }}>
        {particles.map((particle) => (
          <Box
            key={particle.id}
            sx={{
              position: 'absolute',
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              borderRadius: '50%',
              backgroundColor: theme.palette.primary.main,
              opacity: particle.opacity,
              animation: `float ${particle.speed}s infinite linear`,
              '@keyframes float': {
                '0%': { transform: 'translateY(0) translateX(0)' },
                '25%': { transform: 'translateY(100px) translateX(50px)' },
                '50%': { transform: 'translateY(200px) translateX(0)' },
                '75%': { transform: 'translateY(100px) translateX(-50px)' },
                '100%': { transform: 'translateY(0) translateX(0)' }
              },
              animationDelay: `-${Math.random() * particle.speed}s`
            }}
          />
        ))}
      </Box>

      {/* Background glow effects */}
      <Box sx={{ 
        position: 'absolute',
        top: '20%',
        left: '10%',
        width: '30vw',
        height: '30vw',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${theme.palette.primary.main}40 0%, transparent 70%)`,
        filter: 'blur(60px)',
        opacity: 0.6,
        animation: 'pulse 15s infinite alternate',
        '@keyframes pulse': {
          '0%': { opacity: 0.4, transform: 'scale(1)' },
          '100%': { opacity: 0.7, transform: 'scale(1.2)' }
        }
      }} />
      
      <Box sx={{ 
        position: 'absolute',
        bottom: '10%',
        right: '10%',
        width: '25vw',
        height: '25vw',
        borderRadius: '50%',
        background: isDark
          ? 'radial-gradient(circle, rgba(56, 189, 248, 0.3) 0%, transparent 70%)' 
          : 'radial-gradient(circle, rgba(14, 165, 233, 0.2) 0%, transparent 70%)',
        filter: 'blur(60px)',
        opacity: 0.7,
        animation: 'pulse2 20s infinite alternate',
        '@keyframes pulse2': {
          '0%': { opacity: 0.5, transform: 'scale(1.2)' },
          '100%': { opacity: 0.8, transform: 'scale(1)' }
        }
      }} />

      <Container maxWidth={false} sx={{ 
        pt: 10, 
        pb: 8,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        zIndex: 1,
        width : '100%'
      }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          flex: 1,
          position: 'relative',
        }}>
          {/* Logo with enhanced animation */}
          <Fade in={true} timeout={1500}>
            <Box 
              component="img" 
              src="/ritz.png" 
              alt="Mandapa Logo" 
              sx={{ 
                maxWidth: '200px', 
                mb: 4,
                filter: 'drop-shadow(0 0 15px rgba(212,175,55,0.6))',
                animation: 'float-logo 6s ease-in-out infinite',
                '@keyframes float-logo': {
                  '0%, 100%': { transform: 'translateY(0)' },
                  '50%': { transform: 'translateY(-10px)' }
                }
              }} 
            />
          </Fade>
          
          {/* Main title with text reveal animation */}
          <Fade in={showTitle} timeout={1000}>
            <Typography 
              variant="h1" 
              component="h1" 
              gutterBottom 
              sx={{ 
                fontWeight: 300,
                fontSize: { xs: '2.5rem', sm: '3rem', md: '4rem' },
                background: 'linear-gradient(45deg, #d4af37 30%, #f5e5bc 70%)',
                backgroundClip: 'text',
                textFillColor: 'transparent',
                mb: 2,
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -10,
                  left: '25%',
                  width: '50%',
                  height: 3,
                  background: 'linear-gradient(90deg, transparent, #d4af37, transparent)',
                },
                textShadow: '0 0 30px rgba(212,175,55,0.5)'
              }}
            >
              Sentiment Intelligence
            </Typography>
          </Fade>
          
          {/* Subtitle with typing animation feel */}
          <Fade in={showSubtitle} timeout={1000}>
            <Typography 
              variant="h5" 
              sx={{ 
                maxWidth: 800, 
                mx: 'auto', 
                mb: 5, 
                color: theme.palette.text.secondary,
                fontWeight: 300,
                position: 'relative',
                display: 'inline-block',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  right: -20,
                  top: '50%',
                  height: '1.2em',
                  width: 2,
                  backgroundColor: theme.palette.primary.main,
                  animation: 'blink 1s step-end infinite',
                  opacity: 0.7,
                },
                '@keyframes blink': {
                  '0%, 100%': { opacity: 1 },
                  '50%': { opacity: 0 }
                }
              }}
            >
              Elevating the Mandapa experience through AI-driven guest insights
            </Typography>
          </Fade>
          
          {/* CTA button with enhanced animation */}
          <Collapse in={showButton} timeout={800}>
            <Button 
              variant="contained" 
              size="large"
              onClick={onGetStarted}
              endIcon={<PlayArrowIcon />}
              sx={{ 
                px: 5, 
                py: 1.8, 
                borderRadius: 8,
                background: 'linear-gradient(45deg, #b18e22 0%, #d4af37 50%, #b18e22 100%)',
                backgroundSize: '200% 200%',
                color: '#000',
                fontWeight: 500,
                mb: 8,
                fontSize: '1.1rem',
                animation: 'shimmer 2s infinite linear',
                '@keyframes shimmer': {
                  '0%': { backgroundPosition: '0% 0%' },
                  '100%': { backgroundPosition: '200% 0%' }
                },
                '&:hover': {
                  transform: 'translateY(-3px) scale(1.05)',
                  boxShadow: '0 10px 30px rgba(212,175,55,0.7)',
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: -3,
                  left: -3,
                  right: -3,
                  bottom: -3,
                  borderRadius: 10,
                  background: 'linear-gradient(45deg, #d4af37, transparent, #d4af37)',
                  opacity: 0.4,
                  zIndex: -1,
                  animation: 'rotate 3s linear infinite',
                  '@keyframes rotate': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' }
                  }
                }
              }}
            >
              Experience the Dashboard
            </Button>
          </Collapse>
          
          {/* Feature cards with enhanced animations */}
          <Fade in={showCards} timeout={1000}>
            <Grid container spacing={4} maxWidth="lg">
              <Grid item xs={12} md={4}>
                <Card 
                  elevation={isDark ? 8 : 3} 
                  sx={{ 
                    height: '100%',
                    borderRadius: 4,
                    background: isDark 
                      ? 'linear-gradient(145deg, rgba(30,41,59,0.9), rgba(15,23,42,0.9))' 
                      : 'linear-gradient(145deg, rgba(255,255,255,0.95), rgba(241,245,249,0.95))',
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
                    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    '&:hover': {
                      transform: 'translateY(-16px) scale(1.02)',
                      boxShadow: isDark 
                        ? '0 20px 40px rgba(0,0,0,0.3), 0 0 20px rgba(212,175,55,0.3)' 
                        : '0 20px 40px rgba(0,0,0,0.1), 0 0 20px rgba(212,175,55,0.2)',
                      '& .icon-container': {
                        transform: 'translateY(-10px)',
                        '& svg': {
                          transform: 'scale(1.2)',
                          color: theme.palette.primary.main
                        }
                      }
                    },
                    overflow: 'hidden',
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      background: `radial-gradient(circle at bottom right, ${theme.palette.primary.main}33, transparent 70%)`,
                      opacity: 0,
                      transition: 'opacity 0.5s ease',
                    },
                    '&:hover::before': {
                      opacity: 1
                    }
                  }}
                >
                  <Box 
                    className="icon-container"
                    sx={{ 
                      display: 'flex', 
                      justifyContent: 'center', 
                      pt: 3, 
                      mb: 1, 
                      transition: 'transform 0.4s ease' 
                    }}
                  >
                    <RateReviewIcon sx={{ 
                      fontSize: 70, 
                      color: isDark ? 'rgba(212,175,55,0.8)' : theme.palette.primary.main,
                      transition: 'all 0.4s ease',
                      filter: `drop-shadow(0 4px 6px ${theme.palette.primary.main}40)`
                    }} />
                  </Box>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div" sx={{ 
                      fontWeight: 600,
                      position: 'relative',
                      display: 'inline-block',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: -5,
                        left: 0,
                        width: '40%',
                        height: 2,
                        backgroundColor: theme.palette.primary.main,
                        transition: 'width 0.3s ease',
                      },
                      '&:hover::after': {
                        width: '100%'
                      }
                    }}>
                      AI Review Analysis
                    </Typography>
                    <Divider sx={{ my: 1.5 }} />
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                      Our AI-powered system analyzes guest reviews in real-time, extracting sentiment, key aspects, and hidden insights with exceptional accuracy. The technology understands the nuanced language of luxury hospitality to deliver meaningful insights.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card 
                  elevation={isDark ? 8 : 3} 
                  sx={{ 
                    height: '100%',
                    borderRadius: 4,
                    background: isDark 
                      ? 'linear-gradient(145deg, rgba(30,41,59,0.9), rgba(15,23,42,0.9))' 
                      : 'linear-gradient(145deg, rgba(255,255,255,0.95), rgba(241,245,249,0.95))',
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
                    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    '&:hover': {
                      transform: 'translateY(-16px) scale(1.02)',
                      boxShadow: isDark 
                        ? '0 20px 40px rgba(0,0,0,0.3), 0 0 20px rgba(212,175,55,0.3)' 
                        : '0 20px 40px rgba(0,0,0,0.1), 0 0 20px rgba(212,175,55,0.2)',
                      '& .icon-container': {
                        transform: 'translateY(-10px)',
                        '& svg': {
                          transform: 'scale(1.2)',
                          color: theme.palette.primary.main
                        }
                      }
                    },
                    overflow: 'hidden',
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      background: `radial-gradient(circle at bottom right, ${theme.palette.primary.main}33, transparent 70%)`,
                      opacity: 0,
                      transition: 'opacity 0.5s ease',
                    },
                    '&:hover::before': {
                      opacity: 1
                    }
                  }}
                >
                  <Box 
                    className="icon-container"
                    sx={{ 
                      display: 'flex', 
                      justifyContent: 'center', 
                      pt: 3, 
                      mb: 1, 
                      transition: 'transform 0.4s ease' 
                    }}
                  >
                    <DashboardIcon sx={{ 
                      fontSize: 70, 
                      color: isDark ? 'rgba(212,175,55,0.8)' : theme.palette.primary.main,
                      transition: 'all 0.4s ease',
                      filter: `drop-shadow(0 4px 6px ${theme.palette.primary.main}40)`
                    }} />
                  </Box>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div" sx={{ 
                      fontWeight: 600,
                      position: 'relative',
                      display: 'inline-block',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: -5,
                        left: 0,
                        width: '40%',
                        height: 2,
                        backgroundColor: theme.palette.primary.main,
                        transition: 'width 0.3s ease',
                      },
                      '&:hover::after': {
                        width: '100%'
                      }
                    }}>
                      Interactive Dashboard
                    </Typography>
                    <Divider sx={{ my: 1.5 }} />
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                      Visualize guest sentiment with elegant, intuitive dashboards custom-built for Mandapa. Track key performance metrics, analyze trends over time, and identify opportunities to elevate the guest experience with beautiful, responsive data visualizations.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card 
                  elevation={isDark ? 8 : 3} 
                  sx={{ 
                    height: '100%',
                    borderRadius: 4,
                    background: isDark 
                      ? 'linear-gradient(145deg, rgba(30,41,59,0.9), rgba(15,23,42,0.9))' 
                      : 'linear-gradient(145deg, rgba(255,255,255,0.95), rgba(241,245,249,0.95))',
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
                    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    '&:hover': {
                      transform: 'translateY(-16px) scale(1.02)',
                      boxShadow: isDark 
                        ? '0 20px 40px rgba(0,0,0,0.3), 0 0 20px rgba(212,175,55,0.3)' 
                        : '0 20px 40px rgba(0,0,0,0.1), 0 0 20px rgba(212,175,55,0.2)',
                      '& .icon-container': {
                        transform: 'translateY(-10px)',
                        '& svg': {
                          transform: 'scale(1.2)',
                          color: theme.palette.primary.main
                        }
                      }
                    },
                    overflow: 'hidden',
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      background: `radial-gradient(circle at bottom right, ${theme.palette.primary.main}33, transparent 70%)`,
                      opacity: 0,
                      transition: 'opacity 0.5s ease',
                    },
                    '&:hover::before': {
                      opacity: 1
                    }
                  }}
                >
                  <Box 
                    className="icon-container"
                    sx={{ 
                      display: 'flex', 
                      justifyContent: 'center', 
                      pt: 3, 
                      mb: 1, 
                      transition: 'transform 0.4s ease' 
                    }}
                  >
                    <InsightsIcon sx={{ 
                      fontSize: 70, 
                      color: isDark ? 'rgba(212,175,55,0.8)' : theme.palette.primary.main,
                      transition: 'all 0.4s ease',
                      filter: `drop-shadow(0 4px 6px ${theme.palette.primary.main}40)`
                    }} />
                  </Box>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div" sx={{ 
                      fontWeight: 600,
                      position: 'relative',
                      display: 'inline-block',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: -5,
                        left: 0,
                        width: '40%',
                        height: 2,
                        backgroundColor: theme.palette.primary.main,
                        transition: 'width 0.3s ease',
                      },
                      '&:hover::after': {
                        width: '100%'
                      }
                    }}>
                      Strategic Insights
                    </Typography>
                    <Divider sx={{ my: 1.5 }} />
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                      Transform data into actionable intelligence with AI-generated recommendations tailored to Mandapa's uniquely luxurious context. Detect emerging issues, identify opportunities for service excellence, and benchmark against leading competitors.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Fade>
          
          {/* About Section with enhanced reveal */}
          <Fade in={showAbout} timeout={1000}>
            <Paper 
              elevation={isDark ? 8 : 2} 
              sx={{ 
                mt: 8, 
                p: 4, 
                borderRadius: 4,
                background: isDark 
                  ? 'linear-gradient(145deg, rgba(30,41,59,0.8), rgba(15,23,42,0.8))' 
                  : 'linear-gradient(145deg, rgba(255,255,255,0.9), rgba(241,245,249,0.9))',
                backdropFilter: 'blur(10px)',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
                maxWidth: 900,
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <Box sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: `radial-gradient(circle at bottom right, ${theme.palette.primary.main}15, transparent 60%)`,
                pointerEvents: 'none'
              }} />
              
              <Grid container spacing={4} alignItems="center">
                <Grid item xs={12} md={8}>
                  <Typography variant="h6" gutterBottom sx={{ 
                    fontWeight: 600, 
                    color: theme.palette.primary.main,
                    display: 'flex',
                    alignItems: 'center',
                    '&::before': {
                      content: '""',
                      display: 'inline-block',
                      width: 4,
                      height: 20,
                      backgroundColor: theme.palette.primary.main,
                      marginRight: 1.5,
                      borderRadius: 4
                    }
                  }}>
                    Enhancing Mandapa's Legacy of Excellence
                  </Typography>
                  <Typography variant="body1" paragraph sx={{ color: theme.palette.text.secondary, lineHeight: 1.7 }}>
                    This dashboard was designed exclusively for Mandapa, A Ritz-Carlton Reserve, to elevate the already exceptional guest experience through actionable data insights and AI-powered intelligence.
                  </Typography>
                  <Typography variant="body1" sx={{ color: theme.palette.text.secondary, lineHeight: 1.7 }}>
                    By combining cutting-edge artificial intelligence with intuitive visualization, the platform empowers Mandapa's team to understand guest sentiment at a granular level, transforming feedback into opportunities for even greater service excellence.
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
                  <Box
                    component="img"
                    src="/mandapa-resort.jpg" // You would need this image
                    alt="Mandapa Resort"
                    sx={{
                      maxWidth: '100%',
                      borderRadius: 3,
                      boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                      border: `3px solid ${theme.palette.primary.main}30`,
                      transition: 'transform 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.05)'
                      }
                    }}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Fade>
          
          {/* Personal Touch Section */}
          <Fade in={showPersonal} timeout={1000}>
            <Box sx={{ 
              mt: 6, 
              maxWidth: 900,
              p: 2,
              textAlign: 'left',
              width: '100%'
            }}>
              <Grid container spacing={4} alignItems="center">
                <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
                  <Avatar
                    sx={{
                      width: 160,
                      height: 160,
                      mx: 'auto',
                      border: `4px solid ${theme.palette.primary.main}40`,
                      boxShadow: `0 10px 30px ${theme.palette.primary.main}30`,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.05)',
                        boxShadow: `0 15px 40px ${theme.palette.primary.main}40`,
                        border: `4px solid ${theme.palette.primary.main}60`,
                      }
                    }}
                    alt="J"
                    src="/your-photo.jpg" // Replace with your photo
                  />
                  <Stack 
                    direction="row" 
                    spacing={1.5} 
                    justifyContent="center" 
                    sx={{ mt: 2 }}
                  >
                    <IconButton 
                      aria-label="GitHub" 
                      component="a"
                      href="https://github.com/jonathanw33"
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ 
                        color: theme.palette.text.secondary,
                        '&:hover': {
                          color: theme.palette.primary.main,
                          backgroundColor: isDark ? 'rgba(212,175,55,0.1)' : 'rgba(212,175,55,0.05)'
                        }
                      }}
                    >
                      <GitHubIcon />
                    </IconButton>
                    <IconButton 
                      aria-label="LinkedIn"
                      component="a"
                      href="https://www.linkedin.com/in/jonathan-wiguna-0264b9314/"
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ 
                        color: theme.palette.text.secondary,
                        '&:hover': {
                          color: theme.palette.primary.main,
                          backgroundColor: isDark ? 'rgba(212,175,55,0.1)' : 'rgba(212,175,55,0.05)'
                        }
                      }}
                    >
                      <LinkedInIcon />
                    </IconButton>
                    <IconButton 
                      aria-label="Email"
                      component="a"
                      href="mailto:jonathan.wiguna.p@gmail.com"
                      sx={{ 
                        color: theme.palette.text.secondary,
                        '&:hover': {
                          color: theme.palette.primary.main,
                          backgroundColor: isDark ? 'rgba(212,175,55,0.1)' : 'rgba(212,175,55,0.05)'
                        }
                      }}
                    >
                      <EmailIcon />
                    </IconButton>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={8}>
                  <Typography variant="h6" gutterBottom sx={{ 
                    fontWeight: 600, 
                    color: theme.palette.primary.main,
                    display: 'flex',
                    alignItems: 'center',
                    '&::before': {
                      content: '""',
                      display: 'inline-block',
                      width: 4,
                      height: 20,
                      backgroundColor: theme.palette.primary.main,
                      marginRight: 1.5,
                      borderRadius: 4
                    }
                  }}>
                    A Personal Note
                  </Typography>
                  <Typography variant="body1" paragraph sx={{ color: theme.palette.text.secondary, lineHeight: 1.8 }}>
                    Hello! I'm Jonathan Wiguna, a passionate developer with a deep appreciation for the intersection of technology and hospitality excellence. I designed this sentiment analysis dashboard as part of my IT internship application for Mandapa.
                  </Typography>
                  <Typography variant="body1" paragraph sx={{ color: theme.palette.text.secondary, lineHeight: 1.8 }}>
                    My goal was to create a tool that aligns with Mandapa's commitment to exceptional experiences. This project showcases my skills in frontend development, data visualization, and practical AI applications that can benefit luxury hospitality.
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Chip 
                      icon={<PersonIcon />} 
                      label="IT Internship Applicant" 
                      sx={{ 
                        mr: 1, 
                        mb: 1,
                        bgcolor: isDark ? 'rgba(212,175,55,0.1)' : 'rgba(212,175,55,0.1)',
                        color: theme.palette.primary.main,
                        border: `1px solid ${theme.palette.primary.main}40`,
                        '&:hover': {
                          bgcolor: isDark ? 'rgba(212,175,55,0.2)' : 'rgba(212,175,55,0.15)',
                        }
                      }}
                    />
                    <Chip 
                      label="React" 
                      sx={{ 
                        mr: 1, 
                        mb: 1,
                        bgcolor: isDark ? 'rgba(97, 218, 251, 0.1)' : 'rgba(97, 218, 251, 0.1)',
                        color: isDark ? 'rgb(97, 218, 251)' : 'rgb(20, 158, 202)',
                        border: `1px solid ${isDark ? 'rgba(97, 218, 251, 0.3)' : 'rgba(20, 158, 202, 0.3)'}`,
                      }}
                    />
                    <Chip 
                      label="Material UI" 
                      sx={{ 
                        mr: 1, 
                        mb: 1,
                        bgcolor: isDark ? 'rgba(25, 118, 210, 0.1)' : 'rgba(25, 118, 210, 0.1)',
                        color: theme.palette.primary.main,
                        border: `1px solid ${theme.palette.primary.main}40`,
                      }}
                    />
                    <Chip 
                      label="AI/ML" 
                      sx={{ 
                        mr: 1, 
                        mb: 1,
                        bgcolor: isDark ? 'rgba(156, 39, 176, 0.1)' : 'rgba(156, 39, 176, 0.1)',
                        color: isDark ? 'rgb(186, 104, 200)' : 'rgb(123, 31, 162)',
                        border: `1px solid ${isDark ? 'rgba(186, 104, 200, 0.3)' : 'rgba(123, 31, 162, 0.3)'}`,
                      }}
                    />
                  </Box>
                  <Button
                    variant="outlined"
                    endIcon={<ArrowForwardIcon />}
                    onClick={onGetStarted}
                    sx={{
                      mt: 3,
                      borderColor: theme.palette.primary.main,
                      color: theme.palette.primary.main,
                      borderWidth: 2,
                      px: 3,
                      py: 1,
                      borderRadius: 10,
                      '&:hover': {
                        borderWidth: 2,
                        bgcolor: isDark ? 'rgba(212,175,55,0.1)' : 'rgba(212,175,55,0.05)',
                        transform: 'translateX(5px)',
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Explore the Dashboard
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Fade>
        </Box>
      </Container>
    </Box>
  );
};

export default WelcomeScreen;
                      