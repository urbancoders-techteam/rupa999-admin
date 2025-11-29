import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import {
  Button,
  Card,
  Container,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Tooltip,
} from '@mui/material';
// routes
import { useDispatch, useSelector } from 'react-redux';
import { PATH_DASHBOARD } from '../routes/paths';
// components
import ConfirmDialog from '../components/confirm-dialog';
import CustomBreadcrumbs from '../components/custom-breadcrumbs';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
import { useSettingsContext } from '../components/settings';
import { useSnackbar } from '../components/snackbar';
import {
  emptyRows,
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  TableSelectedAction,
  useTable,
} from '../components/table';
import { deleteNotificationAsync, getAllNotificationsAsync } from '../redux/services/notification_services';
import NotificationTableRow from '../sections/_notification/components/NotificationTableRow';

const TABLE_HEAD = [
  { id: 'sno', label: 'S.no', align: 'left' },
  { id: 'title', label: 'Title', align: 'left' },
  { id: 'description', label: 'Description', align: 'left' },
  { id: 'createdBy', label: 'Created By', align: 'left' },
  { id: 'action', label: 'Action', align: 'right' },
];

export default function NotificationListPage() {
  const { dense, page, rowsPerPage, setPage, selected, setSelected, onSelectRow, onSelectAllRows, onChangeDense, onChangePage, onChangeRowsPerPage, } = useTable();

  const { themeStretch } = useSettingsContext();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const { notificationList, loading, pagination } = useSelector((state) => state.notification);

  const [openConfirm, setOpenConfirm] = useState(false);

  useEffect(() => {
    dispatch(
      getAllNotificationsAsync({
        page: page + 1, // API uses 1-based pagination
        limit: rowsPerPage,
      })
    );
  }, [dispatch, page, rowsPerPage]);

  // Transform API data to table format
  const tableData = (notificationList || []).map((notification, index) => ({
    id: notification._id,
    _id: notification._id,
    sno: (page * rowsPerPage) + index + 1,
    title: notification.title || 'N/A',
    description: notification.description || 'N/A',
    createdBy: notification.createdBy?.name || 'N/A',
    createdAt: notification.createdAt,
    isActive: notification.isActive,
  }));

  const dataInPage = tableData;

  const handleDeleteRow = async (id) => {
    try {
      await dispatch(deleteNotificationAsync(id)).unwrap();
      enqueueSnackbar('Notification deleted successfully', { variant: 'success' });
      setSelected([]);
      // Refresh list
      dispatch(
        getAllNotificationsAsync({
          page: page + 1,
          limit: rowsPerPage,
        })
      );
    } catch (error) {
      enqueueSnackbar(error?.message || 'Failed to delete notification', { variant: 'error' });
    }
  };

  const handleDeleteRows = async (selectedRows) => {
    try {
      await Promise.all(selectedRows.map((id) => dispatch(deleteNotificationAsync(id)).unwrap()));
      enqueueSnackbar(`${selectedRows.length} notification(s) deleted successfully`, { variant: 'success' });
      setSelected([]);
      // Refresh list
      dispatch(
        getAllNotificationsAsync({
          page: page + 1,
          limit: rowsPerPage,
        })
      );
    } catch (error) {
      enqueueSnackbar(error?.message || 'Failed to delete notifications', { variant: 'error' });
    }
  };

  const handleEditRow = (row) => {
    navigate(PATH_DASHBOARD.notifications.edit(row.id), { state: row });
  };

  const handleOpenConfirm = () => setOpenConfirm(true);
  const handleCloseConfirm = () => setOpenConfirm(false);

  return (
    <>
      <Helmet>
        <title> Notifications: List | Rupa999 </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="Notifications"
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'Notifications', href: PATH_DASHBOARD.notifications.list }]}
          action={
            <Button component={RouterLink} to={PATH_DASHBOARD.notifications.new} variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
              New Notification
            </Button>
          }
        />

        <Card>
          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={dense}
              numSelected={selected.length}
              rowCount={tableData.length}
              onSelectAllRows={(checked) => onSelectAllRows(checked, tableData.map((row) => row.id))}
              action={
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={handleOpenConfirm}>
                    <Iconify icon="eva:trash-2-outline" />
                  </IconButton>
                </Tooltip>
              }
            />

            <Scrollbar>
              <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 600 }}>
                <TableHeadCustom headLabel={TABLE_HEAD} rowCount={tableData.length} numSelected={selected.length} />

                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : (
                    <>
                      {dataInPage.map((row) => (
                        <NotificationTableRow
                          key={row.id}
                          row={row}
                          index={row.sno}
                          selected={selected.includes(row.id)}
                          onSelectRow={() => onSelectRow(row.id)}
                          onDeleteRow={() => handleDeleteRow(row.id)}
                          onEditRow={() => handleEditRow(row)}
                        />
                      ))}

                      <TableEmptyRows emptyRows={emptyRows(page, rowsPerPage, pagination.total || 0)} />

                      <TableNoData isNotFound={!tableData.length && !loading} />
                    </>
                  )}
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={pagination.total || 0}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
            dense={dense}
            onChangeDense={onChangeDense}
          />
        </Card>
      </Container>

      <ConfirmDialog open={openConfirm} onClose={handleCloseConfirm} title="Delete" content={<>Are you sure want to delete <strong> {selected.length} </strong> items?</>} action={<Button variant="contained" color="error" onClick={() => { handleDeleteRows(selected); handleCloseConfirm(); }}>Delete</Button>} />
    </>
  );
}
