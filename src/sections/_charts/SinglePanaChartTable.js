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
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getMarketResultsByMarketAndGameTypeAsync } from '../../redux/services/market_result_services';

const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// Helper function to get day of week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
// We convert to Monday=0, Tuesday=1, ..., Sunday=6
const getDayOfWeek = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  return day === 0 ? 6 : day - 1; // Convert to Monday=0, Tuesday=1, ..., Sunday=6
};

// Helper function to transform day data
const transformDayData = (dayData) => {
  if (!dayData) {
    // Missing day - return placeholder
    return { top: '***', middle: '**', bottom: '***', isRed: false };
  }

  const openPana = dayData.openPana;
  const closePana = dayData.closePana;
  const openDigit = dayData.openDigit;
  const closeDigit = dayData.closeDigit;

  // Top: openPana (3-digit number, or '***' if null/undefined)
  const top = openPana !== null && openPana !== undefined ? Number(openPana) : '***';

  // Middle: openDigit (main number, or '**' if null/undefined)
  const middleOne = openDigit !== null && openDigit !== undefined ? Number(openDigit) : '**';

  const middleTwo = closeDigit !== null && closeDigit !== undefined ? Number(closeDigit) : '**';

  // Combine middleOne and middleTwo to form the middle value
  let middle;
  if (middleOne === '**' && middleTwo === '**') {
    middle = '**';
  } else if (middleOne === '**') {
    middle = middleTwo;
  } else if (middleTwo === '**') {
    middle = middleOne;
  } else {
    middle = `${middleOne}${middleTwo}`;
  }

  const bottom = closePana !== null && closePana !== undefined ? Number(closePana) : '***';

  const middleNum = typeof middle === 'string' ? middle : middle;
  const specialNumbers = ['00', '11', '22', '33', '55', '66', '77', '88', '99'];
  const isRed = typeof middleNum === 'string' && specialNumbers.includes(middleNum);

  return {
    top,
    middle,
    bottom,
    isRed,
  };
};

// Helper function to transform API data to table format
const transformDataToTableFormat = (apiData) => {
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

  // Get the Monday of the first week
  const getMonday = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    return new Date(d.setDate(diff));
  };

  const startMonday = getMonday(firstDate);
  const endMonday = getMonday(lastDate);

  // Group data into weeks
  const weeks = [];
  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Iterate through each week
  for (let weekStart = new Date(startMonday); weekStart <= endMonday; weekStart.setDate(weekStart.getDate() + 7)) {
    const weekDays = [];
    let weekHasData = false;

    // For each day of the week (Monday to Sunday)
    for (let i = 0; i < 7; i += 1) {
      const currentDate = new Date(weekStart);
      currentDate.setDate(weekStart.getDate() + i);
      const dateString = currentDate.toISOString().split('T')[0];

      const dayData = dateToDataMap.get(dateString);

      if (dayData) {
        weekHasData = true;
      }

      weekDays.push(transformDayData(dayData));
    }

    // Only add week if it has at least one day with data
    if (weekHasData) {
      // End date is always Sunday (6 days after Monday = 7 days total)
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      weeks.push({
        id: weeks.length + 1,
        dateStart: formatDate(weekStart), // Always start from Monday
        dateEnd: formatDate(weekEnd), // Always end on Sunday (7 days from Monday)
        days: weekDays,
      });
    }
  }

  return weeks;
};

