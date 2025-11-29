import {
  Box,
  Card,
  CircularProgress,
  Grid,
  Pagination,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllWinningBidsAsync } from '../../../redux/services/bid_services';

ResultTable.propTypes = {
  marketId: PropTypes.string,
};

export default function ResultTable({ marketId }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const dispatch = useDispatch();

  const { winningBidsList, loading, pagination } = useSelector((state) => state.bid);

  // ===== Pagination states =====
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  // Reset page when marketId changes
  useEffect(() => {
    setPage(1);
  }, [marketId]);

  // Fetch winning bids on mount and when page or marketId changes
  useEffect(() => {
    const params = {
      page,
      limit: rowsPerPage,
    };

    // Only include marketId if it's provided (not null/undefined/empty)
    if (marketId) {
      params.marketId = marketId;
    }

    dispatch(getAllWinningBidsAsync(params));
  }, [dispatch, page, marketId]);

  const handleChangePage = (_, value) => {
    setPage(value);
  };

  // Transform API data to table format
  const tableData = (winningBidsList || []).map((bid) => ({
    id: bid._id,
    userName: bid.userId?.name || 'N/A',
    marketName: bid.marketId?.name || 'N/A',
    number: bid.bidTable?.digit || 'N/A',
    amount: bid.totalPoints || 0,
    winningAmount: bid.winAmount || 0,
    createdAt: bid.createdAt ? new Date(bid.createdAt).toLocaleDateString('en-GB') : 'N/A',
  }));

  // Calculate totals (for current page only, or fetch all for accurate totals)
  const totalBiddingAmount = tableData.reduce((sum, item) => sum + (item.amount || 0), 0);
  const totalWinningAmount = tableData.reduce((sum, item) => sum + (item.winningAmount || 0), 0);

  const pageCount = pagination?.totalPages || 1;

  return (
    <Card sx={{ p: 3, borderRadius: 2, mb: 2 }}>
      {/* ====== Top Summary Cards ====== */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Box
            sx={{
              bgcolor: 'grey.100',
              p: 1.5,
              borderRadius: 1,
              textAlign: 'center',
            }}
          >
            <Typography variant="subtitle2">
              Total Bidding Amount
            </Typography>
            <Typography variant="subtitle2">
              ₹{totalBiddingAmount.toLocaleString('en-IN')}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <Box
            sx={{
              bgcolor: 'grey.100',
              p: 1.5,
              borderRadius: 1,
              textAlign: 'center',
            }}
          >
            <Typography variant="subtitle2">
              Total Winning Amount
            </Typography>
            <Typography variant="subtitle2">
              ₹{totalWinningAmount.toLocaleString('en-IN')}
            </Typography>
          </Box>
        </Grid>
      </Grid>

      {loading && (
        <Box display="flex" justifyContent="center" alignItems="center" py={4}>
          <CircularProgress />
        </Box>
      )}

      {/* ====== Desktop Table View ====== */}
      {!loading && !isMobile && (
        <>
          <TableContainer
            component={Paper}
            sx={{
              borderRadius: 2,
              maxHeight: 420, // restrict table height
              overflowY: 'auto',
            }}
          >
            <Table stickyHeader>
              <TableHead
                sx={{
                  bgcolor: 'grey.50',
                  '& th': {
                    fontWeight: 600,
                    color: 'text.primary',
                  },
                }}
              >
                <TableRow>
                  <TableCell>User Name</TableCell>
                  <TableCell>Market Name</TableCell>
                  <TableCell>Number</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Winning Amount</TableCell>
                  <TableCell>Created At</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {tableData.map((row) => (
                  <TableRow
                    key={row.id}
                    hover
                    sx={{
                      '&:hover': { bgcolor: 'grey.100' },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <TableCell>{row.userName}</TableCell>
                    <TableCell>{row.marketName}</TableCell>
                    <TableCell>{row.number}</TableCell>
                    <TableCell>₹{row.amount.toLocaleString('en-IN')}</TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          color: row.winningAmount > 0 ? 'success.main' : 'text.secondary',
                          fontWeight: 600,
                        }}
                      >
                        ₹{row.winningAmount.toLocaleString('en-IN')}
                      </Typography>
                    </TableCell>
                    <TableCell>{row.createdAt}</TableCell>
                  </TableRow>
                ))}

                {tableData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No records found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <Box display="flex" justifyContent="center" mt={2}>
            <Pagination
              count={pageCount}
              page={page}
              onChange={handleChangePage}
              color="primary"
              shape="rounded"
            />
          </Box>
        </>
      )}

      {/* ====== Mobile Card View ====== */}
      {!loading && isMobile && (
        <>
          <Stack spacing={2} sx={{ maxHeight: 480, overflowY: 'auto' }}>
            {tableData.map((row) => (
              <Box
                key={row.id}
                sx={{
                  borderRadius: 2,
                  border: `1px solid ${theme.palette.divider}`,
                  p: 2,
                  boxShadow: theme.shadows[1],
                  bgcolor: 'background.paper',
                }}
              >
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {row.userName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>{row.marketName}</strong>
                  </Typography>
                </Stack>

                <Typography variant="body2">
                  Number: <strong>{row.number}</strong>
                </Typography>
                <Typography variant="body2">
                  Amount: <strong>₹{row.amount.toLocaleString('en-IN')}</strong>
                </Typography>
                <Typography variant="body2">
                  Winning Amount:{' '}
                  <strong
                    style={{
                      color: row.winningAmount > 0 ? 'green' : 'red',
                    }}
                  >
                    ₹{row.winningAmount.toLocaleString('en-IN')}
                  </strong>
                </Typography>

                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: 'block', mt: 1 }}
                >
                  Created: {row.createdAt}
                </Typography>
              </Box>
            ))}

            {tableData.length === 0 && (
              <Typography align="center" variant="body2" sx={{ color: 'text.secondary', py: 2 }}>
                No records found.
              </Typography>
            )}
          </Stack>

          {/* Pagination for mobile cards */}
          <Box display="flex" justifyContent="center" mt={2}>
            <Pagination
              count={pageCount}
              page={page}
              onChange={handleChangePage}
              color="primary"
              shape="rounded"
            />
          </Box>
        </>
      )}
    </Card>
  );
}
