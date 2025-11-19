import { yupResolver } from '@hookform/resolvers/yup';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
// @mui
import { LoadingButton } from '@mui/lab';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
} from '@mui/material';
import FormProvider, { RHFTextField } from '../hook-form';
import Iconify from '../iconify';

// ----------------------------------------------------------------------

ChangePasswordDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  loading: PropTypes.bool,
  userName: PropTypes.string,
};

export default function ChangePasswordDialog({ open, onClose, onSubmit, loading, userName }) {
  const ChangePasswordSchema = Yup.object().shape({
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
    cpassword: Yup.string()
      .required('Confirm Password is required')
      .oneOf([Yup.ref('password')], 'Passwords must match'),
  });

  const methods = useForm({
    resolver: yupResolver(ChangePasswordSchema),
    defaultValues: {
      password: '',
      cpassword: '',
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  const handleFormSubmit = async (data) => {
    try {
      await onSubmit(data);
      reset();
      onClose();
    } catch (error) {
      // Error handling is done in parent component
      console.error('Error changing password:', error);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={handleClose}>
      <DialogTitle>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={1}>
            <Iconify icon="mdi:lock-reset" width={24} />
            <span>Change Password{userName ? ` - ${userName}` : ''}</span>
          </Stack>
          <IconButton onClick={handleClose} size="small">
            <Iconify icon="eva:close-fill" />
          </IconButton>
        </Stack>
      </DialogTitle>

      <FormProvider methods={methods} onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 2 }}>
            <RHFTextField
              name="password"
              label="New Password"
              type="password"
              placeholder="Enter new password"
            />

            <RHFTextField
              name="cpassword"
              label="Confirm Password"
              type="password"
              placeholder="Confirm new password"
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleClose} variant="outlined" color="inherit">
            Cancel
          </Button>
          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting || loading}
            onClick={handleSubmit(handleFormSubmit)}
          >
            Change Password
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}

