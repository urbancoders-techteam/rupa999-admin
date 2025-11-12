import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Autocomplete, Box, Card, Container, Grid, Stack, TextField } from '@mui/material';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../../components/snackbar';
import FormProvider, { RHFTextField } from '../../components/hook-form';
import { PATH_DASHBOARD } from '../../routes/paths';
import { useSettingsContext } from '../../components/settings';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import RHFDatePicker from '../../components/hook-form/RHFDatePicker';

GeneralPredictionFormPage.propTypes = {
  isEdit: PropTypes.bool,
  isView: PropTypes.bool,
  currentUser: PropTypes.object,
};

export default function GeneralPredictionFormPage({ isEdit = false, isView = false, currentUser }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { themeStretch } = useSettingsContext();

  const { enqueueSnackbar } = useSnackbar();
  const [subMenuValue, setSubMenuValue] = useState('');
  const [dropdownValue, setDropdownValue] = useState('');
  const [panaNumber, setPanaNumber] = useState('');

  const digits = panaNumber?.toString()?.split('')?.map(Number);
  console.log('panaDigit :>> ', digits);

  // Calculate the total (sum)
  const totalPanaNumber = digits.reduce((acc, curr) => acc + curr, 0);

  console.log('totalPanaNumber :>> ', totalPanaNumber);

  const UserSchema = Yup.object().shape({
    userLimit: Yup.string().required('User Limit is required'),
    amount: Yup.string().required('Amount is required'),
  });

  const defaultValues = useMemo(
    () => ({
      userLimit: currentUser?.userLimit || '',
      amount: currentUser?.amount || '',
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

  const arrayData = Array.from({ length: 900 }).map((_, index) => index + 110);

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
    console.log('data :>> ', data);
    // try {
    //   const response = await dispatch(
    //     isEdit ? updateUserAsync({ id: currentUser?.id, data }) : addUserAsync(data)
    //   );
    //   // If response is a success -
    //   navigate(PATH_DASHBOARD.GiftuserLimit.list);
    //   reset();
    //   enqueueSnackbar(isEdit ? 'Update success!' : 'Create success!');
    // } catch (error) {
    //   enqueueSnackbar('Something went wrong!');
    //   console.error(error);
    // }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const optionsData = [
    'SRIDEVI DAY',
    'TIME BAZAR',
    'MADHUR DAY',
    'MILAN DAY',
    'RAJDHANI DAY',
    'SUPREME DAY',
    'KALIYAN',
    'SRIDEVI NIGHT',
    'MADHUR NIGHT',
    'MILAN NIGHT',
    'KALIYAN NIGHT',
    'MAIN BAZAR',
    'RAJDHANI NIGHT',
    'KARNATAKA DAY',
    'KARNATAKA NIGHT',
  ];

  return (
    <>
      <Helmet>
        <title> General Prediction: Page | Rupa999 </title>
      </Helmet>
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="General Prediction Page"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'General Prediction Page', href: PATH_DASHBOARD.predictionform.form },
          ]}
        />
        <Box sx={{ mt: 5 }}>
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              <Card sx={{ p: 3, width: '100%' }}>
                <Box
                  rowGap={3}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)',
                    sm: 'repeat(3, 1fr)',
                  }}
                >
                  <RHFDatePicker disabled={isView} name="date" label="Date" />
                  <Autocomplete
                    fullWidth
                    options={optionsData}
                    value={subMenuValue}
                    onChange={(_, newValue) => setSubMenuValue(newValue)}
                    renderInput={(params) => (
                      <TextField {...params} label="Choose Markets" fullWidth />
                    )}
                  />

                  <Autocomplete
                    fullWidth
                    options={['Open', 'Close']}
                    value={dropdownValue}
                    onChange={(_, newValue) => setDropdownValue(newValue)}
                    renderInput={(params) => <TextField {...params} label="Session" fullWidth />}
                  />

                  <Autocomplete
                    fullWidth
                    options={arrayData}
                    value={panaNumber}
                    onChange={(_, newValue) => setPanaNumber(newValue)}
                    renderInput={(params) => (
                      <TextField {...params} label="Pana Number" fullWidth />
                    )}
                  />

                  <RHFTextField disabled name="digit" label="Digit" Value />
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
                      Predict
                    </LoadingButton>

                    {isEdit && (
                      <LoadingButton
                        onClick={handleBack}
                        type="button"
                        variant="contained"
                        color="error"
                      >
                        Cancel
                      </LoadingButton>
                    )}
                  </Stack>
                )}
              </Card>
            </Grid>
          </FormProvider>
        </Box>
      </Container>
    </>
  );
}
