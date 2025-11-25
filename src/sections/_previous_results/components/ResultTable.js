import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Card,
  Grid,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  IconButton,
  useMediaQuery,
  Stack,
  Pagination,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useDispatch } from 'react-redux';
import { useSnackbar } from '../../../components/snackbar';
import { fDateTime } from '../../../utils/formatTime';
import Iconify from '../../../components/iconify';
import { calculateWinnersAsync, getWinnersAsync } from '../../../redux/services/market_result_services';

export default function ResultTable({ marketResultId, onClose }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  
  const [winners, setWinners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [totalWinAmount, setTotalWinAmount] = useState(0);
  const [totalWinners, setTotalWinners] = useState(0);

  // ===== Pagination states =====
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;
  const pageCount = Math.ceil(winners.length / rowsPerPage);

  const handleChangePage = (_, value) => {
    setPage(value);
  };

  const paginatedData = winners.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const fetchWinners = async () => {
    if (!marketResultId) return;
    
    setLoading(true);
    try {
      const result = await dispatch(getWinnersAsync(marketResultId)).unwrap();
      if (result?.data) {
        setWinners(result.data.winners || []);
        setTotalWinAmount(result.data.totalWinAmount || 0);
        setTotalWinners(result.data.totalWinners || 0);
      }
    } catch (error) {
      console.error('Error fetching winners:', error);
      // If no winners found, show empty state
      setWinners([]);
      setTotalWinAmount(0);
      setTotalWinners(0);
    } finally {
      setLoading(false);
    }
  };

  const handleCalculateWinners = async () => {
    if (!marketResultId) return;
    
    setCalculating(true);
    try {
      const result = await dispatch(calculateWinnersAsync(marketResultId)).unwrap();
      if (result?.data) {
        setWinners(result.data.winners || []);
        setTotalWinAmount(result.data.totalWinAmount || 0);
        setTotalWinners(result.data.totalWinners || 0);
        enqueueSnackbar('Winners calculated successfully!', { variant: 'success' });
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to calculate winners';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    } finally {
      setCalculating(false);
    }
  };

  // Fetch winners when marketResultId changes
  useEffect(() => {
    if (marketResultId) {
      fetchWinners();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [marketResultId]);

  return (
    <Card sx={{ p: 3, borderRadius: 2, mb: 2 }}>
      {/* Header with close button and calculate button */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h6">Winners List</Typography>
        <Stack direction="row" spacing={1}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCalculateWinners}
            disabled={calculating}
            startIcon={calculating ? <CircularProgress size={16} /> : <Iconify icon="eva:refresh-outline" />}
          >
            {calculating ? 'Calculating...' : 'Calculate Winners'}
          </Button>
          {onClose && (
            <IconButton onClick={onClose} color="error">
              <Iconify icon="eva:close-fill" />
            </IconButton>
          )}
        </Stack>
      </Stack>

      {/* ====== Top Summary Cards ====== */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Box
            sx={{
              bgcolor: 'primary.lighter',
              p: 1.5,
              borderRadius: 1,
              textAlign: 'center',
            }}
          >
            <Typography variant="subtitle2" color="primary.main" fontWeight={600}>
              Total Winners
            </Typography>
            <Typography variant="h5" color="primary.main" fontWeight={700}>
              {totalWinners}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <Box
            sx={{
              bgcolor: 'success.lighter',
              p: 1.5,
              borderRadius: 1,
              textAlign: 'center',
            }}
          >
            <Typography variant="subtitle2" color="success.main" fontWeight={600}>
              Total Winning Amount
            </Typography>
            <Typography variant="h5" color="success.main" fontWeight={700}>
              ₹{totalWinAmount.toLocaleString()}
            </Typography>
          </Box>
        </Grid>
      </Grid>

      {loading && (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
          <CircularProgress />
        </Box>
      )}

      {!loading && winners.length === 0 && (
        <Alert severity="info">
          No winners found. Click &quot;Calculate Winners&quot; to process winners.
        </Alert>
      )}

      {!loading && winners.length > 0 && (

        <>
          {/* ====== Desktop Table View ====== */}
          {!isMobile && (
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
                      <TableCell>User Number</TableCell>
                      <TableCell>Market Name</TableCell>
                      <TableCell>Game Type</TableCell>
                      <TableCell>Bid Type</TableCell>
                      <TableCell>Digit</TableCell>
                      <TableCell>Bid Amount</TableCell>
                      <TableCell>Winning Amount</TableCell>
                      <TableCell>Created At</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {paginatedData.map((row, index) => (
                      <TableRow
                        key={row.bidId || index}
                        hover
                        sx={{
                          '&:hover': { bgcolor: 'grey.100' },
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <TableCell>{row.userName || '-'}</TableCell>
                        <TableCell>{row.userNumber || '-'}</TableCell>
                        <TableCell>{row.marketName || '-'}</TableCell>
                        <TableCell>{row.gameType || '-'}</TableCell>
                        <TableCell>{row.bidType || '-'}</TableCell>
                        <TableCell><strong>{row.digit || '-'}</strong></TableCell>
                        <TableCell>₹{row.bidAmount || 0}</TableCell>
                        <TableCell>
                          <Typography variant="body2" color="success.main" fontWeight={600}>
                            ₹{row.winAmount || 0}
                          </Typography>
                        </TableCell>
                        <TableCell>{fDateTime(row.createdAt)}</TableCell>
                      </TableRow>
                    ))}

                    {winners.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={9} align="center">
                          No winners found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Pagination */}
              {winners.length > 0 && (
                <Box display="flex" justifyContent="center" mt={2}>
                  <Pagination
                    count={pageCount}
                    page={page}
                    onChange={handleChangePage}
                    color="primary"
                    shape="rounded"
                  />
                </Box>
              )}
            </>
          )}

          {/* ====== Mobile Card View ====== */}
          {isMobile && (
            <>
              <Stack spacing={2} sx={{ maxHeight: 480, overflowY: 'auto' }}>
                {paginatedData.map((row, index) => (
                  <Box
                    key={row.bidId || index}
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
                        {row.userName || '-'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <strong>{row.marketName || '-'}</strong>
                      </Typography>
                    </Stack>

                    <Typography variant="body2">
                      Number: <strong>{row.userNumber || '-'}</strong>
                    </Typography>
                    <Typography variant="body2">
                      Game Type: <strong>{row.gameType || '-'}</strong>
                    </Typography>
                    <Typography variant="body2">
                      Bid Type: <strong>{row.bidType || '-'}</strong>
                    </Typography>
                    <Typography variant="body2">
                      Digit: <strong>{row.digit || '-'}</strong>
                    </Typography>
                    <Typography variant="body2">
                      Bid Amount: <strong>₹{row.bidAmount || 0}</strong>
                    </Typography>
                    <Typography variant="body2">
                      Winning Amount:{' '}
                      <strong
                        style={{
                          color: row.winAmount > 0 ? 'green' : 'red',
                        }}
                      >
                        ₹{row.winAmount || 0}
                      </strong>
                    </Typography>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: 'block', mt: 1 }}
                    >
                      Created: {fDateTime(row.createdAt)}
                    </Typography>
                  </Box>
                ))}

                {winners.length === 0 && (
                  <Typography align="center" variant="body2" sx={{ color: 'text.secondary', py: 2 }}>
                    No winners found.
                  </Typography>
                )}
              </Stack>

              {/* Pagination for mobile cards */}
              {winners.length > 0 && (
                <Box display="flex" justifyContent="center" mt={2}>
                  <Pagination
                    count={pageCount}
                    page={page}
                    onChange={handleChangePage}
                    color="primary"
                    shape="rounded"
                  />
                </Box>
              )}
            </>
          )}
        </>
      )}
    </Card>
  );
}

ResultTable.propTypes = {
  marketResultId: PropTypes.string,
  onClose: PropTypes.func,
};
