import React from 'react';
import PropTypes from 'prop-types';
import { Box, Card, Grid, Button, Typography, TextField } from '@mui/material';
import { useForm, FormProvider, useWatch, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { RHFTextField, RHFAutocomplete } from '../../../components/hook-form'; // <-- update this import path
import { marketEnum } from '../../../assets/data/marketEnum';

// ----------------------------------------------------------------------

const sessions = ['Open', 'Close'];

// Helper function to check if digits are in non-decreasing order
// Special case: if last digit is 0, allow it even if it doesn't follow non-decreasing rule
// Also allows second digit to be 0 when last digit is 0 (e.g., 000, 100, 200, 500)
const isNonDecreasing = (value) => {
  if (!value || value.length !== 3) return true; // Allow incomplete input
  const digits = value.split('').map(Number);
  
  // Special condition: if last digit is 0, allow it (e.g., 500, 560, 050, 000, 100, 200)
  // This also allows second digit to be 0 when last digit is 0
  if (digits[2] === 0) {
    return true;
  }
  
  // Otherwise, check non-decreasing order
  return digits[0] <= digits[1] && digits[1] <= digits[2];
};

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
    then: (s) =>
      s
        .required('Pana is required')
        .matches(/^\d{3}$/, 'Pana must be exactly 3 digits')
        .test('non-decreasing', 'Digits must be in non-decreasing order (e.g., 789, 778, 056). Numbers ending in 0 are allowed (e.g., 500, 560, 050, 000, 100, 200)', isNonDecreasing),
    otherwise: (s) => s.notRequired(),
  }),
  digit: Yup.string().when('usePercentage', {
    is: false,
    then: (s) => s.required('Digit is required'),
    otherwise: (s) => s.notRequired(),
  }),
});

GeneralCreateResultForm.propTypes = {
  showWinner: PropTypes.bool,
  onHandleShowWinner: PropTypes.func,
};

export default function GeneralCreateResultForm({ showWinner, onHandleShowWinner }) {
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
  const panaValue = useWatch({ control, name: 'pana' });

  // Calculate sum of digits when pana changes
  // Show only the last digit of the sum (e.g., 789 => 7+8+9=24 => 4)
  React.useEffect(() => {
    if (panaValue && panaValue.length === 3 && /^\d{3}$/.test(panaValue)) {
      const sum = panaValue
        .split('')
        .map(Number)
        .reduce((acc, digit) => acc + digit, 0);
      // Get only the last digit of the sum
      const lastDigit = sum % 10;
      setValue('digit', lastDigit.toString(), { shouldValidate: true });
    } else if (!panaValue || panaValue.length === 0) {
      setValue('digit', '', { shouldValidate: true });
    }
  }, [panaValue, setValue]);

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
            <Grid item xs={12} md={4}>
              <RHFTextField
                name="date"
                label="Date"
                type="date"
                size="small"
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Grid>

            {/* Markets */}
            <Grid item xs={12} md={4}>
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

            {/* Session */}
            <Grid item xs={12} md={4}>
              <RHFAutocomplete
                name="session"
                label="Session"
                size="small"
                fullWidth
                options={sessions}
                getOptionLabel={(opt) => (typeof opt === 'string' ? opt : '')}
                isOptionEqualToValue={(opt, val) => opt === val}
              />
            </Grid>

            {/* Percentage toggle */}
            <Grid item xs={12} md={4}>
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
                    maxWidth: '100px',
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
                    maxWidth: '100px',
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
              <Grid item xs={12} md={4}>
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
                <Grid item xs={12} md={4}>
                  <Controller
                    name="pana"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        label="Pana"
                        placeholder="Enter Pana (3 digits)"
                        size="small"
                        fullWidth
                        error={!!error}
                        helperText={error?.message}
                        inputProps={{
                          maxLength: 3,
                          pattern: '[0-9]*',
                          inputMode: 'numeric',
                        }}
                        onChange={(e) => {
                          // Only allow numeric input, max 3 digits
                          let value = e.target.value.replace(/[^0-9]/g, '').slice(0, 3);
                          
                          // Validate non-decreasing order as user types
                          if (value.length > 0) {
                            const digits = value.split('').map(Number);
                            let validValue = digits[0].toString();
                            
                            // For second digit: must be >= first digit OR be 0 (special case when last digit is 0)
                            if (digits.length >= 2) {
                              if (digits[1] >= digits[0] || digits[1] === 0) {
                                validValue += digits[1].toString();
                              } else {
                                // Reject if second digit is less than first and not 0
                                validValue = digits[0].toString();
                              }
                            }
                            
                            // For third digit: must be >= second digit OR be 0 (special case)
                            // If second digit is 0, only allow 0 as third digit (e.g., 000, 100, 200, 500)
                            // If second digit is not 0, allow 0 or >= second digit (e.g., 050, 560, 789)
                            if (digits.length === 3 && validValue.length === 2) {
                              const secondDigit = Number(validValue[1]);
                              if (secondDigit === 0) {
                                // If second digit is 0, only allow 0 as third digit
                                if (digits[2] === 0) {
                                  validValue += digits[2].toString();
                                }
                              } else {
                                // If second digit is not 0, allow 0 or >= second digit
                                if (digits[2] >= digits[1] || digits[2] === 0) {
                                  validValue += digits[2].toString();
                                }
                              }
                              // If third digit is less than second and not 0, don't add it
                            }
                            
                            value = validValue;
                          }
                          
                          field.onChange(value);
                        }}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <RHFTextField
                    name="digit"
                    label="Digit"
                    placeholder="Auto-calculated"
                    size="small"
                    fullWidth
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
              </>
            )}
          </Grid>

          {/* Buttons */}
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button variant="outlined" color="primary" onClick={() => onHandleShowWinner()}>
              {showWinner ? 'Hide Winners' : 'Show Winners'}
            </Button>
            <Button variant="contained" color="primary" type="submit">
              Save
            </Button>
          </Box>
        </Box>
      </FormProvider>
    </Card>
  );
}
