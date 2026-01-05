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
  marketId: PropTypes.string,
};

export default function MarketDataMobileViewCardLayout({ data = [], loading = false, date, marketId }) {
  const theme = useTheme();
  const navigate = useNavigate();

  const getTypeColor = (typeValue) => {
    if (!typeValue) return 'default';
    const lowerType = typeValue.toLowerCase();
    if (lowerType === 'open') return 'success';
    if (lowerType === 'close') return 'error';
    return 'default';
  };

  const handleNavigate = (digit, type) => {
    if (!digit || !type) return;
    const id = `${digit}_${type}`;
    const url = PATH_DASHBOARD.markets.marketdata.bidrecord(id);
    // Add date as query parameter if provided
    const searchParams = new URLSearchParams();
    if (date) {
      searchParams.set('date', date);
    }
    if (marketId) {
      searchParams.set('marketId', marketId);
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

  return (
    <Stack spacing={2} sx={{ p: 2 }}>
      {data.map((row, index) => {
        // Calculate group total
        const groupTotal = Array.isArray(row?.bidData)
          ? row.bidData.reduce((sum, item) => sum + (Number(item?.totalAmount) || 0), 0)
          : 0;

        return (
          <Card
            key={`${row?.gameType || 'game'}-${row?.type || 'type'}-${index}`}
            sx={{
              boxShadow: theme.shadows[2],
              borderRadius: 2,
            }}
          >
            <CardContent>
              <Stack spacing={1}>
                {/* Row 1: Game Type | Group Total */}
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="subtitle2" fontWeight="bold">
                    {row.gameType || '—'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Group Total
                  </Typography>
                </Stack>

                {/* Row 2: Session Label | Amount */}
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Label
                    variant="soft"
                    color={getTypeColor(row.type)}
                    sx={{ textTransform: 'capitalize', fontSize: '0.75rem' }}
                  >
                    {row.type || '—'}
                  </Label>
                  <Typography variant="subtitle2" fontWeight="bold" color="primary.main">
                    ₹{groupTotal.toLocaleString()}
                  </Typography>
                </Stack>

                {/* Bid Data Header */}
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 0.5 }}>
                  <Typography variant="body2" color="text.secondary">
                    Bidding Number
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Amount
                  </Typography>
                </Stack>

                {/* Bid Data List */}
                {row?.bidData?.map((item, idx) => (
                  <Stack
                    key={`${item?.bidsNumber || 'digit'}-${idx}`}
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Tooltip title="Click to view records" arrow placement="left">
                      <Typography
                        variant="body2"
                        onClick={() => handleNavigate(item?.bidsNumber, row?.type)}
                        sx={{ cursor: item?.bidsNumber ? 'pointer' : 'default', color: item?.bidsNumber ? 'primary.main' : 'text.secondary' }}
                      >
                        {item.bidsNumber}
                      </Typography>
                    </Tooltip>
                    <Typography variant="body2" color="text.secondary">
                      ₹{Number(item.totalAmount || 0).toLocaleString()}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </CardContent>
          </Card>
        );
      })}
    </Stack>
  );
}
