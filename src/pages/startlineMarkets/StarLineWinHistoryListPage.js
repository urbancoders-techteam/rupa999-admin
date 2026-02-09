import { paramCase } from 'change-case';
import dayjs from 'dayjs';
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
import CustomTableToolbar from '../../components/table/CustomTableToolBar';
// sections
import WinHistoryTableRow from '../../sections/_win_history/list/WinHistoryTableRow';
import WinHistoryMobileViewCardLayout from '../../sections/_win_history/list/WinHistoryMobileViewCardLayout';
// redux
import { getAllWinningBidsAsync } from '../../redux/services/bid_services';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'actions', label: 'Actions', align: 'center' },
  { id: 'id', label: 'ID', align: 'left' },
  { id: 'marketName', label: 'Market Name', align: 'left' },
  { id: 'userName', label: 'Winner Name', align: 'left' },
  { id: 'contactNumber', label: 'Phone', align: 'left' },
  { id: 'session', label: 'Session', align: 'left' },
  { id: 'amount', label: 'Amount', align: 'left' },
  { id: 'number', label: 'Number', align: 'left' },
  { id: 'winAmount', label: 'Win Amount', align: 'left' },
  { id: 'createdAt', label: 'Created At', align: 'left' },
];

// ----------------------------------------------------------------------

export default function StarLineWinHistoryListPage() {
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

  const [filterName, setFilterName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Fetch starline winning bids only
  useEffect(() => {
    dispatch(
      getAllWinningBidsAsync({
        page: page + 1,
        limit: rowsPerPage,
        starlineOnly: true,
      })
    );
  }, [dispatch, page, rowsPerPage]);

  // Transform API data to table format
  const tableData = useMemo(
    () =>
      winningBidsList.map((bid, index) => ({
        id: bid._id,
        userId: bid.userId?._id,
        sno: (page * rowsPerPage) + index + 1,
        marketName: bid.marketId?.name || 'N/A',
        userName: bid.userId?.name || 'N/A',
        session: bid.type || 'N/A',
        number: bid.bidTable?.digit || 'N/A',
        contactNumber: bid.userId?.number || 'N/A',
        amount: bid.totalPoints || 0,
        winAmount: bid.winAmount || 0,
        createdAt: bid.createdAt ? dayjs(bid.createdAt).format('DD-MMM, YYYY HH:mm A') : 'N/A',
      })),
    [winningBidsList, page, rowsPerPage]
  );

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

  const dataInPage = useMemo(
    () => dataFiltered.slice(0, rowsPerPage),
    [dataFiltered, rowsPerPage]
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

  const handleDeleteRow = () => {
    // Read-only list; delete via API if needed later
  };

  const handleDeleteRows = () => {
    setSelected([]);
  };

  const handleEditRow = (userId) => {
    if (userId) navigate(PATH_DASHBOARD.user.view(paramCase(userId)));
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
        <title> Start Line Win History : List | Rupa999 </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        {isMobile ? (
          <Box sx={{ position: 'sticky', top: 0, zIndex: 10, bgcolor: 'background.paper' }}>
            <CustomBreadcrumbs
              heading="Start Line Win History"
              links={[
                { name: 'Dashboard', href: PATH_DASHBOARD.root },
                { name: 'Start Line Win History', href: PATH_DASHBOARD.starline.winhistory.root },
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
              heading="Start Line Win History"
              links={[
                { name: 'Dashboard', href: PATH_DASHBOARD.root },
                { name: 'Start Line Win History', href: PATH_DASHBOARD.starline.winhistory.list },
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

        {isMobile ? (
          <>
            <WinHistoryMobileViewCardLayout
              data={dataInPage}
              onEditRow={(id) => handleEditRow(id)}
              onDeleteRow={(id) => handleDeleteRow(id)}
              onSelectRow={(id) => onSelectRow(id)}
              selected={selected}
              page={page}
              rowsPerPage={rowsPerPage}
              loading={loading}
            />
            <TablePaginationCustom
              count={pagination.total || 0}
              page={page}
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
                        <TableCell colSpan={TABLE_HEAD.length} align="center">
                          Loading...
                        </TableCell>
                      </TableRow>
                    ) : (
                      <>
                        {dataFiltered?.map((row, index) => (
                            <WinHistoryTableRow
                              index={index + 1}
                              key={row.id}
                              row={row}
                              selected={selected.includes(row.id)}
                              onSelectRow={() => onSelectRow(row.id)}
                              onDeleteRow={() => handleDeleteRow(row.id)}
                              onEditRow={() => handleEditRow(row.userId)}
                            />
                          ))}

                        <TableEmptyRows
                          height={denseHeight}
                          emptyRows={emptyRows(0, rowsPerPage, dataFiltered.length)}
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
    const searchTerm = filterName.toLowerCase();
    filteredData = filteredData.filter(
      (item) =>
        (item.userName && item.userName.toLowerCase().indexOf(searchTerm) !== -1) ||
        (item.marketName && item.marketName.toLowerCase().indexOf(searchTerm) !== -1) ||
        (item.number && item.number.toString().indexOf(searchTerm) !== -1) ||
        (item.session && item.session.toLowerCase().indexOf(searchTerm) !== -1)
    );
  }

  if (filterStatus !== 'all') {
    filteredData = filteredData.filter((item) => item.status === filterStatus);
  }

  if (filterRole !== 'all') {
    filteredData = filteredData.filter((item) => item.role === filterRole);
  }

  return filteredData;
}
