import { useEffect, useMemo, useState } from 'react';
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
import { getActiveGamePlayUsersAsync } from '../redux/services/user_services';
import { PATH_DASHBOARD } from '../routes/paths';
import ActiveGamePlayUserMobileCardLayout from '../sections/_users/active-game-play/ActiveGamePlayUserMobileCardLayout';
import ActiveGamePlayUserTableRow from '../sections/_users/active-game-play/ActiveGamePlayUserTableRow';

const TABLE_HEAD = [
  { id: 'sno', label: 'S.No.', align: 'center' },
  { id: 'name', label: 'User Name', align: 'left' },
  { id: 'number', label: 'Phone', align: 'left' },
  { id: 'balance', label: 'Balance', align: 'left' },
  { id: 'gamePlays24h', label: 'Games Played (24h)', align: 'left' },
  { id: 'gameAmount24h', label: 'Game Amount (24h)', align: 'left' },
  { id: 'lastLoginAt', label: 'Last Login', align: 'left' },
  { id: 'lastPlayedAt', label: 'Last Played', align: 'left' },
  { id: 'status', label: 'Account Status', align: 'left' },
];

export default function ActiveGamePlayUsersListPage() {
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
  const isMobile = useResponsive('down', 'sm');
  const {
    activeGamePlayUserList,
    activeGamePlayUsersLoading,
    activeGamePlayUsersPagination,
  } = useSelector((state) => state.user);

  const [filterName, setFilterName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(
      getActiveGamePlayUsersAsync({
        page: page + 1,
        limit: rowsPerPage,
        search: searchQuery,
      })
    );
  }, [dispatch, page, rowsPerPage, searchQuery]);

  const tableData = useMemo(
    () =>
      (activeGamePlayUserList || []).map((user, index) => ({
        ...user,
        id: user._id || user.id || index + 1,
        sno: page * rowsPerPage + index + 1,
      })),
    [activeGamePlayUserList, page, rowsPerPage]
  );

  const isFiltered = searchQuery !== '';
  const isNotFound = !activeGamePlayUsersLoading && !tableData.length;
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

  return (
    <>
      <Helmet>
        <title>Active Game Play Users | Rupa999</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="Active Game Play Users"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Users', href: PATH_DASHBOARD.user.root },
            { name: 'Active Game Play Users' },
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
            <ActiveGamePlayUserMobileCardLayout
              data={tableData}
              loading={activeGamePlayUsersLoading}
            />
            <TablePaginationCustom
              count={activeGamePlayUsersPagination?.total || 0}
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
                <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 1200 }}>
                  <TableHeadCustom headLabel={TABLE_HEAD} rowCount={tableData.length} />

                  <TableBody>
                    {activeGamePlayUsersLoading ? (
                      <TableRow>
                        <TableCell colSpan={TABLE_HEAD.length} align="center" sx={{ py: 4 }}>
                          <Typography variant="body2">Loading active users...</Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      tableData.map((row) => (
                        <ActiveGamePlayUserTableRow
                          key={row._id || row.id}
                          row={row}
                          index={row.sno}
                        />
                      ))
                    )}

                    {!activeGamePlayUsersLoading && (
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
              count={activeGamePlayUsersPagination?.total || 0}
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
