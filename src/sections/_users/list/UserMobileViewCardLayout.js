/* eslint-disable no-nested-ternary */
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Divider,
  Paper,
  Stack,
  Typography
} from '@mui/material';
import PropTypes from 'prop-types';
import { useState } from 'react';
import ChangePasswordDialog from '../../../components/change-password-dialog/ChangePasswordDialog';
import AddDeductBalanceModal from '../form/UserAddDeductForm';
import StatusToggleCell from './StatusToggledCell';

function UserMobileViewCardLayout({ 
  data, 
  onEditRow, 
  onDeleteRow, 
  onStatusChange, 
  onChangePassword,
  changePasswordLoading,
  onViewBankDetails,
  onAddDeductBalance, 
  addDeductBalanceLoading, 
  onTransactionRow,
  onWithdrawalRequestsRow,
  onBidHistoryRow,
}) {

  const [openAddDeduct, setOpenAddDeduct] = useState(false);
  const [openChangePassword, setOpenChangePassword] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUserName, setSelectedUserName] = useState(null);
  const [selectedUserBalance, setSelectedUserBalance] = useState(0);

  const handleSubmit = async (values) => {
    if (onAddDeductBalance && selectedUserId) {
      try {
        await onAddDeductBalance(selectedUserId, values.amount, values.action);
        setOpenAddDeduct(false);
        setSelectedUserId(null);
        setSelectedUserBalance(0);
      } catch (error) {
        // Error is already handled in the parent component
      }
    }
  };

  const handleOpenAddDeduct = (userId, userBalance) => {
    setSelectedUserId(userId);
    setSelectedUserBalance(userBalance || 0);
    setOpenAddDeduct(true);
  };

  const handleCloseAddDeduct = () => {
    setOpenAddDeduct(false);
    setSelectedUserId(null);
    setSelectedUserBalance(0);
  };

  const handleOpenChangePassword = (userId, userName) => {
    setSelectedUserId(userId);
    setSelectedUserName(userName);
    setOpenChangePassword(true);
  };

  const handleCloseChangePassword = () => {
    setOpenChangePassword(false);
    setSelectedUserId(null);
    setSelectedUserName(null);
  };

  const handleChangePasswordSubmit = async (value) => {
    if (onChangePassword && selectedUserId) {
      await onChangePassword(selectedUserId, value.password, value.cpassword);
      handleCloseChangePassword();
    }
  };

  return (
    <Box
      sx={{
        maxHeight: '100%',
        overflow: 'hidden',
        // p: 1,
        borderRadius: 2,
        bgcolor: 'background.default',
      }}
    >
      {data.length === 0 ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 200,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            No users available
          </Typography>
        </Box>
      ) : (
        <Stack spacing={1.5}>
          {data.map((row, index) => (
            <Paper
                key={row._id}
                sx={{
                  borderRadius: 2,
                  overflow: 'hidden',
                  boxShadow: '0px 2px 6px rgba(0,0,0,0.08)',
                }}
              >
                <Accordion
                  disableGutters
                  sx={{ boxShadow: 'none', '&:before': { display: 'none' } }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreRoundedIcon />}
                    sx={{
                      px: 2,
                      py: 1,
                      bgcolor: 'grey.50',
                      '& .MuiAccordionSummary-content': {
                        alignItems: 'center',
                        width: '100%',
                      },
                      // Move the expand icon to the top-right corner
                      '& .MuiAccordionSummary-expandIconWrapper': {
                        position: 'absolute',
                        top: 18,
                        right: 12,
                        transform: 'none !important',
                      },
                    }}
                  >
                    <Stack
                      direction="row"
                      alignItems="start"
                      justifyContent="space-between"
                      sx={{ width: '100%', pr: 4 }} // add padding-right so text doesn't overlap the icon
                    >
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Stack
                          direction="column"
                          spacing={0.5}
                          sx={{ borderRight: '1px solid #ccc', paddingRight: 1, minWidth: '30px' }}
                        >
                          <Typography variant="subtitle2">{index + 1}.</Typography>
                        </Stack>

                        <Stack
                          direction="column"
                          spacing={0.5}
                          sx={{ borderRight: '1px solid #ccc', paddingRight: 1, minWidth: '120px' }}
                        >
                          <Typography variant="subtitle1">
                            {row.name || '—'}
                          </Typography>
                          <Typography variant="subtitle2" color="text.secondary">{row.phone || '—'}</Typography>
                        </Stack>

                        <Stack direction="column" spacing={0.5}>
                          <Typography variant="subtitle2">Balance : </Typography>
                          <Typography variant="subtitle2" color="text.secondary">{row.balance || '—'}</Typography>
                        </Stack>
                      </Box>

                      <Typography
                        variant="subtitle2"
                        color={row.status === 'active' ? 'primary' : 'error'}
                      >
                        {row.status === 'active' ? 'Active' : 'InActive'}
                      </Typography>
                    </Stack>
                  </AccordionSummary>

                  <AccordionDetails
                    sx={{
                      bgcolor: 'background.paper',
                      px: 2,
                      py: 1.5,
                    }}
                  >
                   
                    <Stack spacing={0.5}>
                      <Typography variant="body2">
                        <b>Creation Date:</b>{' '}
                        {row.createdAt ? new Date(row.createdAt).toLocaleString() : '—'}
                      </Typography>

                      <Accordion
                        disableGutters
                        sx={{
                          boxShadow: 'none',
                          borderRadius: 1,
                          border: '1px solid',
                          borderColor: 'divider',
                          '&:before': { display: 'none' },
                          bgcolor: 'background.paper',
                        }}
                      >
                        <AccordionSummary
                          expandIcon={<ExpandMoreRoundedIcon />}
                          sx={{
                            bgcolor: 'grey.50',
                            borderBottom: '1px solid',
                            borderColor: 'divider',
                            '& .MuiAccordionSummary-content': {
                              alignItems: 'center',
                              width: '100%',
                            },
                          }}
                        >
                          <Typography variant="subtitle1" fontWeight={600}>
                            Account Details
                          </Typography>
                        </AccordionSummary>

                        <AccordionDetails
                          sx={{
                            px: 2,
                            py: 1.5,
                            bgcolor: 'background.default',
                          }}
                        >
                          <Box>
                            <Typography variant="body2" sx={{ mb: 0.5 }}>
                              <strong>Bank Name:</strong> {row.bankDetails?.bankName || '—'}
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 0.5 }}>
                              <strong>Account No:</strong>{' '}
                              {row.bankDetails?.accountNumber || '—'}
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 0.5 }}>
                              <strong>IFSC Code:</strong> {row.bankDetails?.ifscCode || '—'}
                            </Typography>
                            <Typography variant="body2">
                              <strong>Account Holder:</strong>{' '}
                              {row.bankDetails?.accountHolderName || '—'}
                            </Typography>
                          </Box>
                        </AccordionDetails>
                      </Accordion>

                      <Stack spacing={1}>
                        <Button variant="contained" onClick={() => handleOpenAddDeduct(row._id, row.balance)}>
                          <b>Deposit / Deduct Money</b>
                        </Button>

                        <Button variant="outlined" onClick={() => handleOpenChangePassword(row._id, row.name)}>
                          <b>Change Password</b>
                        </Button>
                      </Stack>

                    <Box flex={1} sx={{ display: 'flex', alignItems: 'center', gap: 1, my: 1.5}}>
                      {onTransactionRow && (
                        <Button variant="contained" onClick={() => onTransactionRow(row._id || row.id, row)}>
                          <Typography variant="body2"> Transaction</Typography>
                        </Button>
                      )}
                      {onWithdrawalRequestsRow && (
                        <Button variant="contained" onClick={() => onWithdrawalRequestsRow(row._id || row.id, row)}>
                          <Typography variant="body2">Withdrawal</Typography>
                        </Button>
                      )}
                      {onBidHistoryRow && (
                        <Button variant="contained" onClick={() => onBidHistoryRow(row._id || row.id, row)}>
                          <Typography variant="body2" textWrap='noWrap'>Bid</Typography>
                        </Button>
                      )}
                    </Box>

                      <Divider sx={{ my: 1 }} />

                      <Stack direction="row" justifyContent="flex-end" spacing={1}>
                        <StatusToggleCell
                          id={row._id}
                          status={typeof row.status === 'boolean' ? row.status : row.status === 'Active' || row.status === 'active'}
                          onStatusChange={onStatusChange}
                        />
                        <Button startIcon={<DeleteIcon fontSize="small" />} variant='text' color="error" onClick={() => onDeleteRow(row._id || row.id)}>
                          <Typography variant="body2">Delete</Typography>
                        </Button>
                      </Stack>
                    </Stack>
                  </AccordionDetails>
                </Accordion>
              </Paper>
          ))}
        </Stack>
      )}

      <AddDeductBalanceModal
        open={openAddDeduct}
        handleClose={handleCloseAddDeduct}
        currentBalance={selectedUserBalance}
        onSubmit={handleSubmit}
        loading={addDeductBalanceLoading}
      />

      <ChangePasswordDialog
        open={openChangePassword}
        onClose={handleCloseChangePassword}
        onSubmit={handleChangePasswordSubmit}
        loading={changePasswordLoading}
        userName={selectedUserName}
      />
    </Box>
  );
}

UserMobileViewCardLayout.propTypes = {
  data: PropTypes.array,
  onEditRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onStatusChange: PropTypes.func,
  onChangePassword: PropTypes.func,
  changePasswordLoading: PropTypes.bool,
  onViewBankDetails: PropTypes.func,
  onAddDeductBalance: PropTypes.func,
  addDeductBalanceLoading: PropTypes.bool,
  onTransactionRow: PropTypes.func,
  onWithdrawalRequestsRow: PropTypes.func,
  onBidHistoryRow: PropTypes.func,
};

export default UserMobileViewCardLayout;