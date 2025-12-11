import { useCallback, useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
// @mui
import {
  Card,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@mui/material';
import { Box } from '@mui/system';
import useResponsive from '../hooks/useResponsive';
// routes
import { PATH_DASHBOARD } from '../routes/paths';
// _mock_
// components
import CustomBreadcrumbs from '../components/custom-breadcrumbs';
import Scrollbar from '../components/scrollbar';
import { useSettingsContext } from '../components/settings';
import {
  emptyRows,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  useTable,
} from '../components/table';
// services
import {
  approveWithdrawalRequestAsync,
  getAllWithdrawalRequestsAsync,
  rejectWithdrawalRequestAsync,
} from '../redux/services/withdrawal_services';

// sections
import CustomTableToolbar from '../components/table/CustomTableToolBar';
import WithdrawDetailsMobileViewLayoutPage from '../sections/_withdraw_details/components/WithdrawDetailsMobileViewLayoutPage';
import WithdrawDetailsTableRow from '../sections/_withdraw_details/components/WithdrawDetailsTableRow';

// ----------------------------------------------------------------------
const TABLE_HEAD = [
  { id: 'index', label: 'ID', align: 'center' },
  { id: 'name', label: 'Name', align: 'left' },
  { id: 'amount', label: 'Amount', align: 'left' },
  { id: 'method', label: 'Method', align: 'left' },
  { id: 'status', label: 'Status', align: 'left' },
  { id: 'createdAt', label: 'Created At', align: 'left' },
  { id: 'actions', label: 'Actions', align: 'left' },
];

// ----------------------------------------------------------------------

export default function WithdrawDetailsListPage() {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    //
    selected,
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();

  const { themeStretch } = useSettingsContext();

  const dispatch = useDispatch();
  const { id: userId } = useParams();
  const location = useLocation();
  
  // Get userName from navigation state
  const userName = location.state?.userName || '';

  const [tableData, setTableData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [acceptLoading, setAcceptLoading] = useState({});
  const [rejectLoading, setRejectLoading] = useState({});

  const [filterName, setFilterName] = useState(''); // Input field value
  const [searchQuery, setSearchQuery] = useState(''); // Actual search value for filtering


  const [filterStatus, setFilterStatus] = useState('all');

  // Fetch withdrawal requests by userId
  const fetchWithdrawalRequests = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const params = {
        page: page + 1, // API uses 1-based pagination
        limit: rowsPerPage,
        userId, // Filter by userId
      };

      const result = await dispatch(getAllWithdrawalRequestsAsync(params)).unwrap();
      if (result?.data) {
        // Transform API data to match table structure
        const transformedData = result.data.map((item) => ({
          id: item._id || item.id,
          _id: item._id || item.id,
          userId: item.userId || {}, // Keep userId object for WithdrawDetailsTableRow
          amount: item.amount || 0,
          method: item.method || 'N/A',
          status: item.status || 'pending',
          remarks: item.remarks || '-',
          createdAt: item.createdAt,
          processedAt: item.processedAt ? new Date(item.processedAt).toLocaleString('en-IN') : null,
          processedBy: item.processedBy || null,
          bankDetails: item.bankDetails || null,
          upiDetails: item.upiDetails || null,
          ...item,
        }));
        setTableData(transformedData);
        // Store total items from pagination
        if (result?.pagination?.total) {
          setTotalItems(result.pagination.total);
        } else if (result?.pagination?.totalItems) {
          setTotalItems(result.pagination.totalItems);
        } else if (result?.totalItems !== undefined) {
          setTotalItems(result.totalItems);
        } else if (result?.data?.length !== undefined) {
          setTotalItems(result.data.length);
        }
      }
    } catch (error) {
      console.error('Failed to fetch withdrawal requests:', error);
      toast.error(error?.message || 'Failed to fetch withdrawal requests');
      setTableData([]);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  }, [dispatch, userId, page, rowsPerPage]);

  // Fetch withdrawal requests on component mount and when dependencies change
  useEffect(() => {
    fetchWithdrawalRequests();
  }, [fetchWithdrawalRequests]);

  // Memoized filtered data
  const dataFiltered = useMemo(() => {
    let filtered = [...tableData];

    // Filter by name
    if (searchQuery) {
      filtered = filtered.filter((item) => {
        const itemUserName = item?.userId?.name || '';
        return itemUserName.toLowerCase().includes(searchQuery.toLowerCase());
      });
    }

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter((item) => item.status === filterStatus);
    }

    // Sort data
    const stabilized = filtered.map((el, index) => [el, index]);
    stabilized.sort((a, b) => {
      const orderResult = getComparator(order, orderBy)(a[0], b[0]);
      if (orderResult !== 0) return orderResult;
      return a[1] - b[1];
    });

    return stabilized.map((el) => el[0]);
  }, [tableData, order, orderBy, searchQuery, filterStatus]);

  const dataInPage = useMemo(
    () => dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [dataFiltered, page, rowsPerPage]
  );

  const denseHeight = dense ? 52 : 72;

  const isMobile = useResponsive('down', 'sm');

  const isFiltered = searchQuery !== '' || filterStatus !== 'all';

  const isNotFound = !loading && tableData.length === 0 && !isFiltered;

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
    setFilterStatus('all');
    setPage(0);
  };

  const handleAccept = async (id) => {
    setAcceptLoading((prev) => ({ ...prev, [id]: true }));
    try {
      await dispatch(approveWithdrawalRequestAsync({ id, remarks: '' })).unwrap();
      toast.success('Withdrawal request approved successfully');
      // Refresh the list
      fetchWithdrawalRequests();
    } catch (error) {
      console.error('Failed to approve withdrawal request:', error);
      toast.error(error?.message || 'Failed to approve withdrawal request');
    } finally {
      setAcceptLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleReject = async (id) => {
    setRejectLoading((prev) => ({ ...prev, [id]: true }));
    try {
      await dispatch(rejectWithdrawalRequestAsync({ id, remarks: '' })).unwrap();
      toast.success('Withdrawal request rejected successfully');
      // Refresh the list
      fetchWithdrawalRequests();
    } catch (error) {
      console.error('Failed to reject withdrawal request:', error);
      toast.error(error?.message || 'Failed to reject withdrawal request');
    } finally {
      setRejectLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  return (
    <>
      <Helmet>
        <title> Withdrawal Details : List | Rupa999 </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Box
          sx={(theme) => ({
            position: 'relative', // default for desktop
            bgcolor: 'background.paper',
            zIndex: 10,
            [theme.breakpoints.down('sm')]: {
              position: 'fixed',
              top: 60,
              left: 0,
              width: '100%',
              px: 2,
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
              borderBottom: '1px solid',
              borderColor: 'divider',
            },
          })}
        >
          <CustomBreadcrumbs
            heading={userName ? `Withdrawal Details - ${userName}` : 'Withdrawal Details'}
            links={[
              { name: 'Dashboard', href: PATH_DASHBOARD.root },
              { name: 'User List', href: PATH_DASHBOARD.user.list },
              { name: userName ? `${userName}'s Withdrawal Details` : 'Withdrawal Details' },
            ]}

          />
        </Box>

        {/* 👇 Add margin to push content below breadcrumb for mobile */}
        <Box
          sx={(theme) => ({
            [theme.breakpoints.down('sm')]: {
              height: 65, // equal to breadcrumb bar height
            },
          })}
        />

        {isMobile ? (
          <>
            <CustomTableToolbar
              isFiltered={isFiltered}
              filterName={filterName}
              onFilterName={handleFilterName}
              onSearch={handleSearch}
              onResetFilter={handleResetFilter}
            />
            <WithdrawDetailsMobileViewLayoutPage
              data={dataFiltered}
              onAccept={(id) => handleAccept(id)}
              onReject={(id) => handleReject(id)}
              acceptLoading={acceptLoading}
              rejectLoading={rejectLoading}
              loading={loading}
            />
          </>
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
                    rowCount={tableData.length || 0}
                    numSelected={selected.length}
                    onSort={onSort}
                  />

                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                          Loading...
                        </TableCell>
                      </TableRow>
                    ) : (
                      dataInPage.map((row, index) => (
                        <WithdrawDetailsTableRow
                          key={row._id || row.id}
                          index={(page * rowsPerPage) + index + 1}
                          row={row}
                          onAccept={() => handleAccept(row._id || row.id)}
                          onReject={() => handleReject(row._id || row.id)}
                          acceptLoading={acceptLoading[row._id || row.id] || false}
                          rejectLoading={rejectLoading[row._id || row.id] || false}
                        />
                      ))
                    )}

                    {!loading && (
                      <TableEmptyRows
                        height={denseHeight}
                        emptyRows={emptyRows(page, rowsPerPage, totalItems || tableData.length)}
                      />
                    )}

                    <TableNoData isNotFound={isNotFound} />
                  </TableBody>
                </Table>
              </Scrollbar>
            </TableContainer>

            <TablePaginationCustom
              count={totalItems || tableData.length}
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
