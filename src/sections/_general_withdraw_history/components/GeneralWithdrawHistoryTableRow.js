/* eslint-disable no-nested-ternary */
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button, Stack,
  TableCell,
  TableRow,
  Typography
} from '@mui/material';
import PropTypes from 'prop-types';
import { useState } from 'react';
import ConfirmDialog from '../../../components/confirm-dialog';
import Iconify from '../../../components/iconify';
import Label from '../../../components/label';

// ----------------------------------------------------------------------

GeneralWithdrawHistoryTableRow.propTypes = {
  index: PropTypes.number,
  row: PropTypes.object,
  onAccept: PropTypes.func,
  onReject: PropTypes.func,
  acceptLoading: PropTypes.bool,
  rejectLoading: PropTypes.bool,
};

export default function GeneralWithdrawHistoryTableRow({
  index,
  row,
  onAccept,
  onReject,
  acceptLoading = false,
  rejectLoading = false,
}) {
  const {
    marketName,
    userPhone,
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

  const [openConfirmAccept, setOpenConfirmAccept] = useState(false);
  const [openConfirmReject, setOpenConfirmReject] = useState(false);

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

  const getStatusColor = (statusValue) => {
    const statusLower = statusValue?.toLowerCase() || '';
    switch (statusLower) {
      case 'approved':
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
        {/* ID */}
        <TableCell align="center">
          <Typography variant="body2" fontWeight="600">
            {index}
          </Typography>
        </TableCell>

        {/* Name */}
        <TableCell align="left">
          <Typography variant="subtitle2">
            {marketName}
          </Typography>
        </TableCell>

        {/* Phone */}
        <TableCell align="left">{userPhone}</TableCell>

        {/* Amount */}
        <TableCell align="left">₹{payableAmount}</TableCell>

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
            {status || 'pending'}
          </Label>
        </TableCell>

        {/* Failed Reason */}
        <TableCell align="left">
          <Typography variant="body2" color="text.secondary" noWrap>
            {reason || '-'}
          </Typography>
        </TableCell>

        <TableCell align="left">
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
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
                {status === 'approved' ? '✓ Approved' : status === 'rejected' ? '✗ Rejected' : status}
              </Typography>
            )}
          </Stack>
        </TableCell>

        {/* Created At */}
        <TableCell align="left">{createdAt}</TableCell>
      </TableRow>

      {/* Confirm Accept Dialog */}
      <ConfirmDialog
        open={openConfirmAccept}
        onClose={handleCloseConfirmAccept}
        title="Accept Withdrawal Request"
        content={
          <>
            Are you sure you want to accept this withdrawal request for <strong>₹{payableAmount}</strong>?
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
            Are you sure you want to reject this withdrawal request for <strong>₹{payableAmount}</strong>?
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
