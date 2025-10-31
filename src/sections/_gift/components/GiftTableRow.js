import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import {
  Stack,
  Button,
  TableRow,
  MenuItem,
  TableCell,
  IconButton,
  Typography,
} from '@mui/material';
// components
import Label from '../../../components/label';
import Iconify from '../../../components/iconify';
import MenuPopover from '../../../components/menu-popover';
import ConfirmDialog from '../../../components/confirm-dialog';

// ----------------------------------------------------------------------

GiftTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onSelectRow: PropTypes.func,
};

export default function GiftTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow }) {
  const { id, limit, remaining, amount, createdAt, status, code } = row;

  const [openConfirm, setOpenConfirm] = useState(false);
  const [openPopover, setOpenPopover] = useState(null);

  const handleOpenConfirm = () => setOpenConfirm(true);
  const handleCloseConfirm = () => setOpenConfirm(false);
  const handleOpenPopover = (event) => setOpenPopover(event.currentTarget);
  const handleClosePopover = () => setOpenPopover(null);

  // dynamic color for status
  const getStatusColor = (items) => {
    switch (items === status) {
      case 'active':
        return 'success';
      case 'pending':
        return 'warning';
      case 'inactive':
        return 'default';
      case 'completed':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <>
      <TableRow hover selected={selected}>
        {/* ID */}
        <TableCell align="left">
          <Typography variant="subtitle2" noWrap>
            {id}
          </Typography>
        </TableCell>

        {/* Limit */}
        <TableCell align="left">{limit}</TableCell>

        {/* Remaining */}
        <TableCell align="left">{remaining}</TableCell>

        {/* Amount */}
        <TableCell align="left">{amount}</TableCell>

        {/* Created At */}
        <TableCell align="center">{createdAt}</TableCell>

        {/* Status */}
        <TableCell align="left">
          <Label
            variant="soft"
            color={getStatusColor(status)}
            sx={{ textTransform: 'capitalize' }}
          >
            {status}
          </Label>
        </TableCell>

        {/* Code */}
        <TableCell align="left">{code}</TableCell>

        {/* Action */}
        <TableCell align="left">
          <IconButton color={openPopover ? 'inherit' : 'default'} onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      {/* Action Menu */}
      <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        arrow="right-top"
        sx={{ width: 140 }}
      >
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

        <MenuItem
          onClick={() => {
            onEditRow();
            handleClosePopover();
          }}
        >
          <Iconify icon="eva:edit-fill" />
          Edit
        </MenuItem>
      </MenuPopover>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Delete"
        content="Are you sure you want to delete this record?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
}
