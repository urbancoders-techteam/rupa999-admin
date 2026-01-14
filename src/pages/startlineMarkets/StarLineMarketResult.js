import { paramCase } from 'change-case';
import { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
// @mui
import {
  Card,
  Container,
  Table,
  TableBody,
  TableContainer,
  useMediaQuery,
} from '@mui/material';
// routes
import { useTheme } from '@mui/system';
import { PATH_DASHBOARD } from '../../routes/paths';
// components
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
  useTable,
} from '../../components/table';
// sections
import CustomTableToolbar from '../../components/table/CustomTableToolBar';
import StarlineMarketResultMobileViewCardLayout from '../../sections/_starline_market_results/components/StarlineMarketResultMobileViewCardLayout';
import CreateResultForm from '../../sections/_starline_market_results/CreateResultForm';
import StarLineMarketResultsTableRow from '../../sections/_starline_market_results/StarLineMarketResultsTableRow';
import { useSnackbar } from '../../components/snackbar';
import { getAllStarlineMarketResultsAsync } from '../../redux/services/starline_market_result_services';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'action', label: 'Action', align: 'left' },
  { id: 'id', label: 'ID', align: 'left' },
  { id: 'name', label: 'Market Name', align: 'left' },
  { id: 'resultDate', label: 'Result Date', align: 'left' },
  { id: 'openPana', label: 'Pana', align: 'center' },
  { id: 'openDigits', label: 'Digit', align: 'center' },
  { id: 'revert', label: 'Revert', align: 'left' },
  { id: 'createdAt', label: 'Created At', align: 'left' },
];

// ----------------------------------------------------------------------

export default function StarLineMarketResultListPage() {
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
    onSelectAllRows,
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

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Redux state
  const { resultList, pagination, loading } = useSelector((state) => state.starlineMarketResult);

  const [filterName, setFilterName] = useState(''); // Input field value
  const [searchQuery, setSearchQuery] = useState(''); // Actual search value for filtering

  // Fetch starline market results on component mount and when filters change
  useEffect(() => {
    dispatch(
      getAllStarlineMarketResultsAsync({
        page: page + 1, // API uses 1-based pagination
        limit: rowsPerPage,
      })
    );
  }, [dispatch, page, rowsPerPage]);

  // Transform API data to table format
  const tableData = useMemo(
    () =>
      resultList.map((result, index) => {
        const market = result.marketsId;
        return {
          id: result._id || result.id,
          _id: result._id,
          name: market?.name || '-',
          gameName: market?.name || '-',
          resultDate: result.date ? new Date(result.date).toLocaleDateString() : '-',
          date: result.date,
          openPana: result.openPana || '-',
          openDigit: result.openDigit || '-',
          digit: result.openDigit || '-',
          createdAt: result.createdAt ? new Date(result.createdAt).toLocaleDateString() : '-',
          ...result,
        };
      }),
    [resultList]
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

  const dataInPage = useMemo(
    () => dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [dataFiltered, page, rowsPerPage]
  );

  const denseHeight = dense ? 52 : 72;

  const isFiltered = searchQuery !== '';

  const isNotFound = !dataFiltered.length && !!searchQuery && !loading;

  const handleFilterName = (event) => {
    setFilterName(event.target.value);
  };

  const handleSearch = () => {
    setPage(0);
    setSearchQuery(filterName);
  };

  const handleRevert = async (row) => {
    try {
      // TODO: Implement revert functionality when API is ready
      console.log('Revert row:', row);
      enqueueSnackbar('Revert functionality will be implemented soon', { variant: 'info' });
    } catch (error) {
      enqueueSnackbar(error?.message || 'Failed to revert starline market result', {
        variant: 'error',
      });
    }
  };

  const handleEditRow = (id) => {
    navigate(PATH_DASHBOARD.starline.marketresults.edit(paramCase(id)));
  };

  const handleResetFilter = () => {
    setFilterName('');
    setSearchQuery('');
    setPage(0);
  };

  return (
    <>
      <Helmet>
        <title> Market Results : List | Rupa999 </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="Market Results"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Market Results', href: PATH_DASHBOARD.starline.marketresults.list },
          ]}
        />

        {/* --- Result Form --- */}
        <CreateResultForm />

        {isMobile ? (
          <StarlineMarketResultMobileViewCardLayout
            data={dataInPage}
            onEditRow={handleEditRow}
            onRevert={handleRevert}
            page={page}
            rowsPerPage={rowsPerPage}
          />
        ) : (
          <Card>
            <CustomTableToolbar
              isFiltered={isFiltered}
              filterName={filterName}
              onFilterName={handleFilterName}
              onSearch={handleSearch}
              onResetFilter={handleResetFilter}
            />

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
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row, index) => (
                        <StarLineMarketResultsTableRow
                          key={row.id}
                          row={row}
                          index={(page * rowsPerPage) + index + 1}
                          selected={selected.includes(row.id)}
                          onSelectRow={() => onSelectRow(row.id)}
                          onEditRow={() => handleEditRow(row.name)}
                          onRevert={handleRevert}
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
              page={page}
              count={pagination?.total || dataFiltered.length}
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
      (marketresults) =>
        marketresults.gameName.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  if (filterStatus !== 'all') {
    inputData = inputData.filter((marketresults) => marketresults.status === filterStatus);
  }

  if (filterRole !== 'all') {
    inputData = inputData.filter((marketresults) => marketresults.role === filterRole);
  }

  return inputData;
}
