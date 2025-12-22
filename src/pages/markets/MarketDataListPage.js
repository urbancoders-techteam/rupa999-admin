import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
// @mui
import {
  Box,
  Button,
  Card,
  Container,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import RHFDatePicker from '../../components/hook-form/RHFDatePicker';
import Iconify from '../../components/iconify';
// components
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import FormProvider, { RHFAutocomplete } from '../../components/hook-form';
import Scrollbar from '../../components/scrollbar';
import { useSettingsContext } from '../../components/settings';
import {
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  useTable,
} from '../../components/table';
// sections
import { marketTypeOptiData } from '../../assets/data/marketEnum';
import { getBidDataResultAsync } from '../../redux/services/bid_services';
import { getAllMarketsAsync } from '../../redux/services/market_services';
import { PATH_DASHBOARD } from '../../routes/paths';
import MarketDataMobileViewCardLayout from '../../sections/_market_data/components/MarketDataMobileViewCardLayout';
import MarketDataTableRow from '../../sections/_market_data/components/MarketDataTableRow';

// ----------------------------------------------------------------------

const marketTimeOptions = [
  { name: 'Open', key: 'open' },
  { name: 'Close', key: 'close' },
];

const TABLE_HEAD = [
  { id: 'srNo', label: 'Sr No.', align: 'center' },
  { id: 'biddingNumber', label: 'Bidding Number', align: 'left' },
  { id: 'type', label: 'Type', align: 'left' },
  { id: 'totalBidsUserCount', label: 'User Count', align: 'left' },
  { id: 'totalAmount', label: 'Total Amount', align: 'left' },
];

// ----------------------------------------------------------------------

export default function MarketDataListPage() {
  const { dense, page, rowsPerPage, setPage, onChangeDense, onChangePage, onChangeRowsPerPage } =
    useTable();

  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { bidDataResult, loading, pagination } = useSelector((state) => state.bid);
  const { marketList, loading: marketLoading } = useSelector((state) => state.market);

  const defaultValues = {
    date: dayjs(),
    market: null,
    marketType: null,
    marketTime: null,
    sortBy: null,
  };

  const methods = useForm({
    defaultValues,
  });

  const { handleSubmit, watch } = methods;

  const selectedDate = watch('date');

  // Fetch markets on component mount
  useEffect(() => {
    dispatch(getAllMarketsAsync({ page: 1, limit: 100 }));
  }, [dispatch]);

  // Initial data fetch on component mount with default date (today)
  useEffect(() => {
    const initialParams = {
      page: 1,
      limit: rowsPerPage,
      date: dayjs().format('YYYY-MM-DD'), // Default to today's date
    };
    dispatch(getBidDataResultAsync(initialParams));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const onSubmit = async (data, e) => {
    e?.preventDefault(); // Prevent form submission and page reload
    try {
      setPage(0); // Reset to first page when filters change
      const params = {
        page: 1,
        limit: rowsPerPage,
      };

      // Add date filter - always include date (default to today if not provided)
      if (data.date) {
        params.date = dayjs(data.date).format('YYYY-MM-DD');
      } else {
        params.date = dayjs().format('YYYY-MM-DD');
      }

      // Add market filter (using _id from API)
      if (data.market?._id) {
        params.market = data.market._id;
      }

      // Add game type filter (using key from marketTypeOptiData)
      if (data.marketType?.key) {
        params.gameType = data.marketType.key;
      }

      // Add market time filter
      if (data.marketTime?.key) {
        params.session = data.marketTime.key;
      }

      // Add sortBy filter
      if (data.sortBy?.key) {
        params.sortBy = data.sortBy.key;
      }

      await dispatch(getBidDataResultAsync(params)).unwrap();
    } catch (error) {
      console.error('Failed to fetch bid data result:', error);
    }
  };

  // Fetch data when pagination changes
  const fetchDataWithFilters = async () => {
    try {
      const formValues = methods.getValues();
      const params = {
        page: page + 1, // API uses 1-based pagination
        limit: rowsPerPage,
      };

      // Add date filter - always include date (default to today if not provided)
      if (formValues.date) {
        params.date = dayjs(formValues.date).format('YYYY-MM-DD');
      } else {
        params.date = dayjs().format('YYYY-MM-DD');
      }

      // Add market filter (using _id from API)
      if (formValues.market?._id) {
        params.market = formValues.market._id;
      }

      // Add game type filter
      if (formValues.marketType?.key) {
        params.gameType = formValues.marketType.key;
      }

      // Add market time filter
      if (formValues.marketTime?.key) {
        params.session = formValues.marketTime.key;
      }

      // Add sortBy filter
      // if (formValues.sortBy?.key) {
      //   params.sortBy = formValues.sortBy.key;
      // }

      await dispatch(getBidDataResultAsync(params)).unwrap();
    } catch (error) {
      console.error('Failed to fetch bid data result:', error);
    }
  };

  // Fetch data when page or rowsPerPage changes (always include date filter)
  useEffect(() => {
    const formValues = methods.getValues();
    // Always fetch when pagination changes, date is always included
    fetchDataWithFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage]);

  useEffect(() => {
    dispatch(
      getAllMarketsAsync({
        page: 1, // API uses 1-based pagination
        limit: 100,
      })
    );
  }, [dispatch]);

  const isNotFound = !bidDataResult.length && !loading;
  return (
    <>
      <Helmet>
        <title> Market Data : List | Rupa999 </title>
      </Helmet>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Container maxWidth={themeStretch ? false : 'xl'}>
          <CustomBreadcrumbs
            heading={`Market Data (${selectedDate ? dayjs(selectedDate).format('DD-MM-YYYY') : 'N/A'
              })`}
            links={[
              { name: 'Dashboard', href: PATH_DASHBOARD.home.list },
              { name: 'Market Data', href: PATH_DASHBOARD.markets.marketdata.list },
              { name: 'List' },
            ]}
          />

          {/* Filter Section */}
          <FormProvider methods={methods}>
            <Card sx={{ p: 3, mb: 3 }}>
              <Box
                component="form"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit(onSubmit)(e);
                }}
                noValidate
              >
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={6} md={2.5}>
                    <RHFDatePicker
                      name="date"
                      label="Date"
                      size="small"
                      format="DD/MM/YYYY"
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={2.5}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <RHFAutocomplete
                        name="market"
                        label="Market Name"
                        size="small"
                        options={marketList || []}
                        loading={marketLoading}
                        getOptionLabel={(option) => option?.name || ''}
                        isOptionEqualToValue={(option, value) => option?._id === value?._id}
                        renderOption={(props, option) => <li {...props}>{option.name}</li>}
                        sx={{ flex: 1 }}
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6} md={2.5}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <RHFAutocomplete
                        name="marketType"
                        label="Filter by game type"
                        size="small"
                        options={marketTypeOptiData}
                        getOptionLabel={(option) => option?.name || ''}
                        isOptionEqualToValue={(option, value) => option?.key === value?.key}
                        renderOption={(props, option) => <li {...props}>{option.name}</li>}
                        sx={{ flex: 1 }}
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6} md={2.5}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <RHFAutocomplete
                        name="marketTime"
                        label="Market Time"
                        size="small"
                        options={marketTimeOptions}
                        getOptionLabel={(option) => option?.name || ''}
                        isOptionEqualToValue={(option, value) => option?.key === value?.key}
                        renderOption={(props, option) => <li {...props}>{option.name}</li>}
                        sx={{ flex: 1 }}
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6} md={2}>
                    <Button
                      fullWidth
                      variant="contained"
                      disabled={loading}
                      startIcon={<Iconify icon="eva:search-fill" />}
                      onClick={handleSubmit(onSubmit)}
                    >
                      GET
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Card>
          </FormProvider>

          {/* Table Section */}
          {isMobile ? (
            <>
              <MarketDataMobileViewCardLayout
                data={bidDataResult}
                loading={loading}
                date={selectedDate ? dayjs(selectedDate).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD')}
              />
              <TablePaginationCustom
                page={pagination?.page ? pagination.page - 1 : page}
                count={pagination?.total || 0}
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
                  <Table size={dense ? 'medium' : 'small'}>
                    <TableHeadCustom headLabel={TABLE_HEAD} rowCount={marketList.length} />

                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={TABLE_HEAD.length} align="center" sx={{ py: 3 }}>
                            <Typography>Loading...</Typography>
                          </TableCell>
                        </TableRow>
                      ) : (
                        <>
                          {bidDataResult.map((row, index) => (
                            <MarketDataTableRow
                              key={row.id || row.bidsNumber || index}
                              index={index}
                              row={row}
                              date={selectedDate ? dayjs(selectedDate).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD')}
                            />
                          ))}

                          <TableNoData isNotFound={isNotFound} />
                        </>
                      )}
                    </TableBody>
                  </Table>
                </Scrollbar>
              </TableContainer>

              <TablePaginationCustom
                page={pagination?.page ? pagination.page - 1 : page}
                count={pagination?.total || 0}
                rowsPerPage={rowsPerPage}
                onPageChange={onChangePage}
                onRowsPerPageChange={onChangeRowsPerPage}
                dense={dense}
                onChangeDense={onChangeDense}
              />
            </Card>
          )}
        </Container>
      </LocalizationProvider>
    </>
  );
}
