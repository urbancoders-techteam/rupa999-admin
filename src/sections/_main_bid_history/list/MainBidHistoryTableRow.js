import PropTypes from 'prop-types';
// @mui
import {
  TableRow,
  TableCell,
  Typography,
} from '@mui/material';
// components
import { fDateTime } from '../../../utils/formatTime';
import { fBidDigit } from '../../../utils/formatText';

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

  return (
    <TableRow hover>
      <TableCell align="center">
        <Typography variant="subtitle2" noWrap>
          {index + 1 || '—'}
        </Typography>
      </TableCell>

      <TableCell align="left">
        <Typography variant="subtitle2" noWrap>
          {userId.name || '—'}
        </Typography>
      </TableCell>
     
      <TableCell align="left">
        <Typography variant="body2" noWrap>
          {userId.number || '—'}
        </Typography>
      </TableCell>

      <TableCell align="left">
        <Typography variant="subtitle2" noWrap>
          {marketId.name || '—'}
        </Typography>
      </TableCell>

      <TableCell align="left">
        <Typography variant="body2" noWrap>
          {formatText(name) || '—'}
        </Typography>
      </TableCell>

      <TableCell align="left">
        <Typography variant="body2">
          {fBidDigit(bidTable.digit) || '—'}
        </Typography>
      </TableCell>

      <TableCell align="left">
        <Typography variant="body2">
          {totalPoints || '—'}
        </Typography>
      </TableCell>

      <TableCell align="left">
        <Typography variant="body2">
          {getDisplayDate()}
        </Typography>
      </TableCell>
    </TableRow>
  );
}

