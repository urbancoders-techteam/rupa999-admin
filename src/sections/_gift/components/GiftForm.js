import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack } from '@mui/material';
// import { addUserAsync, updateUserAsync } from '../../../redux';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, { RHFTextField } from '../../../components/hook-form';
import { PATH_DASHBOARD } from '../../../routes/paths';

GiftForm.propTypes = {
  isEdit: PropTypes.bool,
  isView: PropTypes.bool,
  currentUser: PropTypes.object,
};

export default function GiftForm({ isEdit = false, isView = false, currentUser }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();

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

  return (
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
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField disabled={isView} name="userLimit" label="User Limit" />
              <RHFTextField disabled={isView} name="amount" label="Amount" />
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
                  {!isEdit ? 'Create Gift' : 'Save Changes'}
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
  );
}
