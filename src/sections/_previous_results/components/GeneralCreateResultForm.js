/* eslint-disable no-lonely-if */
import PropTypes from 'prop-types';
import { useMemo, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Card, Grid, Button, Typography, TextField, Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useForm, FormProvider, useWatch, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from '../../../components/snackbar';
import { getAllMarketsAsync } from '../../../redux/services/market_services';
import { createMarketResultAsync, updateMarketResultAsync } from '../../../redux/services/market_result_services';
import { RHFTextField, RHFAutocomplete } from '../../../components/hook-form';
import RHFDatePicker from '../../../components/hook-form/RHFDatePicker';
import { PATH_DASHBOARD } from '../../../routes/paths';

// ----------------------------------------------------------------------

const SESSIONS = ['Open', 'Close'];

// Helper function to check if digits are in non-decreasing order
const isNonDecreasing = (value) => {
  if (!value || value.length !== 3) return true;
  const digits = value.split('').map(Number);
  if (digits[2] === 0) return true; // Allow numbers ending in 0
  return digits[0] <= digits[1] && digits[1] <= digits[2];
};

// Market autocomplete helpers
const getMarketOptionLabel = (option) => {
  if (typeof option === 'string') return option;
  if (option && typeof option === 'object') return option.name || '';
  return '';
};

const isMarketOptionEqualToValue = (option, value) => {
  if (!option || !value) return false;
  if (typeof option === 'string' && typeof value === 'string') return option === value;
  const optionId = typeof option === 'object' ? option._id : option;
  const valueId = typeof value === 'object' ? value._id : value;
  return optionId === valueId;
};

const renderMarketOption = (props, option) => (
  <li {...props} key={option._id || option}>
    {typeof option === 'object' ? option.name : option}
  </li>
);

// Pana input validation helper
const validatePanaInput = (value) => {
  let validValue = value.replace(/[^0-9]/g, '').slice(0, 3);
  
  if (validValue.length > 0) {
    const digits = validValue.split('').map(Number);
    validValue = digits[0].toString();
    
    if (digits.length >= 2) {
      if (digits[1] >= digits[0] || digits[1] === 0) {
        validValue += digits[1].toString();
      } else {
        validValue = digits[0].toString();
      }
    }
    
    if (digits.length === 3 && validValue.length === 2) {
      const secondDigit = Number(validValue[1]);
      if (secondDigit === 0) {
  if (digits[2] === 0) {
          validValue += digits[2].toString();
        }
      } else if (digits[2] >= digits[1] || digits[2] === 0) {
        validValue += digits[2].toString();
      }
    }
  }
  
  return validValue;
};

// Calculate last digit of sum
const calculateLastDigit = (pana) => {
  if (!pana || pana.length !== 3 || !/^\d{3}$/.test(pana)) return '';
  const sum = pana.split('').map(Number).reduce((acc, digit) => acc + digit, 0);
  return (sum % 10).toString();
};

// Extract market ID helper
const extractMarketId = (market) => (typeof market === 'object' && market?._id ? market._id : market);

// Transform session to lowercase
const normalizeSession = (session) => (session ? session.toLowerCase() : '');

GeneralCreateResultForm.propTypes = {
  isEdit: PropTypes.bool,
  isView: PropTypes.bool,
  currentResult: PropTypes.object,
  showWinner: PropTypes.bool,
  onHandleShowWinner: PropTypes.func,
};

export default function GeneralCreateResultForm({
  isEdit = false,
  isView = false,
  currentResult,
  showWinner,
  onHandleShowWinner,
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const { marketList, loading: marketLoading } = useSelector((state) => state.market);
  const { loading: marketResultLoading } = useSelector((state) => state.marketResult);

  // Validation schema
  const validationSchema = useMemo(
    () =>
      Yup.object({
        date: Yup.mixed()
          .required('Date is required')
          .test('date-valid', 'Date is required', (value) => {
            if (!value) return false;
            if (dayjs.isDayjs(value)) return value.isValid();
            return dayjs(value).isValid();
          }),
        market: Yup.mixed()
          .required('Market is required')
          .test('market-required', 'Market is required', (value) => {
            if (!value) return false;
            if (typeof value === 'string') return value.trim() !== '';
            return typeof value === 'object' && !!value._id;
          }),
        session: Yup.string().required('Session is required'),
        usePercentage: Yup.boolean().required(),
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
              .test(
                'non-decreasing',
                'Digits must be in non-decreasing order (e.g., 789, 778, 056). Numbers ending in 0 are allowed (e.g., 500, 560, 050, 000, 100, 200)',
                isNonDecreasing
              ),
          otherwise: (s) => s.notRequired(),
        }),
      }),
    []
  );

  // Default values based on edit mode
  const defaultValues = useMemo(() => {
    if (isEdit && currentResult) {
      // For edit mode, map from API response to form values
      const hasPercentage = currentResult.percentage === 'yes' || !!currentResult.percentage;
      return {
        date: currentResult.date ? dayjs(currentResult.date) : dayjs(),
        market: currentResult.marketsId || currentResult.market?._id || '',
        session: currentResult.session ? currentResult.session.charAt(0).toUpperCase() + currentResult.session.slice(1) : '',
        usePercentage: hasPercentage,
        percentage: hasPercentage ? (currentResult.percentage || '') : '',
        pana: currentResult.openPana?.toString() || currentResult.closePana?.toString() || currentResult.pana?.toString() || '',
        digit: currentResult.openDigit?.toString() || currentResult.closeDigit?.toString() || currentResult.digit?.toString() || '',
      };
    }
    return {
      date: dayjs(),
      market: '',
      session: '',
      usePercentage: false,
      percentage: '',
      pana: '',
      digit: '',
    };
  }, [isEdit, currentResult]);

  const methods = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues,
    mode: 'onSubmit',
  });

  const { handleSubmit, setValue, control, reset, formState: { isSubmitting } } = methods;
  const usePercentage = useWatch({ control, name: 'usePercentage' });
  const panaValue = useWatch({ control, name: 'pana' });

  // Fetch markets on mount
  useEffect(() => {
    dispatch(getAllMarketsAsync());
  }, [dispatch]);

  // Reset form when currentResult changes (for edit mode)
  useEffect(() => {
    if ((isEdit || isView) && currentResult?._id) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, isView, currentResult?._id, reset]);

  // Calculate and update digit when pana changes (only for create mode)
  useEffect(() => {
    if (!isEdit && panaValue) {
      const digit = calculateLastDigit(panaValue);
      setValue('digit', digit, { shouldValidate: true });
    }
  }, [panaValue, setValue, isEdit]);

  // Memoized handlers
  const handlePercentageToggle = useCallback(
    (value) => () => {
      setValue('usePercentage', value, { shouldValidate: true });
    },
    [setValue]
  );

  const handlePanaChange = useCallback(
    (field) => (e) => {
      const validValue = validatePanaInput(e.target.value);
      field.onChange(validValue);
      // Auto-calculate digit for create mode
      if (!isEdit && validValue.length === 3) {
        const digit = calculateLastDigit(validValue);
        setValue('digit', digit, { shouldValidate: true });
      }
    },
    [setValue, isEdit]
  );

  // Prepare payload for POST API
  const preparePostPayload = useCallback((data) => {
    const marketsId = extractMarketId(data.market);
    const session = normalizeSession(data.session);
    
    // Format date - handle both dayjs object and string
    const formattedDate = dayjs.isDayjs(data.date) 
      ? data.date.format('YYYY-MM-DD')
      : dayjs(data.date).format('YYYY-MM-DD');

    const payload = {
      date: formattedDate,
      marketsId,
      session,
    };

    if (data.usePercentage) {
      // When percentage is "yes", include percentage value
      payload.percentage = data.percentage || 'yes';
    } else {
      // When percentage is "no", include pana and digit
      payload.percentage = 'no';
      payload.pana = parseInt(data.pana, 10);
      payload.digit = parseInt(data.digit, 10);
    }

    return payload;
  }, []);

  // Prepare payload for PATCH API
  const preparePatchPayload = useCallback((data) => {
    const marketsId = extractMarketId(data.market);
    const session = normalizeSession(data.session);
    
    // Format date - handle both dayjs object and string
    const formattedDate = dayjs.isDayjs(data.date) 
      ? data.date.format('YYYY-MM-DD')
      : dayjs(data.date).format('YYYY-MM-DD');

    const payload = {
      date: formattedDate,
      marketsId,
      session,
    };

    if (data.usePercentage) {
      // When percentage is "yes"
      payload.percentage = data.percentage || 'yes';
      // For PATCH with percentage, include session-specific fields if pana/digit are provided
      if (data.pana && data.digit) {
        if (session === 'open') {
          payload.openPana = parseInt(data.pana, 10);
          payload.openDigit = parseInt(data.digit, 10);
        } else if (session === 'close') {
          payload.closePana = parseInt(data.pana, 10);
          payload.closeDigit = parseInt(data.digit, 10);
        }
      }
    } else {
      // When percentage is "no", include pana and digit based on session
      payload.percentage = 'no';
      if (session === 'open') {
        payload.openPana = parseInt(data.pana, 10);
        payload.openDigit = parseInt(data.digit, 10);
      } else if (session === 'close') {
        payload.closePana = parseInt(data.pana, 10);
        payload.closeDigit = parseInt(data.digit, 10);
      }
    }

    return payload;
  }, []);

  const onSubmit = useCallback(
    async (data) => {
      try {
        let payload;
        
        if (isEdit && currentResult?._id) {
          // PATCH request
          payload = preparePatchPayload(data);
          await dispatch(updateMarketResultAsync({ id: currentResult._id, data: payload })).unwrap();
          enqueueSnackbar('Market result updated successfully!', { variant: 'success' });
          navigate(PATH_DASHBOARD.markets.marketresults.list);
        } else {
          // POST request
          payload = preparePostPayload(data);
          await dispatch(createMarketResultAsync(payload)).unwrap();
          enqueueSnackbar('Market result created successfully!', { variant: 'success' });
          // Reset form after successful creation
          reset({
            date: dayjs(),
            market: '',
            session: '',
            usePercentage: false,
            percentage: '',
            pana: '',
            digit: '',
          });
          // Optionally refresh the list
          dispatch(getAllMarketsAsync());
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        const errorMessage =
          error?.response?.data?.message || error?.message || 'An error occurred while saving market result';
        enqueueSnackbar(errorMessage, { variant: 'error' });
      }
    },
    [isEdit, currentResult, dispatch, navigate, enqueueSnackbar, preparePostPayload, preparePatchPayload, reset]
  );

  const handleBack = useCallback(() => {
    navigate(PATH_DASHBOARD.markets.marketresults.list);
  }, [navigate]);

  const isLoading = marketLoading || marketResultLoading;

  return (
    <Card sx={{ p: 3, borderRadius: 2, mb: 2 }}>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
        {isEdit ? 'Edit Market Result' : 'Create Market Result'}
      </Typography>

      <FormProvider {...methods}>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Grid container spacing={2}>
            {/* Date */}
            <Grid item xs={12} md={4}>
              <RHFDatePicker
                name="date"
                label="Date"
                size="small"
                format="DD/MM/YYYY"
                disabled={isView}
                required
              />
            </Grid>

            {/* Markets */}
            <Grid item xs={12} md={4}>
              <RHFAutocomplete
                name="market"
                label="Markets"
                size="small"
                fullWidth
                disabled={isView || marketLoading}
                options={marketList || []}
                loading={marketLoading}
                getOptionLabel={getMarketOptionLabel}
                isOptionEqualToValue={isMarketOptionEqualToValue}
                renderOption={renderMarketOption}
              />
            </Grid>

            {/* Session */}
            <Grid item xs={12} md={4}>
              <RHFAutocomplete
                name="session"
                label="Session"
                size="small"
                fullWidth
                disabled={isView}
                options={SESSIONS}
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
                  onClick={handlePercentageToggle(true)}
                  disabled={isView}
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
                  disabled={isView}
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
                  disabled={isView}
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
                        disabled={isView}
                        error={!!error}
                        helperText={error?.message}
                        inputProps={{
                          maxLength: 3,
                          pattern: '[0-9]*',
                          inputMode: 'numeric',
                        }}
                        onChange={handlePanaChange(field)}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <RHFTextField
                    name="digit"
                    label="Digit"
                    placeholder={isEdit ? 'Enter Digit' : 'Auto-calculated'}
                    size="small"
                    fullWidth
                    disabled={isView}
                    InputProps={{
                      readOnly: !isEdit && !isView,
                    }}
                  />
                </Grid>
              </>
            )}
          </Grid>

          {/* Buttons */}
          <Stack
            direction="row"
            spacing={2}
            justifyContent="flex-end"
            sx={{ mt: 3 }}
          >
            {!isView && (
              <>
                {!isEdit && onHandleShowWinner && (
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
                  {isEdit ? 'Update Result' : 'Create Result'}
                </LoadingButton>
              </>
            )}
            {(isView || isEdit) && (
              <LoadingButton variant="outlined" onClick={handleBack} type="button">
                {isView ? 'Back' : 'Cancel'}
              </LoadingButton>
            )}
          </Stack>
        </Box>
      </FormProvider>
    </Card>
  );
}
