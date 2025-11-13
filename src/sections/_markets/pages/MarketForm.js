import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Card,
  Grid,
  Stack,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  FormHelperText,
} from '@mui/material';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Container, useTheme } from '@mui/system';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, { RHFTextField } from '../../../components/hook-form';
import RHFTimePicker from '../../../components/hook-form/RHFTimePicker';
import { PATH_DASHBOARD } from '../../../routes/paths';
import { useSettingsContext } from '../../../components/settings';
import { createMarketAsync, updateMarketAsync } from '../../../redux/services/market_services';

MarketForm.propTypes = {
  isEdit: PropTypes.bool,
  isView: PropTypes.bool,
  currentUser: PropTypes.object,
};

export default function MarketForm({ isEdit = false, isView = false, currentUser }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();

  const { enqueueSnackbar } = useSnackbar();

  // ✅ Validation Schema
  const MarketSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    openTime: Yup.string().required('Open Time is required'),
    closeTime: Yup.string().required('Close Time is required'),
    disableGame: Yup.string().oneOf(['yes', 'no'], 'Invalid option').required('Please select an option'),
    hideOpen: Yup.string().oneOf(['enable', 'disable'], 'Invalid option').required('Please select an option'),
    activeDays: Yup.array()
      .of(Yup.string().oneOf(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']))
      .min(1, 'Select at least one active day')
      .required('Active days are required'),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentUser?.name || '',
      openTime: currentUser?.openTime || '',
      closeTime: currentUser?.closeTime || '',
      disableGame: currentUser?.disableGame || 'no',
      hideOpen: currentUser?.hideOpen || 'disable',
      activeDays: currentUser?.activeDays || [],
    }),
    [currentUser]
  );

  const methods = useForm({
    resolver: yupResolver(MarketSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;

  const values = watch();

  useEffect(() => {
    if ((isEdit && currentUser) || (isView && currentUser)) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
  }, [isEdit, isView, currentUser, reset, defaultValues]);

  const onSubmit = async (data) => {
    try {
      if (isEdit && currentUser?._id) {
        await dispatch(updateMarketAsync({ id: currentUser._id, data })).unwrap();
        enqueueSnackbar('Market updated successfully!', { variant: 'success' });
      } else {
        await dispatch(createMarketAsync(data)).unwrap();
        enqueueSnackbar('Market created successfully!', { variant: 'success' });
      }
      navigate(PATH_DASHBOARD.markets.marketlist.list);
    } catch (error) {
      enqueueSnackbar(error?.message || 'Failed to save market', { variant: 'error' });
    }
  };

  const handleBack = () => navigate(PATH_DASHBOARD.markets.marketlist.list);

  const themeStretch = useSettingsContext();

  return (
    <Container maxWidth={themeStretch ? false : 'lg'}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Card sx={{ p: 3, width: '100%' }}>
            {/* Text & Time Inputs */}
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name="name" label="Name" disabled={isView} />

              <RHFTextField name="openTime" label="Open Time (e.g., 09:00)" disabled={isView} required />
              <RHFTextField name="closeTime" label="Close Time (e.g., 21:00)" disabled={isView} required />
            </Box>

            {/* Active Days */}
            <FormControl component="fieldset" sx={{ mt: 3 }} error={!!errors.activeDays}>
              <FormLabel component="legend">Active Days</FormLabel>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: 'repeat(2, 1fr)',
                    sm: 'repeat(4, 1fr)',
                  },
                  gap: 1,
                  mt: 1,
                }}
              >
                {[
                  { label: 'Monday', value: 'monday' },
                  { label: 'Tuesday', value: 'tuesday' },
                  { label: 'Wednesday', value: 'wednesday' },
                  { label: 'Thursday', value: 'thursday' },
                  { label: 'Friday', value: 'friday' },
                  { label: 'Saturday', value: 'saturday' },
                  { label: 'Sunday', value: 'sunday' },
                ].map((day) => {
                  const isChecked = values.activeDays?.includes(day.value) || false;
                  return (
                    <FormControlLabel
                      key={day.value}
                      control={
                        <Checkbox
                          checked={isChecked}
                          onChange={(e) => {
                            const currentDays = values.activeDays || [];
                            if (e.target.checked) {
                              setValue('activeDays', [...currentDays, day.value], { shouldValidate: true });
                            } else {
                              setValue(
                                'activeDays',
                                currentDays.filter((d) => d !== day.value),
                                { shouldValidate: true }
                              );
                            }
                          }}
                          disabled={isView}
                          sx={{
                            color: theme.palette.primary.light,
                            '&.Mui-checked': {
                              color: theme.palette.primary.main,
                            },
                            '&:hover': {
                              backgroundColor: theme.palette.action.hover,
                              borderRadius: '8px',
                            },
                            transition: 'all 0.25s ease',
                            borderRadius: '8px',
                          }}
                        />
                      }
                      label={day.label}
                    />
                  );
                })}
              </Box>
              {errors.activeDays && <FormHelperText>{errors.activeDays.message}</FormHelperText>}
            </FormControl>

            {/* Radio Fields */}
            <Box
              sx={{ my: 2 }}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
              gap={2}
            >
              <FormControl component="fieldset" error={!!errors.disableGame} sx={{ mt: 2 }}>
                <FormLabel component="legend">Disable Game</FormLabel>
                <RadioGroup
                  row
                  name="disableGame"
                  value={values.disableGame}
                  onChange={(e) => setValue('disableGame', e.target.value)}
                >
                  <FormControlLabel value="yes" control={<Radio disabled={isView} />} label="Yes" />
                  <FormControlLabel value="no" control={<Radio disabled={isView} />} label="No" />
                </RadioGroup>
                {errors.disableGame && (
                  <FormHelperText>{errors.disableGame.message}</FormHelperText>
                )}
              </FormControl>

              <FormControl component="fieldset" error={!!errors.hideOpen} sx={{ mt: 2 }}>
                <FormLabel component="legend">Hide Open</FormLabel>
                <RadioGroup
                  row
                  name="hideOpen"
                  value={values.hideOpen}
                  onChange={(e) => setValue('hideOpen', e.target.value)}
                >
                  <FormControlLabel value="enable" control={<Radio disabled={isView} />} label="Enable" />
                  <FormControlLabel value="disable" control={<Radio disabled={isView} />} label="Disable" />
                </RadioGroup>
                {errors.hideOpen && <FormHelperText>{errors.hideOpen.message}</FormHelperText>}
              </FormControl>
            </Box>

            {/* Action Buttons */}
            {isView ? (
              <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                <LoadingButton onClick={handleBack} type="button" variant="contained">
                  Back
                </LoadingButton>
              </Stack>
            ) : (
              <Stack gap="10px" justifyContent="flex-end" flexDirection="row" sx={{ mt: 3 }}>
                <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                  {!isEdit ? 'Create Market' : 'Save Changes'}
                </LoadingButton>

                <LoadingButton onClick={handleBack} type="button" variant="contained" color="error">
                  Cancel
                </LoadingButton>
              </Stack>
            )}
          </Card>
        </Grid>
      </FormProvider>
    </Container>
  );
}
