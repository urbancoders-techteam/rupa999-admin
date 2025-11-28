import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import {
  Card,
  Table,
  Button,
  Tooltip,
  TableBody,
  Container,
  IconButton,
  TableContainer,
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../routes/paths';
// components
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
import ConfirmDialog from '../components/confirm-dialog';
import CustomBreadcrumbs from '../components/custom-breadcrumbs';
import { useSettingsContext } from '../components/settings';
import {
  useTable,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from '../components/table';
import NotificationTableRow from '../sections/_notification/components/NotificationTableRow';
import { getNotifications, removeNotification } from '../utils/notificationService';

const TABLE_HEAD = [
  { id: 'sno', label: 'S.no', align: 'left' },
  { id: 'title', label: 'Title', align: 'left' },
  { id: 'description', label: 'Description', align: 'left' },
  { id: 'createdBy', label: 'Created By', align: 'left' },
  { id: 'action', label: 'Action', align: 'right' },
];

export default function NotificationListPage() {
  const { dense, page, order, orderBy, rowsPerPage, setPage, selected, setSelected, onSelectRow, onSelectAllRows, onSort, onChangeDense, onChangePage, onChangeRowsPerPage, } = useTable();

  const { themeStretch } = useSettingsContext();
  const navigate = useNavigate();

  const [tableData, setTableData] = useState([]);
  const [openConfirm, setOpenConfirm] = useState(false);

  useEffect(() => {
    setTableData(getNotifications());
  }, []);

  const dataInPage = tableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleDeleteRow = (id) => {
    const next = removeNotification(id);
    setSelected([]);
    setTableData(next);
    if (page > 0 && dataInPage.length < 2) setPage(page - 1);
  };

  const handleDeleteRows = (selectedRows) => {
    let next = tableData;
    selectedRows.forEach((id) => {
      next = next.filter((r) => r.id !== id);
    });
    setSelected([]);
    setTableData(next);
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
            <Button component={RouterLink} to={PATH_DASHBOARD.notifications.new} variant="contained" startIcon={<Iconify icon="eva:plus-fill" /> }>
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
                <TableHeadCustom order={order} orderBy={orderBy} headLabel={TABLE_HEAD} rowCount={tableData.length} numSelected={selected.length} onSort={onSort} />

                <TableBody>
                  {tableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                    <NotificationTableRow key={row.id} row={row} index={page * rowsPerPage + index + 1} selected={selected.includes(row.id)} onSelectRow={() => onSelectRow(row.id)} onDeleteRow={() => handleDeleteRow(row.id)} onEditRow={() => handleEditRow(row)} />
                  ))}

                  <TableEmptyRows emptyRows={emptyRows(page, rowsPerPage, tableData.length)} />

                  <TableNoData isNotFound={!tableData.length} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom count={tableData.length} page={page} rowsPerPage={rowsPerPage} onPageChange={onChangePage} onRowsPerPageChange={onChangeRowsPerPage} dense={dense} onChangeDense={onChangeDense} />
        </Card>
      </Container>

      <ConfirmDialog open={openConfirm} onClose={handleCloseConfirm} title="Delete" content={<>Are you sure want to delete <strong> {selected.length} </strong> items?</>} action={<Button variant="contained" color="error" onClick={() => { handleDeleteRows(selected); handleCloseConfirm(); }}>Delete</Button>} />
    </>
  );
}
