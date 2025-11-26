import { paramCase } from 'change-case';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
// @mui
import {
  Button,
  Card,
  Container,
  Table,
  TableBody,
  TableContainer,
  useMediaQuery,
} from '@mui/material';
// routes
import { useTheme } from '@mui/system';
import { useDispatch, useSelector } from 'react-redux';
import { getAllMarketResultsAsync } from '../../redux/services/market_result_services';
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
  useTable,
} from '../../components/table';
// sections
import CustomTableToolbar from '../../components/table/CustomTableToolBar';
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

// ----------------------------------------------------------------------

export default function MarketResultListPage() {
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

  const { resultList } = useSelector((state) => state.marketResult);
  console.log('resultList :>> ', resultList);

  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [tableData, setTableData] = useState(resultList);

  const [openConfirm, setOpenConfirm] = useState(false);

  const [filterName, setFilterName] = useState('');

  const [showWinner, setShowWinner] = useState(false);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  console.log('dataFiltered :>> ', dataFiltered);
  console.log('tableData :>> ', tableData);

  const dataInPage = dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const denseHeight = dense ? 52 : 72;

  const isFiltered = filterName !== '';

  const isNotFound = !resultList.length && !!filterName;

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleFilterName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
    console.log('event.target.value :>> ', event.target.value);
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

  const handleDeleteRows = (selectedRows) => {
    const deleteRows = tableData.filter((row) => !selectedRows.includes(row.id));
    setSelected([]);
    setTableData(deleteRows);

    if (page > 0) {
      if (selectedRows.length === dataInPage.length) {
        setPage(page - 1);
      } else if (selectedRows.length === dataFiltered.length) {
        setPage(0);
      } else if (selectedRows.length > dataInPage.length) {
        const newPage = Math.ceil((tableData.length - selectedRows.length) / rowsPerPage) - 1;
        setPage(newPage);
      }
    }
  };

  const handleEditRow = (id) => {
    navigate(PATH_DASHBOARD.gameresults.edit(paramCase(id)));
  };

  const handleResetFilter = () => {
    setFilterName('');
  };

  const onHandleShowWinner = () => {
    setShowWinner(!showWinner);
  }

  useEffect(() => {
    dispatch(getAllMarketResultsAsync());
  }, [dispatch]);


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

        <GeneralCreateResultForm showWinner={showWinner} onHandleShowWinner={onHandleShowWinner} />

        {showWinner === true && <ResultTable />}

        {isMobile ? (
          <PreviousResultMobileViewCardLayout
            data={resultList}
            onEditRow={handleEditRow}
            onDeleteRow={(id) => handleDeleteRow(id)}
          />
        ) : (
          <Card>
            <CustomTableToolbar
              isFiltered={isFiltered}
              filterName={filterName}
              onFilterName={handleFilterName}
              onResetFilter={handleResetFilter}
            />

            <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
              {/* <TableSelectedAction
                dense={dense}
                numSelected={selected.length}
                rowCount={tableData.length}
                onSelectAllRows={(checked) =>
                  onSelectAllRows(
                    checked,
                    tableData.map((row) => row.id)
                  )
                }
                // action={
                //   <Tooltip title="Delete">
                //     <IconButton color="primary" onClick={handleOpenConfirm}>
                //       <Iconify icon="eva:trash-2-outline" />
                //     </IconButton>
                //   </Tooltip>
                // }
              /> */}

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
                    {resultList
                      // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row) => (
                        <MarketResultTableRow
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
              page={page}
              count={dataFiltered.length}
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
      (gameresults) =>
        gameresults.gameName.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  if (filterStatus !== 'all') {
    inputData = inputData.filter((gameresults) => gameresults.status === filterStatus);
  }

  if (filterRole !== 'all') {
    inputData = inputData.filter((gameresults) => gameresults.role === filterRole);
  }

  return inputData;
}
