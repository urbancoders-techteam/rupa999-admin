import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
// @mui
import {
  Card,
  Container,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
} from '@mui/material';
// redux
import { useDispatch, useSelector } from 'react-redux';
// routes
import { PATH_DASHBOARD } from '../routes/paths';
// components
import CustomBreadcrumbs from '../components/custom-breadcrumbs';
import Scrollbar from '../components/scrollbar';
import { useSettingsContext } from '../components/settings';
import {
  emptyRows,
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  useTable,
} from '../components/table';
// sections
import CustomTableToolbar from '../components/table/CustomTableToolBar';
import { getAllLedgersAsync } from '../redux/services/user_services';
import TransactionTableRow from '../sections/_users/transactions/list/TransactionTableRow';

// ----------------------------------------------------------------------

const PARTICULAR_OPTIONS = [
  { value: 'All', label: 'All' },
  { value: 'Deposit', label: 'Deposit', },
  { value: 'Game Amount', label: 'Game Amount' },
  { value: 'Win Amount', label: 'Win Amount' },
  { value: 'Withdrawal', label: 'Withdrawal' },
];

const TABLE_HEAD = [
  { id: 'sNo', label: 'S.No.', align: 'center' },
  { id: 'date', label: 'Date', align: 'left' },
  { id: 'userName', label: 'User Name', align: 'left' },
  { id: 'particulars', label: 'Particulars', align: 'left' },
  { id: 'debit', label: 'Debit', align: 'left' },
  { id: 'credit', label: 'Credit', align: 'left' },
  { id: 'balance', label: 'Balance', align: 'left' },
  { id: 'Created By', label: 'Created By', align: 'left' },
];

// ----------------------------------------------------------------------

export default function MainTransactionListPage() {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();

  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();

  // Redux state
  const { allLedgersList, allLedgersLoading, allLedgersPagination } = useSelector(
    (state) => state.user
  );

  const [filterParticulars, setFilterParticulars] = useState('All');

  // Fetch ledgers on component mount and when filters change
  useEffect(() => {
    dispatch(
      getAllLedgersAsync({
        page: page + 1, // API uses 1-based pagination
        limit: rowsPerPage,
        particulars: filterParticulars === 'All' ? '' : filterParticulars,
      })
    );
  }, [dispatch, page, rowsPerPage, filterParticulars]);

  // Transform API data to table format
  const tableData = useMemo(
    () =>
      allLedgersList.map((transaction, index) => ({
        id: transaction._id || index + 1,
        _id: transaction._id,
        date: transaction.date,
        particulars: transaction.particulars,
        debit: transaction.debit || 0,
        credit: transaction.credit || 0,
        balance: transaction.balance || 0,
        user: transaction.user,
        admin: transaction.admin,
        remarks: transaction.remarks,
        marketName: transaction.marketName || transaction.market?.name || null,
        wonAmount: transaction.wonAmount || transaction.won || null,
        ...transaction,
      })),
    [allLedgersList]
  );

  const denseHeight = dense ? 52 : 72;

  const isFiltered = filterParticulars !== 'All';

  const isNotFound = !allLedgersLoading && !tableData.length;

  const handleFilterParticulars = (event) => {
    setPage(0);
    setFilterParticulars(event.target.value);
  };

  const handleResetFilter = () => {
    setFilterParticulars('All');
  };

  return (
    <>
      <Helmet>
        <title> Main Transaction : List | Rupa999 </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="Transaction List"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Main Transaction List' },
          ]}
        />

          <Card>
            <Stack direction="row" spacing={2} sx={{ p: 2, pb: 0 }}>
              <TextField
                select
                size="small"
                label="Particulars"
                value={filterParticulars}
                onChange={handleFilterParticulars}
                sx={{ minWidth: 180 }}
              >
                {PARTICULAR_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>

            <CustomTableToolbar isFiltered={isFiltered} onResetFilter={handleResetFilter} />

            <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
              <Scrollbar>
                <Table size={dense ? 'small' : 'medium'} sx={{ minWidth:{xs: 500, sm: 800 }}}>
                  <TableHeadCustom
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={tableData.length}
                    onSort={onSort}
                  />

                  <TableBody>
                    {allLedgersLoading ? (
                      <TableRow>
                        <TableCell colSpan={TABLE_HEAD.length} align="center">
                          Loading...
                        </TableCell>
                      </TableRow>
                    ) : (
                      <>
                        {tableData.length > 0 ? (
                          tableData.map((row, index) => (
                            <TransactionTableRow key={row.id} row={row} index={index} />
                          ))
                        ) : (
                          <TableNoData isNotFound={isNotFound} />
                        )}

                        <TableEmptyRows
                          height={denseHeight}
                          emptyRows={emptyRows(
                            page,
                            rowsPerPage,
                            allLedgersPagination?.total || tableData.length
                          )}
                        />
                      </>
                    )}
                  </TableBody>
                </Table>
              </Scrollbar>
            </TableContainer>

            <TablePaginationCustom
              count={allLedgersPagination?.total || 0}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={onChangePage}
              onRowsPerPageChange={onChangeRowsPerPage}
              dense={dense}
              onChangeDense={onChangeDense}
            />
          </Card>
      </Container>
    </>
  );
}

// ----------------------------------------------------------------------

