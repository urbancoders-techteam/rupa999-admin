import React, { useState } from 'react';
import { Box, Card, Grid, Button, Typography, TextField, Autocomplete } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { marketEnum } from '../../../assets/data/marketEnum';

// ----------------------------------------------------------------------

const validationSchema = Yup.object().shape({
  date: Yup.string().required('Date is required'),
  market: Yup.string().required('Market is required'),
  session: Yup.string().required('Session is required'),
  pana: Yup.string().required('Pana is required'),
  digit: Yup.string().required('Digit is required'),
});

const sessions = ['Open', 'Close'];

GeneralCreateResultForm.propTypes = {
  setShowWinner: PropTypes.bool,
};

export default function GeneralCreateResultForm({ setShowWinner }) {
  const [percentage, setPercentage] = useState('No');

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      market: '',
      session: '',
      pana: '',
      digit: '',
    },
  });

  const onSubmit = (data) => {
    console.log({ ...data, percentage });
    alert('Form Submitted Successfully!');
  };

  return (
    <Card sx={{ p: 3, borderRadius: 2, mb: 2 }}>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
        General Create Result
      </Typography>

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Grid container spacing={2}>
          {/* Date */}
          <Grid item xs={12} md={4}>
            <Controller
              name="date"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Date"
                  type="date"
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.date}
                  helperText={errors.date?.message}
                />
              )}
            />
          </Grid>

          {/* Markets */}
          <Grid item xs={12} md={4}>
            <Controller
              name="market"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  options={marketEnum}
                  onChange={(_, value) => field.onChange(value || '')}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Markets"
                      size="small"
                      error={!!errors.market}
                      helperText={errors.market?.message}
                    />
                  )}
                />
              )}
            />
          </Grid>

          {/* Session */}
          <Grid item xs={12} md={4}>
            <Controller
              name="session"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  options={sessions}
                  onChange={(_, value) => field.onChange(value || '')}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Session"
                      size="small"
                      error={!!errors.session}
                      helperText={errors.session?.message}
                    />
                  )}
                />
              )}
            />
          </Grid>

          {/* Percentage */}
          <Grid item xs={12} md={4}>
            <Typography
              variant="body2"
              sx={{ ml: 1, mb: 1, fontWeight: 500, color: 'text.secondary' }}
            >
              Did you want to do with percentage?
            </Typography>

            <Box
              sx={{
                ml: 1,
                gap: 1,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Button
                variant={percentage === 'Yes' ? 'contained' : 'outlined'}
                color={percentage === 'Yes' ? 'success' : 'inherit'}
                onClick={() => setPercentage('Yes')}
                sx={{
                  flex: 1,
                  maxWidth: '100px',
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: 2,
                  boxShadow: percentage === 'Yes' ? '0px 2px 8px rgba(25, 135, 84, 0.4)' : 'none',
                }}
              >
                Yes
              </Button>

              <Button
                variant={percentage === 'No' ? 'contained' : 'outlined'}
                color={percentage === 'No' ? 'error' : 'inherit'}
                onClick={() => setPercentage('No')}
                sx={{
                  flex: 1,
                  maxWidth: '100px',
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: 2,
                  boxShadow: percentage === 'No' ? '0px 2px 8px rgba(220, 53, 69, 0.4)' : 'none',
                }}
              >
                No
              </Button>
            </Box>
          </Grid>

          {/* Pana */}
          {percentage === 'Yes' ? (
            <Grid item xs={12} md={4}>
              <Controller
                name="percentage"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Percentage"
                    placeholder="Enter Percentage"
                    size="small"
                    error={!!errors.percentage}
                    helperText={errors.percentage?.message}
                  />
                )}
              />
            </Grid>
          ) : (
            <>
              {' '}
              <Grid item xs={12} md={4}>
                <Controller
                  name="pana"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Pana"
                      placeholder="Enter Pana"
                      size="small"
                      error={!!errors.pana}
                      helperText={errors.pana?.message}
                    />
                  )}
                />
              </Grid>
              {/* Digit */}
              <Grid item xs={12} md={4}>
                <Controller
                  name="digit"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Digit"
                      placeholder="Enter Digit"
                      size="small"
                      error={!!errors.digit}
                      helperText={errors.digit?.message}
                      disabled={percentage === 'No'}
                    />
                  )}
                />
              </Grid>
            </>
          )}
        </Grid>

        {/* Buttons */}
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button variant="outlined" color="primary" onClick={() => setShowWinner(true)}>
            Show Winners
          </Button>
          <Button variant="contained" color="primary" type="submit">
            Save
          </Button>
        </Box>
      </Box>
    </Card>
  );
}
