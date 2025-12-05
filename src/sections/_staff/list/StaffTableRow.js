import {
  Button,
  IconButton,
  MenuItem,
  Stack,
  TableCell,
  TableRow,
  Typography,
  styled,
} from '@mui/material';
import PropTypes from 'prop-types';
import { useState } from 'react';
import ConfirmDialog from '../../../components/confirm-dialog';
import Iconify from '../../../components/iconify';
import MenuPopover from '../../../components/menu-popover';
import { fDateTime } from '../../../utils/formatTime';
import StatusToggleCell from './StatusToggledCell';

// ----------------------------------------------------------------------
// ✅ Move this styled component OUTSIDE of StaffTableRow
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(even)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

// ----------------------------------------------------------------------

StaffTableRow.propTypes = {
  row: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    mobile: PropTypes.string,
    roleId: PropTypes.object,
    password: PropTypes.string,
    status: PropTypes.string,
    createdAt: PropTypes.string,
  }),
  index: PropTypes.number,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onTransationRow: PropTypes.func,
  onWithdrawalRequestRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onStatusChange: PropTypes.func,
};

export default function StaffTableRow({ index, row, selected, onEditRow, onTransationRow, onWithdrawalRequestRow, onDeleteRow, onStatusChange }) {
  const {
    _id,
    name,
    email,
    mobile,
    roleId,
    status,
    createdAt,
  } = row;

  const [openConfirm, setOpenConfirm] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpenConfirm = () => setOpenConfirm(true);
  const handleCloseConfirm = () => setOpenConfirm(false);

  const handleOpenPopover = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => setAnchorEl(null);

  return (
    <>
      <StyledTableRow hover>
        <TableCell align="left">
          <IconButton color={anchorEl ? 'inherit' : 'default'} onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>

        <TableCell align="left">{index}</TableCell>

        <TableCell align="left">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="subtitle2" noWrap>
              {name}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell align="left">
          <Typography variant="body2">
            {roleId ? `${roleId.roleName}` : 'N/A'}
          </Typography>
        </TableCell>

        <TableCell align="left">
          <Typography variant="body2">{mobile}</Typography>
        </TableCell>

        <TableCell align="left">
          <Typography variant="body2">{email}</Typography>
        </TableCell>

        <StatusToggleCell
          id={_id}
          status={typeof status === 'boolean' ? status : status === 'Active'}
          onStatusChange={onStatusChange}
        />

        <TableCell align="left" sx={{ minWidth: '140px' }}>
          <Typography variant="body2" color="text.secondary">
            {fDateTime(createdAt)}
          </Typography>
        </TableCell>
      </StyledTableRow>

      {/* ✅ Properly anchored MenuPopover */}
      <MenuPopover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          // vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem
          onClick={() => {
            onEditRow();
            handleClosePopover();
          }}
        >
          <Iconify icon="eva:edit-fill" />
          Edit
        </MenuItem>

        <MenuItem
          onClick={() => {
            onTransationRow();
            handleClosePopover();
          }}
        >
          <Iconify icon="solar:wallet-bold" />
          Transactions
        </MenuItem>

        <MenuItem
          onClick={() => {
            onWithdrawalRequestRow();
            handleClosePopover();
          }}
        >
          <Iconify icon="mdi:bank-transfer" />
          Withdrawal Details
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleOpenConfirm();
            handleClosePopover();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="eva:trash-2-outline" />
          Delete
        </MenuItem>
      </MenuPopover>

      {/* Confirm Delete */}
      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Delete User"
        content="Are you sure you want to delete this user?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
}
