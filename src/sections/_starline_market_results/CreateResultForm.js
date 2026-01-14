import React, { useCallback, useEffect, useMemo } from 'react';
import { Box, Card, Grid, Button, Typography } from '@mui/material';
import { useForm, FormProvider, useWatch, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
import { RHFTextField, RHFAutocomplete } from '../../components/hook-form';
import RHFDatePicker from '../../components/hook-form/RHFDatePicker';
import { useSnackbar } from '../../components/snackbar';
import { getAllStarlineMarketsAsync } from '../../redux/services/starline_market_services';
import {
  createStarlineMarketResultAsync,
  getAllStarlineMarketResultsAsync,
} from '../../redux/services/starline_market_result_services';

// ----------------------------------------------------------------------

// Pana validation helper
const isNonDecreasing = (value) => {
  if (!value || value.length !== 3) return true;
  const digits = value.split('').map(Number);
  if (digits[2] === 0) return true;
  return digits[0] <= digits[1] && digits[1] <= digits[2];
};

// Pana validation
const validatePanaInput = (value) => {
  const digits = value
    .replace(/[^0-9]/g, '')
    .slice(0, 3)
    .split('')
    .map(Number);
  if (digits.length === 0) return '';

  let valid = digits[0].toString();
  if (digits.length >= 2 && (digits[1] >= digits[0] || digits[1] === 0)) {
    valid += digits[1].toString();
  }
  if (digits.length === 3 && valid.length === 2) {
    const second = Number(valid[1]);
    if (
      (second === 0 && digits[2] === 0) ||
      (second !== 0 && (digits[2] >= digits[1] || digits[2] === 0))
    ) {
      valid += digits[2].toString();
    }
  }
  return valid;
};

const calculateDigit = (pana) => {
  if (!pana || !/^\d{3}$/.test(pana)) return '';
  const sum = pana
    .split('')
    .map(Number)
    .reduce((a, b) => a + b, 0);
  return (sum % 10).toString();
};

// Market helpers
const getMarketLabel = (option) => option?.name || option || '';
const getMarketId = (option) => option?._id || option || '';
const isMarketEqual = (option, value) => getMarketId(option) === getMarketId(value);

const INITIAL_FORM_VALUES = {
  date: dayjs(),
  market: '',
  usePercentage: false,
  percentage: '',
  pana: '',
  digit: '',
};

const validationSchema = Yup.object({
  date: Yup.mixed()
    .required('Date is required')
    .test('date-valid', 'Invalid date', (value) => {
      if (!value) return false;
      return dayjs.isDayjs(value) ? value.isValid() : dayjs(value).isValid();
    }),
  market: Yup.mixed()
    .required('Market is required')
    .test('market-required', 'Market is required', (value) => {
      if (!value) return false;
      return typeof value === 'string' ? value.trim() !== '' : !!value._id;
    }),
  usePercentage: Yup.boolean().required(),
  percentage: Yup.string().when('usePercentage', {
    is: true,
    then: (s) => s.required('Percentage is required'),
  }),
  pana: Yup.string().when('usePercentage', {
    is: false,
    then: (s) =>
      s
        .required('Pana is required')
        .matches(/^\d{3}$/, 'Pana must be exactly 3 digits')
        .test('non-decreasing', 'Digits must be in non-decreasing order', isNonDecreasing),
  }),
});

export default function CreateResultForm() {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { marketList, loading: marketLoading } = useSelector((state) => state.starlineMarket);

  const methods = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: INITIAL_FORM_VALUES,
    mode: 'onSubmit',
  });

  const {
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { isSubmitting },
  } = methods;

  // React Hook Form-aware watch
  const usePercentage = useWatch({ control, name: 'usePercentage' });
  const panaValue = useWatch({ control, name: 'pana' });
  const selectedMarket = useWatch({ control, name: 'market' });

  // Normalize market options
  const marketOptions = useMemo(
    () =>
      marketList.map((item) => ({
        _id: item._id,
        name: item.name,
      })),
    [marketList]
  );

  // Auto-calculate digit when pana changes
  useEffect(() => {
    if (panaValue) {
      const digit = calculateDigit(panaValue);
      setValue('digit', digit, { shouldValidate: true });
    }
  }, [panaValue, setValue]);

  // Fetch starline markets on mount
  useEffect(() => {
    dispatch(getAllStarlineMarketsAsync({ page: 1, limit: 100 }));
  }, [dispatch]);

  const handlePercentageToggle = useCallback(
    (value) => () => setValue('usePercentage', value, { shouldValidate: true }),
    [setValue]
  );

  const handlePanaChange = useCallback(
    (field) => (e) => {
      const validValue = validatePanaInput(e.target.value);
      field.onChange(validValue);
      if (validValue.length === 3) {
        setValue('digit', calculateDigit(validValue), { shouldValidate: true });
      }
    },
    [setValue]
  );

  const preparePayload = useCallback(
    (data) => {
      const payload = {
        date: dayjs.isDayjs(data.date)
          ? data.date.format('YYYY-MM-DD')
          : dayjs(data.date).format('YYYY-MM-DD'),
        marketsId: getMarketId(data.market),
        percentage: data.usePercentage ? data.percentage || 'yes' : 'no',
      };

      if (!data.usePercentage) {
        payload.pana = parseInt(data.pana, 10);
        payload.digit = parseInt(data.digit, 10);
      }

      return payload;
    },
    []
  );

  const onSubmit = useCallback(
    async (data) => {
      try {
        const payload = preparePayload(data);
        await dispatch(createStarlineMarketResultAsync(payload)).unwrap();
        enqueueSnackbar('Starline market result created successfully!', { variant: 'success' });
        reset(INITIAL_FORM_VALUES);
        // Refresh the list
        dispatch(getAllStarlineMarketResultsAsync({ page: 1, limit: 10 }));
      } catch (error) {
        const errorMessage =
          error?.response?.data?.message || error?.message || 'Failed to create starline market result';
        enqueueSnackbar(errorMessage, { variant: 'error' });
      }
    },
    [dispatch, enqueueSnackbar, preparePayload, reset]
  );

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
                size="small"
                fullWidth
              />
            </Grid>

            {/* Markets */}
            <Grid item xs={12} sm={6}>
              <RHFAutocomplete
                name="market"
                label="Starline Markets"
                size="small"
                fullWidth
                options={marketOptions}
                loading={marketLoading}
                getOptionLabel={getMarketLabel}
                isOptionEqualToValue={isMarketEqual}
                renderOption={(props, option) => (
                  <li {...props} key={option._id}>
                    {option.name}
                  </li>
                )}
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
                  onClick={handlePercentageToggle(true)}
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
                  onClick={handlePercentageToggle(false)}
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
                  <Controller
                    name="pana"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <RHFTextField
                        {...field}
                        label="Pana"
                        placeholder="Enter Pana (3 digits)"
                        size="small"
                        fullWidth
                        error={!!error}
                        helperText={error?.message}
                        onChange={handlePanaChange(field)}
                        inputProps={{
                          maxLength: 3,
                        }}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <RHFTextField
                    name="digit"
                    label="Digit"
                    placeholder="Auto-calculated"
                    size="small"
                    fullWidth
                    disabled
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
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={isSubmitting || marketLoading}
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </Button>
          </Box>
        </Box>
      </FormProvider>
    </Card>
  );
}
