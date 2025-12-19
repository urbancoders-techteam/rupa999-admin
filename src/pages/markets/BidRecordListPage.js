import { paramCase } from 'change-case';
import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
// @mui
import { Box, Card, Container, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from '@mui/material';
import useResponsive from '../../hooks/useResponsive';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// _mock_
// components
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import Scrollbar from '../../components/scrollbar';
import { useSettingsContext } from '../../components/settings';
import {
  emptyRows,
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  useTable,
} from '../../components/table';
import CustomTableToolbar from '../../components/table/CustomTableToolBar';
// sections
import BidRecordMobileViewCardLayout from '../../sections/_bid_records/list/BidRecordMobileViewCardLayout';
import WinHistoryTableRow from '../../sections/_win_history/list/WinHistoryTableRow';
// redux
import { getBidRecordsByDigitAndTypeAsync } from '../../redux/services/bid_services';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'actions', label: 'Actions', align: 'center' },
  { id: 'user', label: 'User Name', align: 'left' },
  { id: 'mobile', label: 'Mobile', align: 'left' },
  // { id: 'id', label: 'ID', align: 'left' },
  { id: 'game', label: 'Bid Number', align: 'left' },
  { id: 'amount', label: 'Amount', align: 'left' },
  { id: 'marketName', label: 'Market Name', align: 'left' },
  { id: 'userName', label: 'Market Time', align: 'left' },
];


