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
  const UserSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    apiKeyName: Yup.string().required('API Key Name is required'),
    openTime: Yup.mixed().required('Open Time is required'),
    closeTime: Yup.mixed().required('Close Time is required'),
    openResultTime: Yup.mixed().required('Open Result Time is required'),
    closeResultTime: Yup.mixed().required('Close Result Time is required'),
    userLimit: Yup.string().required('User Limit is required'),
    amount: Yup.string().required('Amount is required'),
    disableGame: Yup.string().required('Please select an option'),
    hideOpen: Yup.string().required('Please select an option'),
    activeDays: Yup.object().test('at-least-one-day', 'Select at least one active day', (value) =>
      Object.values(value || {}).some(Boolean)
    ),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentUser?.name || '',
      apiKeyName: currentUser?.apiKeyName || '',
      openTime: currentUser?.openTime || null,
      closeTime: currentUser?.closeTime || null,
      openResultTime: currentUser?.openResultTime || null,
      closeResultTime: currentUser?.closeResultTime || null,
      userLimit: currentUser?.userLimit || '',
      amount: currentUser?.amount || '',
      disableGame: currentUser?.disableGame || '',
      hideOpen: currentUser?.hideOpen || '',
      activeDays: currentUser?.activeDays || {
        Sunday: false,
        Monday: false,
        Tuesday: false,
        Wednesday: false,
        Thursday: false,
        Friday: false,
        Saturday: false,
      },
    }),
    [currentUser]
  );

  const methods = useForm({
    resolver: yupResolver(UserSchema),
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
    console.log('✅ Form Submitted:', data);
    enqueueSnackbar('Form submitted successfully!');
  };

  const handleBack = () => navigate(PATH_DASHBOARD.marketlist.list);

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

              <RHFTimePicker name="openTime" label="Open Time" required />
              <RHFTimePicker name="closeTime" label="Close Time" />
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
                {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(
                  (day) => (
                    <FormControlLabel
                      key={day}
                      control={
                        <Controller
                          name={`activeDays.${day}`}
                          control={control}
                          render={({ field }) => (
                            <Checkbox
                              {...field}
                              checked={!!field.value}
                              onChange={(e) => setValue(`activeDays.${day}`, e.target.checked)}
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
                          )}
                        />
                      }
                      label={day}
                    />
                  )
                )}
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
                  <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                  <FormControlLabel value="no" control={<Radio />} label="No" />
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
                  <FormControlLabel value="enable" control={<Radio />} label="Enable" />
                  <FormControlLabel value="disable" control={<Radio />} label="Disable" />
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
