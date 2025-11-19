import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Container, Grid, Stack } from '@mui/material';
import PropTypes from 'prop-types';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import FormProvider, { RHFAutocomplete, RHFSwitch, RHFTextField } from '../../../components/hook-form';
import { useSettingsContext } from '../../../components/settings';
import { useSnackbar } from '../../../components/snackbar';
import { getAllRolesAsync } from '../../../redux/services/role_services';
import { createStaffAsync, updateStaffAsync } from '../../../redux/services/staff_services';
import { PATH_DASHBOARD } from '../../../routes/paths';

// -------------------------------------------------------------

StaffForm.propTypes = {
  isEdit: PropTypes.bool,
  isView: PropTypes.bool,
  currentStaff: PropTypes.object,
};

// -------------------------------------------------------------

export default function StaffForm({ isEdit = false, isView = false, currentStaff }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { themeStretch } = useSettingsContext();

  // Redux state for roles and staff
  const { roleList, loading: roleLoading } = useSelector((state) => state.role);
  const { loading: staffLoading } = useSelector((state) => state.staff);

  // Fetch roles on mount
  useEffect(() => {
    dispatch(getAllRolesAsync({ page: 1, limit: 100 }));
  }, [dispatch]);

  // ✅ Validation Schema
  const StaffSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    mobile: Yup.string()
      .matches(/^[0-9]{10}$/, 'Enter a valid 10-digit mobile number')
      .required('Mobile number is required'),
    email: Yup.string().email('Enter a valid email address').required('Email is required'),
    password: isEdit
      ? Yup.string()
      : Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
    roleId: Yup.mixed()
      .required('Role/Designation is required')
      .test('is-valid-role', 'Please select a valid role', (value) => {
        if (!value) return false;
        // Accept both object (with _id) or string
        if (typeof value === 'object' && value._id) return true;
        if (typeof value === 'string' && value.length > 0) return true;
        return false;
      }),
    status: Yup.boolean(),
  });

  const defaultValues = useMemo(
    () => {
      // Handle roleId - if it's an object with _id, use that; otherwise find in roleList
      let roleIdValue = '';
      if (currentStaff?.roleId) {
        if (typeof currentStaff.roleId === 'object' && currentStaff.roleId._id) {
          // If it's already an object with _id, use it directly
          roleIdValue = currentStaff.roleId;
        } else if (typeof currentStaff.roleId === 'string') {
          // If it's a string ID, find the matching role object from roleList
          const foundRole = roleList.find((role) => role._id === currentStaff.roleId);
          roleIdValue = foundRole || '';
        }
      }

      return {
        name: currentStaff?.name || '',
        mobile: currentStaff?.mobile || currentStaff?.mobileNumber || '',
        email: currentStaff?.email || '',
        password: '',
        roleId: roleIdValue,
        status: currentStaff?.status !== undefined ? currentStaff.status : true,
      };
    },
    [currentStaff, roleList]
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

  // Reset form when staff data changes (for edit mode) or when roleList loads
  useEffect(() => {
    if (isEdit || isView) {
      if (currentStaff && currentStaff._id) {
        // Find role object if roleId is a string
        if (currentStaff?.roleId && typeof currentStaff.roleId === 'string' && roleList.length > 0) {
          const foundRole = roleList.find((role) => role._id === currentStaff.roleId);
          if (foundRole) {
            reset({
              ...defaultValues,
              roleId: foundRole,
            });
          } else {
            reset(defaultValues);
          }
        } else {
          reset(defaultValues);
        }
      }
    } else {
      // Reset to empty form for create mode
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, isView, currentStaff?._id, roleList, reset]);

  const onSubmit = async (data) => {
    try {
      // Extract roleId - handle both object and string
      let roleIdValue = data.roleId;
      if (roleIdValue && typeof roleIdValue === 'object') {
        roleIdValue = roleIdValue._id || roleIdValue.id || roleIdValue;
      }

      // Prepare submit data - map roleId correctly
      const submitData = {
        name: data.name.trim(),
        mobile: parseInt(data.mobile.trim(), 10), // Convert to number
        email: data.email.trim().toLowerCase(),
        roleId: roleIdValue, // Ensure it's a string
        status: data.status !== undefined ? data.status : true,
      };

      // Only include password if provided (required for create, optional for edit)
      if (!isEdit) {
        // Password is required for create
        if (!data.password || data.password.trim() === '') {
          enqueueSnackbar('Password is required', { variant: 'error' });
          return;
        }
        submitData.password = data.password;
      } else if (data.password && data.password.trim() !== '') {
        // Optional password update in edit mode
        submitData.password = data.password;
      }

      if (isEdit && currentStaff?._id) {
        // Update existing staff
        await dispatch(updateStaffAsync({ id: currentStaff._id, data: submitData })).unwrap();

        enqueueSnackbar('Staff updated successfully!', { variant: 'success' });
        navigate(PATH_DASHBOARD.staff.list);
      } else {
        // Create new staff
        await dispatch(createStaffAsync(submitData)).unwrap();

        enqueueSnackbar('Staff created successfully!', { variant: 'success' });
        navigate(PATH_DASHBOARD.staff.list);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      const errorMessage =
        error?.response?.data?.message || error?.message || 'An error occurred while saving staff';
      enqueueSnackbar(errorMessage, { variant: 'error' });
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
              <RHFTextField
                name="mobile"
                label="Mobile Number"
                disabled={isView}
                inputProps={{ maxLength: 10 }}
              />
              <RHFTextField name="email" label="Email" disabled={isView} />
              {!isEdit && (
                <RHFTextField
                  name="password"
                  label={isEdit ? 'Password (leave blank to keep current)' : 'Password'}
                  type="password"
                  disabled={isView}
                />
              )}
              <RHFAutocomplete
                name="roleId"
                label="Role"
                size="small"
                options={roleList}
                disabled={isView || roleLoading}
                getOptionLabel={(option) => option.roleName || option.designationName || ''}
                isOptionEqualToValue={(option, value) => option._id === value._id}
                loading={roleLoading}
                placeholder="Select Role"
                renderOption={(props, option) => (
                  <li {...props}>{option.roleName || option.designationName}</li>
                )}
              />

              <Box>
                <RHFSwitch
                  name="status"
                  label="Status (Active/Inactive)"
                  disabled={isView}
                  sx={{ mt: 1 }}
                />
              </Box>
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
                <LoadingButton
                  type="submit"
                  variant="contained"
                  loading={isSubmitting || roleLoading || staffLoading}
                  disabled={(roleList.length === 0 && !roleLoading) || staffLoading}
                >
                  {isEdit ? 'Save Changes' : 'Create Staff'}
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
