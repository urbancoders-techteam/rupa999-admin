import PropTypes from 'prop-types';
// @mui
import {
  TableRow,
  TableCell,
  Typography,
} from '@mui/material';
// components
import { fDateTime } from '../../../../utils/formatTime';
import { fBidDigit } from '../../../../utils/formatText';

// ----------------------------------------------------------------------

UserBidHistoryTableRow.propTypes = {
  index: PropTypes.number,
  row: PropTypes.object,
  selected: PropTypes.bool,
};

export default function UserBidHistoryTableRow({ index, row, selected }) {
  const {
    marketId,
    name,
    bidTable,
    debit,
    totalPoints,
    date,
    createdAt,
  } = row || {};

  const getDisplayDate = () => {
    if (date) return fDateTime(date);
    if (createdAt) return fDateTime(createdAt);
    return '—';
  };

  const formatText = text =>
    text
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

  return (
    <TableRow hover>
      <TableCell align="left">
          <Typography variant="subtitle2" noWrap>
            {index + 1 || '—'}
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
          <Typography variant="body2">
            {fBidDigit(debit)}
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

