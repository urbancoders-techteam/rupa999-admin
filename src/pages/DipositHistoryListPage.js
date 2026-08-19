import { useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
// @mui
import {
  Card,
  Container,
  Table,
  TableBody,
  TableContainer,
  TableRow,
  TableCell,
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
import { getAllDepositHistoryAsync } from '../redux/services/user_services';
import MainTransactionTableRow from '../sections/_main_transaction/list/MainTransactionTableRow';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'sNo', label: 'S.No.', align: 'center' },
  { id: 'date', label: 'Date', align: 'left' },
  { id: 'userName', label: 'User Name', align: 'left' },
  { id: 'depositAmount', label: 'Deposit Amount', align: 'left' },
  { id: 'balance', label: 'Balance', align: 'left' },
  { id: 'utrNo', label: 'UTR No.', align: 'left' },
  { id: 'modeOfPayment', label: 'Mode Of Payment', align: 'left' },
  // { id: 'remarks', label: 'Remarks', align: 'left' },
];

// ----------------------------------------------------------------------

export default function DipositHistoryListPage() {
  const {
    dense,
    page,
    rowsPerPage,
    setPage,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();

  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();

  // Redux state
  const { allDepositHistoryList, allDepositHistoryLoading, allDepositHistoryPagination } = useSelector(
    (state) => state.user
  );

  // Fetch deposit history on component mount and when pagination changes
  useEffect(() => {
    dispatch(
      getAllDepositHistoryAsync({
        page: page + 1, // API uses 1-based pagination
        limit: rowsPerPage,
      })
    );
  }, [dispatch, page, rowsPerPage]);

  // Transform API data to table format
  const tableData = useMemo(
    () =>
      allDepositHistoryList.map((transaction, index) => ({
        ...transaction,
        id: transaction._id || index + 1,
        _id: transaction._id,
        sno: (page * rowsPerPage) + index + 1, // Calculate S.No. based on pagination
        date: transaction.date,
        particulars: transaction.particulars || 'Deposit',
        debit: 0,
        credit: transaction.credit || 0,
        balance: transaction.balance || 0,
        user: transaction.user,
        admin: transaction.admin,
        remarks: transaction.remarks || '-',
        userName: transaction.user?.name || 'N/A',
        userPhone: transaction.user?.number || transaction.user?.whatsappNumber || 'N/A',
        createdBy: transaction.admin?.name || 'System',
        utrNo:
          transaction.utrNo ??
          transaction.utrNumber ??
          transaction.transactionId ??
          '—',
        modeOfPayment:
          transaction.modeOfPayment ??
          transaction.paymentMode ??
          transaction.paymentMethod ??
          '—',
      })),
    [allDepositHistoryList, page, rowsPerPage]
  );

  const denseHeight = dense ? 52 : 72;

  const isNotFound = !allDepositHistoryLoading && !tableData.length;

  return (
    <>
      <Helmet>
        <title> Deposit History : List | Rupa999 </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="Deposit History List"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Deposit History List', href: PATH_DASHBOARD.diposithistory.root },
          ]}
        />

        <Card>
          <CustomTableToolbar />

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: { xs: 500, sm: 800 } }}>
                <TableHeadCustom
                  headLabel={TABLE_HEAD}
                  rowCount={tableData.length}
                />

                <TableBody>
                  {allDepositHistoryLoading ? (
                    <TableRow>
                      <TableCell colSpan={TABLE_HEAD.length} align="center">
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : (
                    <>
                      {tableData.length > 0 ? (
                        tableData.map((row, index) => (
                          <MainTransactionTableRow
                            key={row.id || index}
                            row={row}
                            index={row.sno}
                            variant="deposit"
                          />
                        ))
                      ) : (
                        <TableNoData isNotFound={isNotFound} />
                      )}

                      <TableEmptyRows
                        height={denseHeight}
                        emptyRows={emptyRows(
                          page,
                          rowsPerPage,
                          allDepositHistoryPagination?.total || tableData.length
                        )}
                      />
                    </>
                  )}
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={allDepositHistoryPagination?.total || 0}
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
