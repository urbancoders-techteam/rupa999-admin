import PropTypes from 'prop-types';
import { Box, Stack, Typography, Card, CardContent, Divider } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { PATH_DASHBOARD } from '../../../routes/paths';

// ----------------------------------------------------------------------

MarketDataMobileViewCardLayout.propTypes = {
  data: PropTypes.array,
  loading: PropTypes.bool,
};

export default function MarketDataMobileViewCardLayout({ data = [], loading = false }) {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleNavigate = (id) => {
    navigate(PATH_DASHBOARD.markets.marketdata.bidrecord(id));
  };

  const resolveBiddingNumber = (row) => row?.biddingNumber || row?.jodiDigit || row?.number || '—';
  const resolveTotalAmount = (row) =>
    row?.totalAmount ??
    row?.amount ??
    row?.total ??
    Object.values(row || {}).reduce((sum, val) => (typeof val === 'number' ? sum + val : sum), 0);

  if (loading) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (data.length === 0) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography>No data available</Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={2} sx={{ p: 2 }}>
      {data.map((row, index) => (
        <Card
          key={row.id || index}
          sx={{
            boxShadow: theme.shadows[2],
            borderRadius: 2,
          }}
        >
          <CardContent>
            <Stack spacing={1.25}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                {/* <Typography variant="subtitle2" fontWeight="bold">
                  Game Name
                </Typography> */}
                <Typography variant="subtitle2" fontWeight="bold">
                  {/* {index + 1} */}
                  Single Digit
                </Typography>
              </Stack>

              <Divider />

              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  Bidding Number:
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight="medium"
                  onClick={() => handleNavigate(row.id)}
                  sx={{ cursor: 'pointer', color: 'primary.main' }}
                >
                  {row.bidsNumber || '—'}
                </Typography>
              </Stack>

              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  Type:
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {row.type ? row.type.charAt(0).toUpperCase() + row.type.slice(1) : '—'}
                </Typography>
              </Stack>

              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  Total Amount:
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {row.totalAmount ? row.totalAmount.toLocaleString() : '0'}
                </Typography>
              </Stack>

              <Box sx={{ pt: 1, borderTop: `1px solid ${theme.palette.divider}` }}>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                  Game Type Breakdown:
                </Typography>
              </Box>

              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" color="text.secondary">
                  Bidding Number
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Amount
                </Typography>
              </Stack>

              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography
                  variant="body2"
                  fontWeight="medium"
                  onClick={() => handleNavigate(row.id)}
                  sx={{ cursor: 'pointer', color: 'primary.main', textAlign: 'center' }}
                >
                  {row?.bidsNumber}
                </Typography>
                <Typography variant="body2" fontWeight="medium" sx={{ textAlign: 'center' }}>
                  {row?.totalAmount}
                </Typography>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
}
