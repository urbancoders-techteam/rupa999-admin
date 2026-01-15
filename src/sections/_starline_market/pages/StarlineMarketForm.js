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
  FormHelperText,
} from '@mui/material';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { Container } from '@mui/system';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, { RHFTextField } from '../../../components/hook-form';
import RHFTimePicker from '../../../components/hook-form/RHFTimePicker';
import { PATH_DASHBOARD } from '../../../routes/paths';
import { useSettingsContext } from '../../../components/settings';
import {
  createStarlineMarketAsync,
  updateStarlineMarketAsync,
} from '../../../redux/services/starline_market_services';

StarlineMarketForm.propTypes = {
  isEdit: PropTypes.bool,
  isView: PropTypes.bool,
  currentUser: PropTypes.object,
};

export default function StarlineMarketForm({ isEdit = false, isView = false, currentUser }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();

  // ✅ Validation Schema
  const UserSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    openTime: Yup.mixed().required('Open Time is required'),
    disableGame: Yup.string().required('Please select an option'),
    autoResultOpen: Yup.string().required('Please select an option'),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentUser?.name || '',
      openTime: currentUser?.openTime ? dayjs(currentUser.openTime) : null,
      disableGame: currentUser?.disableGame || 'no',
      autoResultOpen: currentUser?.autoResultOpen || 'disable',
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
      // Convert dayjs object to HH:mm format string for API
      const submitData = {
        ...data,
        openTime: data.openTime ? dayjs(data.openTime).format('HH:mm') : null,
      };

      if (isEdit && currentUser?._id) {
        await dispatch(
          updateStarlineMarketAsync({ id: currentUser._id, data: submitData })
        ).unwrap();
        enqueueSnackbar('Starline market updated successfully!', { variant: 'success' });
      } else {
        await dispatch(createStarlineMarketAsync(submitData)).unwrap();
        enqueueSnackbar('Starline market created successfully!', { variant: 'success' });
      }
      navigate(PATH_DASHBOARD.starline.market.list);
    } catch (error) {
      enqueueSnackbar(error?.message || 'Failed to save starline market', { variant: 'error' });
    }
  };

  const handleBack = () => navigate(PATH_DASHBOARD.starline.market.list);

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

              <RHFTimePicker name="openTime" label="Open Time" required disabled={isView} />
            </Box>

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
                  disabled={isView}
                >
                  <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                  <FormControlLabel value="no" control={<Radio />} label="No" />
                </RadioGroup>
                {errors.disableGame && (
                  <FormHelperText>{errors.disableGame.message}</FormHelperText>
                )}
              </FormControl>

              <FormControl component="fieldset" error={!!errors.autoResultOpen} sx={{ mt: 2 }}>
                <FormLabel component="legend">Auto Result Open</FormLabel>
                <RadioGroup
                  row
                  name="autoResultOpen"
                  value={values.autoResultOpen}
                  onChange={(e) => setValue('autoResultOpen', e.target.value)}
                  disabled={isView}
                >
                  <FormControlLabel value="enable" control={<Radio />} label="Enable" />
                  <FormControlLabel value="disable" control={<Radio />} label="Disable" />
                </RadioGroup>
                {errors.autoResultOpen && (
                  <FormHelperText>{errors.autoResultOpen.message}</FormHelperText>
                )}
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
