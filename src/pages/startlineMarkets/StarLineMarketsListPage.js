import { Helmet } from 'react-helmet-async';
import { paramCase } from 'change-case';
import { useState, useMemo, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
// @mui
import { Card, Table, Button, TableBody, Container, TableContainer, Box } from '@mui/material';
import useResponsive from '../../hooks/useResponsive';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Scrollbar from '../../components/scrollbar';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
import { useSnackbar } from '../../components/snackbar';
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from '../../components/table';
import CustomTableToolbar from '../../components/table/CustomTableToolBar';
// sections
import Iconify from '../../components/iconify';
import StarlineMarketMobileViewCardLayout from '../../sections/_starline_market/components/StarlineMarketMobileViewCardLayout';
import StarlineMarketTableRow from '../../sections/_starline_market/list/StarlineMarketTableRow';
// redux
import {
  getAllStarlineMarketsAsync,
  deleteStarlineMarketAsync,
} from '../../redux/services/starline_market_services';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'action', label: 'Action', align: 'center' },
  { id: 'id', label: 'ID', align: 'left' },
  { id: 'name', label: 'Name', align: 'left' },
  { id: 'currentStatus', label: 'Current Status', align: 'left' },
  { id: 'openTime', label: 'Open Time', align: 'left' },
  { id: 'createdAt', label: 'Created At', align: 'left' },
];

// ----------------------------------------------------------------------

export default function StarLineMarketsListPage() {
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
  const { enqueueSnackbar } = useSnackbar();

  // Redux state
  const { marketList, pagination, loading } = useSelector((state) => state.starlineMarket);

  const [filterName, setFilterName] = useState(''); // Input field value
  const [searchQuery, setSearchQuery] = useState(''); // Actual search value for filtering

  // Fetch starline markets on component mount and when filters change
  useEffect(() => {
    dispatch(
      getAllStarlineMarketsAsync({
        page: page + 1, // API uses 1-based pagination
        limit: rowsPerPage,
        search: searchQuery,
      })
    );
  }, [dispatch, page, rowsPerPage, searchQuery]);

  // Transform API data to table format
  const tableData = useMemo(
    () =>
      marketList.map((market, index) => {
        let formattedOpenTime = '-';
        if (market.openTime) {
          try {
            const date = dayjs(market.openTime);
            if (date.isValid()) {
              formattedOpenTime = date.format('hh:mm A'); // 12-hour format with AM/PM
            }
          } catch (error) {
            console.error('Error formatting openTime:', error);
          }
        }
        
        return {
          id: market._id || market.id,
          _id: market._id,
          name: market.name,
          openTime: formattedOpenTime,
          currentStatus: 'OPEN NOW', // You can add logic here to determine status based on time
          createdAt: market.createdAt ? new Date(market.createdAt).toLocaleDateString() : '-',
          disableGame: market.disableGame || 'no',
          autoResultOpen: market.autoResultOpen || 'disable',
          ...market,
        };
      }),
    [marketList]
  );

  // Apply client-side filtering and sorting
  const dataFiltered = useMemo(
    () =>
      applyFilter({
        inputData: tableData,
        comparator: getComparator(order, orderBy),
        filterName: searchQuery,
      }),
    [tableData, order, orderBy, searchQuery]
  );

  // Memoized paginated data (client-side pagination for now, can be moved to server-side)
  const dataInPage = useMemo(
    () => dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [dataFiltered, page, rowsPerPage]
  );

  const denseHeight = dense ? 52 : 72;

  const isMobile = useResponsive('down', 'sm');

  const isFiltered = searchQuery !== '';

  const isNotFound = !dataFiltered.length && !!searchQuery && !loading;

  const handleFilterName = (event) => {
    setFilterName(event.target.value);
  };

  const handleSearch = () => {
    setPage(0);
    setSearchQuery(filterName);
  };

  const handleDeleteRow = async (id) => {
    try {
      await dispatch(deleteStarlineMarketAsync(id)).unwrap();
      enqueueSnackbar('Starline market deleted successfully!', { variant: 'success' });
      // Refresh the list
      dispatch(
        getAllStarlineMarketsAsync({
          page: page + 1,
          limit: rowsPerPage,
          search: searchQuery,
        })
      );
      setSelected([]);
      // Check if we need to go back a page after deletion
      if (page > 0 && tableData.length === 1) {
        setPage(page - 1);
      }
    } catch (error) {
      enqueueSnackbar(error?.message || 'Failed to delete starline market', { variant: 'error' });
    }
  };

  const handleEditRow = (name) => {
    const market = tableData.find((m) => m.name === name);
    if (market?._id) {
      navigate(PATH_DASHBOARD.starline.market.edit(paramCase(market._id)));
    }
  };

  const handleResetFilter = () => {
    setFilterName('');
    setSearchQuery('');
    setPage(0);
  };

  return (
    <>
      <Helmet>
        <title> Starline Market : List | Rupa999 </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        {isMobile ? (
          <Box sx={{ position: 'sticky', top: 0, zIndex: 10, bgcolor: 'background.paper' }}>
            <CustomBreadcrumbs
              heading="Starline Market"
              links={[
                { name: 'Dashboard', href: PATH_DASHBOARD.root },
                { name: 'Starline Market', href: PATH_DASHBOARD.starline.market.list },
                { name: 'List' },
              ]}
              action={
                <Button
                  component={RouterLink}
                  to={PATH_DASHBOARD.starline.market.new}
                  variant="contained"
                  startIcon={<Iconify icon="eva:plus-fill" />}
                >
                  New Market
                </Button>
              }
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
              heading="Starline Market"
              links={[
                { name: 'Dashboard', href: PATH_DASHBOARD.root },
                { name: 'Starline Market', href: PATH_DASHBOARD.starline.market.list },
                { name: 'List' },
              ]}
              action={
                <Button
                  component={RouterLink}
                  to={PATH_DASHBOARD.starline.market.new}
                  variant="contained"
                  startIcon={<Iconify icon="eva:plus-fill" />}
                >
                  New Market
                </Button>
              }
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
            <StarlineMarketMobileViewCardLayout
              data={dataInPage}
              onEditRow={handleEditRow}
              onDeleteRow={(id) => handleDeleteRow(id)}
              onSelectRow={(id) => onSelectRow(id)}
              selected={selected}
              page={page}
              rowsPerPage={rowsPerPage}
            />
            <TablePaginationCustom
              count={pagination?.total || dataFiltered.length}
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
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={dataFiltered.length}
                    numSelected={selected.length}
                    onSort={onSort}
                  />

                  <TableBody>
                    {dataFiltered.length > 0 ? (
                      <>
                        {dataFiltered
                          ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .map((row, index) => (
                            <StarlineMarketTableRow
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
                          emptyRows={emptyRows(page, rowsPerPage, dataFiltered.length)}
                        />
                      </>
                    ) : (
                      <TableNoData isNotFound={isNotFound} />
                    )}
                  </TableBody>
                </Table>
              </Scrollbar>
            </TableContainer>
            <TablePaginationCustom
              count={pagination?.total || dataFiltered.length}
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
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filterName }) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    inputData = inputData.filter(
      (market) => market.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  return inputData;
}
