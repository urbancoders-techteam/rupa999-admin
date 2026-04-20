import React from 'react';
import PropTypes from 'prop-types';
import {
  Typography,
  Stack,
  Box,
  Card,
  Divider,
  CircularProgress,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { fDateTime } from '../../../../utils/formatTime';

function BidHostoryMobileViewCardLayout({
  data = [],
  loading = false,
}) {
  const theme = useTheme();

  const getDisplayDate = (row) => {
    if (row.date) return fDateTime(row.date);
    if (row.createdAt) return fDateTime(row.createdAt);
    return 'N/A';
  };

  const formatText = (text) => {
    if (!text || text === '-') return '—';
    return text
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 400,
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
          No bid history found
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Stack spacing={2}>
        {data.map((row, index) => (
          <Card
            key={row.id || index}
            sx={{
              p: 2,
              borderRadius: 2,
              boxShadow: theme.shadows[1],
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            {/* Header */}
            <Box mb={1.5}>
              <Typography variant="subtitle1" fontWeight={600} noWrap>
                {row.marketId?.name || row.starlineMarketId?.name || row.marketName || 'N/A'}
              </Typography>
            </Box>

            <Divider sx={{ my: 1.5 }} />

            {/* Bid Details */}
            <Stack spacing={1}>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  Market Type:
                </Typography>
                <Typography variant="body2" fontWeight={500}>
                  {(row.marketType || (row.starlineMarketId ? 'starline' : 'main')).toUpperCase()}
                </Typography>
              </Stack>

              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  User Name:
                </Typography>
                <Typography variant="body2" fontWeight={500}>
                  {row.userId?.name || '—'}
                </Typography>
              </Stack>

              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  Phone:
                </Typography>
                <Typography variant="body2" fontWeight={500}>
                  {row.userId?.number || '—'}
                </Typography>
              </Stack>

              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  Game Name:
                </Typography>
                <Typography variant="body2" fontWeight={500}>
                  {formatText(row.name) || formatText(row.gameType) || '—'}
                </Typography>
              </Stack>

              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  Digit:
                </Typography>
                <Typography variant="body2" fontWeight={500}>
                  {row.bidTable?.digit || '—'}
                </Typography>
              </Stack>

              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  Point:
                </Typography>
                <Typography variant="body2" fontWeight={500}>
                  {row.totalPoints || '—'}
                </Typography>
              </Stack>

              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  Date:
                </Typography>
                <Typography variant="body2" fontWeight={500}>
                  {getDisplayDate(row)}
                </Typography>
              </Stack>
            </Stack>
          </Card>
        ))}
      </Stack>
    </Box>
  );
}

BidHostoryMobileViewCardLayout.propTypes = {
  data: PropTypes.array,
  loading: PropTypes.bool,
};

export default BidHostoryMobileViewCardLayout;
