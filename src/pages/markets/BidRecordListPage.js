import { Helmet } from 'react-helmet-async';
import { paramCase } from 'change-case';
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { Card, Table, TableBody, Container, TableContainer, Box } from '@mui/material';
import useResponsive from '../../hooks/useResponsive';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// _mock_
// components
import Scrollbar from '../../components/scrollbar';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
import {
  useTable,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from '../../components/table';
import CustomTableToolbar from '../../components/table/CustomTableToolBar';
// sections
import WinHistoryTableRow from '../../sections/_win_history/list/WinHistoryTableRow';
import BidRecordMobileViewCardLayout from '../../sections/_bid_records/list/BidRecordMobileViewCardLayout';

// ----------------------------------------------------------------------

// Dummy data for Bid Records
const bidRecordData = [
  {
    id: 1,
    userId: 'user001',
    marketName: 'RAJDHANI DAY',
    userName: 'Open',
    session: 'Jodi Digit',
    number: '47',
    amount: 1000,
    winAmount: 0,
    createdAt: '2025-11-15 10:30:25',
  },
  {
    id: 2,
    userId: 'user002',
    marketName: 'RAJDHANI DAY',
    userName: 'Open',
    session: 'Single Pana',
    number: '680',
    amount: 500,
    winAmount: 0,
    createdAt: '2025-11-15 10:28:15',
  },
  {
    id: 3,
    userId: 'user001',
    marketName: 'RAJDHANI DAY',
    userName: 'Close',
    session: 'Jodi Digit',
    number: '56',
    amount: 750,
    winAmount: 0,
    createdAt: '2025-11-15 10:25:42',
  },
  {
    id: 4,
    userId: 'user003',
    marketName: 'RAJDHANI DAY',
    userName: 'Open',
    session: 'Jodi Digit',
    number: '74',
    amount: 1200,
    winAmount: 0,
    createdAt: '2025-11-15 10:22:18',
  },
  {
    id: 5,
    userId: 'user002',
    marketName: 'RAJDHANI DAY',
    userName: 'Close',
    session: 'Single Digit',
    number: '5',
    amount: 800,
    winAmount: 0,
    createdAt: '2025-11-15 10:20:55',
  },
  {
    id: 6,
    userId: 'user001',
    marketName: 'RAJDHANI DAY',
    userName: 'Close',
    session: 'Double Pana',
    number: '123',
    amount: 600,
    winAmount: 0,
    createdAt: '2025-11-15 10:18:30',
  },
  {
    id: 7,
    userId: 'user003',
    marketName: 'RAJDHANI DAY',
    userName: 'Close',
    session: 'Jodi Digit',
    number: '12',
    amount: 950,
    winAmount: 0,
    createdAt: '2025-11-15 10:15:12',
  },
  {
    id: 8,
    userId: 'user002',
    marketName: 'RAJDHANI DAY',
    userName: 'Close',
    session: 'Triple Pana',
    number: '456',
    amount: 1100,
    winAmount: 0,
    createdAt: '2025-11-15 10:12:45',
  },
  {
    id: 9,
    userId: 'user001',
    marketName: 'RAJDHANI DAY',
    userName: 'Open',
    session: 'Single Pana',
    number: '234',
    amount: 700,
    winAmount: 0,
    createdAt: '2025-11-15 10:10:20',
  },
  {
    id: 10,
    userId: 'user003',
    marketName: 'RAJDHANI DAY',
    userName: 'Open',
    session: 'Jodi Digit',
    number: '89',
    amount: 850,
    winAmount: 0,
    createdAt: '2025-11-15 10:08:05',
  },
  {
    id: 11,
    userId: 'user002',
    marketName: 'RAJDHANI DAY',
    userName: 'Close',
    session: 'Half Sangam A',
    number: '123-4',
    amount: 1300,
    winAmount: 0,
    createdAt: '2025-11-15 10:05:33',
  },
  {
    id: 12,
    userId: 'user001',
    marketName: 'RAJDHANI DAY',
    userName: 'Close',
    session: 'Full Sangam',
    number: '456-789',
    amount: 1500,
    winAmount: 0,
    createdAt: '2025-11-15 10:03:15',
  },
  {
    id: 13,
    userId: 'user003',
    marketName: 'RAJDHANI DAY',
    userName: 'Open',
    session: 'Jodi Digit',
    number: '23',
    amount: 650,
    winAmount: 0,
    createdAt: '2025-11-15 10:00:50',
  },
  {
    id: 14,
    userId: 'user002',
    marketName: 'RAJDHANI DAY',
    userName: 'Open',
    session: 'Single Digit',
    number: '7',
    amount: 900,
    winAmount: 0,
    createdAt: '2025-11-15 09:58:22',
  },
  {
    id: 15,
    userId: 'user001',
    marketName: 'RAJDHANI DAY',
    userName: 'Close',
    session: 'Double Pana',
    number: '789',
    amount: 1050,
    winAmount: 0,
    createdAt: '2025-11-15 09:55:10',
  },
];

const TABLE_HEAD = [
  { id: 'actions', label: 'Actions', align: 'center' },
  { id: 'id', label: 'ID', align: 'left' },
  { id: 'marketName', label: 'Market Name', align: 'left' },
  { id: 'userName', label: 'Market Time', align: 'left' },
  { id: 'game', label: 'Bid Number', align: 'left' },
  { id: 'amount', label: 'Amount', align: 'left' },
  { id: 'user', label: 'User Name', align: 'left' },
  { id: 'mobile', label: 'Mobile', align: 'left' },
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

  const navigate = useNavigate();

  const [tableData, setTableData] = useState(bidRecordData);
  const loading = false;

  const [filterName, setFilterName] = useState(''); // Input field value
  const [searchQuery, setSearchQuery] = useState(''); // Actual search value for filtering

  const [filterRole, setFilterRole] = useState('all');

  const [filterStatus, setFilterStatus] = useState('all');

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


  const handleFilterName = (event) => {
    setFilterName(event.target.value);
  };

  const handleSearch = () => {
    setPage(0);
    setSearchQuery(filterName);
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
              data={dataInPage}
              loading={loading}
            />
            <TablePaginationCustom
              count={dataFiltered.length}
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
                    {dataFiltered
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
