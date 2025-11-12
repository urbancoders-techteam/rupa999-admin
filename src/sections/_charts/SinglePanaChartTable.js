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
  const cellBaseSx = {
    border: '1px solid #e0e0e0',
    padding: { xs: '2px 4px', sm: '4px 8px' }, // Responsive padding
    textAlign: 'center',
  };

  return (
    <Box sx={{ p: { xs: 1, sm: 2 }, backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          py: { xs: 0.5, sm: 1 },
          fontWeight: 'bold',
          textAlign: 'center',
          color: '#fff',
          backgroundColor: '#1b3153ff',
          fontSize: { xs: '0.9rem', sm: '1.25rem' },
          borderRadius: 2,
        }}
      >
        Single Pana Chart
      </Typography>

      <TableContainer component={Paper} sx={{ boxShadow: 3, overflowX: 'auto' }}>
        <Table aria-label="responsive table" size="small">
          <TableHead sx={{ backgroundColor: '#f3f4f6' }}>
            <TableRow>
              <TableCell
                sx={{
                  ...cellBaseSx,
                  width: '12%',
                  fontWeight: 'medium',
                  fontSize: { xs: '0.65rem', sm: '0.875rem' },
                  whiteSpace: 'nowrap',
                }}
              >
                Date Range
              </TableCell>
              {dayNames.map((day) => (
                <TableCell
                  key={day}
                  sx={{
                    ...cellBaseSx,
                    width: '11%',
                    fontWeight: 'medium',
                    fontSize: { xs: '0.65rem', sm: '0.875rem' },
                    whiteSpace: 'nowrap',
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
                    fontSize: { xs: '0.65rem', sm: '0.75rem' },
                    backgroundColor: '#f9fafb',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: 0.2,
                    }}
                  >
                    <Typography sx={{ fontSize: { xs: '0.65rem', sm: '0.8rem' } }}>
                      {item.dateStart}
                    </Typography>
                    <Typography sx={{ fontWeight: 'bold', my: '1px', fontSize: '0.7rem' }}>
                      -
                    </Typography>
                    <Typography sx={{ fontSize: { xs: '0.65rem', sm: '0.8rem' } }}>
                      {item.dateEnd}
                    </Typography>
                  </Box>
                </TableCell>

                {item.days.map((dayData, i) => (
                  <TableCell
                    key={i}
                    sx={{
                      ...cellBaseSx,
                      fontSize: { xs: '0.6rem', sm: '0.75rem' },
                      verticalAlign: 'center',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: { xs: '2px', sm: '4px' },
                        py: { xs: 0.5, sm: 1 },
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{ color: '#374151', fontSize: { xs: '0.6rem', sm: '0.7rem' } }}
                      >
                        {dayData.top}
                      </Typography>

                      <Typography
                        variant="h5"
                        sx={{
                          fontSize: { xs: '1rem', sm: '1.5rem' },
                          fontWeight: '800',
                          color: dayData.isRed ? '#dc2626' : '#111827',
                        }}
                      >
                        {dayData.middle}
                      </Typography>

                      <Typography
                        variant="caption"
                        sx={{ color: '#6b7280', fontSize: { xs: '0.6rem', sm: '0.7rem' } }}
                      >
                        {dayData.bottom}
                      </Typography>
                    </Box>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default SinglePanaChartTable;
