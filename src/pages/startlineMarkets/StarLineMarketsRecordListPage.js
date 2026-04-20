import { Helmet } from 'react-helmet-async';
import { paramCase } from 'change-case';
import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
// @mui
import { Card, Table, Button, TableBody, Container, TableContainer, Box } from '@mui/material';
import useResponsive from '../../hooks/useResponsive';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Scrollbar from '../../components/scrollbar';
import ConfirmDialog from '../../components/confirm-dialog';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
  TableSkeleton,
} from '../../components/table';
// sections
import GeneralMarketRecordTableRow from '../../sections/_general_market_records/components/GeneralMarketRecordsTableRow';
import GeneralMarketRecordMVCLayout from '../../sections/_general_market_records/components/GeneralMarketRecordMVCLayout';
import CustomTableToolbar from '../../components/table/CustomTableToolBar';
// redux
import { getStarlineMarketRecordsAsync } from '../../redux/services/user_services';
import { getAllStarlineMarketsAsync } from '../../redux/services/starline_market_services';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'actions', label: 'Actions', align: 'center' },
  { id: 'id', label: 'ID', align: 'left' },
  { id: 'marketName', label: 'Market Name', align: 'left' },
  { id: 'userName', label: 'User Name', align: 'left' },
  { id: 'userPhone', label: 'User Phone', align: 'left' },
  { id: 'number', label: 'Number', align: 'left' },
  { id: 'amount', label: 'Amount', align: 'left' },
  { id: 'winAmount', label: 'Win Amount', align: 'left' },
  { id: 'status', label: 'Status', align: 'left' },
  { id: 'createdAt', label: 'Created At', align: 'left' },
];

// ----------------------------------------------------------------------

export default function StarLineMarketsRecordListPage() {
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
  const navigate = useNavigate();

  const {
    starlineMarketRecordsList,
    starlineMarketRecordsLoading,
    starlineMarketRecordsPagination,
  } = useSelector((state) => state.user);
  const { marketList: starlineMarketList } = useSelector((state) => state.starlineMarket);

  const [openConfirm, setOpenConfirm] = useState(false);
  const [filterName, setFilterName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDropDown, setSelectedDropDown] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Fetch starline markets for dropdown
  useEffect(() => {
    dispatch(getAllStarlineMarketsAsync({ page: 1, limit: 100 }));
  }, [dispatch]);

  // Fetch starline market records (only starline bids)
  useEffect(() => {
    dispatch(
      getStarlineMarketRecordsAsync({
        page: page + 1,
        limit: rowsPerPage,
        search: searchQuery,
        marketId: selectedDropDown || '',
        status: filterStatus !== 'all' ? filterStatus : '',
      })
    );
  }, [dispatch, page, rowsPerPage, searchQuery, selectedDropDown, filterStatus]);

  const handleDateFilter = (newValue) => {
    setSelectedDate(newValue);
  };

  const tableData = useMemo(
    () =>
      starlineMarketRecordsList.map((record, index) => ({
        id: record.id || record._id || index + 1,
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
    [starlineMarketRecordsList]
  );

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
  const isMobile = useResponsive('down', 'sm');
  const isFiltered = searchQuery !== '' || selectedDropDown !== '' || filterStatus !== 'all';
  const isNotFound = !starlineMarketRecordsLoading && !tableData.length;

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
    setSelectedDropDown(event?.target?.value ?? '');
  };

  const handleDeleteRow = () => {
    dispatch(
      getStarlineMarketRecordsAsync({
        page: page + 1,
        limit: rowsPerPage,
        search: searchQuery,
        marketId: selectedDropDown || '',
        status: filterStatus !== 'all' ? filterStatus : '',
      })
    );
  };

  const handleDeleteRows = (selectedRows) => {
    setSelected([]);
    setOpenConfirm(false);
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
        <title> Start Line Markets Record : List | Rupa999 </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        {isMobile ? (
          <Box sx={{ position: 'sticky', top: 0, zIndex: 10, bgcolor: 'background.paper' }}>
            <CustomBreadcrumbs
              heading="Start Line Markets Record"
              links={[
                { name: 'Dashboard', href: PATH_DASHBOARD.root },
                { name: 'Start Line Markets Record', href: PATH_DASHBOARD.starline.marketrecords.root },
              ]}
            />
            <CustomTableToolbar
              isFiltered={isFiltered}
              filterName={filterName}
              selectedDate={selectedDate}
              marketOptions={starlineMarketList}
              selectedDropDown={selectedDropDown}
              onselectedDropDown={handleSelectedDropDown}
              onDateFilter={handleDateFilter}
              onFilterName={handleFilterName}
              onSearch={handleSearch}
              onResetFilter={handleResetFilter}
              sx={{ mt: 1 }}
            />
          </Box>
        ) : (
          <>
            <CustomBreadcrumbs
              heading="Start Line Markets Record"
              links={[
                { name: 'Dashboard', href: PATH_DASHBOARD.root },
                { name: 'Start Line Markets Record', href: PATH_DASHBOARD.starline.marketrecords.root },
              ]}
            />
            <CustomTableToolbar
              isFiltered={isFiltered}
              filterName={filterName}
              marketOptions={starlineMarketList}
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
          <GeneralMarketRecordMVCLayout
            data={dataFiltered}
            loading={starlineMarketRecordsLoading}
            onEditRow={(id) => handleEditRow(id)}
            onDeleteRow={handleDeleteRow}
            onSelectRow={(id) => onSelectRow(id)}
            selected={selected}
            page={page}
            rowsPerPage={rowsPerPage}
            total={starlineMarketRecordsPagination?.total || tableData.length}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
          />
        ) : (
          <Card>
            <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
              <Scrollbar>
                <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                  <TableHeadCustom
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={tableData.length}
                    numSelected={selected.length}
                    onSort={onSort}
                  />

                  <TableBody>
                    {starlineMarketRecordsLoading ? (
                      <TableSkeleton />
                    ) : (
                      <>
                        {dataFiltered.map((row, index) => (
                            <GeneralMarketRecordTableRow
                              index={page * rowsPerPage + index + 1}
                              key={row.id}
                              row={row}
                              selected={selected.includes(row.id)}
                              onSelectRow={() => onSelectRow(row.id)}
                              onDeleteRow={handleDeleteRow}
                              onEditRow={() => handleEditRow(row.id)}
                            />
                          ))}
                        <TableEmptyRows
                          height={denseHeight}
                          emptyRows={emptyRows(
                            page,
                            rowsPerPage,
                            starlineMarketRecordsPagination?.total || tableData.length
                          )}
                        />
                        <TableNoData isNotFound={isNotFound} />
                      </>
                    )}
                  </TableBody>
                </Table>
              </Scrollbar>
            </TableContainer>
            <TablePaginationCustom
              count={starlineMarketRecordsPagination?.total || tableData.length}
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
            OK
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filterName, filterStatus, selectedDropDown }) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    inputData = inputData.filter(
      (user) => user.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  if (filterStatus !== 'all') {
    inputData = inputData.filter((user) => user.status === filterStatus);
  }

  if (selectedDropDown !== 'all') {
    inputData = inputData.filter((user) => user.role === selectedDropDown);
  }

  return inputData;
}