// ----------------------------------------------------------------------
export default function BidRecordListPage() {
  const {
    dense,
    page,
    rowsPerPage,
    setPage,
    //
    selected,
    setSelected,
    onSelectRow,
    //
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();

  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams(); // Get id from route params (format: digit_type)

  const { bidRecordsList, loading, pagination } = useSelector((state) => state.bid);

  const [filterName, setFilterName] = useState(''); // Input field value
  const [searchQuery, setSearchQuery] = useState(''); // Actual search value for filtering

  const [filterRole, setFilterRole] = useState('all');

  const [filterStatus, setFilterStatus] = useState('all');

  // Fetch bid records when component mounts or when id/page/rowsPerPage changes
  useEffect(() => {
    if (id) {
      dispatch(
        getBidRecordsByDigitAndTypeAsync({
          id,
          page: page + 1, // API uses 1-based pagination
          limit: rowsPerPage,
        })
      );
    }
  }, [dispatch, id, page, rowsPerPage]);

  // Transform API data to table format
  const tableData = useMemo(
    () =>
      bidRecordsList.map((bid, index) => ({
        id: bid.id || bid._id || index + 1,
        _id: bid._id || bid.id,
        userId: bid.userId,
        marketName: bid.marketName || 'N/A',
        userName: bid.userName || 'N/A',
        session: bid.session || 'N/A',
        game: bid.game || bid.gameType || 'N/A',
        number: bid.number || 'N/A',
        amount: bid.amount || 0,
        winAmount: bid.winAmount || 0,
        createdAt: bid.createdAt || 'N/A',
        mobile: bid.mobile || 'N/A',
        ...bid,
      })),
    [bidRecordsList]
  );

  // Memoized filtered data
  const dataFiltered = useMemo(
    () =>
      applyFilter({
        inputData: tableData,
        filterName: searchQuery,
        filterRole,
        filterStatus,
      }),
    [tableData, searchQuery, filterRole, filterStatus]
  );

  // Use API pagination instead of client-side pagination
  const dataInPage = tableData;

  const denseHeight = dense ? 52 : 72;

  const isMobile = useResponsive('down', 'sm');

  const isFiltered = searchQuery !== '' || filterRole !== 'all' || filterStatus !== 'all';

  const isNotFound =
    (!dataFiltered.length && !!searchQuery) ||
    (!dataFiltered.length && !!filterRole) ||
    (!dataFiltered.length && !!filterStatus);


  const handleFilterName = (event) => {
    setFilterName(event.target.value);
  };

  const handleSearch = () => {
    setPage(0);
    setSearchQuery(filterName);
  };

  const handleDeleteRow = (rowId) => {
    // Note: Delete functionality would need to be implemented via API
    // For now, just remove from selected
    setSelected(selected.filter((selectedId) => selectedId !== rowId));
  };

  const handleEditRow = (rowId) => {
    navigate(PATH_DASHBOARD.user.edit(paramCase(rowId)));
  };

  const handleResetFilter = () => {
    setFilterName('');
    setSearchQuery('');
    setFilterRole('all');
    setFilterStatus('all');
    setPage(0);
  };

  return (
    <>
      <Helmet>
        <title> Bid Record Data : List | Rupa999 </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        {isMobile ? (
          <Box sx={{ position: 'sticky', top: 0, zIndex: 10, bgcolor: 'background.paper' }}>
            <CustomBreadcrumbs
              heading="Bid Record Data"
              links={[
                { name: 'Dashboard', href: PATH_DASHBOARD.root },
                { name: 'Market Data', href: PATH_DASHBOARD.markets.marketdata.list },
                { name: 'Bid Record Data', href: PATH_DASHBOARD.markets.winhistory.list },
                { name: 'List' },
              ]}
            />
            <CustomTableToolbar
              isFiltered={isFiltered}
              filterName={filterName}
              onFilterName={handleFilterName}
              onSearch={handleSearch}
              onResetFilter={handleResetFilter}
              sx={{ mt: 1 }}
            />
          </Box>
        ) : (
          <>

            <CustomBreadcrumbs
              heading="Bid Record Data"
              links={[
                { name: 'Dashboard', href: PATH_DASHBOARD.root },
                { name: 'Market Data', href: PATH_DASHBOARD.markets.marketdata.list },
                { name: 'Bid Record Data', href: PATH_DASHBOARD.markets.winhistory.root },
                { name: 'List' },
              ]}
            />

            <CustomTableToolbar
              isFiltered={isFiltered}
              filterName={filterName}
              onFilterName={handleFilterName}
              onSearch={handleSearch}
              onResetFilter={handleResetFilter}
              sx={{ mt: 1 }}
            />
          </>
        )}

        {/* Render mobile card layout for small screens, otherwise render the table */}
        {isMobile ? (
          <>
            <BidRecordMobileViewCardLayout
              data={[]}
              loading={loading}
            />
            <TablePaginationCustom
              page={pagination?.page ? pagination.page - 1 : page}
              count={pagination?.total || 0}
              rowsPerPage={rowsPerPage}
              onPageChange={onChangePage}
              onRowsPerPageChange={onChangeRowsPerPage}
              dense={dense}
              onChangeDense={onChangeDense}
            />
          </>
        ) : (
          <Card>
            <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
              <Scrollbar>
                <Table size={!dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                  <TableHeadCustom
                    headLabel={TABLE_HEAD}
                    rowCount={tableData.length}
                    numSelected={selected.length}
                  />

                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={TABLE_HEAD.length} align="center" sx={{ py: 3 }}>
                          <Typography>Loading...</Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      <>
                        {dataFiltered.map((row, index) => (
                          <WinHistoryTableRow
                            index={
                              pagination?.page
                                ? (pagination.page - 1) * rowsPerPage + index + 1
                                : index + 1
                            }
                            key={row.id || row._id || index}
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
                      </>
                    )}
                    {/* {[]
                      ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row, index) => (
                        <WinHistoryTableRow
                          index={(page * rowsPerPage) + index + 1}
                          key={row.id}
                          row={row}
                          selected={selected.includes(row.id)}
                          onSelectRow={() => onSelectRow(row.id)}
                          onDeleteRow={() => handleDeleteRow(row.id)}
                          onEditRow={() => handleEditRow(row.name)}
                        />
                      ))} */}

                    <TableEmptyRows
                      height={denseHeight}
                      emptyRows={emptyRows(page, rowsPerPage, tableData.length)}
                    />

                    <TableNoData isNotFound={!isNotFound} />
                  </TableBody>
                </Table>
              </Scrollbar>
            </TableContainer>
            <TablePaginationCustom
              page={pagination?.page ? pagination.page - 1 : page}
              count={pagination?.total || 0}
              rowsPerPage={rowsPerPage}
              onPageChange={onChangePage}
              onRowsPerPageChange={onChangeRowsPerPage}
              dense={dense}
              onChangeDense={onChangeDense}
            />
          </Card>
        )}
      </Container>

      {/* <ConfirmDialog
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
      /> */}
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, filterName, filterStatus, filterRole }) {
  let filteredData = inputData;

  if (filterName) {
    filteredData = filteredData.filter(
      (record) =>
        (record.marketName && record.marketName.toLowerCase().indexOf(filterName.toLowerCase()) !== -1) ||
        (record.session && record.session.toLowerCase().indexOf(filterName.toLowerCase()) !== -1) ||
        (record.number && record.number.toLowerCase().indexOf(filterName.toLowerCase()) !== -1)
    );
  }

  if (filterStatus !== 'all') {
    filteredData = filteredData.filter((record) => record.status === filterStatus);
  }

  if (filterRole !== 'all') {
    filteredData = filteredData.filter((record) => record.role === filterRole);
  }

  return filteredData;
}
