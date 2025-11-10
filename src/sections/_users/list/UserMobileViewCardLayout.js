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
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import StatusToggleCell from './StatusToggledCell';
import { PATH_DASHBOARD } from '../../../routes/paths';
import AddDeductBalanceModal from '../form/UserAddDeductForm';

function UserMobileViewCardLayout({ data = [], onEditRow, onDeleteRow }) {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  // Derived values
  const totalPages = Math.ceil(data.length / rowsPerPage);
  const [paginatedData, setPaginatedData] = useState([]);

  const [open, setOpen] = useState(false);

  const handleSubmit = (values) => {
    console.log('Submitted:', values);
  };

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

//   const viewUserBidHistory = (userId) => {
//     navigate(PATH_DASHBOARD.user.bidhistory(userId));
//   };
  const viewTransaction = (userId) => {
    navigate(PATH_DASHBOARD.user.transactions(userId));
  };
  const viewGameRecord = (userId) => {
    navigate(PATH_DASHBOARD.user.bidhistory(userId));
  };
  const viewWithdrawalRequests = (userId) => {
    navigate(PATH_DASHBOARD.user.withdrawalrequest(userId));
  };

  return (
    <Box
      sx={{
        maxHeight: '100%',
        overflow: 'hidden',
        // p: 1,
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
                    expandIcon={<ExpandMoreRoundedIcon />}
                    sx={{
                      px: 2,
                      py: 1,
                      bgcolor: 'grey.50',
                      '& .MuiAccordionSummary-content': {
                        alignItems: 'center',
                        width: '100%',
                      },
                      // Move the expand icon to the top-right corner
                      '& .MuiAccordionSummary-expandIconWrapper': {
                        position: 'absolute',
                        top: 18,
                        right: 12,
                        transform: 'none !important',
                      },
                    }}
                  >
                    <Stack
                      direction="row"
                      alignItems="start"
                      justifyContent="space-between"
                      sx={{ width: '100%', pr: 4 }} // add padding-right so text doesn't overlap the icon
                    >
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Stack
                          direction="column"
                          spacing={0.5}
                          sx={{ borderRight: '1px solid #ccc', paddingRight: 1, minWidth:'30px' }}
                        >
                          {/* <Typography variant="subtitle1">ID:</Typography> */}
                          <Typography variant="subtitle2">{row.id || '—'}.</Typography>
                        </Stack>

                        <Stack
                          direction="column"
                          spacing={0.5}
                          sx={{ borderRight: '1px solid #ccc', paddingRight: 1, minWidth:'120px' }}
                        >
                          <Typography variant="subtitle1">
                            {row.name || '—'}
                          </Typography>
                           <Typography variant="subtitle2" color="text.secondary">{row.phone || '—'}</Typography>
                        </Stack>

                        <Stack direction="column" spacing={0.5}>
                          <Typography variant="subtitle2">Balance : </Typography>
                          <Typography variant="subtitle2" color="text.secondary">{row.balance || '—'}</Typography>
                        </Stack>
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
                    <Box flex={1} sx={{ display: 'flex', alignItems: 'center',gap:1, mb: 1 }}>
                      <Button variant="contained" onClick={viewTransaction}>
                        <Typography variant="body2"> Transaction</Typography>
                      </Button>
                      <Button variant="contained" onClick={viewWithdrawalRequests}>
                        <Typography variant="body2">Withdrawal</Typography>
                      </Button>
                      <Button variant="contained" onClick={viewGameRecord}>
                        <Typography variant="body2">Game</Typography>
                      </Button>
                    </Box>
                    <Stack spacing={0.5}>
                      <Typography variant="body2">
                        <b>Password:</b> {row.password || '—'}
                      </Typography>
                      <Typography variant="body2">
                        <b>Creation Date:</b>{' '}
                        {row.createdAt ? new Date(row.createdAt).toLocaleString() : '—'}
                      </Typography>

                      <Accordion
                        disableGutters
                        sx={{
                          boxShadow: 'none',
                          borderRadius: 1,
                          border: '1px solid',
                          borderColor: 'divider',
                          '&:before': { display: 'none' },
                          bgcolor: 'background.paper',
                        }}
                      >
                        <AccordionSummary
                          expandIcon={<ExpandMoreRoundedIcon />}
                          sx={{
                            bgcolor: 'grey.50',
                            borderBottom: '1px solid',
                            borderColor: 'divider',
                            '& .MuiAccordionSummary-content': {
                              alignItems: 'center',
                              width: '100%',
                            },
                          }}
                        >
                          <Typography variant="subtitle1" fontWeight={600}>
                            Account Details
                          </Typography>
                        </AccordionSummary>

                        <AccordionDetails
                          sx={{
                            px: 2,
                            py: 1.5,
                            bgcolor: 'background.default',
                          }}
                        >
                          {/* {row?.accountDetails ? ( */}
                          <Box>
                            <Typography variant="body2" sx={{ mb: 0.5 }}>
                              <strong>Bank Name:</strong> {row?.accountDetails?.bankName || '—'}
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 0.5 }}>
                              <strong>Account No:</strong>{' '}
                              {row?.accountDetails?.accountNumber || '—'}
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 0.5 }}>
                              <strong>IFSC Code:</strong> {row?.accountDetails?.ifscCode || '—'}
                            </Typography>
                            <Typography variant="body2">
                              <strong>Account Holder:</strong>{' '}
                              {row?.accountDetails?.holderName || '—'}
                            </Typography>
                          </Box>
                          {/* //   ) : (
                        //     <Typography variant="body2" color="text.secondary">
                        //       No account details available.
                        //     </Typography>
                        //   )} */}
                        </AccordionDetails>
                      </Accordion>

                      <Button variant="contained" onClick={() => setOpen(true)}>
                        <b>Add / Deduct Money</b>
                      </Button>

                      <Divider sx={{ my: 1 }} />

                      <Stack direction="row" justifyContent="space-between" spacing={1}>
                        <StatusToggleCell id={row.id} status={row.status} />

                        <IconButton size="small" color="primary" onClick={() => onEditRow(row.name)}>
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

      <AddDeductBalanceModal
        open={open}
        handleClose={() => setOpen(false)}
        currentBalance={2.01}
        onSubmit={handleSubmit}
      />
    </Box>
  );
}

UserMobileViewCardLayout.propTypes = {
  data: PropTypes.array,
  onEditRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};

export default UserMobileViewCardLayout;
