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
  Tooltip,
} from '@mui/material';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import Iconify from '../../../components/iconify';
import { PATH_DASHBOARD } from '../../../routes/paths';

// ----------------------------------------------------------------------

MarketDataTableRow.propTypes = {
  index: PropTypes.number,
  row: PropTypes.object,
  date: PropTypes.string,
  marketId: PropTypes.string,
};

export default function MarketDataTableRow({ index, row, date, marketId }) {
  const { gameType, type, bidData = [] } = row || {};
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const handleNavigate = (digit) => {
    if (!digit || !type) return;
    const id = `${digit}_${type}`;
    const url = PATH_DASHBOARD.markets.marketdata.bidrecord(id);

    const searchParams = new URLSearchParams();
    if (date) searchParams.set('date', date);
    if (marketId) searchParams.set('marketId', marketId);

    const queryString = searchParams.toString();
    navigate(queryString ? `${url}?${queryString}` : url);
  };

  const getTypeLabel = (typeValue) => {
    if (!typeValue) return '—';
    return typeValue.charAt(0).toUpperCase() + typeValue.slice(1);
  };

  const groupTotal = Array.isArray(bidData)
    ? bidData.reduce((sum, item) => sum + (Number(item?.totalAmount) || 0), 0)
    : 0;

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
          <Typography variant="body2">{getTypeLabel(type)}</Typography>
        </TableCell>

        <TableCell align="left">
          <Typography variant="body2">{hasBidData ? bidData.length : 0}</Typography>
        </TableCell>

        <TableCell align="left">
          <Typography variant="body2">{groupTotal.toLocaleString()}</Typography>
        </TableCell>
      </TableRow>

      {/* Collapsible row for bid data */}
      <TableRow>
        <TableCell sx={{ py: 0 }} colSpan={6}>
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
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bidData.map((item, idx) => {
                    const digit = item?.bidsNumber;
                    const amount = Number(item?.totalAmount) || 0;
                    return (
                      <TableRow key={`${digit || 'digit'}-${idx}`}>
                        <TableCell>
                          <Tooltip title="Click to view records" arrow placement="left">
                            <Typography
                              variant="body2"
                              onClick={() => handleNavigate(digit)}
                              sx={{
                                cursor: digit ? 'pointer' : 'default',
                                color: digit ? 'primary.main' : 'text.primary',
                                display: 'inline-block',
                                '&:hover': digit ? { textDecoration: 'underline' } : {},
                              }}
                            >
                              {digit || '—'}
                            </Typography>
                          </Tooltip>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2">₹{amount.toLocaleString()}</Typography>
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
