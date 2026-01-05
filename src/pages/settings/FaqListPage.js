import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import {
  Button,
  Card,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@mui/material';
// routes
import { useDispatch, useSelector } from 'react-redux';
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
import { useSettingsContext } from '../../components/settings';
import { useSnackbar } from '../../components/snackbar';
import {
  emptyRows,
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  TableSelectedAction,
  useTable,
} from '../../components/table';
import { deleteFaqAsync, getAllFaqsAsync } from '../../redux/services/faq_services';
import FaqTableRow from '../../sections/_faq/components/FaqTableRow';

const TABLE_HEAD = [
  { id: 'sno', label: 'S.no', align: 'left' },
  { id: 'question', label: 'Question', align: 'left' },
  { id: 'answer', label: 'Answer', align: 'left' },
  { id: 'action', label: 'Action', align: 'right' },
];

export default function FaqListPage() {
  const { dense, page, rowsPerPage, setPage, selected, setSelected, onSelectRow, onSelectAllRows, onChangeDense, onChangePage, onChangeRowsPerPage, } = useTable();

  const { themeStretch } = useSettingsContext();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const { faqList, loading, pagination } = useSelector((state) => state.faq);

  useEffect(() => {
    dispatch(
      getAllFaqsAsync({
        page: page + 1, // API uses 1-based pagination
        limit: rowsPerPage,
      })
    );
  }, [dispatch, page, rowsPerPage]);

  // Transform API data to table format
  const tableData = (faqList || []).map((faq, index) => ({
    id: faq._id,
    _id: faq._id,
    sno: (page * rowsPerPage) + index + 1,
    question: faq.question || 'N/A',
    answer: faq.answer || 'N/A',
    createdAt: faq.createdAt,
    isActive: faq.isActive,
  }));

  const dataInPage = tableData;

  const handleDeleteRow = async (id) => {
    try {
      await dispatch(deleteFaqAsync(id)).unwrap();
      enqueueSnackbar('FAQ deleted successfully', { variant: 'success' });
      setSelected([]);
      // Refresh list
      dispatch(
        getAllFaqsAsync({
          page: page + 1,
          limit: rowsPerPage,
        })
      );
    } catch (error) {
      enqueueSnackbar(error?.message || 'Failed to delete FAQ', { variant: 'error' });
    }
  };

  return (
    <>
      <Helmet>
        <title> FAQ: List | Rupa999 </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="FAQ List"
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'FAQ List', href: PATH_DASHBOARD.faq.list }]}
          action={
            <Button component={RouterLink} to={PATH_DASHBOARD.faq.new} variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
              New FAQ
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
            />

            <Scrollbar>
              <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 600 }}>
                <TableHeadCustom headLabel={TABLE_HEAD} rowCount={tableData.length} numSelected={selected.length} />

                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : (
                    <>
                      {dataInPage.map((row) => (
                        <FaqTableRow
                          key={row.id}
                          row={row}
                          index={row.sno}
                          selected={selected.includes(row.id)}
                          onSelectRow={() => onSelectRow(row.id)}
                          onDeleteRow={() => handleDeleteRow(row.id)}
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
    </>
  );
}
