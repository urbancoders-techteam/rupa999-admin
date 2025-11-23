import React from 'react';
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Box,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';

const data = [
  {
    id: 1,
    dateStart: '03/11/2025',
    dateEnd: '09/11/2025',
    days: [
      { top: 150, middle: 62, bottom: 570, isRed: false },
      { top: 356, middle: 40, bottom: 370, isRed: false },
      { top: 169, middle: 66, bottom: 259, isRed: true },
      { top: 350, middle: 81, bottom: 236, isRed: false },
      { top: 338, middle: 41, bottom: 290, isRed: false },
      { top: 589, middle: '2 *', bottom: '***', isRed: false },
      { top: '***', middle: '**', bottom: 360, isRed: false },
    ],
  },
  {
    id: 2,
    dateStart: '27/10/2025',
    dateEnd: '02/11/2025',
    days: [
      { top: 189, middle: 89, bottom: 450, isRed: false },
      { top: 160, middle: 77, bottom: 890, isRed: true },
      { top: 267, middle: 51, bottom: 344, isRed: false },
      { top: 168, middle: 52, bottom: 138, isRed: false },
      { top: 125, middle: 84, bottom: 167, isRed: false },
      { top: 345, middle: 20, bottom: 145, isRed: false },
      { top: 360, middle: 92, bottom: 129, isRed: false },
    ],
  },
  {
    id: 3,
    dateStart: '13/10/2025',
    dateEnd: '19/10/2025',
    days: [
      { top: 448, middle: 69, bottom: 469, isRed: false },
      { top: 126, middle: 92, bottom: 679, isRed: false },
      { top: 178, middle: 64, bottom: 158, isRed: false },
      { top: 350, middle: 86, bottom: 123, isRed: false },
      { top: 146, middle: 16, bottom: 790, isRed: false },
      { top: 260, middle: 85, bottom: 258, isRed: false },
      { top: 570, middle: 22, bottom: 147, isRed: true },
    ],
  },
  {
    id: 4,
    dateStart: '06/10/2025',
    dateEnd: '12/10/2025',
    days: [
      { top: 670, middle: 33, bottom: 139, isRed: true },
      { top: 256, middle: 31, bottom: 489, isRed: false },
      { top: 236, middle: 15, bottom: 249, isRed: false },
      { top: 338, middle: 40, bottom: 668, isRed: false },
      { top: 468, middle: 87, bottom: 250, isRed: false },
      { top: 126, middle: 91, bottom: 227, isRed: false },
      { top: 178, middle: 67, bottom: 368, isRed: false },
    ],
  },
  {
    id: 5,
    dateStart: '29/09/2025',
    dateEnd: '05/10/2025',
    days: [
      { top: 566, middle: 76, bottom: 169, isRed: false },
      { top: 780, middle: 54, bottom: 699, isRed: false },
      { top: 567, middle: 89, bottom: 559, isRed: false },
      { top: 380, middle: 15, bottom: 348, isRed: false },
      { top: 469, middle: 96, bottom: 259, isRed: false },
      { top: 157, middle: 32, bottom: 237, isRed: false },
      { top: 235, middle: 8, bottom: 364, isRed: false },
    ],
  },
  {
    id: 5,
    dateStart: '29/09/2025',
    dateEnd: '05/10/2025',
    days: [
      { top: 566, middle: 76, bottom: 169, isRed: false },
      { top: 780, middle: 54, bottom: 699, isRed: false },
      { top: 567, middle: 89, bottom: 559, isRed: false },
      { top: 380, middle: 15, bottom: 348, isRed: false },
      { top: 469, middle: 96, bottom: 259, isRed: false },
      { top: 157, middle: 32, bottom: 237, isRed: false },
      { top: 235, middle: 8, bottom: 364, isRed: false },
    ],
  },
];

const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const SinglePanaChartTable = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const cellBaseSx = {
    border: '1px solid #e0e0e0',
    padding: { xs: '2px 4px', sm: '4px 6px', md: '6px 8px' },
    textAlign: 'center',
  };

  return (
    <Box 
      sx={{ 
        p: { xs: 0.5, sm: 1, md: 2 }, 
        backgroundColor: '#f9fafb', 
        minHeight: '100vh',
        width: '100%',
        overflow: 'hidden',
      }}
    >
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          py: { xs: 0.5, sm: 0.75, md: 1 },
          px: { xs: 1, sm: 2 },
          fontWeight: 'bold',
          textAlign: 'center',
          color: '#fff',
          backgroundColor: '#1b3153ff',
          fontSize: { xs: '0.875rem', sm: '1.1rem', md: '1.25rem' },
          borderRadius: { xs: 1, sm: 2 },
          mb: { xs: 1, sm: 2 },
        }}
      >
        Single Pana Chart
      </Typography>

      <TableContainer 
        component={Paper} 
        sx={{ 
          boxShadow: 3, 
          overflowX: 'auto',
          overflowY: 'auto',
          maxWidth: '100%',
          '&::-webkit-scrollbar': {
            height: { xs: '4px', sm: '6px' },
            width: { xs: '4px', sm: '6px' },
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: '#f1f1f1',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#888',
            borderRadius: '3px',
            '&:hover': {
              backgroundColor: '#555',
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
          <TableHead sx={{ backgroundColor: '#f3f4f6', position: 'sticky', top: 0, zIndex: 10 }}>
            <TableRow>
              <TableCell
                sx={{
                  ...cellBaseSx,
                  width: { xs: '100px', sm: '120px', md: '140px' },
                  minWidth: { xs: '100px', sm: '120px', md: '140px' },
                  fontWeight: 'medium',
                  fontSize: { xs: '0.6rem', sm: '0.75rem', md: '0.875rem' },
                  whiteSpace: 'nowrap',
                  backgroundColor: '#f3f4f6',
                  position: 'sticky',
                  left: 0,
                  zIndex: 11,
                  boxShadow: '2px 0 4px rgba(0,0,0,0.1)',
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
                    fontWeight: 'medium',
                    fontSize: { xs: '0.6rem', sm: '0.7rem', md: '0.875rem' },
                    whiteSpace: 'nowrap',
                    backgroundColor: '#f3f4f6',
                  }}
                >
                  {day}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id} sx={{ '&:hover': { backgroundColor: '#f9fafb' } }}>
                <TableCell
                  sx={{
                    ...cellBaseSx,
                    verticalAlign: 'center',
                    fontSize: { xs: '0.6rem', sm: '0.7rem', md: '0.75rem' },
                    backgroundColor: '#f9fafb',
                    position: 'sticky',
                    left: 0,
                    zIndex: 5,
                    boxShadow: '2px 0 4px rgba(0,0,0,0.1)',
                    minWidth: { xs: '100px', sm: '120px', md: '140px' },
                    width: { xs: '100px', sm: '120px', md: '140px' },
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
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: { xs: '1rem', sm: '1.4rem', md: '1.8rem' },
                              fontWeight: '900',
                              color: dayData.isRed ? '#dc2626' : '#111827',
                              lineHeight: 1,
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              maxWidth: '100%',
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

export default SinglePanaChartTable;
