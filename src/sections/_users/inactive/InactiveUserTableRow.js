import { TableCell, TableRow, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import PropTypes from 'prop-types';
import Label from '../../../components/label';
import { fDateTime } from '../../../utils/formatTime';

InactiveUserTableRow.propTypes = {
  index: PropTypes.number.isRequired,
  row: PropTypes.shape({
    _id: PropTypes.string,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    number: PropTypes.string,
    whatsappNumber: PropTypes.string,
    status: PropTypes.string,
    inactiveAt: PropTypes.string,
    updatedAt: PropTypes.string,
  }).isRequired,
  activatingId: PropTypes.string,
  onActivate: PropTypes.func,
};

export default function InactiveUserTableRow({ row, index, activatingId, onActivate }) {
  const { _id, id, name, number, whatsappNumber, status, inactiveAt, updatedAt } = row;
  const userId = _id || id;
  const isActivating = activatingId === userId;

  return (
    <TableRow hover>
      <TableCell align="center">{index}</TableCell>

      <TableCell>
        <Typography variant="subtitle2">{name || '—'}</Typography>
      </TableCell>

      <TableCell>{number || whatsappNumber || '—'}</TableCell>

      <TableCell>
        <Label color="error">{status === 'inactive' ? 'Inactive' : status || 'Inactive'}</Label>
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        {fDateTime(inactiveAt || updatedAt) || '—'}
      </TableCell>

      <TableCell align="center">
        <LoadingButton
          size="small"
          variant="contained"
          color="success"
          loading={isActivating}
          onClick={() => onActivate?.(userId)}
        >
          Activate
        </LoadingButton>
      </TableCell>
    </TableRow>
  );
}
