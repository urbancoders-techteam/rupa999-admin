import { TableCell, TableRow, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { fCurrency } from '../../../../utils/formatNumber';
import { fDateTime } from '../../../../utils/formatTime';

// ----------------------------------------------------------------------

TransactionTableRow.propTypes = {
  index: PropTypes.number,
  row: PropTypes.shape({
    _id: PropTypes.string,
    date: PropTypes.string,
    particulars: PropTypes.string,
    debit: PropTypes.number,
    credit: PropTypes.number,
    balance: PropTypes.number,
    user: PropTypes.object,
    admin: PropTypes.object,
    remarks: PropTypes.string,
  }),
};

export default function TransactionTableRow({ row, index }) {
  const { date, particulars, debit, credit, balance, user, admin, remarks } = row;

  return (
    <TableRow hover>

      <TableCell>
        <Typography variant="body2">{index + 1}</Typography>
      </TableCell>

      <TableCell width="200px">
        <Typography variant="subtitle2" >{fDateTime(date)}</Typography>
      </TableCell>

      <TableCell>
        <Typography variant="body2">{particulars}</Typography>
      </TableCell>

      <TableCell align="left">
        <Typography variant="body2" color={debit > 0 ? 'error.main' : 'text.secondary'}>
          {debit > 0 ? fCurrency(debit) : '-'}
        </Typography>
      </TableCell>

      <TableCell align="left">
        <Typography variant="body2" color={credit > 0 ? 'success.main' : 'text.secondary'}>
          {credit > 0 ? fCurrency(credit) : '-'}
        </Typography>
      </TableCell>

      <TableCell align="left">
        <Typography variant="body2" fontWeight="fontWeightMedium">
          {fCurrency(balance)}
        </Typography>
      </TableCell>

      <TableCell align="left">
        <Typography variant="body2">{admin.name}</Typography>
      </TableCell>
    </TableRow>
  );
}

