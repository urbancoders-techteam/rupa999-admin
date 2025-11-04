/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
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
  Switch,
  CircularProgress,
  Paper,
  Pagination,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import StatusToggleCell from './StatusToggledCell';

function UserMobileViewCardLayout({ data = [], onEditRow, onDeleteRow }) {
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  // Derived values
  const totalPages = Math.ceil(data.length / rowsPerPage);
  const [paginatedData, setPaginatedData] = useState([]);

  // Handle pagination update
  useEffect(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    setPaginatedData(data.slice(start, end));
  }, [data, page]);

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Box
      sx={{
        maxHeight: '100%',
        overflow: 'hidden',
        p: 1.5,
        borderRadius: 2,
        bgcolor: 'background.default',
      }}
    >

      {data.length === 0 ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 200,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            No users available
          </Typography>
        </Box>
      ) : (
        <>
          <Stack spacing={1.5}>
            {paginatedData.map((row) => (
              <Paper
                key={row.id}
                sx={{
                  borderRadius: 2,
                  overflow: 'hidden',
                  boxShadow: '0px 2px 6px rgba(0,0,0,0.08)',
                }}
              >
                <Accordion
                  disableGutters
                  sx={{ boxShadow: 'none', '&:before': { display: 'none' } }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    sx={{
                      px: 2,
                      py: 1,
                      bgcolor: 'grey.50',
                      '& .MuiAccordionSummary-content': { alignItems: 'start' },
                    }}
                  >
                    <Stack
                      direction="row"
                      alignItems="start"
                      justifyContent="space-between"
                      sx={{ width: '100%' }}
                    >
                      <Box >
                        <Typography variant="body2" fontWeight={600}>
                          ID: {row.id || '—'}
                        </Typography>
                        <Typography variant="subtitle1">{row.name || '—'}</Typography>
                        <Typography variant="subtitle2" >
                          Mb No: {row.phone || '—'}
                        </Typography>
                      </Box>

                      <Typography
                        variant="subtitle2"
                        color={row.status === 'Active' ? 'primary' : 'error'}
                      >
                        {row.status}
                      </Typography>
                    </Stack>
                  </AccordionSummary>

                  <AccordionDetails
                    sx={{
                      bgcolor: 'background.paper',
                      px: 2,
                      py: 1.5,
                    }}
                  >
                    <Stack spacing={0.5}>
                      <StatusToggleCell id={row.id} status={row.status} />

                      <Typography variant="body2">
                        <b>Account Details:</b> {row.accountDetails || '—'}
                      </Typography>
                      <Typography variant="body2">
                        <b>Balance:</b> {row.balance || '—'}
                      </Typography>
                      <Typography variant="body2">
                        <b>Withdrawal:</b> {row.withdrawal || '—'}
                      </Typography>
                      <Typography variant="body2">
                        <b>Game Record:</b> {row.gameRecord || '—'}
                      </Typography>
                      <Typography variant="body2">
                        <b>Password:</b> {row.password || '—'}
                      </Typography>
                      <Typography variant="body2">
                        <b>Creation Date:</b>{' '}
                        {row.createdAt ? new Date(row.createdAt).toLocaleString() : '—'}
                      </Typography>

                      <Divider sx={{ my: 1 }} />

                      <Stack direction="row" justifyContent="flex-end" spacing={1}>
                        <IconButton size="small" color="primary" onClick={() => onEditRow(row.id)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="error" onClick={() => onDeleteRow(row.id)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    </Stack>
                  </AccordionDetails>
                </Accordion>
              </Paper>
            ))}
          </Stack>

          {/* Pagination Controls */}
          <Stack direction="row" justifyContent="center" alignItems="center" sx={{ mt: 2, mb: 1 }}>
            {totalPages > 1 && (
              <Pagination
                count={totalPages}
                page={page}
                color="primary"
                onChange={handlePageChange}
                siblingCount={0}
                size="small"
                shape="rounded"
              />
            )}
          </Stack>
        </>
      )}
    </Box>
  );
}

UserMobileViewCardLayout.propTypes = {
  data: PropTypes.array,
  onEditRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};

export default UserMobileViewCardLayout;
