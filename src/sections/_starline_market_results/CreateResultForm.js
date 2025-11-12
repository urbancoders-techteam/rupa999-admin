import React from 'react';
import { Box, Card, Grid, Button, Typography } from '@mui/material';
import { useForm, FormProvider, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { RHFTextField, RHFAutocomplete } from '../../components/hook-form'; // <-- update this import path
import { marketEnum } from '../../assets/data/marketEnum';
import RHFDatePicker from '../../components/hook-form/RHFDatePicker';

// ----------------------------------------------------------------------

const validationSchema = Yup.object({
  date: Yup.string().required('Date is required'),
  market: Yup.string().required('Market is required'),
  session: Yup.string().required('Session is required'),

  // drives conditional UI/validation
  usePercentage: Yup.boolean().required(),

  // conditional fields
  percentage: Yup.string().when('usePercentage', {
    is: true,
    then: (s) => s.required('Percentage is required'),
    otherwise: (s) => s.notRequired(),
  }),
  pana: Yup.string().when('usePercentage', {
    is: false,
    then: (s) => s.required('Pana is required'),
    otherwise: (s) => s.notRequired(),
  }),
  digit: Yup.string().when('usePercentage', {
    is: false,
    then: (s) => s.required('Digit is required'),
    otherwise: (s) => s.notRequired(),
  }),
});

export default function CreateResultForm() {
  const methods = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      market: '',
      session: '',
      usePercentage: false, // false = "No", true = "Yes"
      percentage: '',
      pana: '',
      digit: '',
    },
    mode: 'onSubmit',
  });

  const { handleSubmit, setValue, control } = methods;

  // React Hook Form-aware watch (do NOT use useState for this toggle)
  const usePercentage = useWatch({ control, name: 'usePercentage' });

  const onSubmit = (data) => {
    // you asked to "handle this form using react-hook-form", so we submit RHF data directly
    console.log(data);
    alert('Form Submitted Successfully!');
  };

  return (
    <Card sx={{ p: 3, borderRadius: 2, mb: 2 }}>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
        General Create Result
      </Typography>

      <FormProvider {...methods}>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Grid container spacing={2}>
            {/* Date */}
            <Grid item xs={12} sm={6}>
              <RHFDatePicker
                name="date"
                label="Date"
                type="date"
                size="small"
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Grid>

            {/* Markets */}
            <Grid item xs={12} sm={6}>
              <RHFAutocomplete
                name="market"
                label="Markets"
                size="small"
                fullWidth
                options={marketEnum}
                // optional helpers to keep Autocomplete happy with strings
                getOptionLabel={(opt) => (typeof opt === 'string' ? opt : '')}
                isOptionEqualToValue={(opt, val) => opt === val}
              />
            </Grid>

            {/* Percentage toggle */}
            <Grid item xs={12} sm={12}>
              <Typography
                variant="body2"
                sx={{ ml: 1, mb: 1, fontWeight: 500, color: 'text.secondary' }}
              >
                Did you want to do with percentage?
              </Typography>

              <Box sx={{ ml: 1, gap: 1, display: 'flex', alignItems: 'center' }}>
                <Button
                  variant={usePercentage ? 'contained' : 'outlined'}
                  color={usePercentage ? 'success' : 'inherit'}
                  onClick={() => setValue('usePercentage', true, { shouldValidate: true })}
                  sx={{
                    flex: 1,
                    maxWidth: '120px',
                    textTransform: 'none',
                    fontWeight: 600,
                    borderRadius: 2,
                    boxShadow: usePercentage ? '0px 2px 8px rgba(25, 135, 84, 0.4)' : 'none',
                  }}
                >
                  Yes
                </Button>

                <Button
                  variant={!usePercentage ? 'contained' : 'outlined'}
                  color={!usePercentage ? 'error' : 'inherit'}
                  onClick={() => setValue('usePercentage', false, { shouldValidate: true })}
                  sx={{
                    flex: 1,
                    maxWidth: '120px',
                    textTransform: 'none',
                    fontWeight: 600,
                    borderRadius: 2,
                    boxShadow: !usePercentage ? '0px 2px 8px rgba(220, 53, 69, 0.4)' : 'none',
                  }}
                >
                  No
                </Button>
              </Box>
            </Grid>

            {/* Conditional fields */}
            {usePercentage ? (
              <Grid item xs={12} sm={6}>
                <RHFTextField
                  name="percentage"
                  label="Percentage"
                  placeholder="Enter Percentage"
                  size="small"
                  fullWidth
                />
              </Grid>
            ) : (
              <>
                <Grid item xs={12} sm={6}>
                  <RHFTextField
                    name="pana"
                    label="Pana"
                    placeholder="Enter Pana"
                    size="small"
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <RHFTextField
                    name="digit"
                    label="Digit"
                    placeholder="Enter Digit"
                    size="small"
                    fullWidth
                  />
                </Grid>
              </>
            )}
          </Grid>

          {/* Buttons */}
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button variant="contained" color="primary" type="submit">
              Save
            </Button>
          </Box>
        </Box>
      </FormProvider>
    </Card>
  );
}
