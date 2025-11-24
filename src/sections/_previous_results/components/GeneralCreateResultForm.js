import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Button, Card, Grid, Stack, TextField, Typography } from '@mui/material';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo } from 'react';
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { RHFAutocomplete, RHFTextField } from '../../../components/hook-form';
import RHFDatePicker from '../../../components/hook-form/RHFDatePicker';
import { useSnackbar } from '../../../components/snackbar';
import { createMarketResultAsync, getAllMarketResultsAsync } from '../../../redux/services/market_result_services';
import { getAllMarketsAsync } from '../../../redux/services/market_services';

// ----------------------------------------------------------------------

const SESSIONS = ['Open', 'Close'];
const INITIAL_FORM_VALUES = {
  date: dayjs(),
  market: '',
  session: '',
  usePercentage: false,
  percentage: '',
  pana: '',
  digit: '',
};

// Validation helpers
const isNonDecreasing = (value) => {
  if (!value || value.length !== 3) return true;
  const digits = value.split('').map(Number);
  if (digits[2] === 0) return true;
  return digits[0] <= digits[1] && digits[1] <= digits[2];
};

// Market helpers
const getMarketLabel = (option) => (option?.name || option || '');
const getMarketId = (option) => (option?._id || option || '');
const isMarketEqual = (option, value) => getMarketId(option) === getMarketId(value);

// Pana validation
const validatePanaInput = (value) => {
  const digits = value.replace(/[^0-9]/g, '').slice(0, 3).split('').map(Number);
  if (digits.length === 0) return '';

  let valid = digits[0].toString();
  if (digits.length >= 2 && (digits[1] >= digits[0] || digits[1] === 0)) {
    valid += digits[1].toString();
  }
  if (digits.length === 3 && valid.length === 2) {
    const second = Number(valid[1]);
    if ((second === 0 && digits[2] === 0) || (second !== 0 && (digits[2] >= digits[1] || digits[2] === 0))) {
      valid += digits[2].toString();
    }
  }
  return valid;
};

const calculateDigit = (pana) => {
  if (!pana || !/^\d{3}$/.test(pana)) return '';
  const sum = pana.split('').map(Number).reduce((a, b) => a + b, 0);
  return (sum % 10).toString();
};

GeneralCreateResultForm.propTypes = {
  showWinner: PropTypes.bool,
  onHandleShowWinner: PropTypes.func,
};

export default function GeneralCreateResultForm({ showWinner, onHandleShowWinner }) {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { marketList, loading: marketLoading } = useSelector((state) => state.market);
  const { loading: marketResultLoading } = useSelector((state) => state.marketResult);

  const validationSchema = useMemo(
    () =>
      Yup.object({
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
        session: Yup.string().required('Session is required'),
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
      }),
    []
  );

  const methods = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: INITIAL_FORM_VALUES,
    mode: 'onSubmit',
  });

  const { handleSubmit, setValue, control, reset, formState: { isSubmitting } } = methods;
  const usePercentage = useWatch({ control, name: 'usePercentage' });
  const panaValue = useWatch({ control, name: 'pana' });

  useEffect(() => {
    dispatch(getAllMarketsAsync());
  }, [dispatch]);

  useEffect(() => {
    if (panaValue) {
      const digit = calculateDigit(panaValue);
      setValue('digit', digit, { shouldValidate: true });
    }
  }, [panaValue, setValue]);

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

  const preparePayload = useCallback((data) => {
    const payload = {
      date: dayjs.isDayjs(data.date) ? data.date.format('YYYY-MM-DD') : dayjs(data.date).format('YYYY-MM-DD'),
      marketsId: getMarketId(data.market),
      session: data.session?.toLowerCase() || '',
      percentage: data.usePercentage ? (data.percentage || 'yes') : 'no',
    };

    if (!data.usePercentage) {
      payload.pana = parseInt(data.pana, 10);
      payload.digit = parseInt(data.digit, 10);
    }

    return payload;
  }, []);

  const onSubmit = useCallback(
    async (data) => {
      try {
        const payload = preparePayload(data);
        await dispatch(createMarketResultAsync(payload)).unwrap();
        enqueueSnackbar('Market result created successfully!', { variant: 'success' });
        reset(INITIAL_FORM_VALUES);
        dispatch(getAllMarketResultsAsync());
      } catch (error) {
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to create market result';
        enqueueSnackbar(errorMessage, { variant: 'error' });
      }
    },
    [dispatch, enqueueSnackbar, preparePayload, reset]
  );

  const isLoading = marketLoading || marketResultLoading;

  return (
    <Card sx={{ p: 3, borderRadius: 2, mb: 2 }}>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
        Create Market Result
      </Typography>

      <FormProvider {...methods}>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Grid container spacing={2}>
            {/* Date */}
            <Grid item xs={12} md={4}>
              <RHFDatePicker name="date" label="Date" size="small" format="DD/MM/YYYY" required />
            </Grid>

            {/* Markets */}
            <Grid item xs={12} md={4}>
              <RHFAutocomplete
                name="market"
                label="Markets"
                size="small"
                fullWidth
                disabled={marketLoading}
                options={marketList || []}
                loading={marketLoading}
                getOptionLabel={getMarketLabel}
                isOptionEqualToValue={isMarketEqual}
                renderOption={(props, option) => (
                  <li {...props} key={option._id || option}>
                    {getMarketLabel(option)}
                  </li>
                )}
              />
            </Grid>

            {/* Session */}
            <Grid item xs={12} md={4}>
              <RHFAutocomplete
                name="session"
                label="Session"
                size="small"
                fullWidth
                options={SESSIONS}
                getOptionLabel={(opt) => opt || ''}
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
                  onClick={handlePercentageToggle(true)}
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
                  onClick={handlePercentageToggle(false)}
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
                <RHFTextField name="percentage" label="Percentage" placeholder="Enter Percentage" size="small" fullWidth />
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
                        inputProps={{ maxLength: 3, pattern: '[0-9]*', inputMode: 'numeric' }}
                        onChange={handlePanaChange(field)}
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
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
              </>
            )}
          </Grid>

          {/* Buttons */}
          <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
            {onHandleShowWinner && (
              <Button variant="outlined" color="primary" onClick={onHandleShowWinner} type="button">
                {showWinner ? 'Hide Winners' : 'Show Winners'}
              </Button>
            )}
            <LoadingButton
              type="submit"
              variant="contained"
              loading={isSubmitting || isLoading}
              disabled={isLoading || (marketList.length === 0 && marketLoading)}
            >
              Create Result
            </LoadingButton>
          </Stack>
        </Box>
      </FormProvider>
    </Card>
  );
}
