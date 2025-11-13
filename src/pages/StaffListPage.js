import { Helmet } from 'react-helmet-async';
import { paramCase } from 'change-case';
import { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import {
  Tab,
  Tabs,
  Card,
  Table,
  Button,
  Tooltip,
  Divider,
  TableBody,
  Container,
  IconButton,
  TableContainer,
} from '@mui/material';
import { Box, useTheme } from '@mui/system';
// redux
import { useDispatch, useSelector } from 'react-redux';
import useResponsive from '../hooks/useResponsive';
// routes
import { PATH_DASHBOARD } from '../routes/paths';
// _mock_
// import { _userDataList } from '../_mock/arrays';
// components
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
import ConfirmDialog from '../components/confirm-dialog';
import CustomBreadcrumbs from '../components/custom-breadcrumbs';
import { useSettingsContext } from '../components/settings';
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from '../components/table';
// sections
import CustomTableToolbar from '../components/table/CustomTableToolBar';
import { UserTableRow } from '../sections/_users/list';
import UserMobileViewCardLayout from '../sections/_users/list/UserMobileViewCardLayout';
import { getAllStaffAsync, deleteStaffAsync } from '../redux/services/staff_services';
import { useSnackbar } from '../components/snackbar';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = ['all', 'Active', 'InActive'];

const TABLE_HEAD = [
  { id: 'Action', label: 'Action', align: 'left' },
  { id: 'id', label: 'ID', align: 'left' },
  { id: 'name', label: 'Name', align: 'left' },
  { id: 'company', label: 'Designation', align: 'left' },
  { id: 'company', label: 'Contact No.', align: 'left' },
  { id: 'role', label: 'Email', align: 'left' },
  { id: 'status', label: 'Status', align: 'left' },
  { id: 'createdAt', label: 'createdAt', align: 'left' },
  { id: '' },
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
  const { staffList, loading, pagination } = useSelector((state) => state.staff);

  const [openConfirm, setOpenConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [filterName, setFilterName] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Fetch staff on component mount and when filters change
  useEffect(() => {
    dispatch(getAllStaffAsync());
  }, [dispatch]);

  // Transform API data to table format
  const tableData = staffList.map((staff, index) => ({
    id: staff._id || staff.id || index + 1,
    _id: staff._id,
    name: staff.name,
    email: staff.email,
    mobileNumber: staff.mobile,
    designation: staff.roleId?.roleName || 'N/A',
    status: staff.status ? 'Active' : 'InActive',
    createdAt: staff.createdAt ? new Date(staff.createdAt).toLocaleDateString() : '-',
    ...staff,
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
      await dispatch(deleteStaffAsync(id)).unwrap();
      enqueueSnackbar('Staff deleted successfully!', { variant: 'success' });
      // Refresh the list
      dispatch(getAllStaffAsync());
      setSelected([]);
      if (page > 0 && dataInPage.length < 2) {
        setPage(page - 1);
      }
    } catch (error) {
      enqueueSnackbar(error?.message || 'Failed to delete staff', { variant: 'error' });
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

  const handleEditRow = (id) => {
    navigate(PATH_DASHBOARD.user.edit(id));
  };
  const handleTransactionRow = (id) => {
    navigate(PATH_DASHBOARD.user.transactions(id));
  };
  const handleWithdrawalRequestRow = (id) => {
    navigate(PATH_DASHBOARD.user.withdrawalrequest(id));
  };

  const handleResetFilter = () => {
    setFilterName('');
  };

  return (
    <>
      <Helmet>
        <title> Staff: List | Rupa999 </title>
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
            heading="Staff List"
            links={[
              { name: 'Dashboard', href: PATH_DASHBOARD.root },
              { name: 'Staff List', href: PATH_DASHBOARD.staff.list },
              { name: 'List' },
            ]}
            action={
              <Box display="flex" gap={1}>
                <Button
                  component={RouterLink}
                  variant="contained"
                  startIcon={<Iconify icon="lucide:user-cog" />}
                  to={PATH_DASHBOARD.designation.list}
                  sx={{
                    [(theme) => theme.breakpoints.down('sm')]: {
                      fontSize: '0.75rem',
                      py: 0.5,
                      px: 1.5,
                    },
                  }}
                >
                  Designation and Rights
                </Button>
                <Button
                  component={RouterLink}
                  variant="contained"
                  startIcon={<Iconify icon="eva:plus-fill" />}
                  to={PATH_DASHBOARD.staff.new}
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
              </Box>
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
            // onSelectRow={(id) => onSelectRow(id)}
            // selected={selected}
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
                      .map((row) => (
                        <UserTableRow
                          key={row.id}
                          row={row}
                          // selected={selected.includes(row.id)}
                          onTransationRow={() => handleTransactionRow(row.id)}
                          onWithdrawalRequestRow={() => handleWithdrawalRequestRow(row.id)}
                          onDeleteRow={() => handleOpenDeleteConfirm(row._id || row.id)}
                          onEditRow={() => handleEditRow(row._id || row.id)}
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
          title="Delete Staff"
          content="Are you sure you want to delete this staff member? This action cannot be undone."
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
    inputData = inputData.filter((user) => user.status === filterStatus);
  }

  if (filterRole !== 'all') {
    inputData = inputData.filter((user) => user.role === filterRole);
  }

  return inputData;
}
