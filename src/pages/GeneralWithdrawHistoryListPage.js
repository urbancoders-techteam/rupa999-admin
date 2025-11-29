import { paramCase } from 'change-case';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// @mui

import { Box, Button, Card, Container, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';
import useResponsive from '../hooks/useResponsive';
// routes
import { PATH_DASHBOARD } from '../routes/paths';

// _mock_
// components
import ConfirmDialog from '../components/confirm-dialog';
import CustomBreadcrumbs from '../components/custom-breadcrumbs';
import Scrollbar from '../components/scrollbar';
import { useSettingsContext } from '../components/settings';
// services
import {
  approveWithdrawalRequestAsync,
  getAllWithdrawalRequestsAsync,
  rejectWithdrawalRequestAsync,
} from '../redux/services/withdrawal_services';

// table
import {
  emptyRows,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  useTable,
} from '../components/table';
import CustomTableToolbar from '../components/table/CustomTableToolBar';

// sections
import GeneralWithdrawHistoryTableRow from '../sections/_general_withdraw_history/components/GeneralWithdrawHistoryTableRow';
import WithdrawMobileViewCardLayout from '../sections/_withdraw_details/components/WithdrawDetailsMobileViewCardLayout';
import WithdrawDetailsToolbar from '../sections/_withdraw_details/components/WithdrawDetailsToolbar';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'id', label: 'ID', align: 'left' },
  { id: 'marketName', label: 'Name', align: 'left' },
  { id: 'userPhone', label: 'Phone', align: 'left' },
  { id: 'amount', label: 'Amount', align: 'left' },
  { id: 'withdrawMode', label: 'Withdraw Mode', align: 'left' },
  { id: 'upiName', label: 'UPI Name', align: 'left' },
  { id: 'upiID', label: 'UPI ID', align: 'left' },
  { id: 'bankName', label: 'Bank Name', align: 'left' },
  { id: 'ifsc', label: 'Bank IFSC', align: 'left' },
  { id: 'status', label: 'Status', align: 'left' },
  { id: 'reason', label: 'Faild Reason', align: 'left' },
  { id: 'actions', label: 'Actions', align: 'left' },
  { id: 'createdAt', label: 'Created At', align: 'left' },
];

// ----------------------------------------------------------------------

