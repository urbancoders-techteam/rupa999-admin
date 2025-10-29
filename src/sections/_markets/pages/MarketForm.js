import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, TextField, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';
// import { addUserAsync, updateUserAsync } from '../../../redux';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { DemoContainer } from '@mui/x-date-pickers/internals';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, { RHFSwitch, RHFTextField } from '../../../components/hook-form';
import RHFTimePicker from '../../../components/hook-form/RHFTimePicker';
import { PATH_DASHBOARD } from '../../../routes/paths';

MarketForm.propTypes = {
  isEdit: PropTypes.bool,
  isView: PropTypes.bool,
  currentUser: PropTypes.object,
};

export default function MarketForm({ isEdit = false, isView = false, currentUser }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();

  const UserSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    apiKeyName: Yup.string().required('Api Key Name is required'),
    openTime: Yup.mixed().required('Open Time is required'),
    closeTime: Yup.mixed().required('Close Time is required'),
    openResultTime: Yup.mixed().required('Open Result Time is required'),
    closeResultTime: Yup.mixed().required('Close Result Time is required'),
    userLimit: Yup.string().required('User Limit is required'),
    amount: Yup.string().required('Amount is required'),
    disableGame: Yup.string().required('Disable Game is required'),
    saturdayOpen: Yup.string().required('Saturday Open is required'),
    sundayOpen: Yup.string().required('Sunday Open is required'),
    autoResult: Yup.string().required('Auto Result is required'),
    previoursDayCheck: Yup.string().required('Previous Day Check is required'),
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
      saturdayOpen: currentUser?.saturdayOpen || '',
      sundayOpen: currentUser?.sundayOpen || '',
      autoResult: currentUser?.autoResult || '',
      previoursDayCheck: currentUser?.previoursDayCheck || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if ((isEdit && currentUser) || (isView && currentUser)) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, isView, currentUser]);

  const onSubmit = async (data) => {
    console.log('Form Data:', data);
    // You can handle API submission here if needed
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Card sx={{ p: 3, width: '100%' }}>
          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
            }}
          >
            <RHFTextField disabled={isView} name="name" label="Name" />
            <RHFTextField disabled={isView} name="apiKeyName" label="Api Key Name" />
           
            <RHFTimePicker name="openTime" label="Open Time" disabled={isView} />
            <RHFTimePicker name="closeTime" label="Close Time" disabled={isView} />
            <RHFTimePicker name="openResultTime" label="Open Result Time" disabled={isView} />
            <RHFTimePicker name="closeResultTime" label="Close Result Time" disabled={isView} />
          </Box>
          <Box
            sx={{ my: 2, mx:2 }}
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(4, 1fr)',
            }}
          >
             <FormControl component="fieldset" sx={{ mt: 2 }}>
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
            </FormControl>

             <FormControl component="fieldset" sx={{ mt: 2 }}>
              <FormLabel component="legend">Saturday Open</FormLabel>
              <RadioGroup
                row
                name="saturdayOpen"
                value={values.saturdayOpen}
                onChange={(e) => setValue('saturdayOpen', e.target.value)}
              >
                <FormControlLabel value="enable" control={<Radio />} label="Enable" />
                <FormControlLabel value="disable" control={<Radio />} label="Disable" />
              </RadioGroup>
            </FormControl>

             <FormControl component="fieldset" sx={{ mt: 2 }}>
              <FormLabel component="legend">Sunday Open</FormLabel>
              <RadioGroup
                row
                name="sundayOpen"
                value={values.sundayOpen}
                onChange={(e) => setValue('sundayOpen', e.target.value)}
              >
                <FormControlLabel value="enable" control={<Radio />} label="Enable" />
                <FormControlLabel value="disable" control={<Radio />} label="Disable" />
              </RadioGroup>
            </FormControl>
            
             <FormControl component="fieldset" sx={{ mt: 2 }}>
              <FormLabel component="legend">Auto Result</FormLabel>
              <RadioGroup
                row
                name="autoResult"
                value={values.autoResult}
                onChange={(e) => setValue('autoResult', e.target.value)}
              >
                <FormControlLabel value="enable" control={<Radio />} label="Enable" />
                <FormControlLabel value="disable" control={<Radio />} label="Disable" />
              </RadioGroup>
            </FormControl>
             
             <FormControl component="fieldset" sx={{ mt: 2 }}>
              <FormLabel component="legend">Previous Day Check</FormLabel>
              <RadioGroup
                row
                name="previoursDayCheck"
                value={values.previoursDayCheck}
                onChange={(e) => setValue('previoursDayCheck', e.target.value)}
              >
                <FormControlLabel value="enable" control={<Radio />} label="Enable" />
                <FormControlLabel value="disable" control={<Radio />} label="Disable" />
              </RadioGroup>
            </FormControl>

          </Box>

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

              {isEdit && (
                <LoadingButton onClick={handleBack} type="button" variant="contained" color="error">
                  Cancel
                </LoadingButton>
              )}
            </Stack>
          )}
        </Card>
      </Grid>
    </FormProvider>
  );
}
