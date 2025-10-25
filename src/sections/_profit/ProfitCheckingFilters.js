import React, { useState } from 'react';
import { Box, Grid, Button, TextField, Autocomplete } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import YearlySalesGraph from '../../components/graph/YearlySalesGraph';
import DonutChart from '../../components/graph/DonutChart';
import HorizontalProgressGraph from '../../components/graph/HorizontalProgressGraph';
import { _ecommerceSalesOverview } from '../../_mock/arrays';

const ProfitCheckingFilters = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [dropdownValue, setDropdownValue] = useState('');
  const [subMenuValue, setSubMenuValue] = useState('');

  const onChangeStartDate = (newValue) => {
    setStartDate(newValue);
  };

  return (
    <Box
      sx={{
        display: 'flex',
      }}
    >
      {/* RIGHT SIDE CONTENT */}
      <Box sx={{ flex: 1 }}>

        {/* FILTER BAR */}
        <Grid container spacing={2} alignItems="center" sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Autocomplete
              size="small"
              fullWidth
              options={['Market', 'Starline Markets', 'Desawer Markets']}
              value={dropdownValue}
              onChange={(_, newValue) => setDropdownValue(newValue)}
              renderInput={(params) => <TextField {...params} label="Market Types" fullWidth />}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Autocomplete
              size="small"
              fullWidth
              options={optionsData}
              value={subMenuValue}
              onChange={(_, newValue) => setSubMenuValue(newValue)}
              renderInput={(params) => <TextField {...params} label="Choose Markets" fullWidth />}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <DatePicker
              size="small"
              label="Start date"
              format="DD/MM/YYYY"
              value={startDate}
              onChange={onChangeStartDate}
              renderInput={(params) => <TextField size="small" {...params} />}
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
                '&:hover': {
                  background: 'linear-gradient(135deg, #4338ca, #4f46e5)',
                },
              }}
            >
              Submit
            </Button>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3.5}>
             <HorizontalProgressGraph title="Profit Progress" data={_ecommerceSalesOverview} />
          </Grid>
          <Grid item xs={12} md={6} lg={5}>
            <YearlySalesGraph
              title="Yearly Profit Graph"
              subheader="(+43%) than last year"
              chart={{
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
                series: [
                  {
                    year: '2024',
                    data: [
                      { name: 'Total Amount', data: [13, 41, 35, 151, 49, 62, 69, 91, 48] },
                      { name: 'Total Win Amount', data: [20, 34, 13, 56, 77, 88, 99, 77, 45] },
                      { name: 'Profit', data: [49, 44, 23, 36, 17, 68, 59, 47, 95] },
                    ],
                  },
                  {
                    year: '2025',
                    data: [
                      { name: 'Total Amount', data: [148, 91, 69, 62, 49, 51, 35, 41, 10] },
                      { name: 'Total Win Amount', data: [45, 77, 99, 88, 77, 56, 13, 34, 10] },
                      { name: 'Profit', data: [49, 44, 23, 36, 17, 68, 59, 47, 85] },
                    ],
                  },
                ],
              }}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3.5}>
            <DonutChart
              title="Profit Chart"
              total={2324}
              chart={{
                series: [
                  { label: 'Total Amount', value: 44 },
                  { label: 'Total Profit', value: 75 },
                  { label: 'Profit', value: 75 },
                ],
              }}
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default ProfitCheckingFilters;

const optionsData = [
  'SRIDEVI DAY',
  'TIME BAZAR',
  'MADHUR DAY',
  'MILAN DAY',
  'RAJDHANI DAY',
  'SUPREME DAY',
  'KALIYAN',
  'SRIDEVI NIGHT',
  'MADHUR NIGHT',
  'MILAN NIGHT',
  'KALIYAN NIGHT',
  'MAIN BAZAR',
  'RAJDHANI NIGHT',
  'KARNATAKA DAY',
  'KARNATAKA NIGHT',
];
