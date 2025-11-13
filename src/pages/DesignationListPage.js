import { Helmet } from 'react-helmet-async';
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
import { Box } from '@mui/system';
// redux
import { useDispatch, useSelector } from 'react-redux';
import useResponsive from '../hooks/useResponsive';
// routes
import { PATH_DASHBOARD } from '../routes/paths';
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
import DesignationTableRow from '../sections/_staff/list/DesignationTableRow';
import { getAllRolesAsync, deleteRoleAsync } from '../redux/services/role_services';
import { useSnackbar } from '../components/snackbar';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = ['all', 'Active', 'InActive'];

const TABLE_HEAD = [
  { id: 'Action', label: 'Action', align: 'left' },
  { id: 'index', label: 'ID', align: 'left' },
  { id: 'designationName', label: 'Designation Name', align: 'left' },
  { id: 'status', label: 'Status', align: 'left' },
  { id: 'createdAt', label: 'Created At', align: 'left' },
];

// ----------------------------------------------------------------------

export default function DesignationListPage() {
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
  const { roleList, loading, pagination } = useSelector((state) => state.role);

  const [openConfirm, setOpenConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [filterName, setFilterName] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Fetch roles on component mount and when filters change
  useEffect(() => {
    dispatch(
      getAllRolesAsync({
        page: page + 1, // API uses 1-based pagination
        limit: rowsPerPage,
        search: filterName,
      })
    );
  }, [dispatch, page, rowsPerPage, filterName]);

  // Transform API data to table format
  const tableData = roleList.map((role, index) => ({
    id: role._id || role.id || index + 1,
    _id: role._id,
    designationName: role.roleName,
    status: role.status ? 'Active' : 'InActive',
    createdAt: role.createdAt ? new Date(role.createdAt).toLocaleDateString() : '-',
    ...role,
  }));

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterStatus,
  });

  const dataInPage = dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const denseHeight = dense ? 52 : 72;

  const isMobile = useResponsive('down', 'sm');

  const isFiltered = filterName !== '' || filterStatus !== 'all';

  const isNotFound =
    (!dataFiltered.length && !!filterName) ||
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
      await dispatch(deleteRoleAsync(id)).unwrap();
      enqueueSnackbar('Designation deleted successfully!', { variant: 'success' });
      // Refresh the list
      dispatch(
        getAllRolesAsync({
          page: page + 1,
          limit: rowsPerPage,
          search: filterName,
        })
      );
      setSelected([]);
      if (page > 0 && dataInPage.length < 2) {
        setPage(page - 1);
      }
    } catch (error) {
      enqueueSnackbar(error?.message || 'Failed to delete designation', { variant: 'error' });
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

  const handleEditRow = (id, rowData) => {
    navigate(PATH_DASHBOARD.designation.edit(id), { state: rowData });
  };

  const handleViewRow = (id, rowData) => {
    navigate(PATH_DASHBOARD.designation.view(id), { state: rowData });
  };

  const handleResetFilter = () => {
    setFilterName('');
    setFilterStatus('all');
  };

  return (
    <>
      <Helmet>
        <title> Designation: List | Rupa999 </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Box
          sx={(theme) => ({
            position: 'relative',
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
            heading="Designation List"
            links={[
              { name: 'Dashboard', href: PATH_DASHBOARD.root },
              { name: 'Staff List', href: PATH_DASHBOARD.staff.list },
              { name: 'Designation', href: PATH_DASHBOARD.designation.list },
              { name: 'List' },
            ]}
            action={
              <Button
                component={RouterLink}
                variant="contained"
                startIcon={<Iconify icon="eva:plus-fill" />}
                to={PATH_DASHBOARD.designation.new}
                sx={{
                  [(theme) => theme.breakpoints.down('sm')]: {
                    fontSize: '0.75rem',
                    py: 0.5,
                    px: 1.5,
                  },
                }}
              >
                New Designation
              </Button>
            }
          />
        </Box>

        {/* Add margin to push content below breadcrumb for mobile */}
        <Box
          sx={(theme) => ({
            [theme.breakpoints.down('sm')]: {
              height: 80,
            },
          })}
        />

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
                          <DesignationTableRow
                            key={row.id}
                            index={index}
                            row={row}
                            onEditRow={() => handleEditRow(row._id || row.id, row)}
                            onViewRow={() => handleViewRow(row._id || row.id, row)}
                            onDeleteRow={() => handleOpenDeleteConfirm(row._id || row.id)}
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

          <ConfirmDialog
            open={openConfirm}
            onClose={() => {
              setOpenConfirm(false);
              setDeleteId(null);
            }}
            title="Delete Designation"
            content="Are you sure you want to delete this designation? This action cannot be undone."
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

function applyFilter({ inputData, comparator, filterName, filterStatus }) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    inputData = inputData.filter(
      (designation) =>
        designation.designationName?.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  if (filterStatus !== 'all') {
    inputData = inputData.filter((designation) => designation.status === filterStatus);
  }

  return inputData;
}

