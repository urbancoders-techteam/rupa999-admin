/* eslint-disable no-nested-ternary */
import React from 'react';
import PropTypes from 'prop-types';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Stack,
  Box,
  Divider,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Label from '../../../components/label';

function WinHistoryMobileViewCardLayout({
  data = [],
  onEditRow,
  onDeleteRow,
  onSelectRow,
  selected = [],
  page = 0,
  rowsPerPage = 10,
  loading = false,
}) {
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 200,
          p: 2,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Loading...
        </Typography>
      </Box>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 200,
          p: 2,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          No Data Available
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        boxShadow: 1,
        bgcolor: 'background.paper',
      }}
    >
      <Stack spacing={1}>
        {data.map((row, index) => {
          // Calculate serial number across pagination (same as desktop view)
          const serialNumber = row.sno || (page * rowsPerPage) + index + 1;

          return (
            <Accordion
              key={row.id}
              sx={{ borderRadius: 2, boxShadow: 'none',  }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 2, py: 1.5 }}>
                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary', paddingRight: 1 }}>
                      {serialNumber}.
                    </Typography>
                    <Typography variant="subtitle2" sx={{ flex: 1, fontWeight: 700, textAlign: 'left' }} noWrap>
                      {row.userName || '—'}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.primary', textAlign: 'right', maxWidth: '60%' }}>
                      {row.marketName || '—'}
                    </Typography>
                    <Label
                      variant="soft"
                      color={row.session === 'open' ? 'success' : 'warning'}
                      sx={{ textTransform: 'capitalize', fontSize: '0.7rem', ml: 1 }}
                    >
                      {row.session || '—'}
                    </Label>
                  </Box>
                </Box>
              </AccordionSummary>

              <AccordionDetails>
                <Stack spacing={1.5}>
                  <Divider />

                  {/* Market Name */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                      Contact Number:
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.primary', textAlign: 'right', maxWidth: '60%' }}>
                      {row?.contactNumber || '—'}
                    </Typography>
                  </Box>

                  {/* Number */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                      Number:
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.primary', textAlign: 'right', fontWeight: 600 }}>
                      {row.number || '—'}
                    </Typography>
                  </Box>

                  {/* Amount */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                      Amount:
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.primary', textAlign: 'right' }}>
                      ₹{row.amount?.toLocaleString('en-IN') || 0}
                    </Typography>
                  </Box>

                  {/* Win Amount */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                      Win Amount:
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'success.main', textAlign: 'right', fontWeight: 600 }}>
                      ₹{row.winAmount?.toLocaleString('en-IN') || 0}
                    </Typography>
                  </Box>

                  {/* Created At */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                      Created At:
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.primary', textAlign: 'right', fontSize: '0.75rem' }}>
                      {row.createdAt || '—'}
                    </Typography>
                  </Box>

                </Stack>
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Stack>
    </Box>
  );
}

WinHistoryMobileViewCardLayout.propTypes = {
  data: PropTypes.array,
  onEditRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  selected: PropTypes.array,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  loading: PropTypes.bool,
};

export default WinHistoryMobileViewCardLayout;

