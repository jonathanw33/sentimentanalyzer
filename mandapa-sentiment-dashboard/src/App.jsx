// src/App.jsx
import { useState, useEffect } from 'react';
import { 
  CssBaseline, 
  ThemeProvider, 
  createTheme, 
  Box, 
  Container, 
  Tab, 
  Tabs, 
  Paper,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useMediaQuery,
  Button
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import RateReviewIcon from '@mui/icons-material/RateReview';
import MenuIcon from '@mui/icons-material/Menu';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import SettingsIcon from '@mui/icons-material/Settings';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

import Dashboard from './components/Dashboard';
import ReviewAnalyzer from './components/ReviewAnalyzer';
import AIInsights from './components/AIInsights';
import WelcomeScreen from './components/WelcomeScreen';
import { sampleReviews } from './data/reviewsData';
import './App.css';

// Enhanced theme with gold accents for Mandapa
const createAppTheme = (darkMode) => createTheme({
  palette: {
    mode: darkMode ? 'dark' : 'light',
    primary: {
      main: '#d4af37', // Gold - keep consistent in both modes
      light: '#f5e5bc',
      dark: '#b18e22',
      contrastText: '#000000', // Black text on gold for better contrast
    },
    secondary: {
      main: darkMode ? '#90caf9' : '#2196f3', // Light blue in dark mode, standard blue in light mode
      light: darkMode ? '#a6d4fa' : '#64b5f6',
      dark: darkMode ? '#648dae' : '#1976d2',
      contrastText: '#ffffff',
    },
    background: {
      default: darkMode ? '#121212' : '#f5f5f5',
      paper: darkMode ? '#1e1e1e' : '#ffffff',
      card: darkMode ? 'rgba(30, 30, 30, 0.6)' : 'rgba(255, 255, 255, 0.85)',
      gradient: darkMode 
        ? 'linear-gradient(135deg, #121212 0%, #1A1A1A 100%)'
        : 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
    },
    text: {
      primary: darkMode ? '#ffffff' : '#000000',
      secondary: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
    },
    divider: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
    border: {
      light: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
      medium: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
      dark: darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
    },
  },
  typography: {
    fontFamily: "'Poppins', 'Roboto', 'Helvetica', 'Arial', sans-serif",
    h1: {
      fontWeight: 300,
    },
    h2: {
      fontWeight: 300,
    },
    h3: {
      fontWeight: 300,
    },
    h4: {
      fontWeight: 300,
    },
    h5: {
      fontWeight: 300,
    },
    h6: {
      fontWeight: 400,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          transition: 'all 0.3s ease',
        },
        containedPrimary: {
          color: '#000', // Gold buttons should have black text for better contrast
          background: 'linear-gradient(45deg, #b18e22 0%, #d4af37 50%, #b18e22 100%)',
          backgroundSize: '200% 200%',
          '&:hover': {
            backgroundPosition: 'right center',
            boxShadow: '0 6px 15px rgba(212,175,55,0.3)',
            transform: 'translateY(-2px)',
          },
        },
        outlinedPrimary: {
          borderColor: darkMode ? 'rgba(212,175,55,0.5)' : 'rgba(212,175,55,0.7)',
          '&:hover': {
            borderColor: '#d4af37',
            backgroundColor: darkMode ? 'rgba(212,175,55,0.08)' : 'rgba(212,175,55,0.04)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          transition: 'all 0.3s ease',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          transition: 'all 0.3s ease',
          overflow: 'hidden',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          transition: 'all 0.3s ease',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          transition: 'all 0.3s ease',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'all 0.3s ease',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
  shadows: [
    'none',
    darkMode 
      ? '0px 2px 4px rgba(0,0,0,0.4)' 
      : '0px 2px 4px rgba(0,0,0,0.1)',
    darkMode 
      ? '0px 4px 8px rgba(0,0,0,0.5)' 
      : '0px 4px 8px rgba(0,0,0,0.1)',
    // ... add more custom shadows as needed
  ],
  transitions: {
    easing: {
      premium: 'cubic-bezier(0.25, 0.8, 0.25, 1)',
    },
    duration: {
      short: 200,
      standard: 300, 
      premium: 500,
    },
  },
});

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [theme, setTheme] = useState(createAppTheme(true));
  const [currentTab, setCurrentTab] = useState(0);
  const [reviews, setReviews] = useState([...sampleReviews]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Update theme when dark mode changes
  useEffect(() => {
    setTheme(createAppTheme(darkMode));
  }, [darkMode]);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleSaveReview = (newReview) => {
    setReviews(prevReviews => [newReview, ...prevReviews]);
  };
  
  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };
  
  const drawerItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, index: 0 },
    { text: 'Review Analyzer', icon: <RateReviewIcon />, index: 1 },
    { text: 'AI Insights', icon: <AnalyticsIcon />, index: 2 },
  ];
  
  const menuList = () => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <Box sx={{ 
        p: 2, 
        display: 'flex', 
        alignItems: 'center',
        background: (theme) => theme.palette.mode === 'dark' 
          ? 'linear-gradient(135deg, rgba(30, 30, 30, 0.8) 0%, rgba(20, 20, 20, 0.9) 100%)'
          : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(240, 240, 240, 0.8) 100%)',
        boxShadow: '0 1px 5px rgba(0,0,0,0.1)',
        position: 'relative',
        overflow: 'hidden',
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: 0,
          left: '25%',
          right: '25%',
          height: 2,
          background: (theme) => 
            `linear-gradient(90deg, transparent, ${theme.palette.primary.main}80, transparent)`,
        }
      }}>
        <img src="/mandapa-logo.png" alt="Mandapa Logo" style={{ height: 40, marginRight: 10 }} />
        <Typography variant="h6" sx={{ 
          fontWeight: 500,
          color: (theme) => theme.palette.primary.main,
        }}>
          Mandapa Analytics
        </Typography>
      </Box>
      <Divider />
      <List>
        {drawerItems.map((item) => (
          <ListItem 
            button 
            key={item.text} 
            onClick={() => setCurrentTab(item.index)}
            selected={currentTab === item.index}
            sx={{
              borderLeft: (theme) => currentTab === item.index 
                ? `3px solid ${theme.palette.primary.main}` 
                : '3px solid transparent',
              transition: 'all 0.3s ease',
              my: 0.5,
              mx: 1,
              borderRadius: '0 8px 8px 0',
              '&:hover': {
                backgroundColor: (theme) => theme.palette.mode === 'dark' 
                  ? 'rgba(255,255,255,0.05)'
                  : 'rgba(0,0,0,0.04)',
                borderLeft: (theme) => `3px solid ${theme.palette.primary.main}80`,
              },
              backgroundColor: (theme) => currentTab === item.index 
                ? theme.palette.mode === 'dark' 
                  ? 'rgba(212,175,55,0.15)' 
                  : 'rgba(212,175,55,0.08)'
                : 'transparent',
            }}
          >
            <ListItemIcon sx={{ 
              color: (theme) => currentTab === item.index ? theme.palette.primary.main : 'inherit',
              minWidth: 40,
            }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text} 
              primaryTypographyProps={{ 
                fontWeight: currentTab === item.index ? 500 : 400,
                color: (theme) => currentTab === item.index ? theme.palette.primary.main : theme.palette.text.primary,
              }} 
            />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem 
          button 
          onClick={() => setDarkMode(!darkMode)}
          sx={{
            my: 0.5,
            mx: 1,
            borderRadius: 2,
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: (theme) => theme.palette.mode === 'dark' 
                ? 'rgba(255,255,255,0.05)'
                : 'rgba(0,0,0,0.04)',
            },
          }}
        >
          <ListItemIcon>
            {darkMode ? <LightModeIcon sx={{ color: '#f9d71c' }} /> : <DarkModeIcon sx={{ color: '#2196f3' }} />}
          </ListItemIcon>
          <ListItemText primary={darkMode ? "Light Mode" : "Dark Mode"} />
        </ListItem>
        <ListItem 
          button
          sx={{
            my: 0.5,
            mx: 1,
            borderRadius: 2,
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: (theme) => theme.palette.mode === 'dark' 
                ? 'rgba(255,255,255,0.05)'
                : 'rgba(0,0,0,0.04)',
            },
          }}
        >
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      
      {showWelcome ? (
        <WelcomeScreen onGetStarted={() => setShowWelcome(false)} />
      ) : (
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          minHeight: '100vh',
          transition: 'all 0.5s ease',
          bgcolor: (theme) => theme.palette.background.default,
        }}>
          {/* App Bar */}
          <AppBar 
            position="static" 
            elevation={0}
            sx={{ 
              bgcolor: (theme) => theme.palette.background.paper, 
              color: (theme) => theme.palette.text.primary, 
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
            }}
          >
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ 
                  mr: 2,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    color: (theme) => theme.palette.primary.main,
                    transform: 'rotate(90deg)',
                  }
                }}
                onClick={toggleDrawer(true)}
              >
                <MenuIcon />
              </IconButton>
              <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                <Typography 
                  variant="h6" 
                  component="div" 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    color: (theme) => theme.palette.mode === 'dark' 
                      ? theme.palette.primary.main
                      : theme.palette.primary.dark,
                    fontWeight: 500,
                  }}
                >
                  <Box 
                    component="img" 
                    src="/mandapa-logo.png" 
                    alt="Mandapa Logo" 
                    sx={{ 
                      height: 40, 
                      mr: 2, 
                      display: { xs: 'none', sm: 'block' },
                      filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.1))',
                    }} 
                  />
                  Mandapa Sentiment Analytics
                </Typography>
              </Box>
              {!isMobile && (
                <Button 
                  variant="outlined" 
                  color="primary"
                  startIcon={darkMode ? <LightModeIcon /> : <DarkModeIcon />}
                  onClick={() => setDarkMode(!darkMode)}
                  sx={{ 
                    ml: 2,
                    transition: 'all 0.3s ease',
                    borderColor: (theme) => 
                      theme.palette.mode === 'dark' ? 'rgba(244, 244, 244, 0.3)' : 'rgba(0, 0, 0, 0.2)',
                    color: (theme) => 
                      theme.palette.mode === 'dark' ? '#fff' : theme.palette.text.primary,
                    '&:hover': {
                      borderColor: (theme) => 
                        theme.palette.mode === 'dark' ? '#fff' : theme.palette.text.primary,
                      backgroundColor: 'transparent',
                    }
                  }}
                >
                  {darkMode ? "Light Mode" : "Dark Mode"}
                </Button>
              )}
              <IconButton 
                color="inherit" 
                sx={{ 
                  ml: 1,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    color: (theme) => theme.palette.primary.main,
                    transform: 'rotate(360deg)',
                  }
                }}
              >
                <PowerSettingsNewIcon />
              </IconButton>
            </Toolbar>
            
            {/* Tabs for navigation */}
            <Tabs
              value={currentTab}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              variant={isMobile ? "fullWidth" : "standard"}
              centered={!isMobile}
              sx={{ 
                bgcolor: (theme) => theme.palette.background.default,
                '& .MuiTab-root': {
                  minWidth: 120,
                  transition: 'all 0.3s ease',
                },
                '& .MuiTabs-indicator': {
                  height: 3,
                  borderRadius: 1.5,
                  transition: 'all 0.3s ease',
                }
              }}
            >
              <Tab 
                icon={<DashboardIcon />} 
                label="Dashboard" 
                iconPosition="start" 
                sx={{ 
                  textTransform: 'none',
                  fontWeight: currentTab === 0 ? 500 : 400,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    color: (theme) => theme.palette.primary.main,
                    opacity: 1,
                  },
                  '&.Mui-selected': {
                    color: (theme) => theme.palette.primary.main,
                  }
                }} 
              />
              <Tab 
                icon={<RateReviewIcon />} 
                label="Review Analyzer" 
                iconPosition="start" 
                sx={{ 
                  textTransform: 'none',
                  fontWeight: currentTab === 1 ? 500 : 400,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    color: (theme) => theme.palette.primary.main,
                    opacity: 1,
                  },
                  '&.Mui-selected': {
                    color: (theme) => theme.palette.primary.main,
                  }
                }} 
              />
              <Tab 
                icon={<AnalyticsIcon />} 
                label="AI Insights" 
                iconPosition="start" 
                sx={{ 
                  textTransform: 'none',
                  fontWeight: currentTab === 2 ? 500 : 400,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    color: (theme) => theme.palette.primary.main,
                    opacity: 1,
                  },
                  '&.Mui-selected': {
                    color: (theme) => theme.palette.primary.main,
                  }
                }} 
              />
            </Tabs>
          </AppBar>
          
          {/* Sidebar drawer */}
          <Drawer
            anchor="left"
            open={drawerOpen}
            onClose={toggleDrawer(false)}
            sx={{
              '& .MuiDrawer-paper': {
                boxShadow: '0 0 20px rgba(0,0,0,0.2)',
                borderRight: (theme) => `1px solid ${theme.palette.divider}`,
              }
            }}
          >
            {menuList()}
          </Drawer>
          
          {/* Main content */}
          <Container 
            maxWidth={false} 
            sx={{ 
              mt: 4, 
              mb: 4, 
              flex: 1,
              width: '100%',
              transition: 'all 0.5s ease',
            }}
          >
            <Box sx={{ display: currentTab === 0 ? 'block' : 'none' }}>
              <Dashboard reviews={reviews} />
            </Box>
            
            <Box sx={{ display: currentTab === 1 ? 'block' : 'none' }}>
              <ReviewAnalyzer onSaveReview={handleSaveReview} />
            </Box>
            
            <Box sx={{ display: currentTab === 2 ? 'block' : 'none' }}>
              <AIInsights reviews={reviews} />
            </Box>
          </Container>
          
          {/* Footer */}
          <Paper 
            component="footer" 
            square 
            variant="outlined" 
            sx={{ 
              mt: 'auto', 
              py: 2, 
              textAlign: 'center',
              bgcolor: (theme) => theme.palette.background.paper,
              borderLeft: 'none',
              borderRight: 'none',
              borderBottom: 'none',
              borderTop: (theme) => `1px solid ${theme.palette.divider}`,
              transition: 'all 0.5s ease',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              &copy; {new Date().getFullYear()} Mandapa, A Ritz-Carlton Reserve · Sentiment Analysis Dashboard
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                display: 'block', 
                mt: 0.5,
                color: (theme) => theme.palette.mode === 'dark' 
                  ? theme.palette.primary.main 
                  : theme.palette.primary.dark,
                opacity: 0.8,
              }}
            >
              Powered by Groq AI
            </Typography>
          </Paper>
        </Box>
      )}
    </ThemeProvider>
  );
}

export default App;