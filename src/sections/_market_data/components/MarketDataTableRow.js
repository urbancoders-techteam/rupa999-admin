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
  const {
    id,
    jodiDigit,
    halfSangamA,
    halfSangamB,
    fullSangam,
    singleDigit,
    singlePana,
    doublePana,
    triplePana,
  } = row;

  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(PATH_DASHBOARD.markets.marketdata.bidrecord(id));
  };

  return (
    <TableRow hover>
      <TableCell align="center">
        <Typography variant="body2">{index}</Typography>
      </TableCell>

      <TableCell align="left">
        <Typography variant="body2" onClick={handleNavigate} sx={{ cursor: 'pointer' }}>
          {jodiDigit || '—'}
        </Typography>
      </TableCell>

      <TableCell align="left">
        <Typography variant="body2">{halfSangamA || '0'}</Typography>
      </TableCell>

      <TableCell align="left">
        <Typography variant="body2">{halfSangamB || '0'}</Typography>
      </TableCell>

      <TableCell align="left">
        <Typography variant="body2">{fullSangam || '0'}</Typography>
      </TableCell>

      <TableCell align="left">
        <Typography variant="body2">{singleDigit || '0'}</Typography>
      </TableCell>

      <TableCell align="left">
        <Typography variant="body2">{singlePana || '0'}</Typography>
      </TableCell>

      <TableCell align="left">
        <Typography variant="body2">{doublePana || '0'}</Typography>
      </TableCell>

      <TableCell align="left">
        <Typography variant="body2">{triplePana || '0'}</Typography>
      </TableCell>
    </TableRow>
  );
}
