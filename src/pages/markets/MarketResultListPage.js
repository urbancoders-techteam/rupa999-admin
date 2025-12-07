import { paramCase } from 'change-case';
import { useEffect, useMemo, useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
// @mui
import { Box, Card, Container, Table, TableBody, TableCell, TableContainer, TableRow, useMediaQuery } from '@mui/material';
// routes
import { useTheme } from '@mui/system';
import { useDispatch, useSelector } from 'react-redux';
import { getAllMarketResultsAsync } from '../../redux/services/market_result_services';
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import Scrollbar from '../../components/scrollbar';
import { useSettingsContext } from '../../components/settings';
import {
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  useTable,
} from '../../components/table';
// sections
import CustomTableToolbar from '../../components/table/CustomTableToolBar';
import BulkUploadMarketResults from '../../sections/_previous_results/components/BulkUploadMarketResults';
import GeneralCreateResultForm from '../../sections/_previous_results/components/GeneralCreateResultForm';
import MarketResultTableRow from '../../sections/_previous_results/components/MarketResultTableRow';
import PreviousResultMobileViewCardLayout from '../../sections/_previous_results/components/PreviousResultMobileViewCardLayout';
import ResultTable from '../../sections/_previous_results/components/ResultTable';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'action', label: 'Action', align: 'left' },
  { id: 'name', label: 'Game Name', align: 'left' },
  { id: 'resultDate', label: 'Result Date', align: 'left' },
  { id: 'result', label: 'Result', align: 'left' },
  { id: 'openPana', label: 'Open Pana', align: 'center' },
  { id: 'closePana', label: 'Close Pana', align: 'center' },
  { id: 'createdAt', label: 'Created At', align: 'left' },
];

// Helper function to get row ID
const getRowId = (row) => row._id || row.id;

// ----------------------------------------------------------------------

export default function MarketResultListPage() {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    selected,
    setSelected,
    onSelectRow,
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();

  const { themeStretch } = useSettingsContext();
  const { resultList, pagination, loading } = useSelector((state) => state.marketResult);
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [filterName, setFilterName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showWinner, setShowWinner] = useState(false);
  const [selectedMarketId, setSelectedMarketId] = useState(null);

  // Convert UI page (0-based) to API page (1-based)
  const apiPage = page + 1;
  const apiLimit = rowsPerPage;

  // Fetch data when page, rowsPerPage, or searchQuery changes
  useEffect(() => {
    const params = {
      page: apiPage,
      limit: apiLimit,
    };

    // If backend supports search, add it here
    // Otherwise, we'll filter client-side
    if (searchQuery) {
      params.search = searchQuery;
    }

    // If backend supports sorting, add it here
    if (orderBy) {
      params.sortBy = orderBy;
      params.sortOrder = order;
    }

    dispatch(getAllMarketResultsAsync(params));
  }, [dispatch, apiPage, apiLimit, searchQuery, orderBy, order]);

  // Client-side filtering if backend doesn't support search
  const dataFiltered = useMemo(() => {
    if (!searchQuery) return resultList;

    const searchLower = searchQuery.toLowerCase();
    return resultList.filter((marketResult) => {
      const marketName = marketResult?.market?.name?.toLowerCase() || '';
      const gameName = marketResult?.gameName?.toLowerCase() || '';
      return marketName.includes(searchLower) || gameName.includes(searchLower);
    });
  }, [resultList, searchQuery]);

  // Client-side sorting if backend doesn't support sorting
  const dataSorted = useMemo(
    () => [...dataFiltered].sort(getComparator(order, orderBy)),
    [dataFiltered, order, orderBy]
  );

  // Handlers
  const handleFilterName = useCallback((event) => {
    setFilterName(event.target.value);
  }, []);

  const handleSearch = useCallback(() => {
    setPage(0);
    setSearchQuery(filterName);
  }, [filterName, setPage]);

  const handleResetFilter = useCallback(() => {
    setFilterName('');
    setSearchQuery('');
    setPage(0);
  }, [setPage]);

  const handleDeleteRow = useCallback(
    (id) => {
      // Note: This function seems unused as rows are managed via Redux
      // If delete functionality is needed, implement Redux action
      setSelected((prev) => prev.filter((selectedId) => selectedId !== id));
    },
    [setSelected]
  );

  const handleEditRow = useCallback(
    (id) => {
      navigate(PATH_DASHBOARD.gameresults.edit(paramCase(id)));
    },
    [navigate]
  );

  const toggleShowWinner = useCallback(() => {
    setShowWinner((prev) => !prev);
  }, []);

  // Computed values
  const isFiltered = searchQuery !== '';
  const isNotFound = !dataSorted.length && !loading && !!searchQuery;
  const denseHeight = dense ? 52 : 72;
  
  // Convert server page (1-based) to UI page (0-based) for pagination component
  const serverPage = pagination?.page ? pagination.page - 1 : page;
  const serverTotal = pagination?.total || 0;

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
            { name: 'Market Results', href: PATH_DASHBOARD.markets.marketresults.list },
          ]}
        />

        <GeneralCreateResultForm
          showWinner={showWinner}
          onHandleShowWinner={toggleShowWinner}
          selectedMarketId={setSelectedMarketId}
        />

        {showWinner && <ResultTable marketId={selectedMarketId} />}

        {isMobile ? (
          <PreviousResultMobileViewCardLayout
            data={dataFiltered}
            onEditRow={handleEditRow}
            onDeleteRow={handleDeleteRow}
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
                <Table size={dense ? 'medium' : 'small'} sx={{ minWidth: 800 }}>
                  <TableHeadCustom
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={dataFiltered.length}
                    numSelected={selected.length}
                    onSort={onSort}
                  />

                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={TABLE_HEAD.length} align="center" sx={{ py: 3 }}>
                          Loading...
                        </TableCell>
                      </TableRow>
                    ) : (
                      <>
                        {dataSorted.map((row) => {
                          const rowId = getRowId(row);
                          return (
                            <MarketResultTableRow
                              key={rowId}
                              row={row}
                              selected={selected.includes(rowId)}
                              onSelectRow={() => onSelectRow(rowId)}
                              onDeleteRow={() => handleDeleteRow(rowId)}
                              onEditRow={() => handleEditRow(rowId)}
                            />
                          );
                        })}

                        <TableEmptyRows
                          height={denseHeight}
                          emptyRows={Math.max(0, rowsPerPage - dataSorted.length)}
                        />

                        <TableNoData isNotFound={isNotFound} />
                      </>
                    )}
                  </TableBody>
                </Table>
              </Scrollbar>
            </TableContainer>

            <TablePaginationCustom
              page={serverPage}
              count={serverTotal}
              rowsPerPage={rowsPerPage}
              onPageChange={onChangePage}
              onRowsPerPageChange={onChangeRowsPerPage}
              dense={dense}
              onChangeDense={onChangeDense}
            />
          </Card>
        )}

        {/* Bulk Upload Component - Fixed at bottom */}
        <Box
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 1000,
          }}
        >
          <BulkUploadMarketResults selectedMarketId={selectedMarketId} />
        </Box>
      </Container>
    </>
  );
}
