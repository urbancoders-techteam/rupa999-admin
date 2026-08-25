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
  onViewUser,
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
      <Stack spacing={1.25}>
        {data.map((row, index) => {
          // Calculate serial number across pagination (same as desktop view)
          const serialNumber = row.sno || (page * rowsPerPage) + index + 1;

          return (
            <Accordion
              key={row.id}
              sx={{
                borderRadius: 2,
                boxShadow: 'none',
                border: '1px solid',
                borderColor: 'divider',
                '&:before': { display: 'none' },
                overflow: 'hidden',
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                  px: 1.5,
                  py: 1,
                  alignItems: 'flex-start',
                  '& .MuiAccordionSummary-content': {
                    my: 0.5,
                    mr: 1,
                    width: '100%',
                  },
                }}
              >
                <Box sx={{ width: '100%', minWidth: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.5 }}>
                    <Typography
                      variant="caption"
                      sx={{ fontWeight: 700, color: 'text.secondary', minWidth: 18 }}
                    >
                      {serialNumber}.
                    </Typography>
                    <Typography variant="subtitle2" sx={{ flex: 1, fontWeight: 700, minWidth: 0 }} noWrap>
                      {row.userName || '—'}
                    </Typography>
                    <Label
                      variant="soft"
                      color={row.session === 'open' ? 'success' : 'warning'}
                      sx={{ textTransform: 'capitalize', fontSize: '0.7rem', flexShrink: 0 }}
                    >
                      {row.session || '—'}
                    </Label>
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      pl: 2.75,
                      flexWrap: 'wrap',
                    }}
                  >
                    <Typography variant="caption" sx={{ color: 'text.secondary' }} noWrap>
                      {row.marketName || '—'}
                    </Typography>
                    <Typography variant="caption" sx={{ fontWeight: 600 }}>
                      Bid {row.number || '—'}
                    </Typography>
                    <Typography variant="caption" sx={{ fontWeight: 600, color: 'success.main' }}>
                      Win ₹{row.winAmount?.toLocaleString('en-IN') || 0}
                    </Typography>
                  </Box>
                </Box>
              </AccordionSummary>

              <AccordionDetails>
                <Stack spacing={1.5}>
                  <Divider />

                  {/* Phone */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                      Phone:
                    </Typography>
                    {row.userId && onViewUser && row.contactNumber && row.contactNumber !== 'N/A' ? (
                      <Typography
                        variant="body2"
                        onClick={() => onViewUser(row.userId, row.userName)}
                        sx={{
                          color: 'primary.main',
                          textAlign: 'right',
                          maxWidth: '60%',
                          fontWeight: 600,
                          cursor: 'pointer',
                          textDecoration: 'underline',
                        }}
                      >
                        {row.contactNumber}
                      </Typography>
                    ) : (
                      <Typography variant="body2" sx={{ color: 'text.primary', textAlign: 'right', maxWidth: '60%' }}>
                        {row?.contactNumber || '—'}
                      </Typography>
                    )}
                  </Box>

                  {/* Bid */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                      Bid:
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.primary', textAlign: 'right', fontWeight: 600 }}>
                      {row.number || '—'}
                    </Typography>
                  </Box>

                  {/* Play Amount */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                      Play Amount:
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
  onViewUser: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  selected: PropTypes.array,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  loading: PropTypes.bool,
};

export default WinHistoryMobileViewCardLayout;

