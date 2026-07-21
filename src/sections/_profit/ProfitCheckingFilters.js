import { Autocomplete, Box, Button, Grid, MenuItem, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { _ecommerceSalesOverview } from '../../_mock/arrays';
import DonutChart from '../../components/graph/DonutChart';
import HorizontalProgressGraph from '../../components/graph/HorizontalProgressGraph';
import YearlySalesGraph from '../../components/graph/YearlySalesGraph';
import { getProfitBidsAsync, getYearlyProfitBidsAsync } from '../../redux/services/bid_services';
import { getAllMarketsAsync } from '../../redux/services/market_services';

const ALL_MARKETS_OPTION = { name: 'All', id: '' };

const ProfitCheckingFilters = () => {
  const dispatch = useDispatch();
  const [subMenuValue, setSubMenuValue] = useState(ALL_MARKETS_OPTION);
  const [selectedTimePeriod, setSelectedTimePeriod] = useState('allyear');
  const [selectedDate, setSelectedDate] = useState('');

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
      return [ALL_MARKETS_OPTION];
    }
    const markets = marketList
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
    return [ALL_MARKETS_OPTION, ...markets];
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

  const donutChartData = React.useMemo(() => {
    const toSafeNumber = (value) => {
      const parsedValue = Number(value);
      return Number.isFinite(parsedValue) ? parsedValue : 0;
    };

    const clampPercent = (value) => Math.min(Math.max(value, 0), 100);

    const totalAmount = toSafeNumber(profitBidsList?.totalAmount);
    const winAmount = toSafeNumber(profitBidsList?.winAmount);
    const profits = toSafeNumber(profitBidsList?.profits);

    // Prefer totalAmount as base; fallback keeps chart meaningful for incomplete API payloads.
    const fallbackBase = Math.max(Math.abs(totalAmount), Math.abs(winAmount), Math.abs(profits));
    const baseAmount = Math.abs(totalAmount) > 0 ? Math.abs(totalAmount) : fallbackBase;

    const totalPercent = baseAmount > 0 ? clampPercent((Math.abs(totalAmount) / baseAmount) * 100) : 0;
    const winPercent = baseAmount > 0 ? clampPercent((Math.abs(winAmount) / baseAmount) * 100) : 0;
    const profitPercent = baseAmount > 0 ? clampPercent((Math.abs(profits) / baseAmount) * 100) : 0;
    const totalMoreThanWinPercent = totalAmount > 0 ? ((totalAmount - winAmount) / totalAmount) * 100 : 0;
    const isTotalHigherThanWin = totalAmount > winAmount;

    const profitLabel = profits >= 0 ? 'Loss' : 'Profits';
    const thirdSeriesLabel = isTotalHigherThanWin
      ? `Total Amount Win Amount se ${totalMoreThanWinPercent.toFixed(1)}% jyada hai`
      : `${profitLabel} (${profitPercent.toFixed(1)})`;
    const thirdSeriesValue = isTotalHigherThanWin ? totalMoreThanWinPercent : profitPercent;

    return {
      totalAmount,
      series: [
        { label: `Total Amount (${totalAmount})`, value: totalPercent },
        { label: `Total Win Amount (${winAmount})`, value: winPercent },
   
        // Agar total amount win amount se jyada hai, toh sirf difference percent dikhao (total amount win amount se kitna jyada percent hai)
        {
          label: thirdSeriesLabel,
          value: thirdSeriesValue,
        },

      ],
    };
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

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handleSubmit = () => {
    // Prepare API parameters for profit bids
    const profitParams = {
      period: selectedTimePeriod || 'allyear',
    };

    // Specific date takes priority over the period filter on the backend
    if (selectedDate) {
      profitParams.date = selectedDate;
    }

    // Add market ID if a market is selected
    if (subMenuValue && subMenuValue.id) {
      // Ensure marketId is a string
      const marketIdStr = typeof subMenuValue.id === 'string'
        ? subMenuValue.id
        : subMenuValue.id.toString();
      profitParams.marketId = marketIdStr;
    }

    // Prepare API parameters for yearly profit bids
    const yearlyParams = {};
    if (subMenuValue && subMenuValue.id) {
      yearlyParams.marketId = subMenuValue.id;
    }
    if (selectedDate) {
      yearlyParams.date = selectedDate;
    }

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
          <Grid item xs={12} sm={6} md={4}>
            <Autocomplete
              size="small"
              fullWidth
              options={marketListData}
              value={subMenuValue || ALL_MARKETS_OPTION}
              onChange={(_, newValue) => setSubMenuValue(newValue || ALL_MARKETS_OPTION)}
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
                  placeholder="Select a market"
                />
              )}
              noOptionsText="No markets available"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <TextField
              select
              fullWidth
              size="small"
              label="Time period filter"
              value={selectedTimePeriod || 'allyear'}
              onChange={handleTimePeriodChange}
              disabled={Boolean(selectedDate)}
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

          <Grid item xs={12} sm={6} md={3}>
            <TextField
              type="date"
              fullWidth
              size="small"
              label="Date"
              value={selectedDate}
              onChange={handleDateChange}
              InputLabelProps={{ shrink: true }}
              sx={{
                '& .MuiInputBase-root': {
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                },
              }}
            />
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
              total={donutChartData.totalAmount}
              chart={{
                series: donutChartData.series,
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