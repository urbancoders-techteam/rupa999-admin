import {
  IconButton,
  MenuItem,
  Stack,
  TableCell,
  TableRow,
  Typography,
  styled,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import PropTypes from 'prop-types';
import { useState } from 'react';
import BankDetailsDialog from '../../../components/bank-details-dialog/BankDetailsDialog';
import ChangePasswordDialog from '../../../components/change-password-dialog/ChangePasswordDialog';
import ConfirmDialog from '../../../components/confirm-dialog';
import Iconify from '../../../components/iconify';
import MenuPopover from '../../../components/menu-popover';
import { fDateTime } from '../../../utils/formatTime';
import AddDeductBalanceModal from '../form/UserAddDeductForm';
import StatusToggleCell from './StatusToggledCell';

// ----------------------------------------------------------------------
// ✅ Move this styled component OUTSIDE of UserTableRow
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(even)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

// ----------------------------------------------------------------------

UserTableRow.propTypes = {
  index: PropTypes.number,
  row: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    phone: PropTypes.string,
    balance: PropTypes.number,
    totalGameAmount: PropTypes.number,
    totalWonAmount: PropTypes.number,
    totalWithdrawals: PropTypes.number,
    totalDeposits: PropTypes.number,
    status: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    createdAt: PropTypes.string,
  }),
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onTransationRow: PropTypes.func,
  onBidHistoryRow: PropTypes.func,
  onWithdrawalRequestRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onStatusChange: PropTypes.func,
  onViewBankDetails: PropTypes.func,
  onChangePassword: PropTypes.func,
  changePasswordLoading: PropTypes.bool,
  onAddDeductBalance: PropTypes.func,
  addDeductBalanceLoading: PropTypes.bool,
};

export default function UserTableRow({
  index,
  row,
  selected,
  onEditRow,
  onTransationRow,
  onWithdrawalRequestRow,
  onBidHistoryRow,
  onDeleteRow,
  onStatusChange,
  onViewBankDetails,
  onChangePassword,
  changePasswordLoading,
  onAddDeductBalance,
  addDeductBalanceLoading,
}) {
  const {
    _id,
    name,
    phone,
    balance,
    totalGameAmount,
    totalWonAmount,
    totalWithdrawals,
    totalDeposits,
    status,
    createdAt,
    bankDetails = {},
  } = row || {};

  const [openConfirm, setOpenConfirm] = useState(false);
  const [openBankDetails, setOpenBankDetails] = useState(false);
  const [openChangePassword, setOpenChangePassword] = useState(false);
  const [openAddDeduct, setOpenAddDeduct] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleSubmit = async (values) => {
    if (onAddDeductBalance) {
      try {
        await onAddDeductBalance(_id, values.amount, values.action);
        setOpenAddDeduct(false);
      } catch (error) {
        // Error is already handled in the parent component
      }
    }
  };

  const handleOpenAddDeduct = () => {
    setOpenAddDeduct(true);
    handleClosePopover();
  };

  const handleCloseAddDeduct = () => {
    setOpenAddDeduct(false);
  };

  const handleOpenConfirm = () => setOpenConfirm(true);
  const handleCloseConfirm = () => setOpenConfirm(false);

  const handleOpenPopover = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => setAnchorEl(null);

  const handleViewBankDetails = () => {
    if (onViewBankDetails) {
      onViewBankDetails(_id);
    }
    setOpenBankDetails(true);
    handleClosePopover();
  };

  const handleCloseBankDetails = () => {
    setOpenBankDetails(false);
  };

  const handleOpenChangePassword = () => {
    setOpenChangePassword(true);
    handleClosePopover();
  };

  const handleCloseChangePassword = () => {
    setOpenChangePassword(false);
  };

  const handleChangePasswordSubmit = async (data) => {
    if (onChangePassword) {
      await onChangePassword(_id, data.password, data.cpassword);
      handleCloseChangePassword();
    }
  };

  return (
    <>
      <StyledTableRow hover>
        <TableCell align="left">
          <IconButton color={anchorEl ? 'inherit' : 'default'} onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>

        <TableCell align="left">{index + 1}</TableCell>

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

        <TableCell align="left">₹{balance?.toLocaleString('en-IN')}</TableCell>

        <TableCell align="center" sx={{ minWidth: '140px' }}>
          ₹{totalGameAmount?.toLocaleString('en-IN')}
        </TableCell>

        <TableCell align="center" sx={{ minWidth: '100px' }}>
          ₹{totalWonAmount?.toLocaleString('en-IN')}
        </TableCell>

        <TableCell align="center" sx={{ minWidth: '140px' }}>
          ₹{totalWithdrawals?.toLocaleString('en-IN')}
        </TableCell>

        <TableCell align="center" sx={{ minWidth: '140px' }}>
          ₹{totalDeposits?.toLocaleString('en-IN')}
        </TableCell>

        <StatusToggleCell
          id={_id}
          status={typeof status === 'boolean' ? status : status === 'Active' || status === 'active'}
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
        <MenuItem onClick={handleOpenAddDeduct}>
          <Iconify icon="solar:wallet-bold" />
          Add / Deduct Money
        </MenuItem>

        <MenuItem
          onClick={() => {
            onTransationRow();
            handleClosePopover();
          }}
        >
          <Iconify icon="mdi:bank-transfer" />
          Transaction
        </MenuItem>

        <MenuItem
          onClick={() => {
            onBidHistoryRow();
            handleClosePopover();
          }}
        >
          <Iconify icon="mdi:bank-transfer" />
          Bid History
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

        <MenuItem onClick={handleViewBankDetails}>
          <Iconify icon="mdi:bank" />
          Bank Details
        </MenuItem>

        <MenuItem onClick={handleOpenChangePassword}>
          <Iconify icon="mdi:lock-reset" />
          Change Password
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
        content="Are you sure you want to delete this user? This action cannot be undone."
        action={
          <LoadingButton
            variant="contained"
            color="error"
            loading={deleteLoading}
            onClick={async () => {
              if (onDeleteRow) {
                setDeleteLoading(true);
                try {
                  await onDeleteRow();
                  handleCloseConfirm();
                } catch (error) {
                  // Error is handled in parent
                } finally {
                  setDeleteLoading(false);
                }
              } else {
                handleCloseConfirm();
              }
            }}
          >
            Delete
          </LoadingButton>
        }
      />

      <AddDeductBalanceModal
        open={openAddDeduct}
        handleClose={handleCloseAddDeduct}
        currentBalance={balance || 0}
        onSubmit={handleSubmit}
        loading={addDeductBalanceLoading}
      />

      {/* Bank Details Dialog */}
      <BankDetailsDialog
        open={openBankDetails}
        onClose={handleCloseBankDetails}
        bankDetails={bankDetails}
        loading={false}
      />

      {/* Change Password Dialog */}
      <ChangePasswordDialog
        open={openChangePassword}
        onClose={handleCloseChangePassword}
        onSubmit={handleChangePasswordSubmit}
        loading={changePasswordLoading}
        userName={name}
      />
    </>
  );
}
