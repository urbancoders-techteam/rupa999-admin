import { Helmet } from 'react-helmet-async';
import { paramCase } from 'change-case';
import { useState, useMemo } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import { Card, Table, Button, TableBody, Container, TableContainer, Box } from '@mui/material';
import useResponsive from '../../hooks/useResponsive';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// _mock_
import { _marketjson } from '../../_mock/arrays/_marketjson';
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
// sections
import Iconify from '../../components/iconify';
import MarketMobileViewCardLayout from '../../sections/_markets/components/MarketMobileViewCardLayout';
import StarlineMarketTableRow from '../../sections/_starline_market/list/StarlineMarketTableRow';

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

  const navigate = useNavigate();

  const [tableData, setTableData] = useState(_marketjson);

  const [filterName, setFilterName] = useState('');

  const [filterRole, setFilterRole] = useState('all');

  const [filterStatus, setFilterStatus] = useState('all');

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
    navigate(PATH_DASHBOARD.market.edit(paramCase(id)));
  };

  const handleResetFilter = () => {
    setFilterName('');
    setFilterRole('all');
    setFilterStatus('all');
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
                        <StarlineMarketTableRow
                          index={index + 1}
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
      (market) => market.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  if (filterStatus !== 'all') {
    inputData = inputData.filter((market) => market.status === filterStatus);
  }

  if (filterRole !== 'all') {
    inputData = inputData.filter((market) => market.role === filterRole);
  }

  return inputData;
}
