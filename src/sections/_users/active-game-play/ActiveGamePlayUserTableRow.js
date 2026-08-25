import { TableCell, TableRow, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import Label from '../../../components/label';
import { fCurrency } from '../../../utils/formatNumber';
import { fDateTime } from '../../../utils/formatTime';

ActiveGamePlayUserTableRow.propTypes = {
  index: PropTypes.number.isRequired,
  row: PropTypes.shape({
    name: PropTypes.string,
    number: PropTypes.string,
    whatsappNumber: PropTypes.string,
    balance: PropTypes.number,
    gamePlays24h: PropTypes.number,
    gameAmount24h: PropTypes.number,
    lastLoginAt: PropTypes.string,
    lastPlayedAt: PropTypes.string,
    status: PropTypes.string,
  }).isRequired,
};

export default function ActiveGamePlayUserTableRow({ row, index }) {
  const {
    name,
    number,
    whatsappNumber,
    balance = 0,
    gamePlays24h = 0,
    gameAmount24h = 0,
    lastLoginAt,
    lastPlayedAt,
    status,
  } = row;

  return (
    <TableRow hover>
      <TableCell align="center">{index}</TableCell>

      <TableCell>
        <Typography variant="subtitle2">{name || '—'}</Typography>
      </TableCell>

      <TableCell>{number || whatsappNumber || '—'}</TableCell>

      <TableCell>{fCurrency(balance) || '₹ 0'}</TableCell>

      <TableCell>{gamePlays24h}</TableCell>

      <TableCell>{fCurrency(gameAmount24h) || '₹ 0'}</TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>{fDateTime(lastLoginAt) || '—'}</TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>{fDateTime(lastPlayedAt) || '—'}</TableCell>

      <TableCell>
        <Label color={status === 'active' ? 'success' : 'error'}>
          {status === 'active' ? 'Active' : 'Inactive'}
        </Label>
      </TableCell>
    </TableRow>
  );
}
