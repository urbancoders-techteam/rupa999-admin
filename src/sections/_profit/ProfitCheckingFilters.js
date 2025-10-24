import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  TextField,
  Divider,
  Paper,
} from '@mui/material';
import { styled } from '@mui/material/styles';
// import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

// ✅ Styled Components
const GlassCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.25)',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.2)',
  backdropFilter: 'blur(8px)',
  borderRadius: '20px',
  border: '1px solid rgba(255, 255, 255, 0.18)',
  color: '#1e293b',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
}));

const ProfitCheckingFilters = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [dropdownValue, setDropdownValue] = useState('');

  const onChangeStartDate = (newValue) => {
    setStartDate(newValue);
    console.log('newValue :>> ', newValue);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '90vh',
        background: 'linear-gradient(135deg, #eef2ff, #f8fafc)',
        p: { xs: 2, sm: 3, md: 5 },
      }}
    >
      {/* RIGHT SIDE CONTENT */}
      <Box sx={{ flex: 1 }}>
        <GlassCard sx={{ p: 4 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              mb: 3,
              color: '#1e293b',
              textAlign: 'center',
            }}
          >
            Profit Dashboard
          </Typography>

          {/* FILTER BAR */}
          <Grid container spacing={2} alignItems="center" sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Market Types</InputLabel>
                <Select
                  value={dropdownValue}
                  label="Market Types"
                  onChange={(e) => setDropdownValue(e.target.value)}
                >
                  <MenuItem value="">Select Filter</MenuItem>
                  <MenuItem value="Option1">Option 1</MenuItem>
                  <MenuItem value="Option2">Option 2</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Choose Markets</InputLabel>
                <Select
                  value={dropdownValue}
                  label="Choose Markets"
                  onChange={(e) => setDropdownValue(e.target.value)}
                >
                  <MenuItem value="">Select Data</MenuItem>
                  <MenuItem value="Data1">Data 1</MenuItem>
                  <MenuItem value="Data2">Data 2</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <DatePicker
                size="small"
                label="Start date"
                format="DD/MM/YYYY"
                value={startDate}
                onChange={onChangeStartDate}
                renderInput={(params) => <TextField {...params} />}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <Button
                fullWidth
                variant="contained"
                sx={{
                  background: 'linear-gradient(135deg, #4f46e5, #6366f1)',
                  color: '#fff',
                  fontWeight: 600,
                  py: 1.1,
                  borderRadius: 2,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #4338ca, #4f46e5)',
                  },
                }}
              >
                Submit
              </Button>
            </Grid>
          </Grid>

          <Divider sx={{ mb: 4 }} />

          {/* SUMMARY CARDS */}
          <Grid container spacing={3}>
            {[
              { title: 'Total Amount', value: 5000 },
              { title: 'Total Win Amt', value: 5000 },
              { title: 'Profit', value: 1500 },
            ].map((item, idx) => (
              <Grid item xs={12} sm={6} md={4} key={idx}>
                <Card
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, #e0e7ff, #eef2ff, #c7d2fe)',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.08)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 6px 18px rgba(0,0,0,0.12)',
                    },
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#4338ca' }}>
                    {item.title}
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, mt: 1, color: '#1e293b' }}>
                    {item.value}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </GlassCard>
      </Box>
    </Box>
  );
};

export default ProfitCheckingFilters;
