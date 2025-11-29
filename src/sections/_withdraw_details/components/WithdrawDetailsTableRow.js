import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  MenuItem,
  Stack,
  TableCell,
  TableRow,
  Typography
} from '@mui/material';
// components
import ConfirmDialog from '../../../components/confirm-dialog';
import Iconify from '../../../components/iconify';
import Label from '../../../components/label';
import MenuPopover from '../../../components/menu-popover';

// ----------------------------------------------------------------------

WithdrawDetailsTableRow.propTypes = {
  index: PropTypes.number,
  row: PropTypes.object,
  onEditRow: PropTypes.func,
  onAccept: PropTypes.func,
  onReject: PropTypes.func,
  acceptLoading: PropTypes.bool,
  rejectLoading: PropTypes.bool,
};

export default function WithdrawDetailsTableRow({
  index,
  row,
  onEditRow,
  onAccept,
  onReject,
  acceptLoading,
  rejectLoading,
}) {
  const userId = row.userId;
  const userName = userId?.name || 'N/A';
  const userNumber = userId?.number || 'N/A';
  const amount = row.amount || 0;
  const method = row.method || 'N/A';
  const status = row.status || 'pending';
  const createdAt = row.createdAt ? new Date(row.createdAt).toLocaleDateString() : 'N/A';

  const [openPopover, setOpenPopover] = useState(null);
  const [openConfirmAccept, setOpenConfirmAccept] = useState(false);
  const [openConfirmReject, setOpenConfirmReject] = useState(false);

  const handleOpenPopover = (event) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  const handleOpenConfirmAccept = () => {
    setOpenConfirmAccept(true);
  };

  const handleCloseConfirmAccept = () => {
    setOpenConfirmAccept(false);
  };

  const handleOpenConfirmReject = () => {
    setOpenConfirmReject(true);
  };

  const handleCloseConfirmReject = () => {
    setOpenConfirmReject(false);
  };

  const handleConfirmAccept = async () => {
    if (onAccept) {
      try {
        await onAccept();
        handleCloseConfirmAccept();
      } catch (error) {
        // Error is handled in parent
      }
    } else {
      handleCloseConfirmAccept();
    }
  };

  const handleConfirmReject = async () => {
    if (onReject) {
      try {
        await onReject();
        handleCloseConfirmReject();
      } catch (error) {
        // Error is handled in parent
      }
    } else {
      handleCloseConfirmReject();
    }
  };

  const getStatusText = () => {
    if (status === 'approved') return '✓ Approved';
    if (status === 'rejected') return '✗ Rejected';
    return status;
  };

  return (
    <>
      <TableRow hover sx={{ '&:last-child td, &:last-child th': { border: .5 } }}>
        <TableCell align="center">{index}</TableCell>

        <TableCell>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="subtitle2" noWrap>
              {userName}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell align="left">₹{amount.toLocaleString('en-IN')}</TableCell>

        <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
          {method}
        </TableCell>

        <TableCell align="left">
          <Label
            variant="soft"
            color={
              (status === 'rejected' && 'error') ||
              (status === 'approved' && 'success') ||
              'warning'
            }
            sx={{ textTransform: 'capitalize' }}
          >
            {status}
          </Label>
        </TableCell>

        <TableCell align="left">{createdAt}</TableCell>

        <TableCell align='left'>
          {status === 'pending' ? (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                color="success"
                size="small"
                onClick={handleOpenConfirmAccept}
                disabled={acceptLoading || rejectLoading}
                startIcon={<Iconify icon="eva:checkmark-circle-fill" />}
                sx={{ minWidth: 90 }}
              >
                Accept
              </Button>
              <Button
                variant="contained"
                color="error"
                size="small"
                onClick={handleOpenConfirmReject}
                disabled={acceptLoading || rejectLoading}
                startIcon={<Iconify icon="eva:close-circle-fill" />}
                sx={{ minWidth: 90 }}
              >
                Reject
              </Button>
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ minWidth: 100 }}>
              {getStatusText()}
            </Typography>
          )}
        </TableCell>
      </TableRow>

      {onEditRow && (
        <MenuPopover
          open={openPopover}
          onClose={handleClosePopover}
          arrow="right-top"
          sx={{ width: 140 }}
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
        </MenuPopover>
      )}

      {/* Confirm Accept Dialog */}
      <ConfirmDialog
        open={openConfirmAccept}
        onClose={handleCloseConfirmAccept}
        title="Accept Withdrawal Request"
        content={
          <>
            Are you sure you want to accept this withdrawal request for <strong>₹{amount.toLocaleString('en-IN')}</strong>?
            This action will process the withdrawal.
          </>
        }
        action={
          <LoadingButton
            variant="contained"
            color="success"
            loading={acceptLoading}
            onClick={handleConfirmAccept}
          >
            Accept
          </LoadingButton>
        }
      />

      {/* Confirm Reject Dialog */}
      <ConfirmDialog
        open={openConfirmReject}
        onClose={handleCloseConfirmReject}
        title="Reject Withdrawal Request"
        content={
          <>
            Are you sure you want to reject this withdrawal request for <strong>₹{amount.toLocaleString('en-IN')}</strong>?
            This action cannot be undone.
          </>
        }
        action={
          <LoadingButton
            variant="contained"
            color="error"
            loading={rejectLoading}
            onClick={handleConfirmReject}
          >
            Reject
          </LoadingButton>
        }
      />
    </>
  );
}
