import { paramCase } from 'change-case';
import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
// redux
import { useDispatch, useSelector } from 'react-redux';
// @mui
import { Box, Button, Card, Container, Table, TableBody, TableContainer, CircularProgress, Typography } from '@mui/material';
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
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  TableSkeleton,
  useTable,
} from '../../components/table';
// sections
import CustomTableToolbar from '../../components/table/CustomTableToolBar';
import GeneralMarketRecordMVCLayout from '../../sections/_general_market_records/components/GeneralMarketRecordMVCLayout';
import GeneralMarketRecordTableRow from '../../sections/_general_market_records/components/GeneralMarketRecordsTableRow';
// redux services
import { getAllMarketsAsync } from '../../redux/services/market_services';
import { getGeneralMarketRecordsAsync } from '../../redux/services/user_services';

// ----------------------------------------------------------------------


const TABLE_HEAD = [
  { id: 'actions', label: 'Actions', align: 'center' },
  { id: 'id', label: 'ID', align: 'left' },
  { id: 'marketName', label: 'Market Name', align: 'left' },
  { id: 'userName', label: 'User Name', align: 'left' },
  { id: 'userPhone', label: 'User Phone', align: 'left' },
  { id: 'session', label: 'Session', align: 'left' },
  { id: 'number', label: 'Number', align: 'left' },
  { id: 'amount', label: 'Amount', align: 'left' },
  { id: 'winAmount', label: 'Win Amount', align: 'left' },
  { id: 'status', label: 'Status', align: 'left' },
  { id: 'createdAt', label: 'Created At', align: 'left' },
];

// ----------------------------------------------------------------------

