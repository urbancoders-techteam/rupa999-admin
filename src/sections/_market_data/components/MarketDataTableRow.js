import PropTypes from 'prop-types';
import { TableRow, TableCell, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { PATH_DASHBOARD } from '../../../routes/paths';

// ----------------------------------------------------------------------

MarketDataTableRow.propTypes = {
  index: PropTypes.number,
  row: PropTypes.object,
};

export default function MarketDataTableRow({ index, row }) {
  const { id, bidsNumber, type, totalAmount } = row;

  const navigate = useNavigate();

  const id = row.id || row._id;
  const biddingNumber = row.bidsNumber || row.biddingNumber || row.jodiDigit || '—';
  const totalAmount =
    row.totalAmount ??
    row.amount ??
    row.total ??
    Object.values(row || {}).reduce((sum, val) => (typeof val === 'number' ? sum + val : sum), 0);

  const handleNavigate = () => {
    if (id) {
      navigate(PATH_DASHBOARD.markets.marketdata.bidrecord(id));
    }
  };

  const getTypeLabel = (typeValue) => {
    if (!typeValue) return '—';
    return typeValue.charAt(0).toUpperCase() + typeValue.slice(1);
  };

  return (
    <TableRow hover>
      <TableCell align="center">
        <Typography variant="body2">{index}</Typography>
      </TableCell>

      <TableCell align="left">
        <Typography
          variant="body2"
          onClick={handleNavigate}
          sx={{ cursor: id ? 'pointer' : 'default', color: id ? 'primary.main' : 'text.primary' }}
        >
          {bidsNumber || '—'}
        </Typography>
      </TableCell>

      <TableCell align="left">
        <Typography variant="body2">{getTypeLabel(type)}</Typography>
      </TableCell>

      <TableCell align="left">
        <Typography variant="body2">{totalAmount ? totalAmount.toLocaleString() : '0'}</Typography>
      </TableCell>
    </TableRow>
  );
}
