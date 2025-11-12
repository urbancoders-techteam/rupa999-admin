import { Helmet } from 'react-helmet-async';
import { paramCase } from 'change-case';
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui

import { Card, Table, Button, TableBody, Container, TableContainer, Box } from '@mui/material';
import useResponsive from '../hooks/useResponsive';
// routes
import { PATH_DASHBOARD } from '../routes/paths';

// _mock_
import {generalWithdrawHistoryData}  from '../_mock/arrays';

// components
import Scrollbar from '../components/scrollbar';
import ConfirmDialog from '../components/confirm-dialog';
import CustomBreadcrumbs from '../components/custom-breadcrumbs';
import { useSettingsContext } from '../components/settings';

// table
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from '../components/table';
import CustomTableToolbar from '../components/table/CustomTableToolBar';

// sections
import WithdrawDetailsToolbar from '../sections/_withdraw_details/components/WithdrawDetailsToolbar';
import WithdrawMobileViewCardLayout from '../sections/_withdraw_details/components/WithdrawDetailsMobileViewCardLayout';
import GeneralWithdrawHistoryTableRow from '../sections/_general_withdraw_history/components/GeneralWithdrawHistoryTableRow';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'actions', label: 'Actions', align: 'left' },
  { id: 'id', label: 'ID', align: 'left' },
  { id: 'marketName', label: 'Name', align: 'left' },
  { id: 'userPhone', label: 'Phone', align: 'left' },
  { id: 'amount', label: 'Amount', align: 'left' },
  { id: 'payableAmount', label: 'Payable Amount', align: 'left' },
  { id: 'requestType', label: 'Request Type', align: 'left' },
  { id: 'withdrawMode', label: 'Withdraw Mode', align: 'left' },
  { id: 'upiName', label: 'UPI Name', align: 'left' },
  { id: 'upiID', label: 'UPI ID', align: 'left' },
  { id: 'bankName', label: 'Bank Name', align: 'left' },
  { id: 'ifsc', label: 'Bank IFSC', align: 'left' },
  { id: 'status', label: 'Status', align: 'left' },
  { id: 'reason', label: 'Faild Reason', align: 'left' },
  { id: 'createdAt', label: 'Created At', align: 'left' },
];

// ----------------------------------------------------------------------

export default function GeneralWithdrawHistoryListPage() {
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
    onSelectRow,
    //
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();

  const { themeStretch } = useSettingsContext();

  const navigate = useNavigate();

  const [tableData, setTableData] = useState(generalWithdrawHistoryData);

  const [openConfirm, setOpenConfirm] = useState(false);

  const [filterName, setFilterName] = useState('');

  const [filterRole, setFilterRole] = useState('all');

  const [filterStatus, setFilterStatus] = useState('all');

  // Memoized filtered data
  const dataFiltered = useMemo(
    () =>
      applyFilter({
        inputData: tableData,
        comparator: getComparator(order, orderBy),
        filterName,
        filterRole,
        filterStatus,
      }),
    [tableData, order, orderBy, filterName, filterRole, filterStatus]
  );

  // Memoized paginated data
  const dataInPage = useMemo(
    () => dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [dataFiltered, page, rowsPerPage]
  );

  const denseHeight = dense ? 52 : 72;

  const isMobile = useResponsive('down', 'sm');

  const isFiltered = filterName !== '' || filterRole !== 'all' || filterStatus !== 'all';

  const isNotFound =
    (!dataFiltered.length && !!filterName) ||
    (!dataFiltered.length && !!filterRole) ||
    (!dataFiltered.length && !!filterStatus);


  const handleCloseConfirm = () => {
    setOpenConfirm(false);
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

  const handleDeleteRows = (selectedRows) => {
    const deleteRows = tableData.filter((row) => !selectedRows.includes(row.id));
    setSelected([]);
    setTableData(deleteRows);

    if (page > 0) {
      if (selectedRows.length === dataInPage.length) {
        setPage(page - 1);
      } else if (selectedRows.length === dataFiltered.length) {
        setPage(0);
      } else if (selectedRows.length > dataInPage.length) {
        <TablePaginationCustom
          count={dataFiltered.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={onChangePage}
          onRowsPerPageChange={onChangeRowsPerPage}
          //
          dense={dense}
          onChangeDense={onChangeDense}
        />;
        const newPage = Math.ceil((tableData.length - selectedRows.length) / rowsPerPage) - 1;
        setPage(newPage);
      }
    }
  };

  const handleEditRow = (id) => {
    navigate(PATH_DASHBOARD.user.edit(paramCase(id)));
  };

  const handleResetFilter = () => {
    setFilterName('');
    setFilterRole('all');
    setFilterStatus('all');
  };

  return (
    <>
      <Helmet>
        <title> General Withdraw History List : List | Rupa999 </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        {isMobile ? (
          <Box sx={{ position: 'sticky', top: 0, zIndex: 10, bgcolor: 'background.paper' }}>
            <CustomBreadcrumbs
              heading="General Withdraw History List"
              links={[
                { name: 'Dashboard', href: PATH_DASHBOARD.root },
                { name: 'General Withdraw History List', href: PATH_DASHBOARD.generalwithdrawhistory.list },
              ]}
            />
            <WithdrawDetailsToolbar
              isFiltered={isFiltered}
              filterName={filterName}
              onFilterName={handleFilterName}
              onResetFilter={handleResetFilter}
              sx={{ mt: 1 }}
            />
          </Box>
        ) : (
          <>
            <CustomBreadcrumbs
              heading="General Withdraw History List"
              links={[
                { name: 'Dashboard', href: PATH_DASHBOARD.root },
                { name: 'General Withdraw History List', href: PATH_DASHBOARD.generalwithdrawhistory.list },
              ]}
            />
            <CustomTableToolbar
              isFiltered={isFiltered}
              filterName={filterName}
              onFilterName={handleFilterName}
              onResetFilter={handleResetFilter}
              sx={{ mt: 1 }}
            />
          </>
        )}

        {/* Render mobile card layout for small screens, otherwise render the table */}
        {isMobile ? (
          <WithdrawMobileViewCardLayout
            data={dataFiltered}
            onEditRow={(id) => handleEditRow(id)}
            onDeleteRow={(id) => handleDeleteRow(id)}
            onSelectRow={(id) => onSelectRow(id)}
            selected={selected}
          />
        ) : (
          <Card>
            <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
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
                      ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row, index) => (
                        <GeneralWithdrawHistoryTableRow
                          index={index + 1}
                          key={row.id}
                          row={row}
                          selected={selected.includes(row.id)}
                          onSelectRow={() => onSelectRow(row.id)}
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

      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows(selected);
              handleCloseConfirm();
            }}
          >
            Delete
          </Button>
        }
      />
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
      (user) => user.marketName.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
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
