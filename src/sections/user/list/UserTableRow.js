import PropTypes from 'prop-types';
import { useState } from 'react';
import {
  Stack,
  Avatar,
  Button,
  TableRow,
  TableCell,
  IconButton,
  Typography,
  styled,
  MenuItem,
} from '@mui/material';
import Label from '../../../components/label';
import Iconify from '../../../components/iconify';
import MenuPopover from '../../../components/menu-popover';
import ConfirmDialog from '../../../components/confirm-dialog';

// ----------------------------------------------------------------------

UserTableRow.propTypes = {
  row: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    phone: PropTypes.string,
    password: PropTypes.string,
    balance: PropTypes.number,
    totalGameAmt: PropTypes.number,
    totalWon: PropTypes.number,
    totalWithdraw: PropTypes.number,
    totalBonus: PropTypes.number,
    status: PropTypes.string,
    createdAt: PropTypes.string,
  }),
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onSelectRow: PropTypes.func,
};

export default function UserTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow }) {
  const {
    id,
    name,
    phone,
    password,
    balance,
    totalGameAmt,
    totalWon,
    totalWithdraw,
    totalBonus,
    status,
    createdAt,
  } = row;

  const [openConfirm, setOpenConfirm] = useState(false);
  const [openPopover, setOpenPopover] = useState(null);

  const handleOpenConfirm = () => setOpenConfirm(true);
  const handleCloseConfirm = () => setOpenConfirm(false);
   const handleOpenPopover = (event) => {
    setOpenPopover(event.currentTarget);
  };
  const handleClosePopover = () => setOpenPopover(null);

  // Generate initials for avatar
  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : '?';

  // Style for alternate rows
  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(even)': {
      backgroundColor: theme.palette.action.hover,
    },
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

  return (
    <>
      <StyledTableRow hover selected={selected}>
        <TableCell align="left">{id}</TableCell>

        <TableCell align="left">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar alt={name}>{initials}</Avatar>
            <Typography variant="subtitle2" noWrap>
              {name}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell align="left">
          <Typography variant="body2">{phone}</Typography>
        </TableCell>

        <TableCell align="left">
          <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
            {password}
          </Typography>
        </TableCell>

        <TableCell align="left">₹{balance?.toLocaleString('en-IN')}</TableCell>

        <TableCell align="center">₹{totalGameAmt?.toLocaleString('en-IN')}</TableCell>

        <TableCell align="left">₹{totalWon?.toLocaleString('en-IN')}</TableCell>

        <TableCell align="left">₹{totalWithdraw?.toLocaleString('en-IN')}</TableCell>

        <TableCell align="left">₹{totalBonus?.toLocaleString('en-IN')}</TableCell>

        <TableCell align="left">
          <Label
            variant="soft"
            color={status === 'Blocked' ? 'error' : 'success'}
            sx={{ textTransform: 'capitalize', fontWeight: 600 }}
          >
            {status}
          </Label>
        </TableCell>

        <TableCell align="left">
          <Typography variant="body2" color="text.secondary">
            {createdAt}
          </Typography>
        </TableCell>

        <TableCell align="left">
          <IconButton color={openPopover ? 'inherit' : 'default'} onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
        
      </StyledTableRow>

      {/* Action Menu */}
      <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        arrow="right-top"
        sx={{ width: 150 }}
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
