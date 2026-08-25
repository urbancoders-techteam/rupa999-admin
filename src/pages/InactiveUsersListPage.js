import { useCallback, useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Card,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import CustomBreadcrumbs from '../components/custom-breadcrumbs';
import Scrollbar from '../components/scrollbar';
import { useSettingsContext } from '../components/settings';
import { useSnackbar } from '../components/snackbar';
import {
  emptyRows,
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  useTable,
} from '../components/table';
import CustomTableToolbar from '../components/table/CustomTableToolBar';
import useResponsive from '../hooks/useResponsive';
import { getInactiveUsersAsync, updateUserStatusAsync } from '../redux/services/user_services';
import { PATH_DASHBOARD } from '../routes/paths';
import InactiveUserMobileCardLayout from '../sections/_users/inactive/InactiveUserMobileCardLayout';
import InactiveUserTableRow from '../sections/_users/inactive/InactiveUserTableRow';

const TABLE_HEAD = [
  { id: 'sno', label: 'S.No.', align: 'center' },
  { id: 'name', label: 'Name', align: 'left' },
  { id: 'number', label: 'Mobile', align: 'left' },
  { id: 'status', label: 'Inactive Status', align: 'left' },
  { id: 'inactiveAt', label: 'Inactive Date and Time', align: 'left' },
  { id: 'action', label: 'Action', align: 'center' },
];

export default function InactiveUsersListPage() {
  const {
    dense,
    page,
    rowsPerPage,
    setPage,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const isMobile = useResponsive('down', 'sm');
  const { inactiveUserList, inactiveUsersLoading, inactiveUsersPagination } = useSelector(
    (state) => state.user
  );

  const [filterName, setFilterName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activatingId, setActivatingId] = useState(null);

  const fetchInactiveUsers = useCallback(() => {
    dispatch(
      getInactiveUsersAsync({
        page: page + 1,
        limit: rowsPerPage,
        search: searchQuery,
      })
    );
  }, [dispatch, page, rowsPerPage, searchQuery]);

  useEffect(() => {
    fetchInactiveUsers();
  }, [fetchInactiveUsers]);

  const tableData = useMemo(
    () =>
      (inactiveUserList || []).map((user, index) => ({
        ...user,
        id: user._id || user.id || index + 1,
        sno: page * rowsPerPage + index + 1,
      })),
    [inactiveUserList, page, rowsPerPage]
  );

  const isFiltered = searchQuery !== '';
  const isNotFound = !inactiveUsersLoading && !tableData.length;
  const denseHeight = dense ? 52 : 72;

  const handleFilterName = (event) => {
    setFilterName(event.target.value);
  };

  const handleSearch = () => {
    setPage(0);
    setSearchQuery(filterName);
  };

  const handleResetFilter = () => {
    setFilterName('');
    setSearchQuery('');
    setPage(0);
  };

  const handleActivate = async (id) => {
    setActivatingId(id);
    try {
      await dispatch(updateUserStatusAsync({ id, status: 'active' })).unwrap();
      enqueueSnackbar('User activated successfully!', { variant: 'success' });
      fetchInactiveUsers();
    } catch (error) {
      enqueueSnackbar(error?.message || 'Failed to activate user', { variant: 'error' });
    } finally {
      setActivatingId(null);
    }
  };

  return (
    <>
      <Helmet>
        <title>Inactive Users | Rupa999</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="Inactive Users"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Users', href: PATH_DASHBOARD.user.root },
            { name: 'Inactive Users' },
          ]}
        />

        <CustomTableToolbar
          isFiltered={isFiltered}
          filterName={filterName}
          onFilterName={handleFilterName}
          onSearch={handleSearch}
          onResetFilter={handleResetFilter}
        />

        {isMobile ? (
          <>
            <InactiveUserMobileCardLayout
              data={tableData}
              loading={inactiveUsersLoading}
              activatingId={activatingId}
              onActivate={handleActivate}
            />
            <TablePaginationCustom
              count={inactiveUsersPagination?.total || 0}
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
                <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 900 }}>
                  <TableHeadCustom headLabel={TABLE_HEAD} rowCount={tableData.length} />

                  <TableBody>
                    {inactiveUsersLoading ? (
                      <TableRow>
                        <TableCell colSpan={TABLE_HEAD.length} align="center" sx={{ py: 4 }}>
                          <Typography variant="body2">Loading inactive users...</Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      tableData.map((row) => (
                        <InactiveUserTableRow
                          key={row._id || row.id}
                          row={row}
                          index={row.sno}
                          activatingId={activatingId}
                          onActivate={handleActivate}
                        />
                      ))
                    )}

                    {!inactiveUsersLoading && (
                      <>
                        <TableEmptyRows
                          height={denseHeight}
                          emptyRows={emptyRows(0, rowsPerPage, tableData.length)}
                        />
                        <TableNoData isNotFound={isNotFound} />
                      </>
                    )}
                  </TableBody>
                </Table>
              </Scrollbar>
            </TableContainer>

            <TablePaginationCustom
              count={inactiveUsersPagination?.total || 0}
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
    </>
  );
}
