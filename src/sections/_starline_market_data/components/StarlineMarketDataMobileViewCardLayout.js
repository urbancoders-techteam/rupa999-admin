import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Stack, Typography, Card, Divider, Collapse, IconButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------

StarlineMarketDataMobileViewCardLayout.propTypes = {
  data: PropTypes.array,
  loading: PropTypes.bool,
};

export default function StarlineMarketDataMobileViewCardLayout({
  data = [],
  loading = false,
}) {
  const theme = useTheme();
  const [expandedItems, setExpandedItems] = useState({});

  const toggleExpand = (index) => {
    setExpandedItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  if (loading) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography>No data available</Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={2} sx={{ p: 2 }}>
      {data.map((row, index) => {
        const { gameType, bidData = [] } = row || {};
        const isExpanded = expandedItems[index] || false;
        const groupTotal = Array.isArray(bidData)
          ? bidData.reduce((sum, item) => sum + (Number(item?.totalAmount) || 0), 0)
          : 0;
        const bidCount = Array.isArray(bidData) ? bidData.length : 0;

        return (
          <Card key={`starline-market-data-${index}`} sx={{ p: 2 }}>
            <Stack spacing={1.5}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {gameType || '—'}
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => toggleExpand(index)}
                  disabled={bidCount === 0}
                >
                  <Iconify
                    icon={isExpanded ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
                    width={20}
                  />
                </IconButton>
              </Box>

              <Divider />

              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  Bid Count:
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {bidCount}
                </Typography>
              </Stack>

              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  Group Total:
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  ₹{groupTotal.toLocaleString()}
                </Typography>
              </Stack>

              {bidCount > 0 && (
                <Collapse in={isExpanded}>
                  <Box sx={{ mt: 2, pt: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
                    <Typography variant="subtitle2" gutterBottom sx={{ mb: 1.5 }}>
                      Bid Details ({bidCount} items)
                    </Typography>
                    <Stack spacing={1}>
                      {bidData.map((item, idx) => {
                        const digit = item?.bidsNumber;
                        const amount = Number(item?.totalAmount) || 0;
                        const count = Number(item?.bidCount) || 0;
                        return (
                          <Box
                            key={`bid-${idx}`}
                            sx={{
                              p: 1.5,
                              borderRadius: 1,
                              bgcolor: 'action.hover',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}
                          >
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {digit || '—'}
                            </Typography>
                            <Stack direction="row" spacing={2}>
                              <Typography variant="body2" color="text.secondary">
                                Count: {count}
                              </Typography>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                ₹{amount.toLocaleString()}
                              </Typography>
                            </Stack>
                          </Box>
                        );
                      })}
                    </Stack>
                  </Box>
                </Collapse>
              )}
            </Stack>
          </Card>
        );
      })}
    </Stack>
  );
}
