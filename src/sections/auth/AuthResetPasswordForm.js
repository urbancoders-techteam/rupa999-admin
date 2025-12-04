import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import {
  Card,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
  Paper,
  Alert,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import FormProvider, { RHFTextField } from '../../components/hook-form';
import { changePasswordAsync } from '../../redux/services/auth_services';
import { PATH_DASHBOARD } from '../../routes/paths';

// ----------------------------------------------------------------------

export default function AdminChangePasswordForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { changePasswordLoading, changePasswordError } = useSelector((state) => state.auth);

  const ChangePasswordSchema = Yup.object().shape({
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required('Confirm Password is required'),
  });

  const methods = useForm({
    resolver: yupResolver(ChangePasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const {
    handleSubmit,
    setError,
    formState: { isSubmitting, errors },
  } = methods;

  const onSubmit = async (data) => {
    try {
      // Get adminId from localStorage
      const adminData = localStorage.getItem('admin');
      if (!adminData) {
        toast.error('Admin data not found. Please login again.');
        navigate('/login');
        return;
      }

      const admin = JSON.parse(adminData);
      const adminId = admin._id || admin.id;

      if (!adminId) {
        toast.error('Admin ID not found. Please login again.');
        navigate('/login');
        return;
      }

      // Prepare API payload
      const payload = {
        adminId,
        newPassword: data.password,
        cpassword: data.confirmPassword,
      };

      const res = await dispatch(changePasswordAsync(payload));

      if (res.type === 'auth/changePassword/fulfilled') {
        if (res.payload?.success) {
          toast.success(res.payload?.message || 'Password changed successfully');
          navigate(PATH_DASHBOARD.home.root);
        } else {
          throw new Error(res.payload?.message || 'Failed to change password');
        }
      } else if (res.type === 'auth/changePassword/rejected') {
        throw new Error(res.payload?.message || res.payload || 'Failed to change password');
      }
    } catch (error) {
      setError('afterSubmit', {
        message: error.message || 'Failed to change password',
      });
      toast.error(error.message || 'Failed to change password');
    }
  };

  return (
    <Paper
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.palette.grey[100],
        p: { xs: 2, sm: 4 },
      }}
    >
      <Card
        sx={{
          p: { xs: 3, sm: 4 },
          width: '100%',
          maxWidth: 500,
          borderRadius: 3,
          boxShadow: '0 6px 20px rgba(0,0,0,0.06)',
        }}
      >
        <Typography
          variant={isMobile ? 'h6' : 'h5'}
          fontWeight={600}
          gutterBottom
          textAlign="left"
        >
          Enter New Password
        </Typography>

        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={isMobile ? 2 : 3}>
            {!!errors.afterSubmit && (
              <Alert severity="error">{errors.afterSubmit.message}</Alert>
            )}
            {changePasswordError && !errors.afterSubmit && (
              <Alert severity="error">{changePasswordError}</Alert>
            )}

            <RHFTextField
              name="password"
              label="New Password"
              type="password"
              size={isMobile ? 'small' : 'medium'}
            />

            <RHFTextField
              name="confirmPassword"
              label="Confirm New Password"
              type="password"
              size={isMobile ? 'small' : 'medium'}
            />

            <LoadingButton
              type="submit"
              variant="contained"
              fullWidth={isMobile}
              loading={isSubmitting || changePasswordLoading}
              sx={{
                alignSelf: isMobile ? 'stretch' : 'flex-start',
                px: 4,
                py: 1,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                mt: 1,
              }}
            >
              Change Password
            </LoadingButton>
          </Stack>
        </FormProvider>
      </Card>
    </Paper>
  );
}
