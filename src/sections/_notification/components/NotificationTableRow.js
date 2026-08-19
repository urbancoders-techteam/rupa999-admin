import PropTypes from 'prop-types';
import { Button, TableRow, TableCell, IconButton } from '@mui/material';
import Iconify from '../../../components/iconify';

export default function NotificationTableRow({
  row,
  index,
  selected,
  onSelectRow,
  onResend,
  onDeleteRow,
}) {
  return (
    <TableRow hover selected={selected}>
      <TableCell>{index}</TableCell>
      <TableCell>{row.title}</TableCell>
      <TableCell>{row.description}</TableCell>
      <TableCell align="center">
        <Button
          size="small"
          variant="outlined"
          startIcon={<Iconify icon="eva:paper-plane-outline" />}
          onClick={onResend}
        >
          Resend
        </Button>
      </TableCell>
      <TableCell align="right">
        <IconButton aria-label="Delete notification" color="error" onClick={onDeleteRow} size="small">
          <Iconify icon="eva:trash-2-outline" />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}

NotificationTableRow.propTypes = {
  row: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  selected: PropTypes.bool,
  onSelectRow: PropTypes.func,
  onResend: PropTypes.func.isRequired,
  onDeleteRow: PropTypes.func.isRequired,
};
