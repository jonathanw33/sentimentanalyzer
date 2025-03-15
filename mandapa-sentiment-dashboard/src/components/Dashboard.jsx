// src/components/Dashboard.jsx
import React, { useMemo } from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Card, CardContent, CardHeader, Divider } from '@mui/material';

const Dashboard = ({ reviews = [] }) => {
  // Calculate overall sentiment metrics
  const overallSentiment = useMemo(() => {
    if (!reviews || reviews.length === 0) return "0.00";
    const avg = reviews.reduce((sum, review) => sum + review.overallSentiment, 0) / reviews.length;
    return avg.toFixed(2);
  }, [reviews]);
  
  const averageRating = useMemo(() => {
    if (!reviews || reviews.length === 0) return "0.0";
    const avg = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
    return avg.toFixed(1);
  }, [reviews]);
  
  // Prepare data for sentiment over time chart
  const sentimentByMonth = useMemo(() => {
    if (!reviews || reviews.length === 0) return [];
    const byMonth = {};
    
    reviews.forEach(review => {
      const month = review.date.substring(0, 7); // YYYY-MM
      if (!byMonth[month]) {
        byMonth[month] = {
          month,
          count: 0,
          totalSentiment: 0,
          totalRating: 0
        };
      }
      
      byMonth[month].count++;
      byMonth[month].totalSentiment += review.overallSentiment;
      byMonth[month].totalRating += review.rating;
    });
    
    return Object.values(byMonth)
      .map(m => ({
        month: m.month,
        sentiment: (m.totalSentiment / m.count).toFixed(2),
        rating: (m.totalRating / m.count).toFixed(1),
        reviews: m.count
      }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }, [reviews]);
  
  // Prepare data for aspect sentiment chart
  const aspectSentiment = useMemo(() => {
    if (!reviews || reviews.length === 0) return [];
    const aspects = {};
    
    reviews.forEach(review => {
      if (review.sentimentByAspect) {
        Object.entries(review.sentimentByAspect).forEach(([aspect, score]) => {
          if (!aspects[aspect]) {
            aspects[aspect] = {
              count: 0,
              total: 0
            };
          }
          
          aspects[aspect].count++;
          aspects[aspect].total += score;
        });
      }
    });
    
    return Object.entries(aspects)
      .map(([aspect, data]) => ({
        aspect,
        score: (data.total / data.count).toFixed(2),
        value: parseFloat((data.total / data.count).toFixed(2))
      }))
      .sort((a, b) => b.value - a.value);
  }, [reviews]);

  // Prepare data for trip type distribution
  const tripTypeDistribution = useMemo(() => {
    if (!reviews || reviews.length === 0) return [];
    const distribution = {};
    
    reviews.forEach(review => {
      if (review.tripType) {
        if (!distribution[review.tripType]) {
          distribution[review.tripType] = 0;
        }
        
        distribution[review.tripType]++;
      }
    });
    
    return Object.entries(distribution)
      .map(([type, count]) => ({
        name: type,
        value: count
      }));
  }, [reviews]);
  
  // Prepare data for rating distribution
  const ratingDistribution = useMemo(() => {
    if (!reviews || reviews.length === 0) return [];
    const distribution = {
      1: 0, 2: 0, 3: 0, 4: 0, 5: 0
    };
    
    reviews.forEach(review => {
      if (review.rating && distribution[review.rating] !== undefined) {
        distribution[review.rating]++;
      }
    });
    
    return Object.entries(distribution)
      .map(([rating, count]) => ({
        rating: parseInt(rating),
        count
      }));
  }, [reviews]);
  
  // Colors for charts
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#FFBB28'];
  const SENTIMENT_COLORS = {
    best: '#4caf50', // Green
    good: '#8bc34a', // Light Green
    neutral: '#ffc107', // Amber
    poor: '#ff9800', // Orange
    worst: '#f44336' // Red
  };

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Paper className="custom-tooltip" sx={{ p: 1, backgroundColor: 'rgba(30, 30, 30, 0.9)' }}>
          <Typography variant="body2">{`${label}`}</Typography>
          {payload.map((entry, index) => (
            <Typography key={index} variant="body2" sx={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}`}
            </Typography>
          ))}
        </Paper>
      );
    }
    return null;
  };
  
  // Show loading state if no reviews
  if (!reviews || reviews.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <Typography variant="h6" color="text.secondary">
          Loading dashboard data...
        </Typography>
      </Box>
    );
  }
  
  return (
    <div className="dashboard">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4, fontWeight: 300 }}>
        Sentiment Analysis Dashboard
      </Typography>
      
      {/* Key Metrics Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardHeader
              title="Overall Sentiment Score"
              titleTypographyProps={{ align: 'center', variant: 'h6' }}
            />
            <CardContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
              <Typography variant="h2" component="div" sx={{ 
                color: parseFloat(overallSentiment) >= 0.8 ? SENTIMENT_COLORS.best : 
                      parseFloat(overallSentiment) >= 0.6 ? SENTIMENT_COLORS.good :
                      parseFloat(overallSentiment) >= 0.4 ? SENTIMENT_COLORS.neutral :
                      parseFloat(overallSentiment) >= 0.2 ? SENTIMENT_COLORS.poor : SENTIMENT_COLORS.worst
              }}>
                {overallSentiment}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                out of 1.00
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardHeader
              title="Average Rating"
              titleTypographyProps={{ align: 'center', variant: 'h6' }}
            />
            <CardContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
              <Typography variant="h2" component="div" sx={{ 
                color: parseFloat(averageRating) >= 4.5 ? SENTIMENT_COLORS.best : 
                      parseFloat(averageRating) >= 3.5 ? SENTIMENT_COLORS.good :
                      parseFloat(averageRating) >= 2.5 ? SENTIMENT_COLORS.neutral :
                      parseFloat(averageRating) >= 1.5 ? SENTIMENT_COLORS.poor : SENTIMENT_COLORS.worst
              }}>
                {averageRating}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                out of 5.0
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardHeader
              title="Total Reviews"
              titleTypographyProps={{ align: 'center', variant: 'h6' }}
            />
            <CardContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
              <Typography variant="h2" component="div">
                {reviews.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                last updated today
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Chart Section */}
      <Grid container spacing={3}>
        {/* Sentiment Over Time */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardHeader title="Sentiment Trends Over Time" />
            <Divider />
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                {sentimentByMonth.length > 0 ? (
                  <LineChart
                    data={sentimentByMonth}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis 
                      dataKey="month" 
                      tick={{ fill: '#ccc' }}
                      tickFormatter={(value) => {
                        const [year, month] = value.split('-');
                        return `${month}/${year.slice(2)}`;
                      }}
                    />
                    <YAxis tick={{ fill: '#ccc' }} domain={[0, 1]} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line 
                      type="monotone" 
                      name="Sentiment Score"
                      dataKey="sentiment" 
                      stroke="#d4af37" 
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6, strokeWidth: 2 }}
                    />
                    <Line 
                      type="monotone" 
                      name="Rating (normalized)"
                      dataKey={(data) => parseFloat(data.rating) / 5} 
                      stroke="#90caf9" 
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6, strokeWidth: 2 }}
                    />
                  </LineChart>
                ) : (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <Typography variant="body2" color="text.secondary">No time data available</Typography>
                  </Box>
                )}
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Trip Type Distribution */}
        <Grid item xs={12} md={6} lg={4}>
          <Card>
            <CardHeader title="Trip Type Distribution" />
            <Divider />
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                {tripTypeDistribution.length > 0 ? (
                  <PieChart>
                    <Pie
                      data={tripTypeDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {tripTypeDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                ) : (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <Typography variant="body2" color="text.secondary">No trip type data available</Typography>
                  </Box>
                )}
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Aspect Sentiment */}
        <Grid item xs={12} md={6} lg={6}>
          <Card>
            <CardHeader title="Sentiment by Aspect" />
            <Divider />
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                {aspectSentiment.length > 0 ? (
                  <BarChart
                    data={aspectSentiment}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis 
                      type="number" 
                      domain={[0, 1]}
                      tick={{ fill: '#ccc' }}
                    />
                    <YAxis 
                      dataKey="aspect" 
                      type="category" 
                      tick={{ fill: '#ccc' }}
                      tickFormatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar 
                      dataKey="value" 
                      name="Sentiment Score"
                      radius={[0, 4, 4, 0]}
                    >
                      {aspectSentiment.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={
                            entry.value >= 0.8 ? SENTIMENT_COLORS.best : 
                            entry.value >= 0.6 ? SENTIMENT_COLORS.good :
                            entry.value >= 0.4 ? SENTIMENT_COLORS.neutral :
                            entry.value >= 0.2 ? SENTIMENT_COLORS.poor : SENTIMENT_COLORS.worst
                          } 
                        />
                      ))}
                    </Bar>
                  </BarChart>
                ) : (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <Typography variant="body2" color="text.secondary">No aspect data available</Typography>
                  </Box>
                )}
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Rating Distribution */}
        <Grid item xs={12} md={6} lg={6}>
          <Card>
            <CardHeader title="Rating Distribution" />
            <Divider />
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                {ratingDistribution.length > 0 ? (
                  <BarChart
                    data={ratingDistribution}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis 
                      dataKey="rating" 
                      tick={{ fill: '#ccc' }}
                    />
                    <YAxis tick={{ fill: '#ccc' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar 
                      dataKey="count" 
                      name="Number of Reviews"
                      fill="#d4af37"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                ) : (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <Typography variant="body2" color="text.secondary">No rating data available</Typography>
                  </Box>
                )}
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;