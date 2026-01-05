import PropTypes from 'prop-types';
import { Box, Stack, Typography, Card, CardContent, Divider, Tooltip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { PATH_DASHBOARD } from '../../../routes/paths';
import Label from '../../../components/label';

// ----------------------------------------------------------------------

MarketDataMobileViewCardLayout.propTypes = {
  data: PropTypes.array,
  loading: PropTypes.bool,
  date: PropTypes.string,
};

export default function MarketDataMobileViewCardLayout({ data = [], loading = false, date }) {
  const theme = useTheme();
  const navigate = useNavigate();

  const getTypeColor = (typeValue) => {
    if (!typeValue) return 'default';
    const lowerType = typeValue.toLowerCase();
    if (lowerType === 'open') return 'success';
    if (lowerType === 'close') return 'error';
    return 'default';
  };

  const handleNavigate = (id) => {
    const url = PATH_DASHBOARD.markets.marketdata.bidrecord(id);
    // Add date as query parameter if provided
    const searchParams = new URLSearchParams();
    if (date) {
      searchParams.set('date', date);
    }
    const queryString = searchParams.toString();
    navigate(queryString ? `${url}?${queryString}` : url);
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

  console.log("data::::::::::>", data);

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
                <Typography variant="subtitle2" fontWeight="bold">
                  {row.gameType || '—'}
                </Typography>

                <Label
                  variant="soft"
                  color={getTypeColor(row.type)}
                  sx={{ textTransform: 'capitalize', fontSize: '0.75rem' }}
                >
                  {row.type || '—'}
                </Label>
              </Stack>

              <Divider />

              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" color="text.secondary">
                  Bidding Number
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Amount
                </Typography>
              </Stack>
              
              {row?.bidData?.map((item) => (
                <Stack key={item.id} direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" color="text.secondary" textAlign="center">
                    {item.bidsNumber}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" textAlign="center">
                    {item.totalAmount}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
}
