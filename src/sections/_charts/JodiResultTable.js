/* eslint-disable no-nested-ternary */
import {
  Alert,
  Box,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getMarketResultsByMarketAndGameTypeAsync } from '../../redux/services/market_result_services';

JodiResultTable.propTypes = {
  selectedMarket: PropTypes.object,
};

// ===== Styled Components =====
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  border: '1px solid #e0e0e0', // light grey like your previous table
  textAlign: 'center',
  padding: '6px 4px',
  fontSize: '0.9rem',
  fontWeight: 500,
  color: '#111827', // dark grey for readability
  userSelect: 'none',
  [theme.breakpoints.down('sm')]: {
    padding: '4px 2px',
    fontSize: '0.7rem',
  },
}));

const StyledHeaderCell = styled(StyledTableCell)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '0.9375rem',
  minWidth: '30px',
  color: '#fff !important',
  background: 'linear-gradient(135deg, #1b3153 0%, #2d4a7c 100%) !important',
  position: 'sticky',
  top: 0,
  zIndex: 2,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  borderRight: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.2)'}`,
  '&:last-of-type': {
    borderRight: 'none',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.8125rem',
    padding: '8px 4px',
  },
}));

const StyledTableRow = styled(TableRow)(() => ({
  '&:hover': {
    backgroundColor: '#f9fafb',
    transition: 'background-color 0.2s ease-in-out',
  },
}));

const ScrollContainer = styled(TableContainer)(({ theme }) => ({
  maxHeight: 600,
  overflowX: 'auto',
  overflowY: 'auto',
  scrollBehavior: 'smooth',
  '&::-webkit-scrollbar': {
    height: 8,
    width: 8,
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
    borderRadius: 4,
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 4,
    transition: 'background-color 0.2s ease',
  },
  '&:hover::-webkit-scrollbar-thumb': {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  '&::-webkit-scrollbar-thumb:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
}));

// Helper function to get Monday of a week
const getMonday = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  return new Date(d.setDate(diff));
};

// Helper function to transform API data to table format for Jodi
const transformJodiDataToTableFormat = (apiData) => {
  if (!apiData || apiData.length === 0) return [];

  // API already returns data sorted by date ascending, but ensure it's sorted correctly
  const sortedData = [...apiData].sort((a, b) => new Date(a.date) - new Date(b.date));

  // Create a map of date to data
  const dateToDataMap = new Map();
  sortedData.forEach((item) => {
    dateToDataMap.set(item.date, item);
  });

  // Find the date range
  const firstDate = new Date(sortedData[0].date);
  const lastDate = new Date(sortedData[sortedData.length - 1].date);

  const startMonday = getMonday(firstDate);
  const endMonday = getMonday(lastDate);

  // Group data into weeks
  const weeks = [];
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Iterate through each week
  for (let weekStart = new Date(startMonday); weekStart <= endMonday; weekStart.setDate(weekStart.getDate() + 7)) {
    const weekRow = {};
    let weekHasData = false;

    // For each day of the week (Monday to Sunday)
    for (let i = 0; i < 7; i += 1) {
      const currentDate = new Date(weekStart);
      currentDate.setDate(weekStart.getDate() + i);
      const dateString = currentDate.toISOString().split('T')[0];

      const dayData = dateToDataMap.get(dateString);
      const dayName = dayNames[i];

      if (dayData) {
        weekHasData = true;
        const openDigit = dayData.openDigit;
        const closeDigit = dayData.closeDigit;

        const middleOne = openDigit !== null && openDigit !== undefined ? Number(openDigit) : '**';

        const middleTwo = closeDigit !== null && closeDigit !== undefined ? Number(closeDigit) : '**';

        let jodiValue;
        if (middleOne === '**' && middleTwo === '**') {
          jodiValue = '**';
        } else if (middleOne === '**') {
          jodiValue = middleTwo;
        } else if (middleTwo === '**') {
          jodiValue = middleOne;
        } else {
          jodiValue = `${middleOne}${middleTwo}`;
        }
        weekRow[dayName] = typeof jodiValue === 'string' ? jodiValue : Number(jodiValue);
      } else {
        // Missing day - show '**'
        weekRow[dayName] = '**';
      }
    }

    // Only add week if it has at least one day with data
    if (weekHasData) {
      weeks.push(weekRow);
    }
  }

  return weeks;
};

