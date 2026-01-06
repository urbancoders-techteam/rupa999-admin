import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { alpha, Autocomplete, Button, Grid, TextField, useTheme } from '@mui/material';
import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { getAllMarketsAsync } from '../../../redux/services/market_services';

PanaChartToolBar.propTypes = {
  handleDrawerClose: PropTypes.func,
  selectedMarketType: PropTypes.string,
  onMarketTypeChange: PropTypes.func,
  selectedGame: PropTypes.string,
  onGameChange: PropTypes.func,
  selectedMarket: PropTypes.object,
  onMarketChange: PropTypes.func,
};

export default function PanaChartToolBar({
  handleDrawerClose,
  selectedMarketType = 'Main Market',
  onMarketTypeChange,
  selectedGame = 'Single Pana',
  onGameChange,
  selectedMarket = null,
  onMarketChange,
}) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { marketList } = useSelector((state) => state.market);

  const methods = useForm({
    defaultValues: {
      game: selectedGame,
      marketType: selectedMarketType || 'Main Market',
      market: selectedMarket,
      date: null,
    },
  });

  const { handleSubmit, control, setValue, watch, reset } = methods;
  
  // Watch all form values to detect changes
  const watchedValues = watch();
  const watchedMarketType = watch('marketType');

  // Track applied values (values that were last submitted)
  const [appliedValues, setAppliedValues] = useState({
    game: selectedGame,
    marketType: selectedMarketType || 'Main Market',
    market: selectedMarket,
    date: null,
  });

  // Default values for reset
  const defaultValues = {
    game: 'Single Pana',
    marketType: 'Main Market',
    market: null,
    date: null,
  };

  // Check if current form values differ from applied values
  const hasFiltersApplied = useMemo(() => {
    const currentMarketId = watchedValues.market?._id || watchedValues.market?.id || null;
    const appliedMarketId = appliedValues.market?._id || appliedValues.market?.id || null;
    
    return (
      watchedValues.marketType !== appliedValues.marketType ||
      watchedValues.game !== appliedValues.game ||
      currentMarketId !== appliedMarketId
    );
  }, [watchedValues, appliedValues]);

  // Fetch markets on mount
  useEffect(() => {
    dispatch(getAllMarketsAsync({ page: 1, limit: 1000 }));
  }, [dispatch]);

  // Initialize form with selected values only on mount
  useEffect(() => {
    setValue('game', selectedGame);
    setValue('market', selectedMarket);
    setValue('marketType', selectedMarketType);
    // Initialize applied values only once on mount
    setAppliedValues({
      game: selectedGame,
      marketType: selectedMarketType || 'Main Market',
      market: selectedMarket,
      date: null,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  // Filter markets based on market type
  // Note: Since markets don't have an explicit type field, we'll show all markets for now
  // You may need to add a filter based on your business logic (e.g., naming convention or separate API)
  const filteredMarkets = useMemo(() => marketList || [], [marketList]);

  const onSubmit = (data) => {
    // Store applied values
    setAppliedValues({
      game: data.game,
      marketType: data.marketType,
      market: data.market,
      date: data.date,
    });
    // Only update parent state when Apply Filters is clicked
    if (onMarketTypeChange && data.marketType) {
      onMarketTypeChange(data.marketType);
    }
    if (onGameChange && data.game) {
      onGameChange(data.game);
    }
    if (onMarketChange) {
      onMarketChange(data.market);
    }
    if (handleDrawerClose) handleDrawerClose();
  };

  const handleClearFilters = () => {
    // Reset form to default values
    reset(defaultValues);
    // Update applied values to defaults
    setAppliedValues(defaultValues);
    // Update parent state with default values (this will trigger API calls)
    if (onMarketTypeChange) {
      onMarketTypeChange(defaultValues.marketType);
    }
    if (onGameChange) {
      onGameChange(defaultValues.game);
    }
    if (onMarketChange) {
      onMarketChange(defaultValues.market);
    }
  };


  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
        <Grid container spacing={2} alignItems="flex-end" sx={{ width: '100%' }}>
          <Grid item xs={12} sm={6} md={3} lg={3}>
            <Controller
              name="marketType"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  size="small"
                  fullWidth
                  options={['Main Market', 'Starline Market']}
                  value={field.value || ''}
                  onChange={(_, newValue) => {
                    field.onChange(newValue);
                    // Reset market when market type changes (only in form, not parent state)
                    setValue('market', null);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Market Types *"
                      fullWidth
                      required
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: alpha(theme.palette.background.paper, 0.8),
                          '&:hover': {
                            backgroundColor: theme.palette.background.paper,
                          },
                        },
                      }}
                    />
                  )}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={3} lg={3}>
            <Controller
              name="market"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  size="small"
                  fullWidth
                  disabled={!watchedMarketType}
                  options={filteredMarkets}
                  getOptionLabel={(option) => (typeof option === 'string' ? option : option?.name || '')}
                  isOptionEqualToValue={(option, value) => {
                    if (!option || !value) return false;
                    const optionId = typeof option === 'string' ? option : option._id || option.id;
                    const valueId = typeof value === 'string' ? value : value._id || value.id;
                    return optionId === valueId;
                  }}
                  value={field.value || null}
                  onChange={(_, newValue) => {
                    field.onChange(newValue);
                    // Don't update parent state immediately - wait for Apply Filters
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={watchedMarketType ? "Choose Markets" : "Select Market Type First"}
                      fullWidth
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: alpha(theme.palette.background.paper, 0.8),
                          '&:hover': {
                            backgroundColor: theme.palette.background.paper,
                          },
                        },
                      }}
                    />
                  )}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3} lg={3}>
            <Controller
              name="game"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  size="small"
                  fullWidth
                  options={['Jodi', 'Single Pana']}
                  value={field.value || selectedGame || 'Single Pana'}
                  onChange={(_, newValue) => {
                    const gameValue = newValue || 'Single Pana';
                    field.onChange(gameValue);
                    // Don't update parent state immediately - wait for Apply Filters
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Game"
                      fullWidth
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: alpha(theme.palette.background.paper, 0.8),
                          '&:hover': {
                            backgroundColor: theme.palette.background.paper,
                          },
                        },
                      }}
                    />
                  )}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={1.8} lg={1.8}>
            <Button
              fullWidth
              variant="contained"
              type="submit"
              startIcon={<SearchIcon />}
              sx={{
                height: '40px',
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: theme.customShadows?.z8 || theme.shadows[4],
                '&:hover': {
                  boxShadow: theme.customShadows?.z12 || theme.shadows[8],
                  transform: 'translateY(-1px)',
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
             Submit
            </Button>
          </Grid>

          {/* {hasFiltersApplied && ( */}
            <Grid item xs={12} sm={6} md={1.2} lg={1.2}>
              <Button
                fullWidth
                variant="outlined"
                onClick={handleClearFilters}
                startIcon={<ClearIcon />}
                sx={{
                  height: '40px',
                  fontWeight: 600,
                  textTransform: 'none',
                  borderColor: alpha(theme.palette.error.main, 0.5),
                  color: 'error.main',
                  '&:hover': {
                    borderColor: 'error.main',
                    backgroundColor: alpha(theme.palette.error.main, 0.08),
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                Clear
              </Button>
            </Grid>
          {/* // )} */}
        </Grid>
      </form>
    </FormProvider>
  );
}

