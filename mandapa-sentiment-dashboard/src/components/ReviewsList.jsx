// File: src/components/ReviewsList.js
import React, { useState, useMemo } from 'react';
import {
  Paper, Typography, Box, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, TablePagination, Chip, Rating, TextField,
  InputAdornment, IconButton, Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';

const ReviewsList = ({ reviews }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState('all');
  const [filterCountry, setFilterCountry] = useState('all');
  const [filterTripType, setFilterTripType] = useState('all');
  
  // Get unique countries and trip types for filters
  const countries = useMemo(() => {
    const uniqueCountries = new Set(reviews.map(review => review.country));
    return Array.from(uniqueCountries).sort();
  }, [reviews]);
  
  const tripTypes = useMemo(() => {
    const uniqueTypes = new Set(reviews.map(review => review.tripType));
    return Array.from(uniqueTypes).sort();
  }, [reviews]);
  
  // Filter and sort reviews
  const filteredReviews = useMemo(() => {
    return reviews
      .filter(review => {
        // Filter by search term
        const searchMatch = searchTerm === '' || 
          review.reviewText.toLowerCase().includes(searchTerm.toLowerCase()) ||
          review.reviewer.toLowerCase().includes(searchTerm.toLowerCase());
        
        // Filter by rating
        const ratingMatch = filterRating === 'all' || review.rating === parseInt(filterRating);
        
        // Filter by country
        const countryMatch = filterCountry === 'all' || review.country === filterCountry;
        
        // Filter by trip type
        const tripTypeMatch = filterTripType === 'all' || review.tripType === filterTripType;
        
        return searchMatch && ratingMatch && countryMatch && tripTypeMatch;
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date (newest first)
  }, [reviews, searchTerm, filterRating, filterCountry, filterTripType]);
  
  // Handle pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  // Get sentiment icon based on score
  const getSentimentIcon = (sentiment) => {
    if (sentiment >= 0.8) return <SentimentVerySatisfiedIcon sx={{ color: '#4caf50' }} />;
    if (sentiment >= 0.6) return <SentimentSatisfiedAltIcon sx={{ color: '#8bc34a' }} />;
    if (sentiment >= 0.4) return <SentimentSatisfiedIcon sx={{ color: '#ffc107' }} />;
    if (sentiment >= 0.2) return <SentimentDissatisfiedIcon sx={{ color: '#ff9800' }} />;
    return <SentimentVeryDissatisfiedIcon sx={{ color: '#f44336' }} />;
  };
  
  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  return (
    <div>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4, fontWeight: 300 }}>
        Review Analysis
      </Typography>
      
      {/* Filters */}
      <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {/* Search */}
        <TextField
          label="Search reviews"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(0);
          }}
          sx={{ flexGrow: 1, minWidth: '200px' }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        
        {/* Rating filter */}
        <FormControl size="small" sx={{ minWidth: '120px' }}>
          <InputLabel id="rating-filter-label">Rating</InputLabel>
          <Select
            labelId="rating-filter-label"
            value={filterRating}
            label="Rating"
            onChange={(e) => {
              setFilterRating(e.target.value);
              setPage(0);
            }}
          >
            <MenuItem value="all">All Ratings</MenuItem>
            <MenuItem value="5">5 Stars</MenuItem>
            <MenuItem value="4">4 Stars</MenuItem>
            <MenuItem value="3">3 Stars</MenuItem>
            <MenuItem value="2">2 Stars</MenuItem>
            <MenuItem value="1">1 Star</MenuItem>
          </Select>
        </FormControl>
        
        {/* Country filter */}
        <FormControl size="small" sx={{ minWidth: '180px' }}>
          <InputLabel id="country-filter-label">Country</InputLabel>
          <Select
            labelId="country-filter-label"
            value={filterCountry}
            label="Country"
            onChange={(e) => {
              setFilterCountry(e.target.value);
              setPage(0);
            }}
          >
            <MenuItem value="all">All Countries</MenuItem>
            {countries.map(country => (
              <MenuItem key={country} value={country}>{country}</MenuItem>
            ))}
          </Select>
        </FormControl>
        
        {/* Trip type filter */}
        <FormControl size="small" sx={{ minWidth: '150px' }}>
          <InputLabel id="trip-type-filter-label">Trip Type</InputLabel>
          <Select
            labelId="trip-type-filter-label"
            value={filterTripType}
            label="Trip Type"
            onChange={(e) => {
              setFilterTripType(e.target.value);
              setPage(0);
            }}
          >
            <MenuItem value="all">All Trip Types</MenuItem>
            {tripTypes.map(type => (
              <MenuItem key={type} value={type}>{type}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      
      {/* Results count */}
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Showing {filteredReviews.length} of {reviews.length} reviews
      </Typography>
      
      {/* Reviews table */}
      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Reviewer</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Sentiment</TableCell>
              <TableCell>Trip Type</TableCell>
              <TableCell>Review</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredReviews
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map(review => (
                <TableRow key={review.id} hover>
                  <TableCell>{formatDate(review.date)}</TableCell>
                  <TableCell>
                    <Typography variant="body2">{review.reviewer}</Typography>
                    <Typography variant="caption" color="text.secondary">{review.country}</Typography>
                  </TableCell>
                  <TableCell>
                    <Rating value={review.rating} readOnly size="small" />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {getSentimentIcon(review.overallSentiment)}
                      <Typography variant="body2">{review.overallSentiment}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={review.tripType}
                      size="small"
                      color={
                        review.tripType === 'Couple' ? 'secondary' :
                        review.tripType === 'Family' ? 'success' :
                        review.tripType === 'Business' ? 'info' :
                        review.tripType === 'Solo' ? 'warning' : 'default'
                      }
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '400px'
                      }}
                    >
                      {review.reviewText}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            {filteredReviews.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="body1" sx={{ py: 3 }}>
                    No reviews match the current filters
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={filteredReviews.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
};

export default ReviewsList;