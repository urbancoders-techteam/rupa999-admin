import { Autocomplete, Box, Button, Grid, MenuItem, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { _ecommerceSalesOverview } from '../../_mock/arrays';
import DonutChart from '../../components/graph/DonutChart';
import HorizontalProgressGraph from '../../components/graph/HorizontalProgressGraph';
import YearlySalesGraph from '../../components/graph/YearlySalesGraph';
import { getProfitBidsAsync, getYearlyProfitBidsAsync } from '../../redux/services/bid_services';
import { getAllMarketsAsync } from '../../redux/services/market_services';

const ProfitCheckingFilters = () => {
  const dispatch = useDispatch();
  const [dropdownValue, setDropdownValue] = useState('Main Market');
  const [subMenuValue, setSubMenuValue] = useState('');
  const [selectedTimePeriod, setSelectedTimePeriod] = useState('allyear');

  const { profitBidsList, yearlyProfitBidsList, loading } = useSelector((state) => state.bid);


  // Time period options
  const timePeriodOptions = [
    { value: 'allyear', label: 'All' },
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'lastweek', label: 'Last Week' },
    { value: 'lastmonth', label: 'Last Month' },
  ];

  const { marketList } = useSelector((state) => state.market);

  const marketListData = React.useMemo(() => {
    if (!marketList || !Array.isArray(marketList) || marketList.length === 0) {
      return [];
    }
    return marketList
      .filter((market) => market && (market.name || market._id))
      .map((market) => {
        // Handle both _id (ObjectId) and id (string) formats
        let marketId = '';
        if (market._id) {
          marketId = typeof market._id === 'string' ? market._id : market._id.toString();
        } else {
          marketId = market.id || '';
        }

        return {
          name: market.name || 'Unnamed Market',
          id: marketId,
        };
      });
  }, [marketList]);

  // Transform profitBidsList data for HorizontalProgressGraph
  const profitProgressData = React.useMemo(() => {
    if (!profitBidsList || (typeof profitBidsList === 'object' && Object.keys(profitBidsList).length === 0)) {
      return [];
    }

    // Handle both object and array formats
    const { totalAmount = 0, winAmount = 0, profits = 0 } = profitBidsList || {};

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

  // Fetch markets on mount
  useEffect(() => {
    dispatch(
      getAllMarketsAsync({
        page: 1, // API uses 1-based pagination
        limit: 100,
      })
    );
  }, [dispatch]);

  // Fetch profit data on mount with default values
  useEffect(() => {
    const defaultParams = {
      period: 'allyear', // Use default value directly instead of state
    };

    // Call profit bids API with default period
    dispatch(getProfitBidsAsync(defaultParams));

    // Call yearly profit bids API
    dispatch(getYearlyProfitBidsAsync());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const handleTimePeriodChange = (event) => {
    setSelectedTimePeriod(event.target.value);
  };

  const handleSubmit = () => {
    // Prepare API parameters for profit bids
    const profitParams = {
      period: selectedTimePeriod || 'allyear',
    };

    // Add market ID if a market is selected
    if (subMenuValue && subMenuValue.id) {
      // Ensure marketId is a string
      const marketIdStr = typeof subMenuValue.id === 'string'
        ? subMenuValue.id
        : subMenuValue.id.toString();
      profitParams.marketId = marketIdStr;
      console.log('Submitting with marketId:', marketIdStr, 'Type:', typeof marketIdStr);
    } else {
      console.log('No market selected');
    }

    console.log('Profit params:', profitParams);

    // Prepare API parameters for yearly profit bids
    const yearlyParams = {};
    if (subMenuValue && subMenuValue.id) {
      yearlyParams.marketId = subMenuValue.id;
    }

    console.log('Yearly params:', yearlyParams);

    // Call profit bids API
    dispatch(getProfitBidsAsync(profitParams));

    // Call yearly profit bids API with filters
    dispatch(getYearlyProfitBidsAsync(yearlyParams));
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
              options={['Main Market', 'Starline Markets']}
              value={dropdownValue}
              onChange={(_, newValue) => setDropdownValue(newValue)}
              renderInput={(params) => <TextField {...params} label="Market Types" fullWidth />}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Autocomplete
              size="small"
              fullWidth
              options={marketListData}
              value={subMenuValue || null}
              onChange={(_, newValue) => setSubMenuValue(newValue || '')}
              getOptionLabel={(option) => {
                if (typeof option === 'string') return option;
                return option?.name || '';
              }}
              isOptionEqualToValue={(option, value) => {
                if (!option || !value) return false;
                return option?.id === value?.id;
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Choose Markets"
                  fullWidth
                  placeholder={marketListData.length === 0 ? 'No markets available' : 'Select a market'}
                />
              )}
              noOptionsText="No markets available"
              disabled={marketListData.length === 0}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              select
              fullWidth
              size="small"
              label="Time period filter"
              value={selectedTimePeriod || 'allyear'}
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
              onClick={handleSubmit}
              disabled={loading}
              sx={{
                background: 'linear-gradient(135deg, #4f46e5, #6366f1)',
                color: '#fff',
                fontWeight: 600,
                py: 1.1,
                '&:hover': {
                  background: 'linear-gradient(135deg, #4338ca, #4f46e5)',
                },
                '&:disabled': {
                  background: 'rgba(0, 0, 0, 0.12)',
                  color: 'rgba(0, 0, 0, 0.26)',
                },
              }}
            >
              {loading ? 'Loading...' : 'Submit'}
            </Button>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={6}>
            <HorizontalProgressGraph
              title="Profit Progress"
              data={profitProgressData.length > 0 ? profitProgressData : _ecommerceSalesOverview}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <DonutChart
              title="Profit Chart"
              total={profitBidsList?.totalAmount || 0}
              chart={{
                series: (() => {
                  const totalAmount = profitBidsList?.totalAmount || 0;
                  const winAmount = profitBidsList?.winAmount || 0;
                  const profits = profitBidsList?.profits || 0;

                  // Calculate percentages based on Total Amount (100% base)
                  const winPercent = totalAmount > 0 ? (Math.abs(winAmount) / totalAmount) * 100 : 0;
                  const profitPercent = totalAmount > 0 ? (Math.abs(profits) / totalAmount) * 100 : 0;

                  return [
                    { label: `Total Amount (100%)`, value: 100 },
                    { label: `Total Win Amount (${winPercent.toFixed(1)}%)`, value: winPercent },
                    { label: `Profit (${profitPercent.toFixed(1)}%)`, value: profitPercent },
                  ];
                })(),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={12}>
            <YearlySalesGraph
              title="Yearly Profit Graph"
              subheader="Monthly profit breakdown"
              chart={{
                categories: yearlyProfitBidsList?.categories || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                series: yearlyProfitBidsList?.series || [],
              }}
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default ProfitCheckingFilters;