import PropTypes from 'prop-types';
import { useState } from 'react';
import {
  Stack,
  Button,
  TableRow,
  TableCell,
  IconButton,
  Typography,
  styled,
  MenuItem,
} from '@mui/material';
import Iconify from '../../../components/iconify';
import MenuPopover from '../../../components/menu-popover';
import ConfirmDialog from '../../../components/confirm-dialog';
import StatusToggleCell from './StatusToggledCell';

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
  onTransationRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
 };

export default function UserTableRow({ row, selected, onEditRow, onTransationRow, onDeleteRow }) {
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
    console.log('event', event)
    setOpenPopover(event.currentTarget);
  };
  const handleClosePopover = () => setOpenPopover(null);
  
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
      <StyledTableRow hover >
        <TableCell align="left">
          <IconButton color={openPopover ? 'inherit' : 'default'} onClick={(event)=>handleOpenPopover(event)}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>

        <TableCell align="left">{id}</TableCell>

        <TableCell align="left">
          <Stack direction="row" alignItems="center" spacing={2}>
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

        <TableCell align="center" sx={{ minWidth: '140px' }}>
          ₹{totalGameAmt?.toLocaleString('en-IN')}
        </TableCell>

        <TableCell align="center" sx={{ minWidth: '100px' }}>
          ₹{totalWon?.toLocaleString('en-IN')}
        </TableCell>

        <TableCell align="center" sx={{ minWidth: '140px' }}>
          ₹{totalWithdraw?.toLocaleString('en-IN')}
        </TableCell>

        <TableCell align="center" sx={{ minWidth: '110px' }}>
          ₹{totalBonus?.toLocaleString('en-IN')}
        </TableCell>

       <StatusToggleCell id={id} status={status} />

        <TableCell align="left" sx={{ minWidth: '140px' }}>
          <Typography variant="body2" color="text.secondary">
            {createdAt}
          </Typography>
        </TableCell>
      </StyledTableRow>

      {/* Action Menu */}
      <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        arrow="right-top"
        // sx={{ width: 150 }}
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
          <Iconify icon="eva:edit-fill" />
          Transactions
        </MenuItem>
        <MenuItem
          onClick={() => {
            onEditRow();
            handleClosePopover();
          }}
        >
          <Iconify icon="eva:edit-fill" />
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
