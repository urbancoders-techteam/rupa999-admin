/* eslint-disable no-nested-ternary */
import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Stack,
  IconButton,
  Divider,
  Box,
  Pagination,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Label from '../../../components/label';
import { fDateTime } from '../../../utils/formatTime';
import { fNumber } from '../../../utils/formatNumber';

function GeneralMarketRecordMVCLayout({ 
  data = [], 
  onEditRow, 
  onDeleteRow, 
  onSelectRow, 
  selected = [],
  page: externalPage,
  rowsPerPage: externalRowsPerPage,
  total: externalTotal,
  onPageChange,
  onRowsPerPageChange,
}) {
  // Use external pagination if provided, otherwise use internal pagination
  const useExternalPagination = externalPage !== undefined && onPageChange !== undefined;
  
  const [internalPage, setInternalPage] = useState(1);
  const internalRowsPerPage = 10;
  
  const currentPage = useExternalPagination ? externalPage : internalPage;
  const currentRowsPerPage = useExternalPagination ? externalRowsPerPage : internalRowsPerPage;
  const total = useExternalPagination ? externalTotal : data.length;
  
  // Calculate paginated data
  const paginatedData = useMemo(() => {
    if (useExternalPagination) {
      // If using external pagination, data is already paginated
      return data;
    }
    // Internal pagination
    const start = (currentPage - 1) * currentRowsPerPage;
    const end = start + currentRowsPerPage;
    return data.slice(start, end);
  }, [data, currentPage, currentRowsPerPage, useExternalPagination]);
  
  const totalPages = Math.ceil(total / currentRowsPerPage);
  
  const handlePageChange = (event, value) => {
    if (useExternalPagination && onPageChange) {
      // MUI Pagination is 1-based, parent expects 0-based
      onPageChange(event, value - 1);
    } else {
      setInternalPage(value);
      // Scroll to top on mobile
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  // Convert page to 1-based for MUI Pagination component
  const paginationPage = useExternalPagination ? currentPage + 1 : currentPage;

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          p: { xs: 1, sm: 2 },
          borderRadius: { xs: 1, sm: 2 },
          boxShadow: { xs: 'none', sm: 1 },
          border: { xs: '1px solid', sm: 'none' },
          borderColor: { xs: 'divider', sm: 'transparent' },
          bgcolor: 'background.paper',
          width: '100%',
          minHeight: { xs: '200px', sm: '300px' },
        }}
      >
        <Stack spacing={{ xs: 1.5, sm: 2 }}>
          {paginatedData?.length === 0 && (
            <Box 
              sx={{ 
                textAlign: 'center', 
                py: { xs: 4, sm: 6 },
                px: 2,
              }}
            >
              <Typography 
                variant="body1" 
                sx={{ 
                  color: 'text.secondary',
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                }}
              >
                No records found
              </Typography>
            </Box>
          )}
          {paginatedData?.map((row) => (
          <Accordion 
            key={row.id} 
            sx={{ 
              borderRadius: 2, 
              boxShadow: 'none', 
              border: '1px solid', 
              borderColor: 'divider',
              '&:before': {
                display: 'none',
              },
            }}
          >
            <AccordionSummary 
              expandIcon={<ExpandMoreIcon />} 
              sx={{ 
                px: { xs: 1, sm: 2 }, 
                py: 1,
                '& .MuiAccordionSummary-content': {
                  overflow: 'hidden',
                },
              }}
            >
              <Box sx={{ width: '100%', minWidth: 0 }}>
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    fontWeight: 700,
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {row.marketName || '—'}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'text.secondary',
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  User: {row.userName || '—'}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'text.secondary',
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Phone: {row.userPhone || '—'}
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ px: { xs: 1, sm: 2 }, py: { xs: 1, sm: 2 } }}>
              <Stack spacing={1.5}>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5, fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                    Session
                  </Typography>
                  <Typography variant="body2" sx={{ textTransform: 'capitalize', fontSize: { xs: '0.8125rem', sm: '0.875rem' } }}>
                    {row.session || '—'}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5, fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                    Number
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: { xs: '0.8125rem', sm: '0.875rem' } }}>
                    {row.number || '—'}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5, fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                    Amount
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, fontSize: { xs: '0.8125rem', sm: '0.875rem' } }}>
                    ₹{fNumber(row.amount || 0)}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5, fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                    Win Amount
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, fontSize: { xs: '0.8125rem', sm: '0.875rem' } }}>
                    ₹{fNumber(row.winAmount || 0)}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5, fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                    Status
                  </Typography>
                  <Label
                    variant="soft"
                    color={
                      row.status === 'WON'
                        ? 'success'
                        : row.status === 'LOST'
                          ? 'error'
                          : 'warning'
                    }
                    sx={{ 
                      textTransform: 'uppercase', 
                      fontWeight: 'bold',
                      fontSize: { xs: '0.7rem', sm: '0.75rem' },
                    }}
                  >
                    {row.status === 'WON' ? 'SUCCESS' : row.status === 'LOST' ? 'FAILED' : row.status || 'PENDING'}
                  </Label>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5, fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                    Created At
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: { xs: '0.8125rem', sm: '0.875rem' } }}>
                    {row.createdAt ? fDateTime(row.createdAt) : '—'}
                  </Typography>
                </Box>
                <Divider sx={{ my: 1 }} />
                <Stack direction="row" spacing={1}>
                  <IconButton size="small" color="primary" onClick={() => onEditRow && onEditRow(row.id)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" color="error" onClick={() => onDeleteRow && onDeleteRow(row.id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Stack>
                {selected.includes(row.id) && (
                  <Typography variant="caption" sx={{ color: 'primary.main', fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                    Selected
                  </Typography>
                )}
              </Stack>
            </AccordionDetails>
          </Accordion>
          ))}
        </Stack>
      </Box>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <Stack 
          direction="row" 
          justifyContent="center" 
          alignItems="center" 
          sx={{ 
            mt: { xs: 2, sm: 2.5 }, 
            mb: { xs: 1, sm: 1.5 },
            px: { xs: 1, sm: 0 },
          }}
        >
          <Pagination
            count={totalPages}
            page={paginationPage}
            onChange={handlePageChange}
            color="primary"
            size="small"
            shape="rounded"
            siblingCount={0}
            boundaryCount={1}
            sx={{
              '& .MuiPaginationItem-root': {
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                minWidth: { xs: '32px', sm: '36px' },
                height: { xs: '32px', sm: '36px' },
              },
            }}
          />
        </Stack>
      )}
    </Box>
  );
}

GeneralMarketRecordMVCLayout.propTypes = {
  data: PropTypes.array,
  onEditRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  selected: PropTypes.array,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  total: PropTypes.number,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
};

export default GeneralMarketRecordMVCLayout;