export default function GeneralWithdrawHistoryListPage() {
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
  const dispatch = useDispatch();

  const [tableData, setTableData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [acceptLoading, setAcceptLoading] = useState({});
  const [rejectLoading, setRejectLoading] = useState({});

  const [openConfirm, setOpenConfirm] = useState(false);

  const [filterName, setFilterName] = useState(''); // Input field value
  const [searchQuery, setSearchQuery] = useState(''); // Actual search value for filtering

  const [filterRole, setFilterRole] = useState('all');

  const [filterStatus, setFilterStatus] = useState('all');

  // Fetch withdrawal requests function wrapped in useCallback
  const fetchWithdrawalRequests = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: page + 1, // API uses 1-based pagination
        limit: rowsPerPage,
      };
      // Don't filter by status - show all (history page)
      // if (filterStatus !== 'all') {
      //   const statusMap = {
      //     pending: 'pending',
      //     approved: 'approved',
      //     rejected: 'rejected',
      //   };
      //   params.status = statusMap[filterStatus] || filterStatus;
      // }
      const result = await dispatch(getAllWithdrawalRequestsAsync(params)).unwrap();
      if (result?.data) {
        // Transform API data to match table structure
        const transformedData = result.data.map((item) => ({
          id: item._id || item.id,
          _id: item._id || item.id,
          marketName: item.userId?.name || 'N/A',
          userPhone: item.userId?.number || item.userId?.whatsappNumber || 'N/A',
          amount: item.amount || 0,
          payableAmount: item.amount || 0, // Could calculate with processing fee if needed
          requestType: 'Withdraw',
          withdrawMode: item.method || 'N/A',
          // Extract UPI details from API response
          upiName: item.upiDetails?.upiName || 'N/A',
          upiID: item.upiDetails?.upiId || 'N/A',
          // Extract Bank details from API response
          bankName: item.bankDetails?.bankName || 'N/A',
          ifsc: item.bankDetails?.ifscCode || 'N/A',
          status: item.status || 'pending',
          reason: item.remarks || '-',
          createdAt: item.createdAt ? new Date(item.createdAt).toLocaleString('en-IN') : 'N/A',
          processedAt: item.processedAt ? new Date(item.processedAt).toLocaleString('en-IN') : null,
          processedBy: item.processedBy?.name || null,
          // Keep original data for reference
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
      toast.error(error?.message || 'Failed to fetch withdrawal history');
      setTableData([]);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  }, [dispatch, page, rowsPerPage]);

  // Fetch withdrawal requests on component mount
  useEffect(() => {
    fetchWithdrawalRequests();
  }, [fetchWithdrawalRequests]);

  // Memoized filtered data - filter by name in marketName (userId.name)
  const dataFiltered = useMemo(() => {
    let filtered = [...tableData];

    // Filter by name (search in marketName which is userId.name)
    if (searchQuery) {
      filtered = filtered.filter((item) => {
        const userName = item?.marketName || '';
        return userName.toLowerCase().includes(searchQuery.toLowerCase());
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

  // Memoized paginated data
  const dataInPage = useMemo(
    () => dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [dataFiltered, page, rowsPerPage]
  );

  const denseHeight = dense ? 52 : 72;

  const isMobile = useResponsive('down', 'sm');

  const isFiltered = searchQuery !== '' || filterRole !== 'all' || filterStatus !== 'all';

  const isNotFound = !loading && tableData.length === 0 && !isFiltered;


  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleFilterName = (event) => {
    setFilterName(event.target.value);
  };

  const handleSearch = () => {
    setPage(0);
    setSearchQuery(filterName);
  };

  const handleDeleteRow = (id) => {
    const deleteRow = tableData.filter((row) => (row._id || row.id) !== id);
    setSelected([]);
    setTableData(deleteRow);

    if (page > 0) {
      if (dataInPage.length < 2) {
        setPage(page - 1);
      }
    }
  };

  const handleDeleteRows = (selectedRows) => {
    const deleteRows = tableData.filter((row) => !selectedRows.includes(row._id || row.id));
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
    navigate(PATH_DASHBOARD.user.edit(paramCase(id)));
  };

  const handleResetFilter = () => {
    setFilterName('');
    setSearchQuery('');
    setFilterRole('all');
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
        <title> Main Withdraw History List : List | Rupa999 </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        {isMobile ? (
          <Box sx={{ position: 'sticky', top: 0, zIndex: 10, bgcolor: 'background.paper' }}>
            <CustomBreadcrumbs
              heading="Main Withdraw History List"
              links={[
                { name: 'Dashboard', href: PATH_DASHBOARD.root },
                { name: 'Main Withdraw History List', href: PATH_DASHBOARD.generalwithdrawhistory.list },
              ]}
            />
            <WithdrawDetailsToolbar
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
              heading="Main Withdraw History List"
              links={[
                { name: 'Dashboard', href: PATH_DASHBOARD.root },
                { name: 'Main Withdraw History List', href: PATH_DASHBOARD.generalwithdrawhistory.list },
              ]}
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
          <WithdrawMobileViewCardLayout
            data={tableData}
            onEditRow={(id) => handleEditRow(id)}
            onDeleteRow={(id) => handleDeleteRow(id)}
            onSelectRow={(id) => onSelectRow(id)}
            selected={selected}
            onAccept={(id) => handleAccept(id)}
            onReject={(id) => handleReject(id)}
            acceptLoading={acceptLoading}
            rejectLoading={rejectLoading}
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
                    rowCount={tableData.length || 0}
                    numSelected={selected.length}
                    onSort={onSort}
                  />

                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={15} align="center" sx={{ py: 3 }}>
                          Loading...
                        </TableCell>
                      </TableRow>
                    ) : (
                      dataInPage.map((row, index) => (
                        <GeneralWithdrawHistoryTableRow
                          index={(page * rowsPerPage) + index + 1}
                          key={row._id || row.id}
                          row={row}
                          selected={selected.includes(row._id || row.id)}
                          onSelectRow={() => onSelectRow(row._id || row.id)}
                          onDeleteRow={() => handleDeleteRow(row._id || row.id)}
                          onEditRow={() => handleEditRow(row._id || row.id)}
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

// Filter function is now handled in useMemo above
