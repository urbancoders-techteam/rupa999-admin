import { LoadingButton } from '@mui/lab';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Divider,
  Link,
  Stack,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import { useState } from 'react';
import ConfirmDialog from '../../../components/confirm-dialog';
import Iconify from '../../../components/iconify';
import Label from '../../../components/label';
import { fDateTimeSplit } from '../../../utils/formatTime';

function DetailRow({ label, value }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1.5, py: 0.15 }}>
      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, flexShrink: 0 }}>
        {label}
      </Typography>
      <Box sx={{ textAlign: 'right', minWidth: 0, '& .MuiTypography-root': { lineHeight: 1.3 } }}>{value}</Box>
    </Box>
  );
}

DetailRow.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.node,
};

function getStatusColor(statusValue) {
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
}

function getStatusLabel(statusValue) {
  if (statusValue === 'approved') return '✓ Approved';
  if (statusValue === 'rejected') return '✗ Rejected';
  return statusValue;
}

function WithdrawCard({ row, index, onAccept, onReject, onUserClick, acceptLoading, rejectLoading }) {
  const {
    marketName,
    userPhone,
    payableAmount,
    amount,
    withdrawMode,
    upiName,
    upiID,
    bankName,
    ifsc,
    status,
    reason,
    createdAt,
    _id,
    id,
  } = row;

  const rowId = _id || id;
  const displayAmount = payableAmount || amount || 0;
  const requestAt = createdAt ? fDateTimeSplit(createdAt) : null;
  const isPending = status === 'pending';
  const isAccepting = acceptLoading?.[rowId] || false;
  const isRejecting = rejectLoading?.[rowId] || false;

  const [openConfirmAccept, setOpenConfirmAccept] = useState(false);
  const [openConfirmReject, setOpenConfirmReject] = useState(false);

  const handleConfirmAccept = async () => {
    if (!onAccept) {
      setOpenConfirmAccept(false);
      return;
    }
    try {
      await onAccept(rowId);
      setOpenConfirmAccept(false);
    } catch (error) {
      // Parent handles error
    }
  };

  const handleConfirmReject = async () => {
    if (!onReject) {
      setOpenConfirmReject(false);
      return;
    }
    try {
      await onReject(rowId);
      setOpenConfirmReject(false);
    } catch (error) {
      // Parent handles error
    }
  };

  return (
    <>
      <Accordion
        sx={{
          borderRadius: 2,
          boxShadow: 'none',
          border: '1px solid',
          borderColor: 'divider',
          '&:before': { display: 'none' },
          overflow: 'hidden',
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{
            minHeight: 44,
            px: 1.5,
            py: 0,
            '& .MuiAccordionSummary-content': { my: 0.25, mr: 1, width: '100%' },
          }}
        >
          <Box sx={{ width: '100%', minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', minWidth: 18 }}>
                {index}.
              </Typography>
              <Typography variant="subtitle2" sx={{ flex: 1, fontWeight: 700, minWidth: 0 }} noWrap>
                {marketName || '—'}
              </Typography>
              <Label
                variant="soft"
                color={getStatusColor(status)}
                sx={{ textTransform: 'capitalize', fontSize: '0.7rem', flexShrink: 0 }}
              >
                {status || 'pending'}
              </Label>
            </Box>
            <Typography variant="caption" sx={{ pl: 2.75, fontWeight: 600, color: 'success.dark' }}>
              ₹{Number(displayAmount).toLocaleString('en-IN')}
            </Typography>
          </Box>
        </AccordionSummary>

        <AccordionDetails sx={{ pt: 0, px: 1.5, pb: 1 }}>
          <Stack spacing={0.4}>
            <Divider />

            <DetailRow
              label="Request At"
              value={
                requestAt ? (
                  <Stack spacing={0}>
                    <Typography variant="body2">{requestAt.date}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {requestAt.time}
                    </Typography>
                  </Stack>
                ) : (
                  <Typography variant="body2">—</Typography>
                )
              }
            />
            <DetailRow label="ID" value={<Typography variant="body2">{index}</Typography>} />
            <DetailRow
              label="Name"
              value={<Typography variant="body2">{marketName || '—'}</Typography>}
            />
            <DetailRow
              label="Phone"
              value={
                userPhone && userPhone !== 'N/A' ? (
                  <Link
                    component="button"
                    type="button"
                    variant="body2"
                    underline="hover"
                    onClick={(event) => {
                      event.stopPropagation();
                      onUserClick?.(userPhone);
                    }}
                    sx={{ cursor: 'pointer', textAlign: 'right' }}
                  >
                    {userPhone}
                  </Link>
                ) : (
                  <Typography variant="body2">N/A</Typography>
                )
              }
            />
            <DetailRow
              label="Amount"
              value={
                <Typography variant="body2" fontWeight={600}>
                  ₹{Number(displayAmount).toLocaleString('en-IN')}
                </Typography>
              }
            />
            <DetailRow
              label="Withdraw Mode"
              value={
                <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                  {withdrawMode || 'N/A'}
                </Typography>
              }
            />
            <DetailRow
              label="UPI Name"
              value={<Typography variant="body2">{upiName || 'N/A'}</Typography>}
            />
            <DetailRow
              label="UPI ID"
              value={<Typography variant="body2">{upiID || 'N/A'}</Typography>}
            />
            <DetailRow
              label="Bank Name"
              value={<Typography variant="body2">{bankName || 'N/A'}</Typography>}
            />
            <DetailRow
              label="Bank IFSC"
              value={<Typography variant="body2">{ifsc || 'N/A'}</Typography>}
            />
            <DetailRow
              label="Status"
              value={
                <Label variant="soft" color={getStatusColor(status)} sx={{ textTransform: 'capitalize' }}>
                  {status || 'pending'}
                </Label>
              }
            />
            <DetailRow
              label="Failed Reason"
              value={<Typography variant="body2">{reason || '-'}</Typography>}
            />

            <Box sx={{ pt: 0.25 }}>
              {isPending ? (
                <Stack direction="row" spacing={1}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="success"
                    size="small"
                    disabled={isAccepting || isRejecting}
                    startIcon={<Iconify icon="eva:checkmark-circle-fill" />}
                    onClick={() => setOpenConfirmAccept(true)}
                  >
                    Accept
                  </Button>
                  <Button
                    fullWidth
                    variant="contained"
                    color="error"
                    size="small"
                    disabled={isAccepting || isRejecting}
                    startIcon={<Iconify icon="eva:close-circle-fill" />}
                    onClick={() => setOpenConfirmReject(true)}
                  >
                    Reject
                  </Button>
                </Stack>
              ) : (
                <Typography
                  variant="body2"
                  textAlign="center"
                  sx={{ color: status === 'approved' ? 'success.main' : 'error.main', fontWeight: 600 }}
                >
                  {getStatusLabel(status)}
                </Typography>
              )}
            </Box>
          </Stack>
        </AccordionDetails>
      </Accordion>

      <ConfirmDialog
        open={openConfirmAccept}
        onClose={() => setOpenConfirmAccept(false)}
        title="Accept Withdrawal Request"
        content={
          <>
            Are you sure you want to accept this withdrawal request for <strong>₹{displayAmount}</strong>?
            This action will process the withdrawal.
          </>
        }
        action={
          <LoadingButton variant="contained" color="success" loading={isAccepting} onClick={handleConfirmAccept}>
            Accept
          </LoadingButton>
        }
      />

      <ConfirmDialog
        open={openConfirmReject}
        onClose={() => setOpenConfirmReject(false)}
        title="Reject Withdrawal Request"
        content={
          <>
            Are you sure you want to reject this withdrawal request for <strong>₹{displayAmount}</strong>?
            This action cannot be undone.
          </>
        }
        action={
          <LoadingButton variant="contained" color="error" loading={isRejecting} onClick={handleConfirmReject}>
            Reject
          </LoadingButton>
        }
      />
    </>
  );
}

WithdrawCard.propTypes = {
  row: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  onAccept: PropTypes.func,
  onReject: PropTypes.func,
  onUserClick: PropTypes.func,
  acceptLoading: PropTypes.object,
  rejectLoading: PropTypes.object,
};

export default function GeneralWithdrawHistoryMobileCardLayout({
  data = [],
  loading = false,
  page = 0,
  rowsPerPage = 10,
  onAccept,
  onReject,
  onUserClick,
  acceptLoading = {},
  rejectLoading = {},
}) {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200, p: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Loading...
        </Typography>
      </Box>
    );
  }

  if (!data.length) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200, p: 2 }}>
        <Typography variant="body2" color="text.secondary">
          No Data Available
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'background.paper' }}>
      <Stack spacing={1}>
        {data.map((row, index) => (
          <WithdrawCard
            key={row._id || row.id || index}
            row={row}
            index={page * rowsPerPage + index + 1}
            onAccept={onAccept}
            onReject={onReject}
            onUserClick={onUserClick}
            acceptLoading={acceptLoading}
            rejectLoading={rejectLoading}
          />
        ))}
      </Stack>
    </Box>
  );
}

GeneralWithdrawHistoryMobileCardLayout.propTypes = {
  data: PropTypes.array,
  loading: PropTypes.bool,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  onAccept: PropTypes.func,
  onReject: PropTypes.func,
  onUserClick: PropTypes.func,
  acceptLoading: PropTypes.object,
  rejectLoading: PropTypes.object,
};
