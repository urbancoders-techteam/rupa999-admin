/* eslint-disable no-nested-ternary */
import PropTypes from 'prop-types';
import { useState } from 'react';
import {
  TableRow,
  MenuItem,
  TableCell,
  IconButton,
  Typography,
} from '@mui/material';
import Label from '../../../components/label';
import Iconify from '../../../components/iconify';
import MenuPopover from '../../../components/menu-popover';

// ----------------------------------------------------------------------

GeneralWithdrawHistoryTableRow.propTypes = {
  index: PropTypes.number,
  row: PropTypes.object,
  onEditRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};

export default function GeneralWithdrawHistoryTableRow({ index, row, onEditRow, onDeleteRow }) {
  const {
    id,
    marketName,
    userPhone,
    amount,
    payableAmount,
    requestType,
    withdrawMode,
    upiName,
    upiID,
    bankName,
    ifsc,
    status,
    reason,
    createdAt,
  } = row;

  const [openPopover, setOpenPopover] = useState(null);

  const handleOpenPopover = (event) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };
  

  const getStatusColor = (item) => {
    switch (item === status?.toLowerCase()) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <>
      <TableRow
        hover
        sx={{
          '&:last-child td, &:last-child th': { border: 0 },
          transition: 'background 0.2s ease-in-out',
          '&:hover': { backgroundColor: 'action.hover' },
        }}
      >
        {/* Actions */}
        <TableCell align="left">
          <IconButton color={openPopover ? 'inherit' : 'default'} onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>

        {/* ID */}
        <TableCell align="center">
          <Typography variant="body2" fontWeight="600">
            {id}
          </Typography>
        </TableCell>

        {/* Name */}
        <TableCell align="left">
          <Typography variant="subtitle2" noWrap>
            {marketName}
          </Typography>
        </TableCell>

        {/* Phone */}
        <TableCell align="left">{userPhone}</TableCell>

        {/* Amount */}
        <TableCell align="left">₹{amount}</TableCell>

        {/* Payable Amount */}
        <TableCell align="left">₹{payableAmount}</TableCell>

        {/* Request Type */}
        <TableCell align="left">
          <Label color={requestType === 'Withdraw' ? 'info' : 'primary'} variant="soft">
            {requestType}
          </Label>
        </TableCell>

        {/* Withdraw Mode */}
        <TableCell align="left">{withdrawMode}</TableCell>

        {/* UPI Name */}
        <TableCell align="left">{upiName}</TableCell>

        {/* UPI ID */}
        <TableCell align="left">{upiID}</TableCell>

        {/* Bank Name */}
        <TableCell align="left">{bankName}</TableCell>

        {/* IFSC */}
        <TableCell align="left">{ifsc}</TableCell>

        {/* Status */}
        <TableCell align="left">
          <Label
            variant="soft"
            color={getStatusColor(status)}
            sx={{ textTransform: 'capitalize', fontWeight: 'bold' }}
          >
            {status}
          </Label>
        </TableCell>

        {/* Failed Reason */}
        <TableCell align="left">
          <Typography variant="body2" color="text.secondary" noWrap>
            {reason || '-'}
          </Typography>
        </TableCell>

        {/* Created At */}
        <TableCell align="left">{createdAt}</TableCell>
      </TableRow>

      {/* Action Menu */}
      <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        arrow="right-top"
        sx={{ width: 160 }}
      >
        <MenuItem
          onClick={() => {
            onEditRow?.();
            handleClosePopover();
          }}
        >
          <Iconify icon="eva:edit-fill" />
          Edit
        </MenuItem>

        <MenuItem
          onClick={() => {
            onDeleteRow?.();
            handleClosePopover();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="eva:trash-2-outline" />
          Delete
        </MenuItem>
      </MenuPopover>
    </>
  );
}
