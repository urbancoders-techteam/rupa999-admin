import React from 'react';
import { Grid, Button, TextField, Autocomplete } from '@mui/material';
import PropTypes from 'prop-types';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import RHFDatePicker from '../../../components/hook-form/RHFDatePicker';

PanaChartToolBar.propTypes = {
  handleDrawerClose: PropTypes.func,
};

export default function PanaChartToolBar({ handleDrawerClose }) {
  const methods = useForm({
    defaultValues: {
      marketType: '',
      market: '',
      date: null,
    },
  });

  const { handleSubmit, control } = methods;

  const onSubmit = (data) => {
    console.log('PanaChartToolBar Data:', data);
    if (handleDrawerClose) handleDrawerClose();
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2} alignItems="center" sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3.3}>
            <Controller
              name="marketType"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  size="small"
                  fullWidth
                  options={['Market', 'Starline Markets', 'Desawer Markets']}
                  value={field.value || ''}
                  onChange={(_, newValue) => field.onChange(newValue)}
                  renderInput={(params) => <TextField {...params} label="Market Types" fullWidth />}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3.7}>
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

          <Grid item xs={12} sm={6} md={3}>
            <RHFDatePicker
              size="small"
              format="DD/MM/YYYY"
              name="date"
              label="Select Date"
              fullWidth
              sx={{ mt: 2 }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <Button fullWidth variant="contained" type="submit">
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
