/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  useTheme,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';

// ===== Styled Components =====
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  border: '1px solid #1a1a1a',
  textAlign: 'center',
  padding: '6px 4px',
  fontSize: '0.95rem',
  fontWeight: 500,
  color: '#000',
  userSelect: 'none',
  [theme.breakpoints.down('sm')]: {
    padding: '4px 2px',
    fontSize: '0.75rem',
  },
}));

const StyledHeaderCell = styled(StyledTableCell)(({ theme }) => ({
  fontWeight: 600,
  fontSize: '1rem',
  color: '#fff',
  backgroundColor: '#1b3153ff !important', // 👈 ensure it overrides stickyHeader
  position: 'sticky',
  top: 0, // 👈 necessary for sticky headers to stay visible
  zIndex: 2, // 👈 ensures it's above table rows
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.8rem',
  },
}));


const StyledTableRow = styled(TableRow)(() => ({
  '&:hover': {
    backgroundColor: '#fafafa',
    transition: 'background-color 0.2s ease-in-out',
  },
}));

const ScrollContainer = styled(TableContainer)(() => ({
  maxHeight: 500,
  overflowX: 'auto',
  overflowY: 'auto',
  scrollBehavior: 'smooth',
  '&::-webkit-scrollbar': {
    height: 6,
    width: 6,
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: 'transparent',
    borderRadius: 6,
  },
  '&:hover::-webkit-scrollbar-thumb': {
    backgroundColor: '#bdbdbd',
  },
  '&::-webkit-scrollbar-thumb:hover': {
    backgroundColor: '#999',
  },
}));

// ===== Component =====
export default function JodiResultTable() {
  const theme = useTheme();
  const [data, setData] = useState([]);

  useEffect(() => {
    const dummyData = [
      { Mon: 62, Tue: 40, Wed: 66, Thu: 81, Fri: 41, Sat: '**', Sun: '**' },
      { Mon: 89, Tue: 77, Wed: 51, Thu: 52, Fri: 84, Sat: 20, Sun: 92 },
      { Mon: 69, Tue: 92, Wed: 64, Thu: 86, Fri: 16, Sat: 85, Sun: 22 },
      { Mon: 33, Tue: 31, Wed: 15, Thu: 40, Fri: 87, Sat: 91, Sun: 67 },
      { Mon: 76, Tue: 54, Wed: 89, Thu: 15, Fri: 96, Sat: 32, Sun: 8 },
      { Mon: 48, Tue: 33, Wed: 78, Thu: 93, Fri: 70, Sat: 89, Sun: 99 },
      { Mon: 53, Tue: 65, Wed: 4, Thu: 51, Fri: 54, Sat: 17, Sun: 67 },
      { Mon: 53, Tue: 71, Wed: 32, Thu: 89, Fri: 42, Sat: 22, Sun: 60 },
      { Mon: 42, Tue: 23, Wed: 32, Thu: 24, Fri: 83, Sat: 49, Sun: 51 },
      { Mon: 65, Tue: 6, Wed: 54, Thu: 19, Fri: 55, Sat: 34, Sun: 92 },
      { Mon: 37, Tue: 4, Wed: 11, Thu: 25, Fri: 54, Sat: 88, Sun: 34 },
      { Mon: 68, Tue: 1, Wed: 86, Thu: 97, Fri: '**', Sat: 48, Sun: 4 },
      { Mon: 57, Tue: 40, Wed: 63, Thu: 48, Fri: 91, Sat: 51, Sun: 98 },
      { Mon: 73, Tue: 17, Wed: 69, Thu: 93, Fri: 79, Sat: 69, Sun: 96 },
      { Mon: 48, Tue: 92, Wed: 81, Thu: 71, Fri: 12, Sat: 41, Sun: 23 },
      { Mon: 53, Tue: 47, Wed: 68, Thu: 19, Fri: 79, Sat: 26, Sun: 45 },
      { Mon: 25, Tue: 78, Wed: 1, Thu: 13, Fri: 71, Sat: 13, Sun: 2 },
      { Mon: 21, Tue: 71, Wed: 24, Thu: 19, Fri: 30, Sat: 58, Sun: 54 },
    ];
    setData(dummyData);
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        overflowX: 'auto',
        px: { xs: 1, sm: 3 },
      }}
    >
      <Paper
        elevation={0}
        sx={{
          border: '1px solid #ddd',
          margin: 'auto',
          width: '100%',
          maxWidth: 900,
          transition: 'box-shadow 0.3s ease',
          '&:hover': { boxShadow: '0px 6px 16px rgba(0,0,0,0.05)' },
        }}
      >
        <Typography
          variant="h6"
          fontWeight={700}
          textAlign="center"
          sx={{
            py: 1,
            backgroundColor: '#1b3153ff',
            color: '#fff',
            fontSize: { xs: '1rem', sm: '1.25rem' },
          }}
        >
          Jodi Chart
        </Typography>

        <ScrollContainer>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow >
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                  <StyledHeaderCell key={day} >
                    {day}
                  </StyledHeaderCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {data.map((row, i) => (
                <StyledTableRow key={i}>
                  {Object.entries(row).map(([key, value]) => {
                    const isSpecial = [11, 22, 33, 55, 66, 77, 88, 99].includes(Number(value));
                    return (
                      <StyledTableCell
                        key={key}
                        sx={{
                          color: value === '**' ? '#000' : isSpecial ? '#c62828' : '#000',
                          fontWeight: isSpecial ? 700 : 400,
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
      </Paper>
    </Box>
  );
}