// ===== Component =====
export default function JodiResultTable({ selectedMarket }) {
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!selectedMarket || !selectedMarket._id) {
      setData([]);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await dispatch(
          getMarketResultsByMarketAndGameTypeAsync({
            marketsId: selectedMarket._id,
            gameType: 'jodi',
          })
        ).unwrap();

        if (result?.data) {
          const transformedData = transformJodiDataToTableFormat(result.data);
          setData(transformedData.length > 0 ? transformedData : []);
        } else {
          setData([]);
        }
      } catch (err) {
        console.error('Error fetching market results:', err);
        setError(err?.message || 'Failed to fetch market results');
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch, selectedMarket]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        width: '100%',
        overflowX: 'auto',
        px: { xs: 0.5, sm: 2, md: 3 },
        backgroundColor: 'transparent',
        py: { xs: 1, sm: 2 },
      }}
    >
      {error && (
        <Alert severity="warning" sx={{ mb: 2, width: '100%' }}>
          {error}
        </Alert>
      )}
      <Paper
        elevation={0}
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          margin: 'auto',
          width: '100%',
          maxWidth: 1000,
          borderRadius: 2,
          overflow: 'hidden',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          '&:hover': {
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
            transform: 'translateY(-2px)',
          },
        }}
      >
        <Typography
          variant="h6"
          fontWeight={700}
          textAlign="center"
          sx={{
            py: { xs: 1, sm: 1.25 },
            px: { xs: 1.5, sm: 2 },
            background: 'linear-gradient(135deg, #1b3153 0%, #2d4a7c 100%)',
            color: '#fff',
            fontSize: { xs: '1rem', sm: '1.25rem', md: '1.375rem' },
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            boxShadow: '0 2px 8px rgba(27, 49, 83, 0.2)',
          }}
        >
          Jodi Chart
        </Typography>

        {data.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: { xs: 200, sm: 250, md: 300 },
              py: { xs: 4, sm: 5, md: 6 },
              px: { xs: 2, sm: 3 },
            }}
          >
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: '0.875rem', sm: '1rem', md: '1.125rem' },
                fontWeight: 500,
                color: 'text.secondary',
                textAlign: 'center',
              }}
            >
              No Data Available
            </Typography>
          </Box>
        ) : (
          <ScrollContainer>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                    <StyledHeaderCell key={day}>{day}</StyledHeaderCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {data.map((row, i) => (
                  <StyledTableRow
                    key={i}
                    sx={{
                      '&:nth-of-type(even)': {
                        backgroundColor: 'rgba(0, 0, 0, 0.02)',
                      },
                    }}
                  >
                    {Object.entries(row).map(([key, value]) => {
                      const isSpecial = ['00', '11', '22', '33', '55', '66', '77', '88', '99'].includes(value);
                      return (
                        <StyledTableCell
                          key={key}
                          sx={{
                            color:
                              value === '**'
                                ? 'text.secondary'
                                : isSpecial
                                  ? '#dc2626'
                                  : 'text.primary',
                            fontWeight: isSpecial ? 700 : 500,
                            fontSize: { xs: '0.75rem', sm: '0.875rem', md: '0.9375rem' },
                            position: 'relative',
                            '&::after': isSpecial
                              ? {
                                content: '""',
                                position: 'absolute',
                                bottom: 0,
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: '60%',
                                height: '2px',
                                backgroundColor: '#dc2626',
                                opacity: 0.3,
                              }
                              : {},
                          }}
                        >
                          {value}
                        </StyledTableCell>
                      );
                    })}
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollContainer>
        )}
      </Paper>
    </Box>
  );
}
