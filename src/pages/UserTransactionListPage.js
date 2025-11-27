import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
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
import { getUserLedgersAsync } from '../redux/services/user_services';
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
  { id: 'id', label: 'ID', align: 'left' },
  { id: 'date', label: 'Date', align: 'left' },
  { id: 'particulars', label: 'Particulars', align: 'left' },
  { id: 'debit', label: 'Debit', align: 'left' },
  { id: 'credit', label: 'Credit', align: 'left' },
  { id: 'balance', label: 'Balance', align: 'left' },
  { id: 'Created By', label: 'Created By', align: 'left' },
];

// ----------------------------------------------------------------------

export default function UserTransactionListPage() {
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
  const { id: userId } = useParams();

  // Redux state
  const { transactionsList, transactionsLoading, transactionsPagination, selectedUserName } = useSelector(
    (state) => state.user
  );

  const [filterParticulars, setFilterParticulars] = useState('All');

  // Fetch ledgers on component mount and when filters change
  useEffect(() => {
    if (userId) {
      dispatch(
        getUserLedgersAsync({
          userId,
          page: page + 1, // API uses 1-based pagination
          limit: rowsPerPage,
          particulars: filterParticulars,
        })
      );
    }
  }, [dispatch, userId, page, rowsPerPage, filterParticulars]);

  // Transform API data to table format
  const tableData = useMemo(
    () =>
      transactionsList.map((transaction, index) => ({
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
    [transactionsList]
  );

  const denseHeight = dense ? 52 : 72;

  const isFiltered = filterParticulars !== 'all';

  const isNotFound = !transactionsLoading && !tableData.length;

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
        <title> Transctions : List | Rupa999 </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading={selectedUserName ? `Transaction List - ${selectedUserName}` : 'Transaction List'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'User List', href: PATH_DASHBOARD.user.list },
            { name: 'Transaction List' },
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
              <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: { xs: 500, sm: 800 } }}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tableData.length}
                  onSort={onSort}
                />

                <TableBody>
                  {transactionsLoading ? (
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
                        emptyRows={emptyRows(page, rowsPerPage, tableData.length)}
                      />
                    </>
                  )}
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={transactionsPagination?.total || 0}
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