const SinglePanaChartTable = ({ selectedMarket }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!selectedMarket || !selectedMarket._id) {
      // If no market selected, show empty data
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
            gameType: 'pana',
          })
        ).unwrap();

        if (result?.data) {
          const transformedData = transformDataToTableFormat(result.data);
          setData(transformedData);
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

  const cellBaseSx = {
    border: '1px solid #e0e0e0',
    padding: { xs: '2px 4px', sm: '4px 6px', md: '6px 8px' },
    textAlign: 'center',
  };

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
        p: { xs: 0.5, sm: 1, md: 2 },
        backgroundColor: 'transparent',
        width: '100%',
        overflow: 'hidden',
      }}
    >
      {error && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          py: { xs: 1, sm: 1.25, md: 1.5 },
          px: { xs: 1.5, sm: 2, md: 2.5 },
          fontWeight: 700,
          textAlign: 'center',
          color: '#fff',
          background: 'linear-gradient(135deg, #1b3153 0%, #2d4a7c 100%)',
          fontSize: { xs: '1rem', sm: '1.25rem', md: '1.375rem' },
          borderRadius: { xs: 1.5, sm: 2 },
          mb: { xs: 1.5, sm: 2 },
          letterSpacing: '0.5px',
          textTransform: 'uppercase',
          boxShadow: '0 2px 8px rgba(27, 49, 83, 0.2)',
        }}
      >
        Single Pana Chart
      </Typography>

      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          overflowX: 'auto',
          overflowY: 'auto',
          maxWidth: '100%',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
          },
          '&::-webkit-scrollbar': {
            height: { xs: '6px', sm: '8px' },
            width: { xs: '6px', sm: '8px' },
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'rgba(0, 0, 0, 0.02)',
            borderRadius: 4,
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            borderRadius: '4px',
            transition: 'background-color 0.2s ease',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.2)',
            },
          },
        }}
      >
        <Table
          aria-label="responsive table"
          size={isMobile ? 'small' : 'medium'}
          sx={{
            minWidth: { xs: '600px', sm: '800px' },
            width: '100%',
          }}
        >
          <TableHead sx={{ background: 'linear-gradient(135deg, #1b3153 0%, #2d4a7c 100%)', position: 'sticky', top: 0, zIndex: 10 }}>
            <TableRow>
              <TableCell
                sx={{
                  ...cellBaseSx,
                  width: { xs: '100px', sm: '120px', md: '140px' },
                  minWidth: { xs: '100px', sm: '120px', md: '140px' },
                  fontWeight: 700,
                  fontSize: { xs: '0.6875rem', sm: '0.8125rem', md: '0.875rem' },
                  whiteSpace: 'nowrap',
                  color: '#fff !important',
                  background: 'linear-gradient(135deg, #1b3153 0%, #2d4a7c 100%) !important',
                  position: 'sticky',
                  left: 0,
                  zIndex: 11,
                  boxShadow: '2px 0 4px rgba(0,0,0,0.15)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  borderRight: '1px solid rgba(255,255,255,0.2)',
                }}
              >
                Date Range
              </TableCell>
              {dayNames.map((day) => (
                <TableCell
                  key={day}
                  sx={{
                    ...cellBaseSx,
                    minWidth: { xs: '80px', sm: '100px', md: '110px' },
                    width: { xs: '80px', sm: '100px', md: '110px' },
                    fontWeight: 700,
                    fontSize: { xs: '0.6875rem', sm: '0.75rem', md: '0.875rem' },
                    whiteSpace: 'nowrap',
                    color: '#fff !important',
                    background: 'linear-gradient(135deg, #1b3153 0%, #2d4a7c 100%) !important',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    borderRight: '1px solid rgba(255,255,255,0.2)',
                    '&:last-of-type': {
                      borderRight: 'none',
                    },
                  }}
                >
                  {day}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {data.map((item, index) => (
              <TableRow
                key={item.id}
                sx={{
                  '&:hover': {
                    backgroundColor: 'rgba(27, 49, 83, 0.03)',
                    transition: 'background-color 0.2s ease',
                  },
                  '&:nth-of-type(even)': {
                    backgroundColor: 'rgba(0, 0, 0, 0.02)',
                  },
                }}
              >
                <TableCell
                  sx={{
                    ...cellBaseSx,
                    verticalAlign: 'center',
                    fontSize: { xs: '0.625rem', sm: '0.6875rem', md: '0.75rem' },
                    backgroundColor: 'rgba(0, 0, 0, 0.02)',
                    position: 'sticky',
                    left: 0,
                    zIndex: 5,
                    boxShadow: '2px 0 4px rgba(0,0,0,0.08)',
                    minWidth: { xs: '100px', sm: '120px', md: '140px' },
                    width: { xs: '100px', sm: '120px', md: '140px' },
                    fontWeight: 500,
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: { xs: 0.1, sm: 0.2 },
                    }}
                  >
                    <Typography sx={{
                      fontSize: { xs: '0.55rem', sm: '0.65rem', md: '0.75rem' },
                      lineHeight: 1.2,
                    }}>
                      {item.dateStart}
                    </Typography>
                    <Typography sx={{
                      fontWeight: 'bold',
                      my: '1px',
                      fontSize: { xs: '0.5rem', sm: '0.6rem', md: '0.7rem' },
                      lineHeight: 1,
                    }}>
                      -
                    </Typography>
                    <Typography sx={{
                      fontSize: { xs: '0.55rem', sm: '0.65rem', md: '0.75rem' },
                      lineHeight: 1.2,
                    }}>
                      {item.dateEnd}
                    </Typography>
                  </Box>
                </TableCell>

                {item.days.map((dayData, i) => {
                  // Convert top and bottom to string and split into digits/characters
                  const topStr = String(dayData.top);
                  const bottomStr = String(dayData.bottom);
                  const topDigits = topStr.split('').slice(0, 3);
                  const bottomDigits = bottomStr.split('').slice(0, 3);

                  // Pad arrays to ensure 3 items for consistent layout
                  while (topDigits.length < 3) topDigits.push('');
                  while (bottomDigits.length < 3) bottomDigits.push('');

                  return (
                    <TableCell
                      key={i}
                      sx={{
                        ...cellBaseSx,
                        fontSize: { xs: '0.5rem', sm: '0.65rem', md: '0.75rem' },
                        verticalAlign: 'center',
                        position: 'relative',
                        minWidth: { xs: '80px', sm: '100px', md: '120px' },
                        width: { xs: '80px', sm: '100px', md: '120px' },
                        minHeight: { xs: '60px', sm: '75px', md: '90px' },
                        padding: { xs: '2px 4px', sm: '4px 6px', md: '6px 8px' },
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: { xs: 0.25, sm: 0.5, md: 0.75 },
                          py: { xs: 0.25, sm: 0.5, md: 0.75 },
                          height: '100%',
                          width: '100%',
                          minHeight: { xs: '56px', sm: '67px', md: '78px' },
                        }}
                      >
                        {/* Left side - Top digits stacked vertically */}
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: { xs: 0.1, sm: 0.15, md: 0.2 },
                            flex: '0 0 auto',
                            minWidth: { xs: '16px', sm: '20px', md: '24px' },
                            width: { xs: '16px', sm: '20px', md: '24px' },
                          }}
                        >
                          {topDigits.map((digit, idx) => (
                            <Typography
                              key={idx}
                              sx={{
                                fontSize: { xs: '0.6rem', sm: '0.75rem', md: '0.9rem' },
                                fontWeight: '700',
                                color: digit ? '#666' : 'transparent',
                                lineHeight: 1,
                                minHeight: { xs: '12px', sm: '15px', md: '18px' },
                                height: { xs: '12px', sm: '15px', md: '18px' },
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '100%',
                              }}
                            >
                              {digit || ' '}
                            </Typography>
                          ))}
                        </Box>

                        {/* Center - Middle number (large) */}
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flex: '1 1 auto',
                            minWidth: 0,
                            maxWidth: '100%',
                            position: 'relative',
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: { xs: '1.125rem', sm: '1.5rem', md: '1.875rem' },
                              fontWeight: 900,
                              color: dayData.isRed ? '#dc2626' : '#111827',
                              lineHeight: 1,
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              maxWidth: '100%',
                              textShadow: dayData.isRed ? '0 1px 2px rgba(220, 38, 38, 0.2)' : 'none',
                            }}
                          >
                            {dayData.middle}
                          </Typography>
                        </Box>

                        {/* Right side - Bottom digits stacked vertically */}
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: { xs: 0.1, sm: 0.15, md: 0.2 },
                            flex: '0 0 auto',
                            minWidth: { xs: '16px', sm: '20px', md: '24px' },
                            width: { xs: '16px', sm: '20px', md: '24px' },
                          }}
                        >
                          {bottomDigits.map((digit, idx) => (
                            <Typography
                              key={idx}
                              sx={{
                                fontSize: { xs: '0.6rem', sm: '0.75rem', md: '0.9rem' },
                                fontWeight: '700',
                                color: digit ? '#666' : 'transparent',
                                lineHeight: 1,
                                minHeight: { xs: '12px', sm: '15px', md: '18px' },
                                height: { xs: '12px', sm: '15px', md: '18px' },
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '100%',
                              }}
                            >
                              {digit || ' '}
                            </Typography>
                          ))}
                        </Box>
                      </Box>
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

SinglePanaChartTable.propTypes = {
  selectedMarket: PropTypes.object,
};

export default SinglePanaChartTable;
