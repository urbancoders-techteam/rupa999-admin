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
import FormProvider, { RHFTextField, RHFAutocomplete } from '../../../components/hook-form';
import { PATH_DASHBOARD } from '../../../routes/paths';
import { useSettingsContext } from '../../../components/settings';

// -------------------------------------------------------------

StaffForm.propTypes = {
  isEdit: PropTypes.bool,
  isView: PropTypes.bool,
  currentStaff: PropTypes.object,
};

// Role options - can be replaced with API call later
const ROLE_OPTIONS = [
  'Admin',
  'Manager',
  'Staff',
  'Supervisor',
  'Accountant',
  'Operator',
];

// -------------------------------------------------------------

export default function StaffForm({ isEdit = false, isView = false, currentStaff }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { themeStretch } = useSettingsContext();

  // ✅ Validation Schema
  const StaffSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    mobileNumber: Yup.string()
      .matches(/^[0-9]{10}$/, 'Enter a valid 10-digit mobile number')
      .required('Mobile number is required'),
    email: Yup.string()
      .email('Enter a valid email address')
      .required('Email is required'),
    password: isEdit
      ? Yup.string()
        .test('password-length', 'Password must be at least 6 characters', (value) => {
          if (!value || value.length === 0) return true; // Allow empty in edit mode
          return value.length >= 6;
        })
      : Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
    role: Yup.string().required('Role is required'),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentStaff?.name || '',
      mobileNumber: currentStaff?.mobileNumber || '',
      email: currentStaff?.email || '',
      password: currentStaff?.password || '',
      role: currentStaff?.role || '',
    }),
    [currentStaff]
  );

  const methods = useForm({
    resolver: yupResolver(StaffSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if ((isEdit && currentStaff) || (isView && currentStaff)) {
      reset(defaultValues);
    }
  }, [isEdit, isView, currentStaff, reset, defaultValues]);

  const onSubmit = async (data) => {
    try {
      // Remove password from data if it's empty in edit mode
      const submitData = { ...data };
      if (isEdit && (!submitData.password || submitData.password.trim() === '')) {
        delete submitData.password;
      }

      console.log('✅ Form Submitted:', submitData);
      // TODO: Add API call here to create/update staff
      // if (isEdit) {
      //   await dispatch(updateStaffAsync({ id: currentStaff?.id, data: submitData }));
      // } else {
      //   await dispatch(createStaffAsync(submitData));
      // }
      enqueueSnackbar(isEdit ? 'Staff updated successfully!' : 'Staff created successfully!', { variant: 'success' });
      navigate(PATH_DASHBOARD.staff.list);
    } catch (error) {
      console.error('Error submitting form:', error);
      enqueueSnackbar(error?.message || 'An error occurred', { variant: 'error' });
    }
  };

  const handleBack = () => navigate(PATH_DASHBOARD.staff.list);

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
              <RHFTextField name="name" label="Name" disabled={isView} />
              <RHFTextField name="mobileNumber" label="Mobile Number" disabled={isView} />
              <RHFTextField name="email" label="Email" disabled={isView} />
              <RHFTextField
                name="password"
                label={isEdit ? "Password (leave blank to keep current)" : "Password"}
                type="password"
                disabled={isView}
              />
              <RHFAutocomplete
                name="role"
                size="small"
                label="Select Role"
                disabled={isView}
                options={ROLE_OPTIONS}
                getOptionLabel={(option) => (typeof option === 'string' ? option : '')}
                isOptionEqualToValue={(option, value) => option === value}
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
                  {isEdit ? 'Save Changes' : 'Create Staff'}
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

