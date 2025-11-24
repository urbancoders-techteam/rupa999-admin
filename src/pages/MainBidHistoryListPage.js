import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
// @mui
import {
  Card,
  Container,
  Table,
  TableBody,
  TableContainer,
} from '@mui/material';
import { Box } from '@mui/system';
// redux
import { useDispatch, useSelector } from 'react-redux';
import useResponsive from '../hooks/useResponsive';
// routes
import { PATH_DASHBOARD } from '../routes/paths';
// components
import CustomBreadcrumbs from '../components/custom-breadcrumbs';
import Scrollbar from '../components/scrollbar';
import { useSettingsContext } from '../components/settings';
import {
  emptyRows,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  TableSkeleton,
  useTable,
} from '../components/table';
// sections
import UserBidHistoryTableToolbar from '../sections/_users/bid-history/list/UserBidHistoryTableToolbar';
import BidHostoryMobileViewCardLayout from '../sections/_users/bid-history/list/BidHostoryMobileViewCardLayout';
import MainBidHistoryTableRow from '../sections/_main_bid_history/list/MainBidHistoryTableRow';
import { getAllBidsAsync } from '../redux/services/user_services';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'sNo.', label: 'S.No.', align: 'left' },
  { id: 'userName', label: 'User Name', align: 'left' },
  { id: 'phoneNumber', label: 'Phone', align: 'left' },
  { id: 'marketName', label: 'Market Name', align: 'left' },
  { id: 'name', label: 'Game Name', align: 'left' },
  { id: 'digit', label: 'Digit', align: 'left' },
  { id: 'point', label: 'Point', align: 'left' },
  { id: 'date', label: 'Date', align: 'left' },
];

// ----------------------------------------------------------------------

export default function MainBidHistoryListPage() {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    //
    selected,
    //
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();

  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();

  // Redux state
  const { allBidsList, allBidsLoading, allBidsPagination } = useSelector(
    (state) => state.user
  );

  const [filterName, setFilterName] = useState('');
  const [filterGameType, setFilterGameType] = useState(null);
  const [filterStatus, setFilterStatus] = useState(null);

  const [filterRole] = useState('all');

  // Fetch bids on component mount and when filters change
  useEffect(() => {
    dispatch(
      getAllBidsAsync({
        page: page + 1, // API uses 1-based pagination
        limit: rowsPerPage,
        search: filterName,
        gameType: filterGameType?.value || '',
        status: filterStatus?.value || '',
      })
    );
  }, [dispatch, page, rowsPerPage, filterName, filterGameType, filterStatus]);

  // Transform API data to table format
  const tableData = useMemo(
    () =>
      allBidsList.map((bid, index) => ({
        id: bid._id || index + 1,
        _id: bid._id,
        marketName: bid.marketName || bid.market?.name || '-',
        name: bid.gameName || bid.gameType || bid.name || '-',
        digit: bid.digit || bid.number || '-',
        point: bid.point || bid.amount || 0,
        date: bid.date || bid.createdAt || '-',
        gameType: bid.gameType,
        status: bid.status,
        ...bid,
      })),
    [allBidsList]
  );

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
  });

  const denseHeight = dense ? 52 : 72;

  const isMobile = useResponsive('down', 'sm');

  const isFiltered = filterName !== '' || filterRole !== 'all' || filterStatus !== null || filterGameType !== null;

  const isNotFound = !allBidsLoading && !tableData.length;

  const handleFilterName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleGameTypeChange = (gameType) => {
    setPage(0);
    setFilterGameType(gameType);
  };

  const handleStatusChange = (status) => {
    setPage(0);
    setFilterStatus(status);
  };

  const handleResetFilter = () => {
    setFilterName('');
    setFilterGameType(null);
    setFilterStatus(null);
  };

  return (
    <>
      <Helmet>
        <title> Main Bid History : List | Rupa999 </title>
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
            heading="Main Bid History List"
            links={[
              { name: 'Dashboard', href: PATH_DASHBOARD.root },
              { name: 'Main Bid History List' },
            ]}
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
            <UserBidHistoryTableToolbar
              isFiltered={isFiltered}
              filterName={filterName}
              selectedGameType={filterGameType}
              selectedStatus={filterStatus}
              onFilterName={handleFilterName}
              onGameTypeChange={handleGameTypeChange}
              onStatusChange={handleStatusChange}
              onResetFilter={handleResetFilter}
            />
            <BidHostoryMobileViewCardLayout
              data={dataFiltered}
              loading={allBidsLoading}
            />
            <TablePaginationCustom
              count={allBidsPagination?.total || dataFiltered.length}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={onChangePage}
              onRowsPerPageChange={onChangeRowsPerPage}
              dense={dense}
              onChangeDense={onChangeDense}
            />
          </>
        ) : (
          <>
            <UserBidHistoryTableToolbar
              isFiltered={isFiltered}
              filterName={filterName}
              selectedGameType={filterGameType}
              selectedStatus={filterStatus}
              onFilterName={handleFilterName}
              onGameTypeChange={handleGameTypeChange}
              onStatusChange={handleStatusChange}
              onResetFilter={handleResetFilter}
            />
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
                    {allBidsLoading ? (
                      <TableSkeleton />
                    ) : (
                      <>
                        {tableData.length > 0 ? (
                          tableData.map((row, index) => (
                            <MainBidHistoryTableRow
                              key={row._id || row.id || index}
                              index={index}
                              row={row}
                              selected={selected.includes(row.id)}
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
                            allBidsPagination?.total || tableData.length
                          )}
                        />
                      </>
                    )}
                  </TableBody>
                </Table>
              </Scrollbar>
            </TableContainer>

            <TablePaginationCustom
              count={allBidsPagination?.total || tableData.length}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={onChangePage}
              onRowsPerPageChange={onChangeRowsPerPage}
              dense={dense}
              onChangeDense={onChangeDense}
            />
          </Card>
          </>
        )}
      </Container>
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator }) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  return stabilizedThis.map((el) => el[0]);
}
