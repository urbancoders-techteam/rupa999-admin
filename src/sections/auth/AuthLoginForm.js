import { useState } from 'react';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import toast from 'react-hot-toast';
import { Link, Stack, Alert, IconButton, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// routes
import { PATH_AUTH, PATH_DASHBOARD } from '../../routes/paths';
// auth
import { useAuthContext } from '../../auth/useAuthContext';
// components
import Iconify from '../../components/iconify';
import FormProvider, { RHFTextField } from '../../components/hook-form';
import { staffLoginAsync } from '../../redux/services/auth_services';
import { getPermissionByRoleIdAsync } from '../../redux/services/auth_role_permission';

// ----------------------------------------------------------------------

export default function AuthLoginForm() {
  const { login } = useAuthContext();
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const [showPassword, setShowPassword] = useState(false);

  const LoginSchema = Yup.object().shape({
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    password: Yup.string().required('Password is required'),
  });

  const defaultValues = {
    // email: '',
    // password: '',
        email: 'demo@minimals.cc',
    password: 'demo1234',

  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    reset,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = methods;

  const onSubmit = async (data) => {
    console.log(data);
    navigate(PATH_DASHBOARD.home.root);
    // try {
    //   await login(data.email, data.password);
    // } catch (error) {
    //   console.error(error);
    //   reset();
    //   setError('afterSubmit', {
    //     ...error,
    //     message: error.message,
    //   });
    // }
  };

  //   const onSubmit = async (data) => {
  //  try {
  //     const res = await dispatch(staffLoginAsync({ email: data?.email, password: data?.password }));
  //     console.log('res', res)
  //     if (res?.payload?.success && res.payload.data) {
  //       localStorage.setItem('token', res.payload.data.token);
        
  //       if (res?.payload?.data?.staff._id || res) {
          
  //         const id = res?.payload?.data?.staff.role;
  //         const initialUserData = {
  //           user: res?.payload?.data,
  //         }
  //         navigate(PATH_DASHBOARD.home.root);
  //         // dispatch(getPermissionByRoleIdAsync({ id })).then((permission) => {
  //         //   console.log('permission', permission)
  //         //   if (permission.payload.status === 200) {
  //         //     const updatedUserData = {
  //         //       ...initialUserData,
  //         //       route: permission?.payload?.data,
  //         //     };
  //         //     localStorage.setItem('user', JSON.stringify(updatedUserData));
  //         //     dispatch(setUserInfoRedux(updatedUserData));
  //         //   }
  //         // });
  //         toast.success('Logged in successfully, Welcome to Tied Admin Panel.');   
  //         localStorage.setItem('login', JSON.stringify(res?.payload?.data));
  //       }
        
  //     } else {
  //       throw new Error(res.payload?.message || 'Login failed');
  //     }
  //   } catch (error) {
  //     setError('afterSubmit', {
  //       message: error.message || 'Login failed',
  //     });

  //     reset({
  //       email: data.email,
  //       password: '',
  //     });
  //   }
  // };

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

      <Stack alignItems="flex-end" sx={{ my: 2 }}>
        <Link
          component={RouterLink}
          to={PATH_AUTH.resetPassword}
          variant="body2"
          color="inherit"
          underline="always"
        >
          Forgot password?
        </Link>
      </Stack>

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitSuccessful || isSubmitting}
        sx={{
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
