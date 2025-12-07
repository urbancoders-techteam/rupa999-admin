import PropTypes from 'prop-types';
import { TableRow, TableCell, IconButton } from '@mui/material';
import Iconify from '../../../components/iconify';

export default function NotificationTableRow({ row, index, selected, onSelectRow, onDeleteRow }) {
  return (
    <TableRow hover selected={selected}>
      <TableCell>{index}</TableCell>
      <TableCell>{row.title}</TableCell>
      <TableCell>{row.description}</TableCell>
      <TableCell align="right">
        <IconButton color="error" onClick={onDeleteRow} size="small">
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
  onDeleteRow: PropTypes.func.isRequired,
};
