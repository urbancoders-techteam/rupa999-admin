import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Stack, Typography, Card, Divider, Tooltip, Pagination } from '@mui/material';
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

export default function MarketDataMobileViewCardLayout({
  data = [],
  loading = false,
  date,
  marketId,
}) {
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

  // Build columns by gameType/type; each column lists its bids. One card, multi-column grid.
  const columns = useMemo(
    () =>
      data.map((row, idx) => {
        const bidData = row?.bidData || [];
        return {
          key: `${row?.gameType || 'game'}-${row?.type || 'type'}-${idx}`,
          gameType: row?.gameType || '—',
          type: row?.type || '',
          bids: bidData.map((item, bidIdx) => ({
            key: `${row?.gameType || 'game'}-${row?.type || 'type'}-${item?.bidsNumber || bidIdx}`,
            bidsNumber: item?.bidsNumber || '—',
            amount: Number(item?.totalAmount || 0),
          })),
          groupTotal: Array.isArray(bidData)
            ? bidData.reduce((sum, item) => sum + (Number(item?.totalAmount) || 0), 0)
            : 0,
        };
      }),
    [data]
  );

  const maxRows = useMemo(
    () => (columns.length ? Math.max(...columns.map((c) => c.bids.length)) : 0),
    [columns]
  );

  const columnCount = columns.length || 1;
  const gridTemplate = `60px repeat(${columnCount}, minmax(90px, 1fr))`;
  const rowsPerPage = 10;
  const [page, setPage] = useState(1);
  const totalPages = useMemo(
    () => (maxRows ? Math.ceil(maxRows / rowsPerPage) : 1),
    [maxRows, rowsPerPage]
  );

  useEffect(() => {
    if (page > totalPages) {
      setPage(1);
    }
  }, [page, totalPages]);

  const startIdx = (page - 1) * rowsPerPage;
  const endIdx = startIdx + rowsPerPage;
  const rowIndices = useMemo(
    () => Array.from({ length: maxRows }, (_, idx) => idx).slice(startIdx, endIdx),
    [maxRows, startIdx, endIdx]
  );

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
      <Card
        sx={
          {
            // boxShadow: theme.shadows[2],
            // borderRadius: 2,
          }
        }
      >
        <Box sx={{ p: 2 }}>
          {/* Header */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 1.5 }}
          >
            <Typography variant="subtitle1" fontWeight="bold">
              Bid Summary
            </Typography>
            {date && (
              <Typography variant="caption" color="text.secondary">
                Date: {date}
              </Typography>
            )}
          </Stack>

          <Box sx={{ width: '100%', overflowX: 'auto', pb: 1 }}>
            {/* Table header: one column for Sr No., then dynamic columns per gameType */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: gridTemplate,
                gap: 0.5,
                px: 1,
                py: 1,
                borderRadius: 1,
                backgroundColor: theme.palette.grey[100],
                alignItems: 'center',
                minWidth: 280,
              }}
            >
              <Typography variant="caption" fontWeight="bold" color="text.secondary">
                Sr No.
              </Typography>
              {columns.map((col) => (
                <Stack key={col.key} spacing={0.25}>
                  <Typography variant="caption" fontWeight="bold" color="text.primary">
                    {col.gameType}
                  </Typography>
                  {col.type ? (
                    <Label
                      variant="soft"
                      color={getTypeColor(col.type)}
                      sx={{ textTransform: 'capitalize', fontSize: '0.7rem', width: 'fit-content' }}
                    >
                      {col.type}
                    </Label>
                  ) : null}
                </Stack>
              ))}
              {columns.length === 0 && (
                <Typography variant="caption" color="text.secondary">
                  No columns
                </Typography>
              )}
            </Box>

            <Divider sx={{ my: 1 }} />

            {/* Body rows */}
            <Stack spacing={0.5} sx={{ minWidth: 80 }}>
              {rowIndices.map((rowIdx, idx) => (
                <Box
                  key={`row-${rowIdx}`}
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: gridTemplate,
                    gap: 0.5,
                    alignItems: 'stretch',
                    px: 1,
                    py: 0.75,
                    // borderRadius: 1,
                    // backgroundColor: theme.palette.background.paper,
                    // boxShadow: theme.shadows[1],
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    {startIdx + idx + 1}
                  </Typography>

                  {columns.map((col) => {
                    const item = col.bids[rowIdx];
                    if (!item) {
                      return (
                        <Typography
                          key={`${col.key}-empty-${rowIdx}`}
                          variant="body2"
                          color="text.disabled"
                        >
                          —
                        </Typography>
                      );
                    }

                    return (
                      <Stack key={item.key} spacing={0.25}>
                        <Tooltip title="Click here to view records" arrow placement="top">
                          <Typography
                            variant="body2"
                            onClick={() => handleNavigate(item.bidsNumber, col.type)}
                            sx={{
                              cursor: item.bidsNumber ? 'pointer' : 'default',
                              color: 'text.secondary',
                              '&:hover': {
                                color: item.bidsNumber ? 'primary.main' : 'text.secondary',
                              },
                            }}
                          >
                            {item.bidsNumber} = ₹{item.amount.toLocaleString()}
                          </Typography>
                        </Tooltip>
                      </Stack>
                    );
                  })}
                </Box>
              ))}

              {maxRows === 0 && (
                <Typography variant="body2" color="text.secondary">
                  No bids to display
                </Typography>
              )}

              {/* Group totals row */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: gridTemplate,
                  gap: 0.5,
                  alignItems: 'center',
                  px: 1,
                  py: 0.75,
                  mt: 0.5,
                  borderTop: `1px solid ${theme.palette.divider}`,
                }}
              >
                <Typography variant="body2" fontWeight="bold">
                  Total
                </Typography>
                {columns.map((col) => (
                  <Typography
                    key={`${col.key}-total`}
                    variant="body2"
                    fontWeight="bold"
                    color="primary.main"
                  >
                    ₹{col.groupTotal.toLocaleString()}
                  </Typography>
                ))}
              </Box>

              {maxRows > rowsPerPage && (
                <Stack direction="row" justifyContent="flex-end" sx={{ px: 1, pt: 1 }}>
                  <Pagination
                    size="small"
                    count={totalPages}
                    page={page}
                    onChange={(_, value) => setPage(value)}
                    siblingCount={0}
                    boundaryCount={1}
                  />
                </Stack>
              )}
            </Stack>
          </Box>
        </Box>
      </Card>
    </Stack>
  );
}
