import React, { useEffect } from 'react';
import { Grid, Button, TextField, Autocomplete, Box, useTheme, alpha } from '@mui/material';
import PropTypes from 'prop-types';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import SearchIcon from '@mui/icons-material/Search';

PanaChartToolBar.propTypes = {
  handleDrawerClose: PropTypes.func,
  selectedGame: PropTypes.string,
  onGameChange: PropTypes.func,
};

export default function PanaChartToolBar({ handleDrawerClose, selectedGame = 'Jodi', onGameChange }) {
  const theme = useTheme();
  const methods = useForm({
    defaultValues: {
      game: selectedGame,
      marketType: '',
      market: '',
      date: null,
    },
  });

  const { handleSubmit, control, setValue } = methods;

  useEffect(() => {
    setValue('game', selectedGame);
  }, [selectedGame, setValue]);

  const onSubmit = (data) => {
    console.log('PanaChartToolBar Data:', data);
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
                  options={['Market', 'Starline']}
                  value={field.value || ''}
                  onChange={(_, newValue) => field.onChange(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Market Types"
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
            <Controller
              name="market"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  size="small"
                  fullWidth
                  options={optionsData}
                  value={field.value || ''}
                  onChange={(_, newValue) => field.onChange(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Choose Markets"
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
                  value={field.value || selectedGame || 'Jodi'}
                  onChange={(_, newValue) => {
                    const gameValue = newValue || 'Jodi';
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
