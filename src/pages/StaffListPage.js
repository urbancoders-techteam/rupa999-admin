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
// _mock_
// import { _userDataList } from '../_mock/arrays';
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
import { changeStaffPasswordAsync, deleteStaffAsync, getAllStaffAsync, updateStaffStatusAsync } from '../redux/services/staff_services';
import StaffTableRow from '../sections/_staff/list/StaffTableRow';
import StaffMobileViewLayout from '../sections/_staff/list/StaffMobileViewLayout';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = ['all', 'Active', 'InActive'];

const TABLE_HEAD = [
  { id: 'Action', label: 'Action', align: 'left' },
  { id: 'srNo', label: 'Sr. No.', align: 'left' },
  { id: 'name', label: 'Name', align: 'left' },
  { id: 'role', label: 'Role', align: 'left' },
  { id: 'company', label: 'Contact No.', align: 'left' },
  { id: 'email', label: 'Email', align: 'left' },
  { id: 'status', label: 'Status', align: 'left' },
  { id: 'createdAt', label: 'createdAt', align: 'left' },
];

// ----------------------------------------------------------------------

export default function StaffListPage() {
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
  const { staffList } = useSelector((state) => state.staff);

  const [openConfirm, setOpenConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [filterName, setFilterName] = useState(''); // Input field value
  const [searchQuery, setSearchQuery] = useState(''); // Actual search value for filtering
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [changePasswordLoading, setChangePasswordLoading] = useState(false);

  // This page paginates/filters client-side (see dataFiltered.slice below), so
  // fetch the full staff list once rather than relying on the backend's
  // default page-1/limit-10 response - otherwise only the first 10 staff ever
  // load and later pages render empty despite the pager showing a higher total.
  useEffect(() => {
    dispatch(getAllStaffAsync({ page: 1, limit: 1000 }));
  }, [dispatch]);

  // Transform API data to table format
  const tableData = staffList.map((staff, index) => ({
    id: staff._id || staff.id || index + 1,
    _id: staff._id,
    sno: (page * rowsPerPage) + index + 1, // Calculate S.No. based on pagination
    name: staff.name,
    email: staff.email,
    mobileNumber: staff.mobile,
    designation: staff.roleId?.roleName || 'N/A',
    roleId: staff.roleId?._id || staff.roleId || null,
    roleName: staff.roleId?.roleName || 'N/A',
    status: staff.status ? 'Active' : 'InActive',
    createdAt: staff.createdAt ? new Date(staff.createdAt).toLocaleDateString() : '-',
    ...staff,
  }));

  const dataFiltered = applyFilter({
    inputData: tableData,
    filterName: searchQuery,
    filterRole,
    filterStatus,
  });

  const dataInPage = dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const denseHeight = dense ? 52 : 72;

  const isMobile = useResponsive('down', 'sm');

  const isFiltered = searchQuery !== '' || filterRole !== 'all' || filterStatus !== 'all';

  const isNotFound =
    (!dataFiltered.length && !!searchQuery) ||
    (!dataFiltered.length && !!filterRole && filterRole !== 'all') ||
    (!dataFiltered.length && !!filterStatus && filterStatus !== 'all');

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleFilterStatus = (event, newValue) => {
    setPage(0);
    setFilterStatus(newValue);
  };

  const handleFilterName = (event) => {
    setFilterName(event.target.value);
  };

  const handleSearch = () => {
    setPage(0);
    setSearchQuery(filterName);
  };

  const handleDeleteRow = async (id) => {
    try {
      await dispatch(deleteStaffAsync(id)).unwrap();
      enqueueSnackbar('Staff deleted successfully!', { variant: 'success' });
      // Refresh the list
      dispatch(getAllStaffAsync({ page: 1, limit: 1000 }));
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
    navigate(PATH_DASHBOARD.staff.edit(id));
  };

  const handleStatusChange = async (id, status) => {
    try {
      await dispatch(updateStaffStatusAsync({ id, status })).unwrap();
      enqueueSnackbar(`Staff ${status ? 'activated' : 'deactivated'} successfully!`, { variant: 'success' });
      // Refresh the list
      dispatch(getAllStaffAsync({ page: 1, limit: 1000 }));
    } catch (error) {
      enqueueSnackbar(error?.message || 'Failed to update staff status', { variant: 'error' });
      throw error; // Re-throw to let StatusToggleCell revert the UI
    }
  };

  const handleResetFilter = () => {
    setFilterName('');
    setSearchQuery('');
    setFilterRole('all');
    setFilterStatus('all');
    setPage(0);
  };

  const handleChangePassword = async (staffId, password, cpassword) => {
    setChangePasswordLoading(true);
    try {
      await dispatch(changeStaffPasswordAsync({ id: staffId, password, cpassword })).unwrap();
      enqueueSnackbar('Password changed successfully!', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar(error?.message || 'Failed to change password', { variant: 'error' });
      throw error;
    } finally {
      setChangePasswordLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title> Staff: List | Rupa999 </title>
      </Helmet>

      <Container
        maxWidth={themeStretch ? false : 'xl'}
        sx={{
          px: { xs: 1, sm: 3 },
        }}
      >
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
              px: 1.5,
              py: 1,
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
              borderBottom: '1px solid',
              borderColor: 'divider',
            },
          })}
        >
          <Box
            sx={(theme) => ({
              [theme.breakpoints.down('sm')]: {
                '& .MuiTypography-h3': {
                  fontSize: '1.1rem',
                  mb: 0.5,
                },
              },
            })}
          >
            <CustomBreadcrumbs
              heading="Staff List"
              links={[
                { name: 'Dashboard', href: PATH_DASHBOARD.root },
                { name: 'Staff List', href: PATH_DASHBOARD.staff.list },
              ]}
              sx={(theme) => ({
                [theme.breakpoints.down('sm')]: {
                  mb: 0,
                },
              })}
              action={
              <Box
                display="flex"
                flexDirection={{ xs: 'column', sm: 'row' }}
                gap={{ xs: 0.75, sm: 1 }}
                alignItems={{ xs: 'stretch', sm: 'center' }}
                sx={(theme) => ({
                  [theme.breakpoints.down('sm')]: {
                    minWidth: '120px',
                    width: '100%',
                  },
                })}
              >
                <Button
                  component={RouterLink}
                  variant="contained"
                  startIcon={<Iconify icon="lucide:user-cog" />}
                  to={PATH_DASHBOARD.designation.list}
                  fullWidth={isMobile}
                  sx={{
                    fontSize: { xs: '0.7rem', sm: '0.875rem' },
                    py: { xs: 0.5, sm: 0.75 },
                    px: { xs: 1, sm: 2 },
                    minWidth: { xs: '100%', sm: 180 },
                    width: { xs: '100%', sm: 'auto' },
                    '& .MuiButton-startIcon': {
                      marginRight: { xs: 0.5, sm: 1 },
                      '& svg': {
                        fontSize: { xs: '1rem', sm: '1.25rem' },
                      },
                    },
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      display: { xs: 'none', sm: 'inline' },
                    }}
                  >
                    Designation and Rights
                  </Box>
                  <Box
                    component="span"
                    sx={{
                      display: { xs: 'inline', sm: 'none' },
                    }}
                  >
                    Designation
                  </Box>
                </Button>
                <Button
                  component={RouterLink}
                  variant="contained"
                  startIcon={<Iconify icon="eva:plus-fill" />}
                  to={PATH_DASHBOARD.staff.new}
                  fullWidth={isMobile}
                  sx={{
                    fontSize: { xs: '0.7rem', sm: '0.875rem' },
                    py: { xs: 0.5, sm: 0.75 },
                    px: { xs: 1, sm: 2 },
                    minWidth: { xs: '100%', sm: 120 },
                    width: { xs: '100%', sm: 'auto' },
                    '& .MuiButton-startIcon': {
                      marginRight: { xs: 0.5, sm: 1 },
                      '& svg': {
                        fontSize: { xs: '1rem', sm: '1.25rem' },
                      },
                    },
                  }}
                >
                  New Staff
                </Button>
              </Box>
            }
            />
          </Box>
        </Box>

        {/* 👇 Add margin to push content below breadcrumb for mobile */}
        <Box
          sx={(theme) => ({
            [theme.breakpoints.down('sm')]: {
              height: 115, // Adjust based on breadcrumb + buttons height
            },
          })}
        />

        {isMobile ? (
          <Box sx={{ px: { xs: 0.5, sm: 0 } }}>
            <Tabs
              value={filterStatus}
              onChange={handleFilterStatus}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                mb: 1,
                bgcolor: 'background.neutral',
                borderRadius: 1,
                '& .MuiTab-root': {
                  fontSize: '0.75rem',
                  minHeight: 48,
                  px: 1.5,
                },
              }}
            >
              {STATUS_OPTIONS.map((tab) => (
                <Tab key={tab} label={tab} value={tab} />
              ))}
            </Tabs>
            <Box sx={{ mb: 1.5 }}>
              <CustomTableToolbar
                isFiltered={isFiltered}
                filterName={filterName}
                onFilterName={handleFilterName}
                onSearch={handleSearch}
                onResetFilter={handleResetFilter}
              />
            </Box>
            <StaffMobileViewLayout
              data={dataFiltered}
              onEditRow={(id) => handleEditRow(id)}
              onDeleteRow={(id) => handleOpenDeleteConfirm(id)}
              onStatusChange={(id, status) => handleStatusChange(id, status)}
              onChangePassword={(id, password, cpassword) => handleChangePassword(id, password, cpassword)}
              changePasswordLoading={changePasswordLoading}
            />
          </Box>
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
              onResetFilter={handleResetFilter}
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
                    headLabel={TABLE_HEAD}
                    rowCount={tableData.length}
                    numSelected={selected.length}
                  />

                  <TableBody>
                    {dataFiltered
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row, index) => (
                        <StaffTableRow
                          key={row._id}
                          row={row}
                          index={row.sno}
                          // selected={selected.includes(row.id)}
                          onDeleteRow={() => handleOpenDeleteConfirm(row._id)}
                          onEditRow={() => handleEditRow(row._id)}
                          onStatusChange={(_id, status) => handleStatusChange(_id, status)}
                        />
                      ))}

                    <TableEmptyRows
                      height={denseHeight}
                      emptyRows={emptyRows(page, rowsPerPage, dataFiltered.length)}
                    />

                    <TableNoData isNotFound={isNotFound} />
                  </TableBody>
                </Table>
              </Scrollbar>
            </TableContainer>

            <TablePaginationCustom
              count={dataFiltered.length}
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

function applyFilter({ inputData, filterName, filterStatus, filterRole }) {
  let filteredData = inputData;

  if (filterName) {
    filteredData = filteredData.filter(
      (user) => user.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  if (filterStatus !== 'all') {
    filteredData = filteredData.filter((user) => user.status === filterStatus);
  }

  if (filterRole !== 'all') {
    filteredData = filteredData.filter((user) => user.role === filterRole);
  }

  return filteredData;
}
