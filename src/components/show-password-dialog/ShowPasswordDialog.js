import PropTypes from 'prop-types';
// @mui
import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
} from '@mui/material';
import Iconify from '../iconify';

// ----------------------------------------------------------------------

ShowPasswordDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  loading: PropTypes.bool,
  password: PropTypes.string,
  error: PropTypes.string,
  userName: PropTypes.string,
};

export default function ShowPasswordDialog({ open, onClose, loading, password, error, userName }) {
  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
      <DialogTitle>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={1}>
            <Iconify icon="mdi:eye-outline" width={24} />
            <span>Password{userName ? ` - ${userName}` : ''}</span>
          </Stack>
          <IconButton onClick={onClose} size="small">
            <Iconify icon="eva:close-fill" />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <Stack alignItems="center" justifyContent="center" sx={{ py: 2, minHeight: 60 }}>
          {loading && <CircularProgress size={28} />}

          {!loading && error && (
            <Alert severity="warning" sx={{ width: '100%' }}>
              {error}
            </Alert>
          )}

          {!loading && !error && password && (
            <TextField
              fullWidth
              value={password}
              InputProps={{ readOnly: true }}
              onFocus={(event) => event.target.select()}
            />
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} variant="outlined" color="inherit">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
