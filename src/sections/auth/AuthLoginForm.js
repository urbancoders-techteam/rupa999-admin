import { useState } from 'react';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import toast from 'react-hot-toast';
import { Stack, Alert, IconButton, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Iconify from '../../components/iconify';
import FormProvider, { RHFTextField } from '../../components/hook-form';
import { staffLoginAsync } from '../../redux/services/auth_services';
import { getPermissionByRoleIdAsync } from '../../redux/services/auth_role_permission';

// ----------------------------------------------------------------------

export default function AuthLoginForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);

  const LoginSchema = Yup.object().shape({
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    password: Yup.string().required('Password is required'),
  });

  const defaultValues = {
    email: '',
    password: '',
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    setError,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = methods;

  const onSubmit = async (data) => {
    try {
      const res = await dispatch(staffLoginAsync({ email: data?.email, password: data?.password }));

      if (res?.payload?.success && res.payload.admin) {
        localStorage.setItem('token', res.payload.access_token);
        localStorage.setItem('admin', JSON.stringify(res.payload.admin));
        
        const { isSuperAdmin = false, roleId } = res.payload.admin || {};
        // roleId comes back populated (an object), not a plain string - extract the id
        const roleIdValue = roleId?._id || roleId;

        // Fetch permissions for non-super-admin users if roleId exists
        if (!isSuperAdmin && roleIdValue) {
          try {
            const permissionRes = await dispatch(getPermissionByRoleIdAsync(roleIdValue));

            if (permissionRes.type === 'permission/permissionByRoleId/fulfilled') {
              // Permissions are automatically stored in Redux via the slice
            } else if (permissionRes.type === 'permission/permissionByRoleId/rejected') {
              console.warn('Failed to fetch permissions:', permissionRes.error);
              // Continue login even if permission fetch fails
            }
          } catch (permissionError) {
            console.error('Error fetching permissions:', permissionError);
            // Continue login even if permission fetch fails
          }
        }

        toast.success('Logged in successfully, Welcome to Tied Admin Panel.');
        navigate(PATH_DASHBOARD.home.root);
      } else {
        throw new Error(res.payload?.message || 'Login failed');
      }
    } catch (error) {
      setError('afterSubmit', {
        message: error.message || 'Login failed',
      });
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}

        <RHFTextField name="email" label="Email address" />

        <RHFTextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitSuccessful || isSubmitting}
        sx={{
          mt:3,
          bgcolor: 'text.primary',
          color: (theme) => (theme.palette.mode === 'light' ? 'common.white' : 'grey.800'),
          '&:hover': {
            bgcolor: 'text.primary',
            color: (theme) => (theme.palette.mode === 'light' ? 'common.white' : 'grey.800'),
          },
        }}
      >
        Login
      </LoadingButton>
    </FormProvider>
  );
}
