import { useEffect, useState } from 'react';
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
  Stack,
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
  { id: 'expand', label: '', align: 'center', width: 40 },
  { id: 'srNo', label: 'Sr No.', align: 'center' },
  { id: 'gameType', label: 'Game Type', align: 'left' },
  { id: 'session', label: 'Session', align: 'left' },
  { id: 'bidCount', label: 'Bid Count', align: 'left' },
  { id: 'groupTotal', label: 'Group Total', align: 'left' },
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
    marketSession: null,
    sortBy: null,
  };

  const methods = useForm({
    defaultValues,
  });

  const { handleSubmit, watch, reset } = methods;

  const selectedDate = watch('date');
  const selectedMarket = watch('market');

  // Sheet stays blank until the admin explicitly runs a search via GET
  const [hasSearched, setHasSearched] = useState(false);

  // Fetch markets on component mount
  useEffect(() => {
    dispatch(getAllMarketsAsync({ page: 1, limit: 100 }));
  }, [dispatch]);

  const onSubmit = async (data, e) => {
    e?.preventDefault(); // Prevent form submission and page reload
    try {
      setPage(0); // Reset to first page when filters change
      setHasSearched(true);
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

      // Add market time filter
      if (data.marketSession?.key) {
        params.session = data.marketSession.key;
      }

      // // Add sortBy filter
      // if (data.sortBy?.key) {
      //   params.sortBy = data.sortBy.key;
      // }

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

      // Add market time filter
      if (formValues.marketSession?.key) {
        params.session = formValues.marketSession.key;
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

  // Re-fetch on pagination changes, but only once the admin has already run a search
  useEffect(() => {
    if (!hasSearched) return;
    fetchDataWithFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage]);

  const handleReset = () => {
    reset({ ...defaultValues, date: dayjs() });
    setPage(0);
    setHasSearched(false);
  };

  const isNotFound = hasSearched && !bidDataResult.length && !loading;

  const headingDate = selectedDate ? dayjs(selectedDate).format('DD-MM-YYYY') : 'N/A';
  const dateForApi = selectedDate
    ? dayjs(selectedDate).format('YYYY-MM-DD')
    : dayjs().format('YYYY-MM-DD');
  const marketIdForApi = selectedMarket?._id || '';
  const paginationPage = pagination?.page ? pagination.page - 1 : page;
  const tableSize = dense ? 'medium' : 'small';

  let tableSection = null;

  if (!hasSearched) {
    tableSection = (
      <Card>
        <Box sx={{ p: 5, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            Select a date and market, then click GET to view bid data.
          </Typography>
        </Box>
      </Card>
    );
  } else {
    // Same card/grid layout on every screen size (desktop and mobile)
    tableSection = (
      <>
        <MarketDataMobileViewCardLayout
          data={bidDataResult}
          loading={loading}
          date={dateForApi}
          marketId={marketIdForApi}
        />
        <TablePaginationCustom
          page={paginationPage}
          count={pagination?.total || 0}
          rowsPerPage={rowsPerPage}
          onPageChange={onChangePage}
          onRowsPerPageChange={onChangeRowsPerPage}
          dense={dense}
          onChangeDense={onChangeDense}
        />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title> Market Data : List | Rupa999 </title>
      </Helmet>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Container maxWidth={themeStretch ? false : 'xl'}>
          <CustomBreadcrumbs
            heading={`Market Data (${headingDate})`}
            links={[
              { name: 'Dashboard', href: PATH_DASHBOARD.home.list },
              { name: 'Market Data', href: PATH_DASHBOARD.markets.marketdata.list },
              { name: 'List' },
            ]}
          />

          {/* Filter Section */}
          <FormProvider methods={methods}>
            <Card sx={{ p:{ xs: 2, sm: 3 }, mb:{ xs: 2, sm: 3 } }}>
              <Box
                component="form"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit(onSubmit)(e);
                }}
                noValidate
              >
                <Grid container spacing={{ xs: 1.5, sm: 2 }} alignItems="center">
                  <Grid item xs={12}>
                    <RHFDatePicker
                      name="date"
                      label="Date"
                      size="small"
                      format="DD/MM/YYYY"
                    />
                  </Grid>

                  <Grid item xs={12}>
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

                  {/* Temporarily hidden Market Type filter */}
                  {/* <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <RHFAutocomplete
                        name="marketType"
                        label="Market Type"
                        size="small"
                        options={marketTypeOptiData}
                        getOptionLabel={(option) => option?.name || ''}
                        isOptionEqualToValue={(option, value) => option?.key === value?.key}
                        renderOption={(props, option) => <li {...props}>{option.name}</li>}
                        sx={{ flex: 1 }}
                      />
                    </Box>
                  </Grid> */}

                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <RHFAutocomplete
                        name="marketSession"
                        label="Market Session"
                        size="small"
                        options={marketTimeOptions}
                        getOptionLabel={(option) => option?.name || ''}
                        isOptionEqualToValue={(option, value) => option?.key === value?.key}
                        renderOption={(props, option) => <li {...props}>{option.name}</li>}
                        sx={{ flex: 1 }}
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Stack direction="row" spacing={1}>
                      <Button
                        fullWidth
                        variant="contained"
                        disabled={loading}
                        startIcon={<Iconify icon="eva:search-fill" />}
                        onClick={handleSubmit(onSubmit)}
                      >
                        GET
                      </Button>
                      <Button
                        fullWidth
                        variant="outlined"
                        color="inherit"
                        disabled={loading}
                        startIcon={<Iconify icon="ic:round-refresh" />}
                        onClick={handleReset}
                      >
                        Reset
                      </Button>
                    </Stack>
                  </Grid>
                </Grid>
              </Box>
            </Card>
          </FormProvider>

          {/* Table Section */}
          {tableSection}
        </Container>
      </LocalizationProvider>
    </>
  );
}
