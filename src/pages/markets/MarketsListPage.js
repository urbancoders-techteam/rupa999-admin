import { Helmet } from 'react-helmet-async';
import { useState, useEffect, useMemo } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import { Card, Table, Button, TableBody, Container, TableContainer, Box } from '@mui/material';
// redux
import { useDispatch, useSelector } from 'react-redux';
import useResponsive from '../../hooks/useResponsive';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
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
import Iconify from '../../components/iconify';
import MarketTableRow from '../../sections/_markets/components/MarketTableRow';
import MarketMobileViewCardLayout from '../../sections/_markets/components/MarketMobileViewCardLayout';
import { getAllMarketsAsync, deleteMarketAsync } from '../../redux/services/market_services';
import { useSnackbar } from '../../components/snackbar';
import { formatTimeTo12Hour } from '../../utils/formatTime';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'action', label: 'Action', align: 'center' },
  { id: 'sno', label: 'S.No.', align: 'left' },
  { id: 'name', label: 'Name', align: 'left' },
  { id: 'openTime', label: 'Open Time', align: 'left' },
  { id: 'closeTime', label: 'Close Time', align: 'left' },
  { id: 'activeDays', label: 'Active Days', align: 'left' },
  { id: 'disableGame', label: 'Disable Game', align: 'left' },
  { id: 'hideOpen', label: 'Hide Open', align: 'left' },
  { id: 'createdAt', label: 'Created At', align: 'left' },
];

// ----------------------------------------------------------------------

export default function MarketDetailsPage() {
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
  const { enqueueSnackbar } = useSnackbar();

  // Redux state
  const { marketList, pagination } = useSelector((state) => state.market);

  console.log('marketList', marketList);

  const [filterName, setFilterName] = useState(''); // Input field value
  const [searchQuery, setSearchQuery] = useState(''); // Actual search value sent to API

  // Fetch markets on component mount and when filters change
  useEffect(() => {
    dispatch(
      getAllMarketsAsync({
        page: page + 1, // API uses 1-based pagination
        limit: rowsPerPage,
        search: searchQuery,
      })
    );
  }, [dispatch, page, rowsPerPage, searchQuery]);

  // Transform API data to table format
  const tableData = useMemo(
    () =>
      marketList.map((market, index) => ({
        id: market._id || market.id,
        _id: market._id,
        sno: (page * rowsPerPage) + index + 1, // Calculate S.No. based on pagination
        name: market.name,
        openTime: market.openTime,
        closeTime: formatTimeTo12Hour(market.closeTime),
        activeDays: market.activeDays?.join(", ") || "N/A",
        disableGame: market.disableGame || "no",
        hideOpen: market.hideOpen || "disable",
        createdAt: market.createdAt ? new Date(market.createdAt).toLocaleDateString() : "-",
        ...market,
      })),
    [marketList, page, rowsPerPage]
  );

  // Use tableData directly as API handles pagination and filtering
  const dataFiltered = tableData;

  const denseHeight = dense ? 52 : 72;

  const isMobile = useResponsive('down', 'sm');

  const isFiltered = searchQuery !== '';

  const isNotFound = !tableData.length && !!searchQuery;


  const handleFilterName = (event) => {
    setFilterName(event.target.value);
  };

  const handleSearch = () => {
    setPage(0);
    setSearchQuery(filterName);
  };

  const handleDeleteRow = async (id) => {
    try {
      await dispatch(deleteMarketAsync(id)).unwrap();
      enqueueSnackbar('Market deleted successfully!', { variant: 'success' });
      // Refresh the list
      dispatch(
        getAllMarketsAsync({
          page: page + 1,
          limit: rowsPerPage,
          search: searchQuery,
        })
      );
      setSelected([]);
      // Check if we need to go back a page after deletion
      if (page > 0 && tableData.length === 0) {
        setPage(page - 1);
      }
    } catch (error) {
      enqueueSnackbar(error?.message || 'Failed to delete market', { variant: 'error' });
    }
  };


  const handleEditRow = (name) => {
    const market = tableData.find((m) => m.name === name);
    if (market?._id) {
      navigate(PATH_DASHBOARD.markets.marketlist.edit(market._id), {
        state: { market },
      });
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
        <title> Market : List | Rupa999 </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        {isMobile ? (
          <Box sx={{ position: 'sticky', top: 0, zIndex: 10, bgcolor: 'background.paper' }}>
            <CustomBreadcrumbs
              heading="Market List"
              links={[
                { name: 'Dashboard', href: PATH_DASHBOARD.root },
                { name: 'Market List', href: PATH_DASHBOARD.markets.marketlist.root },
              ]}
              action={
                <Button
                  component={RouterLink}
                  to={PATH_DASHBOARD.markets.marketlist.new}
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
              heading="Market List"
              links={[
                { name: 'Dashboard', href: PATH_DASHBOARD.root },
                { name: 'Market List', href: PATH_DASHBOARD.markets.marketlist.root },
              ]}
              action={
                <Button
                  component={RouterLink}
                  to={PATH_DASHBOARD.markets.marketlist.new}
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
            <MarketMobileViewCardLayout
              data={tableData}
              onEditRow={handleEditRow}
              onDeleteRow={(id) => handleDeleteRow(id)}
              onSelectRow={(id) => onSelectRow(id)}
              selected={selected}
              page={page}
              rowsPerPage={rowsPerPage}
            />
            <TablePaginationCustom
              count={pagination?.total || tableData.length || 0}
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
                    {tableData.length > 0 ? (
                      <>
                        {dataFiltered.map((row, index) => (
                          <MarketTableRow
                            index={row.sno}
                            key={row.id || row._id}
                            row={row}
                            selected={selected.includes(row.id)}
                            onSelectRow={() => onSelectRow(row.id)}
                            onDeleteRow={() => handleDeleteRow(row._id || row.id)}
                            onEditRow={() => handleEditRow(row.name)}
                          />
                        ))}
                        <TableEmptyRows
                          height={denseHeight}
                          emptyRows={emptyRows(0, rowsPerPage, tableData.length)}
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
              count={pagination?.total || tableData.length || 0}
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

