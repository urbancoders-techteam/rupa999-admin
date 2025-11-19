import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import {
  Button,
  Card,
  Container,
  Divider,
  IconButton,
  Tab,
  Table,
  TableBody,
  TableContainer,
  Tabs,
  Tooltip,
} from '@mui/material';
import { Box } from '@mui/system';
// redux
import { useDispatch, useSelector } from 'react-redux';
import useResponsive from '../hooks/useResponsive';
// routes
import { PATH_DASHBOARD } from '../routes/paths';
// components
import ConfirmDialog from '../components/confirm-dialog';
import CustomBreadcrumbs from '../components/custom-breadcrumbs';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
import { useSettingsContext } from '../components/settings';
import {
  emptyRows,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  TableSelectedAction,
  useTable,
} from '../components/table';
// sections
import { useSnackbar } from '../components/snackbar';
import CustomTableToolbar from '../components/table/CustomTableToolBar';
import { getBankDetailsByUserIdAsync } from '../redux/services/bank_details_services';
import { changeUserPasswordAsync, deleteUserAsync, getAllUsersAsync, updateUserStatusAsync } from '../redux/services/user_services';
import { UserTableRow } from '../sections/_users/list';
import UserMobileViewCardLayout from '../sections/_users/list/UserMobileViewCardLayout';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = ['all', 'Blocked', 'Unblock'];

const TABLE_HEAD = [
  { id: 'Action', label: 'Action', align: 'left' },
  { id: 'id', label: 'ID', align: 'left' },
  { id: 'name', label: 'Name', align: 'left' },
  { id: 'company', label: 'Phone', align: 'left' },
  { id: 'role', label: 'Balance', align: 'left' },
  { id: 'isVerified', label: 'Total Game Amt', align: 'center' },
  { id: 'totalWon', label: 'Total Won', align: 'left' },
  { id: 'Withdraw', label: 'Total Withdraw', align: 'left' },
  { id: 'Bonus', label: 'Total Bonus', align: 'left' },
  { id: 'status', label: 'Blocked Status', align: 'left' },
  { id: 'createdAt', label: 'createdAt', align: 'left' },
];

// ----------------------------------------------------------------------

