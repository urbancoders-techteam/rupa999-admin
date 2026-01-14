/* eslint-disable no-nested-ternary */
import React from 'react';
import PropTypes from 'prop-types';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Stack,
  IconButton,
  Box,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Label from '../../../components/label';
import { fDateTimeOrdinal } from '../../../utils/formatTime';

function StarlineMarketMobileViewCardLayout({
  data = [],
  onEditRow,
  onDeleteRow,
  onSelectRow,
  selected = [],
  page = 0,
  rowsPerPage = 10,
}) {
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
      <Stack spacing={0.5}>
        {data.map((row, index) => {
          // Calculate serial number across pagination (same as desktop view)
          const serialNumber = row.sno || (page * rowsPerPage) + index + 1;
          
          return (
          <Accordion
            key={row.id || row._id}
            sx={{ borderRadius: 2, boxShadow: 'none' }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 2, py: 1 }}>
              <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body1" sx={{ fontWeight: 700, borderRight: '1px solid', pr: 1, mr: 1 }}>
                    {serialNumber}
                  </Typography>
                  <Typography variant="body1" sx={{ flex: 1, flexWrap: 'nowrap', fontWeight: 700 }}>
                    {row.name || '—'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2, fontSize: '0.875rem' }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Open: {row.openTime || '—'}
                  </Typography>
                </Box>
              </Box>
            </AccordionSummary>

            <AccordionDetails>
              <Stack spacing={0.5}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Current Status:
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.primary', textAlign: 'right' }}>
                    <Label
                      variant="soft"
                      color={(() => {
                        if (row.currentStatus === 'OPEN NOW') return 'success';
                        if (row.currentStatus === 'CLOSED NOW') return 'error';
                        return 'default';
                      })()}
                      sx={{ textTransform: 'capitalize', fontSize: '0.75rem' }}
                    >
                      {row.currentStatus || '—'}
                    </Label>
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Disable Game:
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.primary', textAlign: 'right' }}>
                    <Label variant="soft" color={row.disableGame === 'yes' ? 'error' : 'success'} sx={{ textTransform: 'capitalize', fontSize: '0.75rem' }}>
                      {row.disableGame || 'no'}
                    </Label>
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Auto Result Open:
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.primary', textAlign: 'right' }}>
                    <Label variant="soft" color={row.autoResultOpen === 'enable' ? 'success' : 'default'} sx={{ textTransform: 'capitalize', fontSize: '0.75rem' }}>
                      {row.autoResultOpen || 'disable'}
                    </Label>
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Created At:
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.primary', textAlign: 'right' }}>
                    {row.createdAt ? (typeof row.createdAt === 'string' ? row.createdAt : fDateTimeOrdinal(row.createdAt)) : '—'}
                  </Typography>
                </Box>

                <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end', pt: 1 }}>
                  <IconButton size="small" color="primary" onClick={() => onEditRow && onEditRow(row.name)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  {onDeleteRow && (
                    <IconButton size="small" color="error" onClick={() => onDeleteRow(row._id || row.id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  )}
                </Stack>

                {selected.includes(row.id || row._id) && (
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Selected
                  </Typography>
                )}
              </Stack>
            </AccordionDetails>
          </Accordion>
          );
        })}
      </Stack>
    </Box>
  );
}

StarlineMarketMobileViewCardLayout.propTypes = {
  data: PropTypes.array,
  onEditRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  selected: PropTypes.array,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
};

export default StarlineMarketMobileViewCardLayout;
