import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Grid, Button, TextField, Autocomplete, MenuItem } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { getProfitBidsAsync } from '../../redux/services/bid_services';
import YearlySalesGraph from '../../components/graph/YearlySalesGraph';
import { getAllMarketsAsync } from '../../redux/services/market_services';
import DonutChart from '../../components/graph/DonutChart';
import HorizontalProgressGraph from '../../components/graph/HorizontalProgressGraph';
import { _ecommerceSalesOverview } from '../../_mock/arrays';

const ProfitCheckingFilters = () => {
  const dispatch = useDispatch();
  const [startDate, setStartDate] = useState(new Date());
  const [dropdownValue, setDropdownValue] = useState('');
  const [subMenuValue, setSubMenuValue] = useState('');
  const [selectedTimePeriod, setSelectedTimePeriod] = useState('');
  console.log('subMenuValue', subMenuValue);
  
  const { profitBidsList } = useSelector((state) => state.bid);

  // Time period options
  const timePeriodOptions = [
    { value: 'today', label: 'today' },
    { value: 'lastweek', label: 'lastweek' },
    { value: 'lastmonth', label: 'lastmonth' },
    { value: 'allyear', label: 'allyear' },
  ];

  const onChangeStartDate = (newValue) => {
    setStartDate(newValue);
  };

  const { marketList } = useSelector((state) => state.market);

  const marketListData = marketList.map((market) => ({ name: market.name, id: market._id }));

  // Transform profitBidsList data for HorizontalProgressGraph
  const profitProgressData = React.useMemo(() => {
    if (!profitBidsList || Object.keys(profitBidsList).length === 0) {
      return [];
    }

    const { totalAmount = 0, winAmount = 0, profits = 0 } = profitBidsList;
    
    // Calculate the maximum value for percentage calculation
    const maxValue = Math.max(totalAmount, winAmount, Math.abs(profits));
    
    return [
      {
        label: 'Total Amount',
        amount: totalAmount,
        value: maxValue > 0 ? (totalAmount / maxValue) * 100 : 0,
      },
      {
        label: 'Total Win Amount',
        amount: winAmount,
        value: maxValue > 0 ? (winAmount / maxValue) * 100 : 0,
      },
      {
        label: 'Profit',
        amount: profits,
        value: maxValue > 0 ? (Math.abs(profits) / maxValue) * 100 : 0,
      },
    ];
  }, [profitBidsList]);

  useEffect(() => {
    dispatch(
      getAllMarketsAsync({
        page: 1, // API uses 1-based pagination
        limit: 100,
      })
    );
    dispatch(getProfitBidsAsync({ period: selectedTimePeriod || 'today' }));
  }, [dispatch, selectedTimePeriod]);

  const handleTimePeriodChange = (event) => {
    setSelectedTimePeriod(event.target.value);
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
          <Grid item xs={12} sm={6} md={2}>
            <Autocomplete
              size="small"
              fullWidth
              options={['Market', 'Starline Markets']}
              value={dropdownValue}
              onChange={(_, newValue) => setDropdownValue(newValue)}
              renderInput={(params) => <TextField {...params} label="Market Types" fullWidth />}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Autocomplete
              size="small"
              fullWidth
              options={marketListData}
              value={subMenuValue}
              onChange={(_, newValue) => setSubMenuValue(newValue)}
              getOptionLabel={(option) => option?.name || ''}
              isOptionEqualToValue={(option, value) => option?.id === value?.id}
              renderInput={(params) => <TextField {...params} label="Choose Markets" fullWidth />}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <DatePicker
              size="small"
              label="Start date"
              format="DD/MM/YYYY"
              value={startDate}
              onChange={onChangeStartDate}
              renderInput={(params) => <TextField size="small" {...params} />}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <TextField
              select
              fullWidth
              size="small"
              label="Time period filter"
              value={selectedTimePeriod || ''}
              onChange={handleTimePeriodChange}
              SelectProps={{
                MenuProps: {
                  PaperProps: {
                    sx: { 
                      maxHeight: { xs: 200, sm: 260 },
                      '& .MuiMenuItem-root': {
                        fontSize: { xs: '0.875rem', sm: '1rem' },
                      },
                    },
                  },
                },
              }}
              sx={{
                '& .MuiInputBase-root': {
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                },
              }}
            >
              <MenuItem value="">
                <em>--</em>
              </MenuItem>
              {timePeriodOptions.map((option) => (
                <MenuItem
                  key={option.value}
                  value={option.value}
                  sx={{
                    mx: 1,
                    borderRadius: 0.75,
                    typography: 'body2',
                    textTransform: 'capitalize',
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                  }}
                >
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
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
            <HorizontalProgressGraph 
              title="Profit Progress" 
              data={ profitProgressData.length > 0 ? profitProgressData : _ecommerceSalesOverview} 
            />
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
              total={profitBidsList.totalAmount}
              chart={{
                series: [
                  { label: 'Total Amount', value:profitBidsList.totalAmount || 0},
                  { label: 'Total Win Amount', value: profitBidsList.winAmount || 0 },
                  { label: 'Profit', value: profitBidsList.profits || 0 },
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