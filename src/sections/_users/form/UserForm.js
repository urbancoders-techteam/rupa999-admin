import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Card,
  Grid,
  Stack,
  Container,
} from '@mui/material';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, { RHFTextField } from '../../../components/hook-form';
import { PATH_DASHBOARD } from '../../../routes/paths';
import { useSettingsContext } from '../../../components/settings';

// -------------------------------------------------------------

UserForm.propTypes = {
  isEdit: PropTypes.bool,
  isView: PropTypes.bool,
  currentUser: PropTypes.object,
};

// -------------------------------------------------------------

export default function UserForm({ isEdit = false, isView = false, currentUser }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { themeStretch } = useSettingsContext();

  // ✅ Validation Schema
  const UserSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    phone: Yup.string()
      .matches(/^[0-9]{10}$/, 'Enter a valid 10-digit phone number')
      .required('Phone number is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm Password is required'),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentUser?.name || '',
      phone: currentUser?.phone || '',
      password: currentUser?.password || '',
      confirmPassword: currentUser?.confirmPassword || '',
    }),
    [currentUser]
  );

  const methods = useForm({
    resolver: yupResolver(UserSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if ((isEdit && currentUser) || (isView && currentUser)) {
      reset(defaultValues);
    }
  }, [isEdit, isView, currentUser, reset, defaultValues]);

  const onSubmit = async (data) => {
    console.log('✅ Form Submitted:', data);
    enqueueSnackbar(isEdit ? 'User updated successfully!' : 'User created successfully!');
    navigate(PATH_DASHBOARD.userlist.list);
  };

  const handleBack = () => navigate(PATH_DASHBOARD.user.list);

  // -------------------------------------------------------------

  return (
    <Container maxWidth={themeStretch ? false : 'xl'}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Card
            sx={{
              p: 3,
              width: '100%',
              boxShadow: 3,
              borderRadius: 2,
            }}
          >
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name="name" label="Full Name" disabled={isView} />
              <RHFTextField name="phone" label="Phone Number" disabled={isView} />
              <RHFTextField
                name="password"
                label="Password"
                type="password"
                disabled={isView}
              />
              <RHFTextField
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                disabled={isView}
              />
            </Box>

            {/* Action Buttons */}
            {isView ? (
              <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                <LoadingButton
                  onClick={handleBack}
                  type="button"
                  variant="contained"
                >
                  Back
                </LoadingButton>
              </Stack>
            ) : (
              <Stack
                gap="10px"
                justifyContent="flex-end"
                flexDirection="row"
                sx={{ mt: 3 }}
              >
                <LoadingButton
                  type="submit"
                  variant="contained"
                  loading={isSubmitting}
                >
                  {isEdit ? 'Save Changes' : 'Create User'}
                </LoadingButton>

                <LoadingButton
                  onClick={handleBack}
                  type="button"
                  variant="contained"
                  color="error"
                >
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
