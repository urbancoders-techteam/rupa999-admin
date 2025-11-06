import React from 'react';
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
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

// Dummy table data
const tableData = [
  {
    id: 1,
    userName: 'John Doe',
    marketName: 'Market A',
    number: '25',
    amount: 1500,
    winningAmount: 3000,
    createdAt: '06-11-2025',
  },
  {
    id: 2,
    userName: 'Jane Smith',
    marketName: 'Market B',
    number: '48',
    amount: 2000,
    winningAmount: 0,
    createdAt: '06-11-2025',
  },
];

export default function ResultTable() {
  return (
    <Card sx={{ p: 3, borderRadius: 2 }}>
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

      {/* ====== Data Table ====== */}
      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
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
    </Card>
  );
}