export default function GeneralMarketRecordListPage() {
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
  const dispatch = useDispatch();

  // Redux state
  const {
    generalMarketRecordsList,
    generalMarketRecordsLoading,
    generalMarketRecordsPagination,
  } = useSelector((state) => state.user);

  const { marketList } = useSelector((state) => state.market);

  const navigate = useNavigate();

  const [openConfirm, setOpenConfirm] = useState(false);

  const [filterName, setFilterName] = useState('');
  const [searchQuery, setSearchQuery] = useState(''); // Actual search value sent to API

  const [selectedDropDown, setSelectedDropDown] = useState('');

  const [filterStatus, setFilterStatus] = useState('all');

  const [selectedDate, setSelectedDate] = useState(new Date());

  // Fetch markets on component mount
  useEffect(() => {
    dispatch(getAllMarketsAsync({ page: 1, limit: 100 }));
  }, [dispatch]);

  const handleDateFilter = (newValue) => {
    setSelectedDate(newValue);
  };

  // Fetch data on component mount and when filters change (but not on filterName change)
  useEffect(() => {
    dispatch(
      getGeneralMarketRecordsAsync({
        page: page + 1, // API uses 1-based pagination
        limit: rowsPerPage,
        search: searchQuery,
        marketId: selectedDropDown || '',
        status: filterStatus !== 'all' ? filterStatus : '',
      })
    );
  }, [dispatch, page, rowsPerPage, searchQuery, selectedDropDown, filterStatus]);

  // Transform API data to table format
  const tableData = useMemo(
    () =>
      generalMarketRecordsList.map((record, index) => ({
        id: record.id || index + 1,
        marketName: record.marketName || '-',
        userName: record.userName || '-',
        userPhone: record.userPhone || '-',
        session: record.session || '-',
        number: record.number || '-',
        amount: record.amount || 0,
        winAmount: record.winAmount || 0,
        status: record.status || 'PENDING',
        createdAt: record.createdAt || '-',
        ...record,
      })),
    [generalMarketRecordsList]
  );

  // Apply client-side sorting
  const dataFiltered = useMemo(
    () => {
      const stabilizedThis = tableData.map((el, index) => [el, index]);
      stabilizedThis.sort((a, b) => {
        const sortOrder = getComparator(order, orderBy)(a[0], b[0]);
        if (sortOrder !== 0) return sortOrder;
        return a[1] - b[1];
      });
      return stabilizedThis.map((el) => el[0]);
    },
    [tableData, order, orderBy]
  );

  const denseHeight = dense ? 52 : 72;

  const isMobile = useResponsive('down', 'md');

  const isFiltered = searchQuery !== '' || selectedDropDown !== '' || filterStatus !== 'all';

  const isNotFound = !generalMarketRecordsLoading && !tableData.length;

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

  const handleSelectedDropDown = (event) => {
    setPage(0);
    setSelectedDropDown(event.target.value);
  };

  const handleDeleteRow = (id) => {
    // Note: Delete functionality would need to be implemented in the API
    // For now, this is a placeholder
    console.log('Delete row:', id);
  };

  const handleDeleteRows = (selectedRows) => {
    // Note: Delete functionality would need to be implemented in the API
    // For now, this is a placeholder
    console.log('Delete rows:', selectedRows);
    setSelected([]);
  };

  const handleEditRow = (id) => {
    navigate(PATH_DASHBOARD.user.edit(paramCase(id)));
  };

  const handleResetFilter = () => {
    setFilterName('');
    setSearchQuery('');
    setSelectedDropDown('');
    setFilterStatus('all');
    setPage(0);
  };

  return (
    <>
      <Helmet>
        <title> General Market Record : List | Rupa999 </title>
      </Helmet>

      <Container 
        maxWidth={themeStretch ? false : 'xl'}
        sx={{
          px: { xs: 1, sm: 2, md: 3 },
          pb: { xs: 2, sm: 3 },
          pt: { xs: 1, sm: 2 },
        }}
      >
        {isMobile ? (
          <Box 
            sx={{ 
              position: 'sticky', 
              top: 0, 
              zIndex: 10, 
              bgcolor: 'background.paper',
              pb: { xs: 1, sm: 1.5 },
              mb: { xs: 1, sm: 1.5 },
              pt: { xs: 1, sm: 1.5 },
              boxShadow: { xs: '0 2px 4px rgba(0,0,0,0.05)', sm: 'none' },
            }}
          >
            <CustomBreadcrumbs
              heading="General Market Record"
              links={[
                { name: 'Dashboard', href: PATH_DASHBOARD.root },
                { name: 'General Market Record', href: PATH_DASHBOARD.markets.marketrecords.root },
              ]}
              sx={{ mb: { xs: 1, sm: 2 } }}
            />
            <CustomTableToolbar
              isFiltered={isFiltered}
              filterName={filterName}
              selectedDate={selectedDate}
              marketOptions={marketList}
              selectedDropDown={selectedDropDown}
              onselectedDropDown={handleSelectedDropDown}
              onDateFilter={handleDateFilter}
              onFilterName={handleFilterName}
              onSearch={handleSearch}
              onResetFilter={handleResetFilter}
            />
          </Box>
        ) : (
          <>
            <CustomBreadcrumbs
              heading="General Market Record"
              links={[
                { name: 'Dashboard', href: PATH_DASHBOARD.root },
                { name: 'General Market Record', href: PATH_DASHBOARD.markets.marketrecords.list },
              ]}
            />
            <CustomTableToolbar
              isFiltered={isFiltered}
              filterName={filterName}
              marketOptions={marketList}
              selectedDropDown={selectedDropDown}
              onselectedDropDown={handleSelectedDropDown}
              onFilterName={handleFilterName}
              onSearch={handleSearch}
              onResetFilter={handleResetFilter}
              sx={{ mt: 1 }}
            />
          </>
        )}

        {/* Render mobile card layout for small screens, otherwise render the table */}
        {isMobile ? (
          <Box 
            sx={{ 
              mt: { xs: 1, sm: 2 }, 
              width: '100%', 
              overflow: 'hidden',
              minHeight: { xs: 'calc(100vh - 320px)', sm: '400px' },
            }}
          >
            {generalMarketRecordsLoading ? (
              <Box 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  minHeight: { xs: '200px', sm: '300px' },
                  py: 4,
                }}
              >
                <Box sx={{ textAlign: 'center' }}>
                  <CircularProgress size={40} />
                  <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
                    Loading records...
                  </Typography>
                </Box>
              </Box>
            ) : (
              <>
                <GeneralMarketRecordMVCLayout
                  data={dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
                  loading={generalMarketRecordsLoading}
                  onEditRow={(id) => handleEditRow(id)}
                  onDeleteRow={(id) => handleDeleteRow(id)}
                  onSelectRow={(id) => onSelectRow(id)}
                  selected={selected}
                  page={page}
                  rowsPerPage={rowsPerPage}
                  total={generalMarketRecordsPagination?.total || tableData.length}
                  onPageChange={onChangePage}
                  onRowsPerPageChange={onChangeRowsPerPage}
                />
              </>
            )}
          </Box>
        ) : (
          <Card>
            <TableContainer sx={{ position: 'relative', overflow: 'auto' }}>
              <Scrollbar>
                <Table size={!dense ? 'small' : 'medium'} sx={{ minWidth: { xs: 600, md: 800 } }}>
                  <TableHeadCustom
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={tableData.length}
                    numSelected={selected.length}
                    onSort={onSort}
                  />

                  <TableBody>
                    {generalMarketRecordsLoading ? (
                      <TableSkeleton />
                    ) : (
                      <>
                        {tableData.length > 0 ? (
                          dataFiltered.map((row, index) => (
                            <GeneralMarketRecordTableRow
                              index={(page * rowsPerPage) + index + 1}
                              key={row.id}
                              row={row}
                              selected={selected.includes(row.id)}
                              onSelectRow={() => onSelectRow(row.id)}
                              onDeleteRow={() => handleDeleteRow(row.id)}
                              onEditRow={() => handleEditRow(row.id)}
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
                            generalMarketRecordsPagination?.total || tableData.length
                          )}
                        />
                      </>
                    )}
                  </TableBody>
                </Table>
              </Scrollbar>
            </TableContainer>
            <TablePaginationCustom
              count={generalMarketRecordsPagination?.total || tableData.length}
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