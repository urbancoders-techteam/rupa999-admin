import { Helmet } from 'react-helmet-async';
import { paramCase } from 'change-case';
import { useState } from 'react';
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
import useResponsive from '../hooks/useResponsive';
// routes
import { PATH_DASHBOARD } from '../routes/paths';
// _mock_
import { _userDataList, _userList } from '../_mock/arrays';
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

// ----------------------------------------------------------------------

const STATUS_OPTIONS = ['all', 'Blocked', 'Unblock'];

const TABLE_HEAD = [
  { id: 'Action', label: 'Action', align: 'left' },
  { id: 'id', label: 'ID', align: 'left' },
  { id: 'name', label: 'Name', align: 'left' },
  { id: 'company', label: 'Phone', align: 'left' },
  { id: 'company', label: 'Password', align: 'left' },
  { id: 'role', label: 'Balance', align: 'left' },
  { id: 'isVerified', label: 'Total Game Amt', align: 'center' },
  { id: 'totalWon', label: 'Total Won', align: 'left' },
  { id: 'Withdraw', label: 'Total Withdraw', align: 'left' },
  { id: 'Bonus', label: 'Total Bonus', align: 'left' },
  { id: 'status', label: 'Blocked Status', align: 'left' },
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

  const navigate = useNavigate();
  // const theme = useTheme();

  const [tableData, setTableData] = useState(_userDataList);

  const [openConfirm, setOpenConfirm] = useState(false);

  const [filterName, setFilterName] = useState('');

  const [filterRole, setFilterRole] = useState('all');

  const [filterStatus, setFilterStatus] = useState('all');

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

  const handleDeleteRow = (id) => {
    const deleteRow = tableData.filter((row) => row.id !== id);
    setSelected([]);
    setTableData(deleteRow);

    if (page > 0) {
      if (dataInPage.length < 2) {
        setPage(page - 1);
      }
    }
  };

  const handleEditRow = (id) => {
    navigate(PATH_DASHBOARD.user.edit(paramCase(id)));
  };

  const handleResetFilter = () => {
    setFilterName('');
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
              px:2,
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
              { name: 'User List', href: PATH_DASHBOARD.userlist.list },
            ]}
            action={
              <Button
                component={RouterLink}
                variant="contained"
                startIcon={<Iconify icon="eva:plus-fill" />}
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
          <UserMobileViewCardLayout
            data={dataFiltered}
            onEditRow={handleEditRow}
            onDeleteRow={(id) => handleDeleteRow(id)}
            // onSelectRow={(id) => onSelectRow(id)}
            // selected={selected}
          />
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
                          // onSelectRow={() => onSelectRow(row.id)}
                          onDeleteRow={() => handleDeleteRow(row.id)}
                          onEditRow={() => handleEditRow(row.name)}
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
