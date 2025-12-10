import PropTypes from 'prop-types';
import { Box, Stack, Typography, Card, CardContent } from '@mui/material';
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
            <Stack spacing={1.5}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  pb: 1,
                  borderBottom: `1px solid ${theme.palette.divider}`,
                }}
              >
                <Typography variant="subtitle2" fontWeight="bold">
                  Sr No: {index + 1}
                </Typography>
              </Box>

              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  Single Digit:
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {row.singleDigit || '0'}
                </Typography>
              </Stack>

              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  Jodi Digit:
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight="medium"
                  onClick={() => handleNavigate(row.id)}
                  sx={{ cursor: 'pointer', color: 'primary.main' }}
                >
                  {row.jodiDigit || '0'}
                </Typography>
              </Stack>

              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  Single Pana:
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {row.singlePana || '0'}
                </Typography>
              </Stack>

              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  Double Pana:
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {row.doublePana || '0'}
                </Typography>
              </Stack>

              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  Triple Pana:
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {row.triplePana || '0'}
                </Typography>
              </Stack>

              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  Half Sangam A:
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {row.halfSangamA || '0'}
                </Typography>
              </Stack>

              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  Half Sangam B:
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {row.halfSangamB || '0'}
                </Typography>
              </Stack>

              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  Full Sangam:
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {row.fullSangam || '0'}
                </Typography>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
}

