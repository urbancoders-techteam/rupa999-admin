import { paramCase } from 'change-case';
import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// @mui
import { Box, Button, Card, Container, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';
import useResponsive from '../../hooks/useResponsive';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import ConfirmDialog from '../../components/confirm-dialog';
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
// sections
import WinHistoryTableRow from '../../sections/_win_history/list/WinHistoryTableRow';
import WithdrawMobileViewCardLayout from '../../sections/_withdraw_details/components/WithdrawDetailsMobileViewCardLayout';
import WithdrawDetailsToolbar from '../../sections/_withdraw_details/components/WithdrawDetailsToolbar';
// redux
import { getAllWinningBidsAsync } from '../../redux/services/bid_services';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'actions', label: 'Actions', align: 'center' },
  { id: 'id', label: 'ID', align: 'left' },
  { id: 'marketName', label: 'Market Name', align: 'left' },
  { id: 'userName', label: 'Winner Name', align: 'left' },
  { id: 'session', label: 'Session', align: 'left' },
  { id: 'amount', label: 'Amount', align: 'left' },
  { id: 'number', label: 'Number', align: 'left' },
  { id: 'winAmount', label: 'Win Amount', align: 'left' },
  { id: 'createdAt', label: 'Created At', align: 'left' },
];

// ----------------------------------------------------------------------

export default function WinHistoryListPage() {
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

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { winningBidsList, loading, pagination } = useSelector((state) => state.bid);

  const [openConfirm, setOpenConfirm] = useState(false);

  const [filterName, setFilterName] = useState(''); // Input field value
  const [searchQuery, setSearchQuery] = useState(''); // Actual search value for filtering

  const [filterRole, setFilterRole] = useState('all');

  const [filterStatus, setFilterStatus] = useState('all');

  // Fetch winning bids on mount and when page changes
  useEffect(() => {
    dispatch(
      getAllWinningBidsAsync({
        page: page + 1, // API uses 1-based pagination
        limit: rowsPerPage,
      })
    );
  }, [dispatch, page, rowsPerPage]);

  // Transform API data to table format
  const tableData = useMemo(
    () =>
      winningBidsList.map((bid, index) => ({
        id: bid._id,
        sno: (page * rowsPerPage) + index + 1, // Calculate S.No. based on pagination
        marketName: bid.marketId?.name || 'N/A',
        userName: bid.userId?.name || 'N/A',
        session: bid.type || 'N/A',
        number: bid.bidTable?.digit || 'N/A',
        amount: bid.totalPoints || 0,
        winAmount: bid.winAmount || 0,
        createdAt: bid.createdAt ? new Date(bid.createdAt).toLocaleString() : 'N/A',
      })),
    [winningBidsList, page, rowsPerPage]
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

  // Memoized paginated data
  const dataInPage = useMemo(
    () => dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [dataFiltered, page, rowsPerPage]
  );

  const denseHeight = dense ? 52 : 72;

  const isMobile = useResponsive('down', 'sm');

  const isFiltered = searchQuery !== '' || filterRole !== 'all' || filterStatus !== 'all';

  const isNotFound =
    (!dataFiltered.length && !!searchQuery) ||
    (!dataFiltered.length && !!filterRole) ||
    (!dataFiltered.length && !!filterStatus);


  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleFilterName = (event) => {
    setFilterName(event.target.value);
  };

  const handleSearch = () => {
    setPage(0);
    setSearchQuery(filterName);
  };

  const handleDeleteRow = (id) => {
    // Note: Delete functionality should be implemented via API if needed
    // For now, this is just a placeholder
    console.log('Delete row:', id);
  };

  const handleDeleteRows = (selectedRows) => {
    // Note: Delete functionality should be implemented via API if needed
    // For now, this is just a placeholder
    console.log('Delete rows:', selectedRows);
    setSelected([]);
    // Since we're using API data, we can't delete locally
    // This would need to be implemented via API endpoint
  };

  const handleEditRow = (id) => {
    navigate(PATH_DASHBOARD.user.edit(paramCase(id)));
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
        <title> Win History List : List | Rupa999 </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        {isMobile ? (
          <Box sx={{ position: 'sticky', top: 0, zIndex: 10, bgcolor: 'background.paper' }}>
            <CustomBreadcrumbs
              heading="Win History List"
              links={[
                { name: 'Dashboard', href: PATH_DASHBOARD.root },
                { name: 'Win History List', href: PATH_DASHBOARD.markets.winhistory.root },
              ]}
            />
            <WithdrawDetailsToolbar
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
              heading="Win History List"
              links={[
                { name: 'Dashboard', href: PATH_DASHBOARD.root },
                { name: 'Win History List', href: PATH_DASHBOARD.markets.winhistory.list },
              ]}
            />
            <WithdrawDetailsToolbar
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
                    headLabel={TABLE_HEAD}
                    rowCount={tableData.length}
                    numSelected={selected.length}
                  />

                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={TABLE_HEAD.length} align="center">
                          Loading...
                        </TableCell>
                      </TableRow>
                    ) : (
                      <>
                        {dataFiltered
                          ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .map((row, index) => (
                            <WinHistoryTableRow
                              index={row.sno}
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
                      </>
                    )}
                  </TableBody>
                </Table>
              </Scrollbar>
            </TableContainer>
            <TablePaginationCustom
              count={pagination.total || 0}
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
