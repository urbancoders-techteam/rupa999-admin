import { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link as RouterLink, useNavigate, useSearchParams } from 'react-router-dom';
// @mui
import {
  Button,
  Card,
  Container,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Table,
  TableBody,
  TableContainer,
  TextField,
  Tooltip,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
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
import { addDeductBalanceAsync, changeUserPasswordAsync, deleteUserAsync, getAllUsersAsync, updateUserStatusAsync } from '../redux/services/user_services';
import { UserTableRow } from '../sections/_users/list';
import UserMobileViewCardLayout from '../sections/_users/list/UserMobileViewCardLayout';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = ['all', 'Active', 'InActive'];

const DATE_FILTER_OPTIONS = [
  { value: '', label: 'All Time' },
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
];

const TABLE_HEAD = [
  { id: 'Action', label: 'Action', align: 'left' },
  { id: 'sno', label: 'S.No.', align: 'left' },
  { id: 'name', label: 'Name', align: 'left' },
  { id: 'company', label: 'Phone', align: 'left' },
  { id: 'role', label: 'Balance', align: 'left' },
  { id: 'isVerified', label: 'Total Game Amt', align: 'center' },
  { id: 'totalWon', label: 'Total Won', align: 'left' },
  { id: 'Withdraw', label: 'Total Withdraw', align: 'left' },
  { id: 'diposit', label: 'Total Deposit', align: 'left' },
  { id: 'status', label: 'Blocked Status', align: 'left' },
  { id: 'createdAt', label: 'createdAt', align: 'left' },
];

// ----------------------------------------------------------------------

export default function UserListPage() {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const {
    dense,
    page,
    rowsPerPage,
    setPage,
    //
    selected,
    setSelected,
    onSelectAllRows,
    //
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();

  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  // Redux state
  const { userList, pagination } = useSelector((state) => state.user);

  const [openConfirm, setOpenConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [filterName, setFilterName] = useState(initialSearch); // Input field value
  const [searchQuery, setSearchQuery] = useState(initialSearch); // Actual search value sent to API
  const [filterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDate, setFilterDate] = useState('');
  const [changePasswordLoading, setChangePasswordLoading] = useState(false);
  const [addDeductBalanceLoading, setAddDeductBalanceLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Map UI filter status to API format
  const getStatusForAPI = (status) => {
    if (status === 'Active') return 'active';
    if (status === 'InActive') return 'inactive';
    return '';
  };

  // Reusable function to fetch users
  const fetchUsers = useCallback(() => {
    dispatch(
      getAllUsersAsync({
        page: page + 1, // API uses 1-based pagination
        limit: rowsPerPage,
        search: searchQuery,
        status: filterStatus !== 'all' ? getStatusForAPI(filterStatus) : '',
        dateFilter: filterDate,
      })
    );
  }, [dispatch, page, rowsPerPage, searchQuery, filterStatus, filterDate]);

  // Fetch users on component mount and when filters change
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Sync search param on first load
  useEffect(() => {
    if (initialSearch) {
      setFilterName(initialSearch);
      setSearchQuery(initialSearch);
    }
    // run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Transform API data to table format
  // Note: API already handles pagination and filtering, so we use the data directly
  const tableData = userList.map((user, index) => ({
    id: user._id || user.id || index + 1,
    _id: user._id,
    sno: (page * rowsPerPage) + index + 1, // Calculate S.No. based on pagination
    name: user.name,
    phone: user.number || user.whatsappNumber,
    balance: user.balance || 0,
    totalGameAmt: user.totalGameAmt || 0,
    totalWon: user.totalWon || 0,
    totalWithdraw: user.totalWithdraw || 0,
    totalBonus: user.totalBonus || 0,
    status: user.status === 'active', // Boolean for StatusToggleCell: true = Active false = inactive
    statusLabel: (() => {
      if (user.status === 'inactive') return 'InActive';
      if (user.status === 'active') return 'Active';
      return 'inactive';
    })(),
    statusValue: user.status,
    isVerified: user.isVerified || false,
    createdAt: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-',
    bankDetails: user.bankDetails || null,
    ...user,
  }));

  // Use tableData directly as API handles pagination and filtering
  const dataFiltered = applyFilter({
    inputData: tableData,
    filterName: '', // Don't filter by name client-side, API handles it
    filterRole,
    filterStatus: 'all', // Don't filter by status client-side, API handles it
  });

  const denseHeight = dense ? 52 : 72;

  const isMobile = useResponsive('down', 'sm');

  const isFiltered =
    searchQuery !== '' || filterRole !== 'all' || filterStatus !== 'all' || filterDate !== '';

  const isNotFound = !userList.length && (!!searchQuery || filterStatus !== 'all' || filterDate !== '');

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleFilterStatus = (event, newValue) => {
    setPage(0);
    setFilterStatus(newValue);
  };

  const handleFilterDate = (event) => {
    setPage(0);
    setFilterDate(event.target.value);
  };

  const handleFilterName = (event) => {
    setFilterName(event.target.value);
  };

  const handleSearch = () => {
    setPage(0);
    setSearchQuery(filterName);
  };

  const handleResetFilter = () => {
    setFilterName('');
    setSearchQuery('');
    setFilterStatus('all');
    setFilterDate('');
    setPage(0);
  };

  const handleDeleteRow = async (id) => {
    setDeleteLoading(true);
    try {
      await dispatch(deleteUserAsync(id)).unwrap();
      enqueueSnackbar('User deleted successfully!', { variant: 'success' });
      // Refresh the list
      fetchUsers();
      setSelected([]);
      setOpenConfirm(false);
      setDeleteId(null);
      // Check if we need to go back a page after deletion
      if (page > 0 && tableData.length === 0) {
        setPage(page - 1);
      }
    } catch (error) {
      enqueueSnackbar(error?.message || 'Failed to delete user', { variant: 'error' });
    } finally {
      setDeleteLoading(false);
    }
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
      const statusValue = status ? 'active' : 'inactive';
      await dispatch(updateUserStatusAsync({ id, status: statusValue })).unwrap();
      enqueueSnackbar(`User ${status ? 'activated' : 'blocked'} successfully!`, { variant: 'success' });
      // Refresh the list
      fetchUsers();
    } catch (error) {
      enqueueSnackbar(error?.message || 'Failed to update user status', { variant: 'error' });
      throw error; // Re-throw to let StatusToggleCell revert the UI
    }
  };

  const handleEditRow = (id, userName) => {
    navigate(PATH_DASHBOARD.user.edit(id), { state: { userName } });
  };

  const handleTransactionRow = (id, userName) => {
    navigate(PATH_DASHBOARD.user.transactions(id), { state: { userName } });
  };

  const handleWithdrawalRequestRow = (id, userName) => {
    navigate(PATH_DASHBOARD.user.withdrawaldetails(id), { state: { userName } });
  };

  const handleBidHistoryRow = (userId, userName) => {
    navigate(PATH_DASHBOARD.user.bidhistory(userId), { state: { userName } });
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

  const handleAddDeductBalance = async (userId, amount, action) => {
    setAddDeductBalanceLoading(true);
    try {
      await dispatch(addDeductBalanceAsync({ id: userId, amount, action })).unwrap();
      enqueueSnackbar(`Balance ${action === 'add' ? 'deposited' : 'deducted'} successfully`, { variant: 'success' });
      // Refresh user list to get updated balance
      fetchUsers();
      return true;
    } catch (error) {
      enqueueSnackbar(error?.message || `Failed to ${action === 'add' ? 'deposit' : 'deduct'} balance`, { variant: 'error' });
      throw error; // Re-throw to prevent dialog from closing on error
    } finally {
      setAddDeductBalanceLoading(false);
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
              height: 110, // equal to breadcrumb bar height
            },
          })}
        />

        {isMobile ? (
          <>
            <CustomTableToolbar
              isFiltered={isFiltered}
              filterName={filterName}
              onFilterName={handleFilterName}
              onSearch={handleSearch}
              onResetFilter={handleResetFilter}
            />
            <Box sx={{ px: 2, pb: 1, display: 'flex', gap: 1.5 }}>
              <TextField
                select
                fullWidth
                size="small"
                label="Status"
                value={filterStatus}
                onChange={(event) => handleFilterStatus(event, event.target.value)}
              >
                {STATUS_OPTIONS.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option === 'all' ? 'All' : option}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                fullWidth
                size="small"
                label="Registered"
                value={filterDate}
                onChange={handleFilterDate}
              >
                {DATE_FILTER_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            <UserMobileViewCardLayout
              data={tableData}
              onEditRow={(id, row) => handleEditRow(id, row?.name)}
              onDeleteRow={(id) => handleDeleteRow(id)}
              onStatusChange={handleStatusChange}
              onTransactionRow={(id, row) => handleTransactionRow(id, row?.name)}
              onBidHistoryRow={(id, row) => handleBidHistoryRow(id, row?.name)}
              onWithdrawalRequestsRow={(id, row) => handleWithdrawalRequestRow(id, row?.name)}
              onChangePassword={(id, password, cpassword) => handleChangePassword(id, password, cpassword)}
              changePasswordLoading={changePasswordLoading}
              onAddDeductBalance={(id, amount, action) => handleAddDeductBalance(id, amount, action)}
              addDeductBalanceLoading={addDeductBalanceLoading}
            />
            <TablePaginationCustom
              count={pagination?.total || tableData.length || 0}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={onChangePage}
              onRowsPerPageChange={onChangeRowsPerPage}
              dense={dense}
              onChangeDense={onChangeDense}
            />
          </>
        ) : (
          <Card>
            <Grid
              container
              spacing={{ xs: 1.5, sm: 2 }}
              alignItems="center"
              sx={{ px: { xs: 0, sm: 1.5, md: 2.5 }, py: { xs: 1, sm: 1.5, md: 2.5 } }}
            >
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Search..."
                  value={filterName}
                  onChange={handleFilterName}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  select
                  fullWidth
                  size="small"
                  label="Status"
                  value={filterStatus}
                  onChange={(event) => handleFilterStatus(event, event.target.value)}
                >
                  {STATUS_OPTIONS.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option === 'all' ? 'All' : option}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  select
                  fullWidth
                  size="small"
                  label="Registered"
                  value={filterDate}
                  onChange={handleFilterDate}
                >
                  {DATE_FILTER_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6} md={2}>
                <Button
                  variant="contained"
                  onClick={handleSearch}
                  startIcon={<Iconify icon="eva:search-fill" />}
                  fullWidth
                  sx={{ height: '40px' }}
                >
                  Search
                </Button>
              </Grid>

              {isFiltered && (
                <Grid item xs={12} sm={6} md={2}>
                  <Button
                    fullWidth
                    color="error"
                    onClick={handleResetFilter}
                    startIcon={<Iconify icon="eva:trash-2-outline" />}
                    sx={{ height: '40px' }}
                  >
                    Clear
                  </Button>
                </Grid>
              )}
            </Grid>

            <Divider />

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
                    headLabel={TABLE_HEAD}
                    rowCount={tableData.length}
                    numSelected={selected.length}
                  />

                  <TableBody>
                    {dataFiltered.map((row, index) => (
                        <UserTableRow
                          key={row._id || row.id}
                          index={row.sno}
                          row={row}
                          onTransationRow={() => handleTransactionRow(row._id || row.id, row.name)}
                          onWithdrawalRequestRow={() => handleWithdrawalRequestRow(row._id || row.id, row.name)}
                          onBidHistoryRow={() => handleBidHistoryRow(row._id || row.id, row.name)}
                          onDeleteRow={async () => handleDeleteRow(row._id || row.id)}
                          onEditRow={() => handleEditRow(row._id || row.id, row.name)}
                          onStatusChange={(_id, status) => handleStatusChange(_id, status)}
                          onChangePassword={(id, password, cpassword) => handleChangePassword(id, password, cpassword)}
                          changePasswordLoading={changePasswordLoading}
                          onAddDeductBalance={(id, amount, action) => handleAddDeductBalance(id, amount, action)}
                          addDeductBalanceLoading={addDeductBalanceLoading}
                        />
                      ))}

                    <TableEmptyRows
                      height={denseHeight}
                      emptyRows={emptyRows(0, rowsPerPage, tableData.length)}
                    />

                    <TableNoData isNotFound={isNotFound} />
                  </TableBody>
                </Table>
              </Scrollbar>
            </TableContainer>

            <TablePaginationCustom
              count={pagination?.total || tableData.length || 0}
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
            <LoadingButton
              variant="contained"
              color="error"
              onClick={handleConfirmDelete}
              loading={deleteLoading}
            >
              Delete
            </LoadingButton>
          }
        />
      </Container>
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, filterName, filterStatus, filterRole }) {
  let filteredData = inputData;

  if (filterName) {
    filteredData = filteredData.filter(
      (user) => user.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  if (filterStatus !== 'all') {
    filteredData = filteredData.filter((user) => user.statusLabel === filterStatus);
  }

  // if (filterRole !== 'all') {
  //   filteredData = filteredData.filter((user) => user.role === filterRole);
  // }

  return filteredData;
}
