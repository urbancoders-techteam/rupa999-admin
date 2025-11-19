import PropTypes from 'prop-types';
// @mui
import {
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import Iconify from '../iconify';

// ----------------------------------------------------------------------

BankDetailsDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  bankDetails: PropTypes.shape({
    bankName: PropTypes.string,
    accountHolderName: PropTypes.string,
    accountNumber: PropTypes.string,
    ifscCode: PropTypes.string,
  }),
  loading: PropTypes.bool,
};

export default function BankDetailsDialog({ open, onClose, bankDetails, loading }) {
  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <DialogTitle sx={{ pb: 2 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon="mdi:bank" width={24} />
          <Typography variant="h6">Bank Details</Typography>
        </Stack>
      </DialogTitle>

      <DialogContent>
        {(() => {
          if (loading) {
            return (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            );
          }

          if (bankDetails) {
            return (
              <Stack spacing={2} sx={{ pb: 4 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Bank Name
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 0.5, fontWeight: 500 }}>
                    {bankDetails.bankName || '—'}
                  </Typography>
                </Box>

                <Divider />

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Account Holder Name
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 0.5, fontWeight: 500 }}>
                    {bankDetails.accountHolderName || '—'}
                  </Typography>
                </Box>

                <Divider />

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Account Number
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 0.5, fontWeight: 500 }}>
                    {bankDetails.accountNumber || '—'}
                  </Typography>
                </Box>

                <Divider />

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    IFSC Code
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 0.5, fontWeight: 500 }}>
                    {bankDetails.ifscCode || '—'}
                  </Typography>
                </Box>
              </Stack>
            );
          }

          return (
            <Box sx={{ py: 2 }}>
              <Typography variant="body2" color="text.secondary" align="center">
                No bank details available
              </Typography>
            </Box>
          );
        })()}
      </DialogContent>
    </Dialog>
  );
}

