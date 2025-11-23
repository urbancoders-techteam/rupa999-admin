import React, { useEffect } from 'react';
import { Grid, Button, TextField, Autocomplete } from '@mui/material';
import PropTypes from 'prop-types';
import { useForm, Controller, FormProvider } from 'react-hook-form';

PanaChartToolBar.propTypes = {
  handleDrawerClose: PropTypes.func,
  selectedGame: PropTypes.string,
  onGameChange: PropTypes.func,
};

export default function PanaChartToolBar({ handleDrawerClose, selectedGame = 'Jodi', onGameChange }) {
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
        <Grid container spacing={2} alignItems="center" sx={{ width: '100%' }}>
        

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
                  renderInput={(params) => <TextField {...params} label="Market Types" fullWidth />}
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
                    <TextField {...params} label="Choose Markets" fullWidth />
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
                  renderInput={(params) => <TextField {...params} label="Select Game" fullWidth />}
                />
              )}
            />
          </Grid>

          {/* <Grid item xs={12} sm={6} md={3} lg={3}>
            <RHFDatePicker
              size="small"
              format="DD/MM/YYYY"
              name="date"
              label="Select Date"
              fullWidth
            />
          </Grid> */}

          <Grid item xs={12} sm={12} md={2} lg={2}>
            <Button 
              fullWidth 
              variant="contained" 
              type="submit"
              sx={{ height: '40px' }}
            >
              Submit
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
