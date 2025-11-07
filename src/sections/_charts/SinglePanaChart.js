/* eslint-disable no-nested-ternary */
import React from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  useMediaQuery,
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';

// Scrollbar styling
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  '&::-webkit-scrollbar': {
    height: 6,
    backgroundColor: 'transparent',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
  },
}));

const renderSubGrid = (grid, failureCoords = [], isMobile) => {
  const rows = ['top', 'middle', 'bottom'];

  return (
    <Box display="flex" flexDirection="column" gap={isMobile ? 0.2 : 0.4}>
      {rows.map((rKey) => (
        <Box key={rKey} display="flex" justifyContent="space-between" width="100%">
          {grid[rKey].map((num, idx) => {
            const isFailed = failureCoords.some((f) => f.row === rKey && f.index === idx);
            return (
              <Typography
                key={idx}
                variant="body2"
                sx={{
                  flex: 1,
                  textAlign: 'center',
                  color: isFailed ? 'error.main' : 'white',
                  fontWeight: 600,
                  fontSize: isMobile ? '0.7rem' : '0.85rem',
                }}
              >
                {num}
              </Typography>
            );
          })}
        </Box>
      ))}
    </Box>
  );
};

export default function MarketResultsChart() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        bgcolor: '#0f172a',
        color: 'white',
        p: { xs: 0.5, sm: 1.5 },
        borderRadius: 2,
      }}
    >
      <Typography
        variant={isMobile ? 'subtitle1' : 'h6'}
        align="center"
        sx={{
          fontWeight: 700,
          mb: isMobile ? 1 : 2,
          color: 'white',
        }}
      >
        Single Pana Results Chart
      </Typography>

      <StyledTableContainer
        component={Paper}
        sx={{
        //   backgroundColor: '#1e293b',
          borderRadius: 2,
          overflowX: 'auto',
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell
                align="center"
                sx={{
                  backgroundColor: '#f5f6fa',
                  fontWeight: 600,
                  borderRight: '1px solid #e0e0e0',
                  fontSize: isMobile ? '0.7rem' : '0.9rem',
                  p: isMobile ? 0.5 : 1,
                }}
              >
                Date Range
              </TableCell>
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                <TableCell
                  key={day}
                  align="center"
                  sx={{
                    backgroundColor: '#f5f6fa',
                    fontWeight: 600,
                    borderRight: '1px solid #e0e0e0',
                    fontSize: isMobile ? '0.7rem' : '0.9rem',
                    p: isMobile ? 0.5 : 1,
                  }}
                >
                  {day}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {weeksData.map((week, index) => (
              <TableRow key={index}>
                <TableCell
                  align="center"
                  sx={{
                    fontWeight: 500,
                    color: '#e2e8f0',
                    fontSize: isMobile ? '0.7rem' : '0.9rem',
                    borderRight: '1px solid #334155',
                    borderBottom: '1px solid #334155',
                    p: isMobile ? 0.6 : 1,
                    minWidth: isMobile ? 100 : 140,
                    backgroundColor: '#1b3153ff',
                  }}
                >
                  {week.range}
                </TableCell>

                {week.days.map((day, dIdx) => (
                  <TableCell
                    key={dIdx}
                    sx={{
                      textAlign: 'center',
                      height: isMobile ? 60 : 90,
                      minWidth: isMobile ? 70 : 100,
                      borderRight: dIdx !== week.days.length - 1 ? '1px solid #334155' : 'none',
                      borderBottom: '1px solid #334155',
                      backgroundColor: '#1b3153ff',
                      p: isMobile ? 0.5 : 1,
                    }}
                  >
                    {renderSubGrid(day.grid, day.failureCoords, isMobile)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </StyledTableContainer>
    </Box>
  );
}

const weeksData = [
  {
    range: '02/01/2023 to 08/01/2023',
    days: [
      {
        name: 'Mon',
        grid: { top: ['3', '', '5'], middle: ['8', '00', '6'], bottom: ['9', '', '9'] },
        failureCoords: [{ row: 'middle', index: 1 }],
      },
      {
        name: 'Tue',
        grid: { top: ['7', '', '2'], middle: ['4', '88', '5'], bottom: ['6', '', '8'] },
        failureCoords: [{ row: 'middle', index: 1 }],
      },
      {
        name: 'Wed',
        grid: { top: ['1', '', '4'], middle: ['9', '09', '7'], bottom: ['8', '', '3'] },
        failureCoords: [{ row: 'middle', index: 1 }],
      },
      {
        name: 'Thu',
        grid: { top: ['4', '', '9'], middle: ['2', '77', '5'], bottom: ['1', '', '3'] },
        failureCoords: [{ row: 'middle', index: 1 }],
      },
      {
        name: 'Fri',
        grid: { top: ['9', '', '8'], middle: ['3', '65', '4'], bottom: ['2', '', '1'] },
        failureCoords: [{ row: 'middle', index: 1 }],
      },
      {
        name: 'Sat',
        grid: { top: ['8', '', '5'], middle: ['1', '00', '3'], bottom: ['1', '', '2'] },
        failureCoords: [{ row: 'middle', index: 1 }],
      },
      {
        name: 'Sun',
        grid: { top: ['9', '', '5'], middle: ['3', '45', '1'], bottom: ['6', '', '4'] },
        failureCoords: [{ row: 'middle', index: 1 }],
      },
    ],
  },
  {
    range: '09/01/2023 to 15/01/2023',
    days: [
      {
        name: 'Mon',
        grid: { top: ['6', '', '8'], middle: ['4', '51', '2'], bottom: ['9', '', '7'] },
        failureCoords: [{ row: 'middle', index: 1 }],
      },
      {
        name: 'Tue',
        grid: { top: ['2', '', '3'], middle: ['7', '44', '6'], bottom: ['5', '', '1'] },
        failureCoords: [{ row: 'middle', index: 1 }],
      },
      {
        name: 'Wed',
        grid: { top: ['1', '', '5'], middle: ['8', '99', '4'], bottom: ['2', '', '7'] },
        failureCoords: [{ row: 'middle', index: 1 }],
      },
      {
        name: 'Thu',
        grid: { top: ['9', '', '2'], middle: ['4', '28', '6'], bottom: ['3', '', '8'] },
        failureCoords: [{ row: 'middle', index: 1 }],
      },
      {
        name: 'Fri',
        grid: { top: ['5', '', '3'], middle: ['6', '75', '8'], bottom: ['7', '', '9'] },
        failureCoords: [{ row: 'middle', index: 1 }],
      },
      {
        name: 'Sat',
        grid: { top: ['8', '', '7'], middle: ['3', '91', '4'], bottom: ['6', '', '5'] },
        failureCoords: [{ row: 'middle', index: 1 }],
      },
      {
        name: 'Sun',
        grid: { top: ['4', '', '6'], middle: ['9', '73', '1'], bottom: ['5', '', '9'] },
        failureCoords: [{ row: 'middle', index: 1 }],
      },
    ],
  },
  {
    range: '16/01/2023 to 22/01/2023',
    days: [
      {
        name: 'Mon',
        grid: { top: ['7', '', '8'], middle: ['4', '99', '6'], bottom: ['5', '', '4'] },
        failureCoords: [{ row: 'middle', index: 1 }],
      },
      {
        name: 'Tue',
        grid: { top: ['8', '', '3'], middle: ['6', '57', '1'], bottom: ['7', '', '8'] },
        failureCoords: [{ row: 'middle', index: 1 }],
      },
      {
        name: 'Wed',
        grid: { top: ['2', '', '9'], middle: ['7', '84', '5'], bottom: ['4', '', '6'] },
        failureCoords: [{ row: 'middle', index: 1 }],
      },
      {
        name: 'Thu',
        grid: { top: ['6', '', '4'], middle: ['1', '75', '2'], bottom: ['9', '', '5'] },
        failureCoords: [{ row: 'middle', index: 1 }],
      },
      {
        name: 'Fri',
        grid: { top: ['3', '', '8'], middle: ['5', '71', '6'], bottom: ['4', '', '8'] },
        failureCoords: [{ row: 'middle', index: 1 }],
      },
      {
        name: 'Sat',
        grid: { top: ['5', '', '4'], middle: ['8', '91', '7'], bottom: ['2', '', '9'] },
        failureCoords: [{ row: 'middle', index: 1 }],
      },
      {
        name: 'Sun',
        grid: { top: ['9', '', '2'], middle: ['6', '44', '3'], bottom: ['7', '', '1'] },
        failureCoords: [{ row: 'middle', index: 1 }],
      },
    ],
  },
  {
    range: '23/01/2023 to 29/01/2023',
    days: [
      {
        name: 'Mon',
        grid: { top: ['5', '', '7'], middle: ['9', '61', '1'], bottom: ['6', '', '4'] },
        failureCoords: [{ row: 'middle', index: 1 }],
      },
      {
        name: 'Tue',
        grid: { top: ['3', '', '4'], middle: ['8', '52', '9'], bottom: ['7', '', '5'] },
        failureCoords: [{ row: 'middle', index: 1 }],
      },
      {
        name: 'Wed',
        grid: { top: ['9', '', '6'], middle: ['4', '99', '8'], bottom: ['5', '', '3'] },
        failureCoords: [{ row: 'middle', index: 1 }],
      },
      {
        name: 'Thu',
        grid: { top: ['7', '', '3'], middle: ['5', '11', '6'], bottom: ['9', '', '7'] },
        failureCoords: [{ row: 'middle', index: 1 }],
      },
      {
        name: 'Fri',
        grid: { top: ['1', '', '8'], middle: ['6', '75', '4'], bottom: ['3', '', '9'] },
        failureCoords: [{ row: 'middle', index: 1 }],
      },
      {
        name: 'Sat',
        grid: { top: ['4', '', '5'], middle: ['7', '93', '2'], bottom: ['1', '', '8'] },
        failureCoords: [{ row: 'middle', index: 1 }],
      },
      {
        name: 'Sun',
        grid: { top: ['6', '', '1'], middle: ['9', '81', '3'], bottom: ['8', '', '9'] },
        failureCoords: [{ row: 'middle', index: 1 }],
      },
    ],
  },
];