export default function UserListPage() {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    //
    selected,
    setSelected,
    onSelectAllRows,
    //
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();

  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  // Redux state
  const { userList, loading, pagination } = useSelector((state) => state.user);

  const [openConfirm, setOpenConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [filterName, setFilterName] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [bankDetails, setBankDetails] = useState(null);
  const [bankDetailsLoading, setBankDetailsLoading] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [changePasswordLoading, setChangePasswordLoading] = useState(false);

  // Fetch users on component mount and when filters change
  useEffect(() => {
    dispatch(
      getAllUsersAsync({
        page: page + 1, // API uses 1-based pagination
        limit: rowsPerPage,
        search: filterName,
        status: filterStatus !== 'all' ? filterStatus : '',
      })
    );
  }, [dispatch, page, rowsPerPage, filterName, filterStatus]);

  // Transform API data to table format
  const tableData = userList.map((user, index) => ({
    id: user._id || user.id || index + 1,
    _id: user._id,
    name: user.name,
    phone: user.number || user.whatsappNumber,
    balance: user.balance || 0,
    totalGameAmt: user.totalGameAmt || 0,
    totalWon: user.totalWon || 0,
    totalWithdraw: user.totalWithdraw || 0,
    totalBonus: user.totalBonus || 0,
    status: user.status === 'active', // Boolean for StatusToggleCell: true = Active, false = InActive/Banned
    statusLabel: (() => {
      if (user.status === 'banned') return 'Blocked';
      if (user.status === 'active') return 'Active';
      return 'InActive';
    })(),
    statusValue: user.status,
    isVerified: user.isVerified || false,
    createdAt: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-',
    ...user,
  }));

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterRole,
    filterStatus,
  });

  const dataInPage = dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const denseHeight = dense ? 52 : 72;

  const isMobile = useResponsive('down', 'sm');

  const isFiltered = filterName !== '' || filterRole !== 'all' || filterStatus !== 'all';

  const isNotFound =
    (!dataFiltered.length && !!filterName) ||
    (!dataFiltered.length && !!filterRole) ||
    (!dataFiltered.length && !!filterStatus);

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleFilterStatus = (event, newValue) => {
    setPage(0);
    setFilterStatus(newValue);
  };

  const handleFilterName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleDeleteRow = async (id) => {
    try {
      await dispatch(deleteUserAsync(id)).unwrap();
      enqueueSnackbar('User deleted successfully!', { variant: 'success' });
      // Refresh the list
      dispatch(
        getAllUsersAsync({
          page: page + 1,
          limit: rowsPerPage,
          search: filterName,
          status: filterStatus !== 'all' ? filterStatus : '',
        })
      );
      setSelected([]);
      if (page > 0 && dataInPage.length < 2) {
        setPage(page - 1);
      }
    } catch (error) {
      enqueueSnackbar(error?.message || 'Failed to delete user', { variant: 'error' });
    }
  };

  const handleOpenDeleteConfirm = (id) => {
    setDeleteId(id);
    setOpenConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (deleteId) {
      handleDeleteRow(deleteId);
      setDeleteId(null);
    }
    setOpenConfirm(false);
  };

  const handleStatusChange = async (id, status) => {
    try {
      const statusValue = status ? 'active' : 'banned';
      await dispatch(updateUserStatusAsync({ id, status: statusValue })).unwrap();
      enqueueSnackbar(`User ${status ? 'activated' : 'blocked'} successfully!`, { variant: 'success' });
      // Refresh the list
      dispatch(
        getAllUsersAsync({
          page: page + 1,
          limit: rowsPerPage,
          search: filterName,
          status: filterStatus !== 'all' ? filterStatus : '',
        })
      );
    } catch (error) {
      enqueueSnackbar(error?.message || 'Failed to update user status', { variant: 'error' });
      throw error; // Re-throw to let StatusToggleCell revert the UI
    }
  };

  const handleResetFilter = () => {
    setFilterName('');
    setFilterRole('all');
    setFilterStatus('all');
    setPage(0);
  };

  const handleEditRow = (id) => {
    navigate(PATH_DASHBOARD.user.edit(id));
  };

  const handleTransactionRow = (id) => {
    navigate(PATH_DASHBOARD.user.transactions(id));
  };

  const handleWithdrawalRequestRow = (id) => {
    navigate(PATH_DASHBOARD.user.withdrawalrequest(id));
  };

  const handleViewBankDetails = async (userId) => {
    setSelectedUserId(userId);
    setBankDetailsLoading(true);
    setBankDetails(null);
    try {
      const response = await dispatch(getBankDetailsByUserIdAsync(userId)).unwrap();
      // Handle response structure: { data: {...} } or direct data object
      const bankDetailsData = response?.data || response;
      setBankDetails(bankDetailsData || null);
      if (!bankDetailsData) {
        enqueueSnackbar('No bank details found for this user', { variant: 'info' });
      }
    } catch (error) {
      setBankDetails(null);
      if (error?.status !== 404 && error?.response?.status !== 404) {
        enqueueSnackbar(error?.message || 'Failed to fetch bank details', { variant: 'error' });
      } else {
        enqueueSnackbar('No bank details found for this user', { variant: 'info' });
      }
    } finally {
      setBankDetailsLoading(false);
    }
  };

  const handleChangePassword = async (userId, password, cpassword) => {
    setChangePasswordLoading(true);
    try {
      await dispatch(changeUserPasswordAsync({ id: userId, password, cpassword })).unwrap();
      enqueueSnackbar('Password changed successfully', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar(error?.message || 'Failed to change password', { variant: 'error' });
      throw error; // Re-throw to prevent dialog from closing on error
    } finally {
      setChangePasswordLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title> User: List | Rupa999 </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Box
          sx={(theme) => ({
            position: 'relative', // default for desktop
            bgcolor: 'background.paper',
            zIndex: 10,
            [theme.breakpoints.down('sm')]: {
              position: 'fixed',
              top: 60,
              left: 0,
              width: '100%',
              px: 2,
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
              borderBottom: '1px solid',
              borderColor: 'divider',
            },
          })}
        >
          <CustomBreadcrumbs
            heading="User List"
            links={[
              { name: 'Dashboard', href: PATH_DASHBOARD.root },
              { name: 'User List', href: PATH_DASHBOARD.user.list },
            ]}
            action={
              <Button
                component={RouterLink}
                variant="contained"
                startIcon={<Iconify icon="eva:plus-fill" />}
                to={PATH_DASHBOARD.user.new}
                sx={{
                  [(theme) => theme.breakpoints.down('sm')]: {
                    fontSize: '0.75rem',
                    py: 0.5,
                    px: 1.5,
                  },
                }}
              >
                New User
              </Button>
            }
          />
        </Box>

        {/* 👇 Add margin to push content below breadcrumb for mobile */}
        <Box
          sx={(theme) => ({
            [theme.breakpoints.down('sm')]: {
              height: 80, // equal to breadcrumb bar height
            },
          })}
        />

        {isMobile ? (
          <>
            <CustomTableToolbar
              isFiltered={isFiltered}
              filterName={filterName}
              onFilterName={handleFilterName}
            />
            <UserMobileViewCardLayout
              data={dataFiltered}
              onEditRow={handleEditRow}
              onDeleteRow={(id) => handleDeleteRow(id)}
              onStatusChange={handleStatusChange}
              onChangePassword={(id, password, cpassword) => handleChangePassword(id, password, cpassword)}
              changePasswordLoading={changePasswordLoading}
              onViewBankDetails={handleViewBankDetails}
              bankDetails={bankDetails}
              bankDetailsLoading={bankDetailsLoading}
            />
          </>
        ) : (
          <Card>
            <Tabs
              value={filterStatus}
              onChange={handleFilterStatus}
              sx={{
                px: 2,
                bgcolor: 'background.neutral',
              }}
            >
              {STATUS_OPTIONS.map((tab) => (
                <Tab key={tab} label={tab} value={tab} />
              ))}
            </Tabs>

            <Divider />

            <CustomTableToolbar
              isFiltered={isFiltered}
              filterName={filterName}
              onFilterName={handleFilterName}
            />

            <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
              <TableSelectedAction
                dense={dense}
                numSelected={selected.length}
                rowCount={tableData.length}
                onSelectAllRows={(checked) =>
                  onSelectAllRows(
                    checked,
                    tableData.map((row) => row.id)
                  )
                }
                action={
                  <Tooltip title="Delete">
                    <IconButton color="primary" onClick={handleOpenConfirm}>
                      <Iconify icon="eva:trash-2-outline" />
                    </IconButton>
                  </Tooltip>
                }
              />

              <Scrollbar>
                <Table size={!dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                  <TableHeadCustom
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={tableData.length}
                    numSelected={selected.length}
                    onSort={onSort}
                  />

                  <TableBody>
                    {dataFiltered
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row, index) => (
                        <UserTableRow
                          key={row._id || row.id}
                          index={index}
                          row={row}
                          // selected={selected.includes(row.id)}
                          onTransationRow={() => handleTransactionRow(row._id || row.id)}
                          onWithdrawalRequestRow={() => handleWithdrawalRequestRow(row._id || row.id)}
                          onDeleteRow={() => handleOpenDeleteConfirm(row._id || row.id)}
                          onEditRow={() => handleEditRow(row._id || row.id)}
                          onStatusChange={(_id, status) => handleStatusChange(_id, status)}
                          onViewBankDetails={handleViewBankDetails}
                          bankDetails={selectedUserId === (row._id || row.id) ? bankDetails : null}
                          bankDetailsLoading={selectedUserId === (row._id || row.id) && bankDetailsLoading}
                          onChangePassword={(id, password, cpassword) => handleChangePassword(id, password, cpassword)}
                          changePasswordLoading={changePasswordLoading}
                        />
                      ))}

                    <TableEmptyRows
                      height={denseHeight}
                      emptyRows={emptyRows(page, rowsPerPage, tableData.length)}
                    />

                    <TableNoData isNotFound={isNotFound} />
                  </TableBody>
                </Table>
              </Scrollbar>
            </TableContainer>

            <TablePaginationCustom
              count={pagination?.total || dataFiltered.length}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={onChangePage}
              onRowsPerPageChange={onChangeRowsPerPage}
              //
              dense={dense}
              onChangeDense={onChangeDense}
            />
          </Card>
        )}

        <ConfirmDialog
          open={openConfirm}
          onClose={() => {
            setOpenConfirm(false);
            setDeleteId(null);
          }}
          title="Delete User"
          content="Are you sure you want to delete this user? This action cannot be undone."
          action={
            <Button variant="contained" color="error" onClick={handleConfirmDelete}>
              Delete
            </Button>
          }
        />
      </Container>
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filterName, filterStatus, filterRole }) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    inputData = inputData.filter(
      (user) => user.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  if (filterStatus !== 'all') {
    inputData = inputData.filter((user) => user.statusLabel === filterStatus);
  }

  if (filterRole !== 'all') {
    inputData = inputData.filter((user) => user.role === filterRole);
  }

  return inputData;
}
