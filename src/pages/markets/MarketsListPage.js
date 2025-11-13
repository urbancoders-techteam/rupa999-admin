import { Helmet } from 'react-helmet-async';
import { paramCase } from 'change-case';
import { useState, useMemo, useEffect } from 'react';
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
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from '../../components/table';
import CustomTableToolbar from '../../components/table/CustomTableToolBar';
import ConfirmDialog from '../../components/confirm-dialog';
// sections
import Iconify from '../../components/iconify';
import MarketTableRow from '../../sections/_markets/components/MarketTableRow';
import MarketMobileViewCardLayout from '../../sections/_markets/components/MarketMobileViewCardLayout';
import { getAllMarketsAsync, deleteMarketAsync } from '../../redux/services/market_services';
import { useSnackbar } from '../../components/snackbar';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'action', label: 'Action', align: 'center' },
  { id: 'id', label: 'ID', align: 'left' },
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
  const { marketList, loading } = useSelector((state) => state.market);

  const [openConfirm, setOpenConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [filterName, setFilterName] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Fetch markets on component mount
  useEffect(() => {
    dispatch(getAllMarketsAsync());
  }, [dispatch]);

  // Transform API data to table format
  const tableData = marketList.map((market, index) => ({
    id: market._id || market.id || index + 1,
    _id: market._id,
    name: market.name,
    openTime: market.openTime,
    closeTime: market.closeTime,
    activeDays: market.activeDays?.join(', ') || 'N/A',
    disableGame: market.disableGame || 'no',
    hideOpen: market.hideOpen || 'disable',
    createdAt: market.createdAt ? new Date(market.createdAt).toLocaleDateString() : '-',
    ...market,
  }));

  // Memoized filtered data
  const dataFiltered = useMemo(
    () =>
      applyFilter({
        inputData: tableData,
        comparator: getComparator(order, orderBy),
        filterName,
        filterRole,
        filterStatus,
      }),
    [tableData, order, orderBy, filterName, filterRole, filterStatus]
  );

  // Memoized paginated data
  const dataInPage = useMemo(
    () => dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [dataFiltered, page, rowsPerPage]
  );

  const denseHeight = dense ? 52 : 72;

  const isMobile = useResponsive('down', 'sm');

  const isFiltered = filterName !== '' || filterRole !== 'all' || filterStatus !== 'all';

  const isNotFound =
    (!dataFiltered.length && !!filterName) ||
    (!dataFiltered.length && !!filterRole) ||
    (!dataFiltered.length && !!filterStatus);


  const handleFilterName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleDeleteRow = async (id) => {
    try {
      await dispatch(deleteMarketAsync(id)).unwrap();
      enqueueSnackbar('Market deleted successfully!', { variant: 'success' });
      // Refresh the list
      dispatch(getAllMarketsAsync());
      setSelected([]);
      if (page > 0 && dataInPage.length < 2) {
        setPage(page - 1);
      }
    } catch (error) {
      enqueueSnackbar(error?.message || 'Failed to delete market', { variant: 'error' });
    }
  };

  const handleOpenDeleteConfirm = (id) => {
    setDeleteId(id);
    setOpenConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (deleteId) {
      handleDeleteRow(deleteId);
      setDeleteId(null);
    }
    setOpenConfirm(false);
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
    setFilterRole('all');
    setFilterStatus('all');
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
              onResetFilter={handleResetFilter}
              sx={{ mt: 1 }}
            />
          </>
        )}

        {/* Render mobile card layout for small screens, otherwise render the table */}
        {isMobile ? (
          <MarketMobileViewCardLayout
            data={dataFiltered}
            onEditRow={handleEditRow}
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
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={tableData.length}
                    numSelected={selected.length}
                    onSort={onSort}
                  />

                  <TableBody>
                    {dataFiltered
                      ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row, index) => (
                        <MarketTableRow
                          index={index + 1}
                          key={row.id || row._id}
                          row={row}
                          selected={selected.includes(row.id)}
                          onSelectRow={() => onSelectRow(row.id)}
                          onDeleteRow={() => handleOpenDeleteConfirm(row._id || row.id)}
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

        <ConfirmDialog
          open={openConfirm}
          onClose={() => setOpenConfirm(false)}
          title="Delete"
          content="Are you sure want to delete?"
          action={
            <Button
              variant="contained"
              color="error"
              onClick={handleConfirmDelete}
            >
              Delete
            </Button>
          }
        />
      </Container>
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filterName, filterStatus, filterRole }) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    inputData = inputData.filter(
      (marketlist) => marketlist.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  if (filterStatus !== 'all') {
    inputData = inputData.filter((marketlist) => marketlist.status === filterStatus);
  }

  if (filterRole !== 'all') {
    inputData = inputData.filter((marketlist) => marketlist.role === filterRole);
  }

  return inputData;
}
