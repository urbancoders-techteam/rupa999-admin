import React, { useState } from 'react';
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
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

// Dummy table data (10 items for testing scroll + pagination)
const tableData = Array.from({ length: 10 }).map((_, i) => ({
  id: i + 1,
  userName: `User ${i + 1}`,
  marketName: `Market ${String.fromCharCode(65 + i)}`,
  number: Math.floor(Math.random() * 90 + 10).toString(),
  amount: Math.floor(Math.random() * 2000 + 500),
  winningAmount: i % 2 === 0 ? Math.floor(Math.random() * 3000) : 0,
  createdAt: '06-11-2025',
}));

export default function ResultTable() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // ===== Pagination states =====
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;
  const pageCount = Math.ceil(tableData.length / rowsPerPage);

  const handleChangePage = (_, value) => {
    setPage(value);
  };

  const paginatedData = tableData.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <Card sx={{ p: 3, borderRadius: 2, mb: 2 }}>
      {/* ====== Top Summary Cards ====== */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Box
            sx={{
              bgcolor: 'grey.100',
              p: 1.5,
              borderRadius: 1,
              textAlign: 'center',
            }}
          >
            <Typography variant="subtitle2">Total Bidding Amount 0</Typography>
          </Box>
        </Grid>

        <Grid item xs={12} md={3}>
          <Box
            sx={{
              bgcolor: 'grey.100',
              p: 1.5,
              borderRadius: 1,
              textAlign: 'center',
            }}
          >
            <Typography variant="subtitle2">Total Winning Amount 0</Typography>
          </Box>
        </Grid>
      </Grid>

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
                  <TableCell>Market Name</TableCell>
                  <TableCell>Number</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Winning Amount</TableCell>
                  <TableCell>Action</TableCell>
                  <TableCell>Created At</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {paginatedData.map((row) => (
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
                    <TableCell>{row.amount}</TableCell>
                    <TableCell>{row.winningAmount}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton color="primary" size="small">
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton color="error" size="small">
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                    <TableCell>{row.createdAt}</TableCell>
                  </TableRow>
                ))}

                {tableData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
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
      {isMobile && (
        <>
          <Stack spacing={2} sx={{ maxHeight: 480, overflowY: 'auto' }}>
            {paginatedData.map((row) => (
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
                  Amount: <strong>{row.amount}</strong>
                </Typography>
                <Typography variant="body2">
                  Winning Amount:{' '}
                  <strong
                    style={{
                      color: row.winningAmount > 0 ? 'green' : 'red',
                    }}
                  >
                    {row.winningAmount}
                  </strong>
                </Typography>

                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: 'block', mt: 1 }}
                >
                  Created: {row.createdAt}
                </Typography>

                {/* Action buttons */}
                <Stack direction="row" spacing={1} mt={1}>
                  <IconButton color="primary" size="small">
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton color="error" size="small">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Stack>
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
