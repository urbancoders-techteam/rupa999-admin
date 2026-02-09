import { useState } from 'react';
import {
  Box,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------

StarlineMarketDataTableRow.propTypes = {
  index: PropTypes.number,
  row: PropTypes.object,
};

export default function StarlineMarketDataTableRow({ index, row }) {
  const { gameType, bidData = [] } = row || {};
  const [open, setOpen] = useState(false);

  const groupTotal = Array.isArray(bidData)
    ? bidData.reduce((sum, item) => sum + (Number(item?.totalAmount) || 0), 0)
    : 0;

  const bidCount = Array.isArray(bidData) ? bidData.length : 0;
  const hasBidData = Array.isArray(bidData) && bidData.length > 0;

  return (
    <>
      <TableRow hover sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell align="center" sx={{ width: 40 }}>
          <IconButton
            size="small"
            onClick={() => setOpen(!open)}
            disabled={!hasBidData}
            sx={{ p: 0.5 }}
          >
            <Iconify
              icon={open ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
              width={18}
              sx={{ color: hasBidData ? 'text.primary' : 'text.disabled' }}
            />
          </IconButton>
        </TableCell>

        <TableCell align="center">
          <Typography variant="body2">{index + 1}</Typography>
        </TableCell>

        <TableCell align="left">
          <Typography variant="body2">{gameType || '—'}</Typography>
        </TableCell>

        <TableCell align="left">
          <Typography variant="body2">{bidCount}</Typography>
        </TableCell>

        <TableCell align="left">
          <Typography variant="body2">{groupTotal.toLocaleString()}</Typography>
        </TableCell>
      </TableRow>

      {/* Collapsible row for bid data */}
      <TableRow>
        <TableCell sx={{ py: 0 }} colSpan={5}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ py: 2, px: 1 }}>
              <Typography variant="subtitle2" gutterBottom sx={{ mb: 1.5 }}>
                Bid Details ({bidData.length} items)
              </Typography>
              <Table size="small" sx={{ backgroundColor: 'action.hover', borderRadius: 1 }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Bidding Number</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="right">Total Amount</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="right">Bid Count</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bidData.map((item, idx) => {
                    const digit = item?.bidsNumber;
                    const amount = Number(item?.totalAmount) || 0;
                    const count = Number(item?.bidCount) || 0;
                    return (
                      <TableRow key={`${digit || 'digit'}-${idx}`}>
                        <TableCell>
                          <Typography variant="body2">{digit || '—'}</Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2">₹{amount.toLocaleString()}</Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2">{count}</Typography>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}
