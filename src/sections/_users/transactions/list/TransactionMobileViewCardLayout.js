import {
  Box,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { fCurrency } from '../../../../utils/formatNumber';
import { fDateTime } from '../../../../utils/formatTime';

function TransactionMobileViewCardLayout({
  data = [],
  loading = false,
}) {
  const theme = useTheme();

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 200,
          p: 2,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 200,
          p: 2,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          No transactions found
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        boxShadow: 1,
        bgcolor: 'background.paper',
      }}
    >
      <Stack spacing={2}>
        {data.map((row) => (
          <Box
            key={row.id || row._id}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
              p: 2,
              boxShadow: theme.shadows[1],
            }}
          >
            {/* Header */}
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              mb={1.5}
            >
              <Typography variant="body2" fontWeight={600}>
                {row.particulars || 'Transaction'}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mt: -1 }}>
                Date: {row.date ? fDateTime(row.date) : '—'}
              </Typography>
            </Stack>

            <Stack spacing={1}>

              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  Debit:
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight={600}
                  color={row.debit > 0 ? 'error.main' : 'text.secondary'}
                >
                  {row.debit > 0 ? fCurrency(row.debit) : '—'}
                </Typography>
              </Stack>

              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  Credit:
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight={600}
                  color={row.credit > 0 ? 'success.main' : 'text.secondary'}
                >
                  {row.credit > 0 ? fCurrency(row.credit) : '—'}
                </Typography>
              </Stack>

              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  Balance:
                </Typography>
                <Typography variant="body2" fontWeight={700}>
                  {fCurrency(row.balance || 0)}
                </Typography>
              </Stack>

              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  Created By:
                </Typography>
                <Typography variant="body2" fontWeight={700}>
                  {row.admin.name || '—'}
                </Typography>
              </Stack>
            </Stack>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}

TransactionMobileViewCardLayout.propTypes = {
  data: PropTypes.array,
  loading: PropTypes.bool,
};

export default TransactionMobileViewCardLayout;
