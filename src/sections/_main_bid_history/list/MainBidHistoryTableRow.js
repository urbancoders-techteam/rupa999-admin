import PropTypes from 'prop-types';
// @mui
import {
  TableCell,
  TableRow,
  Typography,
} from '@mui/material';
// components
import Label from '../../../components/label/Label';
import { fBidDigit } from '../../../utils/formatText';
import { fDateTime } from '../../../utils/formatTime';

// ----------------------------------------------------------------------

MainBidHistoryTableRow.propTypes = {
  index: PropTypes.number,
  row: PropTypes.object,
  selected: PropTypes.bool,
};

export default function MainBidHistoryTableRow({ index, row, selected }) {
  const {
    marketId,
    name,
    bidTable,
    totalPoints,
    userId,
    date,
    type,
    status,
    createdAt,
  } = row || {};

  const getDisplayDate = () => {
    if (date) return fDateTime(date);
    if (createdAt) return fDateTime(createdAt);
    return '—';
  };

  const formatText = (text) => {
    if (!text || text === '-') return '—';
    return text
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getStatusColor = () => {
    const statusLower = status?.toLowerCase();
    if (statusLower === 'won') return 'success';
    if (statusLower === 'lost') return 'error';
    return 'warning';
  };

  const getStatusLabel = () => {
    const statusLower = status?.toLowerCase();
    if (statusLower === 'won') return 'WON';
    if (statusLower === 'lost') return 'LOST';
    return status;
  };

  const getTypeLabel = () => {
    const typeLower = type?.toLowerCase();
    if (typeLower === 'open') return 'OPEN';
    if (typeLower === 'close') return 'CLOSE';
    return type;
  };

  const getTypeColor = () => {
    const typeLower = type?.toLowerCase();
    if (typeLower === 'open') return 'info';
    if (typeLower === 'close') return 'primary';
    return 'default';
  };

  return (
    <TableRow hover>
      <TableCell align="center">
        <Typography variant="subtitle2" noWrap>
          {index + 1 || '—'}
        </Typography>
      </TableCell>

      <TableCell align="left">
        <Typography variant="subtitle2" noWrap>
          {userId?.name || '—'}
        </Typography>
      </TableCell>

      <TableCell align="left">
        <Typography variant="body2" noWrap>
          {userId?.number || '—'}
        </Typography>
      </TableCell>

      <TableCell align="left">
        <Typography variant="subtitle2" noWrap>
          {marketId?.name || '—'}
        </Typography>
      </TableCell>

      <TableCell align="left">
        <Typography variant="body2" noWrap>
          {formatText(name) || '—'}
        </Typography>
      </TableCell>

      <TableCell align="left">
        <Label
          variant="soft"
          color={getTypeColor()}
          sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}
        >
          {getTypeLabel()}
        </Label>
      </TableCell>

      <TableCell align="left">
        <Typography variant="body2">
          {bidTable?.digit ? fBidDigit(bidTable.digit) : '—'}
        </Typography>
      </TableCell>

      <TableCell align="left">
        <Typography variant="body2">
          {totalPoints || '—'}
        </Typography>
      </TableCell>

      <TableCell align="left">
        <Label
          variant="soft"
          color={getStatusColor()}
          sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}
        >
          {getStatusLabel()}
        </Label>
      </TableCell>

      <TableCell align="left">
        <Typography variant="body2">
          {getDisplayDate()}
        </Typography>
      </TableCell>
    </TableRow>
  );
}

