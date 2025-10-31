import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import {
  Card,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
  Paper,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import FormProvider, { RHFTextField } from '../../components/hook-form';

// ----------------------------------------------------------------------

export default function AdminChangePasswordForm() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('Password changed successfully:', data);
      // You can trigger an API call here
      navigate('/dashboard'); // redirect after success
    } catch (error) {
      console.error(error);
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
          Enter Your New Password
        </Typography>

        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={isMobile ? 2 : 3}>
            <RHFTextField
              name="password"
              label="Password"
              type="password"
              size={isMobile ? 'small' : 'medium'}
            />

            <RHFTextField
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              size={isMobile ? 'small' : 'medium'}
            />

            <LoadingButton
              type="submit"
              variant="contained"
              fullWidth={isMobile}
              loading={isSubmitting}
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
              Change
            </LoadingButton>
          </Stack>
        </FormProvider>
      </Card>
    </Paper>
  );
}
