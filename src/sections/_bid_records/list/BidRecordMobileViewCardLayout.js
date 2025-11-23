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
import { fDateTime } from '../../../utils/formatTime';
import Label from '../../../components/label';

function BidRecordMobileViewCardLayout({
  data = [],
  loading = false,
}) {
  const theme = useTheme();

  const getDisplayDate = (row) => {
    if (row.createdAt) return fDateTime(row.createdAt);
    return 'N/A';
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
          No bid records found
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
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.5}>
                <Typography variant="subtitle1" fontWeight={600} noWrap>
                  {row.marketName || 'N/A'}
                </Typography>
                <Label
                  variant="soft"
                  color={row.userName === 'Open' ? 'success' : 'warning'}
                  sx={{ textTransform: 'capitalize', fontSize: '0.75rem' }}
                >
                  {row.userName || 'N/A'}
                </Label>
              </Stack>
              <Typography variant="caption" color="text.secondary">
                ID: {row.id || '—'}
              </Typography>
            </Box>

            <Divider sx={{ my: 1.5 }} />

            {/* Bid Record Details */}
            <Stack spacing={1}>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  Game:
                </Typography>
                <Typography variant="body2" fontWeight={500}>
                  {row.session || '—'}
                </Typography>
              </Stack>

              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  Digit:
                </Typography>
                <Typography variant="body2" fontWeight={500}>
                  {row.number || '—'}
                </Typography>
              </Stack>

              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  Amount:
                </Typography>
                <Typography variant="body2" fontWeight={500}>
                  ₹{row.amount?.toLocaleString('en-IN') || '0'}
                </Typography>
              </Stack>

              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  Win Amount:
                </Typography>
                <Typography 
                  variant="body2" 
                  fontWeight={500}
                  sx={{ color: row.winAmount > 0 ? 'success.main' : 'text.primary' }}
                >
                  ₹{row.winAmount?.toLocaleString('en-IN') || '0'}
                </Typography>
              </Stack>

              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  Created At:
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

BidRecordMobileViewCardLayout.propTypes = {
  data: PropTypes.array,
  loading: PropTypes.bool,
};

export default BidRecordMobileViewCardLayout;

