import SearchIcon from '@mui/icons-material/Search';
import { alpha, Autocomplete, Button, Grid, TextField, useTheme } from '@mui/material';
import PropTypes from 'prop-types';
import { useEffect, useMemo } from 'react';
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

  const { handleSubmit, control, setValue, watch } = methods;
  
  // Watch market type to filter markets
  const watchedMarketType = watch('marketType');

  // Fetch markets on mount
  useEffect(() => {
    dispatch(getAllMarketsAsync({ page: 1, limit: 1000 }));
  }, [dispatch]);

  useEffect(() => {
    setValue('game', selectedGame);
  }, [selectedGame, setValue]);

  useEffect(() => {
    setValue('market', selectedMarket);
  }, [selectedMarket, setValue]);

  useEffect(() => {
    setValue('marketType', selectedMarketType);
  }, [selectedMarketType, setValue]);

  // Filter markets based on market type
  // Note: Since markets don't have an explicit type field, we'll show all markets for now
  // You may need to add a filter based on your business logic (e.g., naming convention or separate API)
  const filteredMarkets = useMemo(() => marketList || [], [marketList]);

  // Auto-select first market when markets are loaded and market type is selected
  useEffect(() => {
    if (
      watchedMarketType &&
      filteredMarkets.length > 0 &&
      !selectedMarket &&
      onMarketChange
    ) {
      const firstMarket = filteredMarkets[0];
      setValue('market', firstMarket);
      onMarketChange(firstMarket);
    }
  }, [filteredMarkets, watchedMarketType, selectedMarket, setValue, onMarketChange]);

  const onSubmit = (data) => {
    console.log('PanaChartToolBar Data:', data);
    if (onMarketTypeChange && data.marketType) {
      onMarketTypeChange(data.marketType);
    }
    if (onMarketChange && data.market) {
      onMarketChange(data.market);
    }
    if (handleDrawerClose) handleDrawerClose();
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
                    if (onMarketTypeChange) {
                      onMarketTypeChange(newValue || '');
                    }
                    // Reset market when market type changes, then auto-select first market
                    setValue('market', null);
                    if (onMarketChange) {
                      onMarketChange(null);
                    }
                    // Auto-select first market after a short delay to ensure markets are available
                    setTimeout(() => {
                      if (newValue && filteredMarkets.length > 0 && onMarketChange) {
                        const firstMarket = filteredMarkets[0];
                        setValue('market', firstMarket);
                        onMarketChange(firstMarket);
                      }
                    }, 100);
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
                    if (onMarketChange && newValue) {
                      onMarketChange(newValue);
                    }
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
                    if (onGameChange) onGameChange(gameValue);
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

          <Grid item xs={12} sm={12} md={3} lg={3}>
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
              Apply Filters
            </Button>
          </Grid>
        </Grid>
      </form>
    </FormProvider>
  );
}

