import { TableCell, TableRow, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { PATH_DASHBOARD } from '../../../routes/paths';

// ----------------------------------------------------------------------

MarketDataTableRow.propTypes = {
  index: PropTypes.number,
  row: PropTypes.object,
  date: PropTypes.string,
};

export default function MarketDataTableRow({ index, row, date }) {
  const { id, bidsNumber, type, totalAmount, totalBidsUserCount } = row;

  console.log("row::::::::::>>", row);

  const navigate = useNavigate();


  const handleNavigate = () => {
    if (id) {
      const url = PATH_DASHBOARD.markets.marketdata.bidrecord(id);
      // Add date as query parameter if provided
      const searchParams = new URLSearchParams();
      if (date) {
        searchParams.set('date', date);
      }
      const queryString = searchParams.toString();
      navigate(queryString ? `${url}?${queryString}` : url);
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
        <Typography variant="body2">{totalBidsUserCount}</Typography>
      </TableCell>

      <TableCell align="left">
        <Typography variant="body2">{totalAmount ? totalAmount.toLocaleString() : '0'}</Typography>
      </TableCell>
    </TableRow>
  );
}
