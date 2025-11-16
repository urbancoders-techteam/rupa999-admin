import { Helmet } from 'react-helmet-async';
import { useState, useMemo } from 'react';
// @mui
import {
  Card,
  Table,
  Button,
  TableBody,
  Container,
  TableContainer,
  Box,
  Grid,
  TextField,
  MenuItem,
  Typography,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import Iconify from '../../components/iconify';
// components
import Scrollbar from '../../components/scrollbar';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
// sections
import MarketDataTableRow from '../../sections/_market_data/components/MarketDataTableRow';

// ----------------------------------------------------------------------

const optionsData = [
  'SRIDEVI DAY',
  'TIME BAZAR',
  'MADHUR DAY',
  'MILAN DAY',
  'RAJDHANI DAY',
  'SUPREME DAY',
  'KALIYAN',
  'SRIDEVI NIGHT',
  'MADHUR NIGHT',
  'MILAN NIGHT',
  'KALIYAN NIGHT',
  'MAIN BAZAR',
  'RAJDHANI NIGHT',
  'KARNATAKA DAY',
  'KARNATAKA NIGHT',
];

const marketTimeOptions = ['Open', 'Close'];

const TABLE_HEAD = [
  { id: 'srNo', label: 'Sr No.', align: 'center' },
  { id: 'jodiDigit', label: 'Jodi Digit', align: 'left' },
  { id: 'halfSangamA', label: 'Half Sangam A', align: 'left' },
  { id: 'halfSangamB', label: 'Half Sangam B', align: 'left' },
  { id: 'fullSangam', label: 'Full Sangam', align: 'left' },
  { id: 'singleDigit', label: 'Single Digit', align: 'left' },
  { id: 'singlePana', label: 'Single Pana', align: 'left' },
  { id: 'doublePana', label: 'Double Pana', align: 'left' },
  { id: 'triplePana', label: 'Triple Pana', align: 'left' },
];

// Mock data for demonstration
const mockMarketData = [
  { id: 1, jodiDigit: '47 = 10', halfSangamA: 0, halfSangamB: 0, fullSangam: 0, singleDigit: 0, singlePana: '680 = 10', doublePana: 0, triplePana: 0 },
  { id: 2, jodiDigit: '56 = 10', halfSangamA: 0, halfSangamB: 0, fullSangam: 0, singleDigit: 0, singlePana: 0, doublePana: 0, triplePana: 0 },
  { id: 3, jodiDigit: '74 = 15', halfSangamA: 0, halfSangamB: 0, fullSangam: 0, singleDigit: 0, singlePana: 0, doublePana: 0, triplePana: 0 },
  { id: 4, jodiDigit: '12 = 5', halfSangamA: 0, halfSangamB: 0, fullSangam: 0, singleDigit: 0, singlePana: 0, doublePana: 0, triplePana: 0 },
  { id: 5, jodiDigit: '23 = 5', halfSangamA: 0, halfSangamB: 0, fullSangam: 0, singleDigit: 0, singlePana: 0, doublePana: 0, triplePana: 0 },
  { id: 6, jodiDigit: '34 = 7', halfSangamA: 0, halfSangamB: 0, fullSangam: 0, singleDigit: 0, singlePana: 0, doublePana: 0, triplePana: 0 },
  { id: 7, jodiDigit: '45 = 9', halfSangamA: 0, halfSangamB: 0, fullSangam: 0, singleDigit: 0, singlePana: 0, doublePana: 0, triplePana: 0 },
  { id: 8, jodiDigit: '67 = 13', halfSangamA: 0, halfSangamB: 0, fullSangam: 0, singleDigit: 0, singlePana: 0, doublePana: 0, triplePana: 0 },
];

// ----------------------------------------------------------------------

export default function MarketDataListPage() {
  const { themeStretch } = useSettingsContext();

  const [tableData] = useState(mockMarketData);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedMarket, setSelectedMarket] = useState('RAJDHANI DAY');
  const [selectedMarketTime, setSelectedMarketTime] = useState('Open');

  const handleDateChange = (newValue) => {
    setSelectedDate(newValue);
  };

  const handleMarketChange = (event) => {
    setSelectedMarket(event.target.value);
  };

  const handleMarketTimeChange = (event) => {
    setSelectedMarketTime(event.target.value);
  };

  const handleGetData = () => {
    // Handle GET button click - fetch data based on filters
    console.log('Fetching data for:', {
      date: selectedDate.format('DD-MM-YYYY'),
      market: selectedMarket,
      time: selectedMarketTime,
    });
    // Add your API call here
  };

  const handleCopyToClipboard = () => {
    // Create table text representation
    let tableText = 'Market Data\n';
    tableText += `Date: ${selectedDate.format('DD-MM-YYYY')}\n`;
    tableText += `Market: ${selectedMarket}\n`;
    tableText += `Time: ${selectedMarketTime}\n\n`;
    tableText += 'Sr No.\tJodi Digit\tHalf Sangam A\tHalf Sangam B\tFull Sangam\tSingle Digit\tSingle Pana\tDouble Pana\tTriple Pana\n';
    
    tableData.forEach((row, index) => {
      tableText += `${index + 1}\t${row.jodiDigit || '—'}\t${row.halfSangamA || '0'}\t${row.halfSangamB || '0'}\t${row.fullSangam || '0'}\t${row.singleDigit || '0'}\t${row.singlePana || '0'}\t${row.doublePana || '0'}\t${row.triplePana || '0'}\n`;
    });

    // Calculate totals
    const totals = tableData.reduce(
      (acc, row) => {
        const jodiValue = row.jodiDigit ? parseInt(row.jodiDigit.split('=')[1]?.trim() || '0', 10) : 0;
        const singlePanaValue = row.singlePana ? parseInt(row.singlePana.split('=')[1]?.trim() || '0', 10) : 0;
        return {
          jodiDigit: acc.jodiDigit + jodiValue,
          singlePana: acc.singlePana + singlePanaValue,
        };
      },
      { jodiDigit: 0, singlePana: 0 }
    );

    tableText += `Total.\t${totals.jodiDigit}\t0\t0\t0\t0\t${totals.singlePana}\t0\t0\n`;

    navigator.clipboard.writeText(tableText).then(() => {
      // You can add a toast notification here
      console.log('Copied to clipboard');
    });
  };

  // Calculate totals for display
  const totals = useMemo(
    () =>
      tableData.reduce(
        (acc, row) => {
          const jodiValue = row.jodiDigit ? parseInt(row.jodiDigit.split('=')[1]?.trim() || '0', 10) : 0;
          const singlePanaValue = row.singlePana ? parseInt(row.singlePana.split('=')[1]?.trim() || '0', 10) : 0;
          return {
            jodiDigit: acc.jodiDigit + jodiValue,
            singlePana: acc.singlePana + singlePanaValue,
          };
        },
        { jodiDigit: 0, singlePana: 0 }
      ),
    [tableData]
  );

  return (
    <>
      <Helmet>
        <title> Market Data : List | Rupa999 </title>
      </Helmet>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Container maxWidth={themeStretch ? false : 'xl'}>
          <CustomBreadcrumbs
            heading={`Market Data (${selectedDate.format('DD-MM-YYYY')})`}
            links={[
              { name: 'Dashboard', href: '/' },
              { name: 'Market Data', href: '#' },
              { name: 'List', href: '#' },
            ]}
          />

          {/* Filter Section */}
          <Card sx={{ p: 3, mb: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6} md={3}>
                <DatePicker
                  label="Date"
                  format="DD-MM-YYYY"
                  value={selectedDate}
                  onChange={handleDateChange}
                  renderInput={(params) => (
                    <TextField {...params} size="small" fullWidth />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  select
                  fullWidth
                  size="small"
                  label="Market Name"
                  value={selectedMarket}
                  onChange={handleMarketChange}
                >
                  {optionsData.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  select
                  fullWidth
                  size="small"
                  label="Market Time"
                  value={selectedMarketTime}
                  onChange={handleMarketTimeChange}
                >
                  {marketTimeOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleGetData}
                  startIcon={<Iconify icon="eva:search-fill" />}
                >
                  GET
                </Button>
              </Grid>
            </Grid>
          </Card>

          {/* Table Section */}
          <Card>
            <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
              <Scrollbar>
                <Table size="small" sx={{ minWidth: 1000 }}>
                  <TableHead>
                    <TableRow>
                      {TABLE_HEAD.map((headCell) => (
                        <TableCell
                          key={headCell.id}
                          align={headCell.align}
                          sx={{ fontWeight: 'bold', bgcolor: 'background.neutral' }}
                        >
                          {headCell.label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {tableData.map((row, index) => (
                      <MarketDataTableRow key={row.id} index={index + 1} row={row} />
                    ))}

                    {/* Total Row */}
                    <TableRow sx={{ bgcolor: 'background.neutral', fontWeight: 'bold' }}>
                      <TableCell align="center">
                        <Typography variant="subtitle2" fontWeight="bold">
                          Total.
                        </Typography>
                      </TableCell>
                      <TableCell align="left">
                        <Typography variant="subtitle2" fontWeight="bold">
                          {totals.jodiDigit}
                        </Typography>
                      </TableCell>
                      <TableCell align="left">
                        <Typography variant="subtitle2" fontWeight="bold">
                          0
                        </Typography>
                      </TableCell>
                      <TableCell align="left">
                        <Typography variant="subtitle2" fontWeight="bold">
                          0
                        </Typography>
                      </TableCell>
                      <TableCell align="left">
                        <Typography variant="subtitle2" fontWeight="bold">
                          0
                        </Typography>
                      </TableCell>
                      <TableCell align="left">
                        <Typography variant="subtitle2" fontWeight="bold">
                          0
                        </Typography>
                      </TableCell>
                      <TableCell align="left">
                        <Typography variant="subtitle2" fontWeight="bold">
                          {totals.singlePana}
                        </Typography>
                      </TableCell>
                      <TableCell align="left">
                        <Typography variant="subtitle2" fontWeight="bold">
                          0
                        </Typography>
                      </TableCell>
                      <TableCell align="left">
                        <Typography variant="subtitle2" fontWeight="bold">
                          0
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Scrollbar>
            </TableContainer>

            {/* Copy to Clipboard Button */}
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                startIcon={<Iconify icon="eva:copy-fill" />}
                onClick={handleCopyToClipboard}
              >
                Copy to Clipboard
              </Button>
            </Box>
          </Card>
        </Container>
      </LocalizationProvider>
    </>
  );
}

