/* eslint-disable no-nested-ternary */
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Divider,
  IconButton,
  Pagination,
  Paper,
  Stack,
  Typography
} from '@mui/material';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import ChangePasswordDialog from '../../../components/change-password-dialog/ChangePasswordDialog';
import StatusToggleCell from './StatusToggledCell';

// ----------------------------------------------------------------------

function StaffMobileViewLayout({ data, onEditRow, onDeleteRow, onStatusChange, onChangePassword, changePasswordLoading }) {
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  // Derived values
  const totalPages = Math.ceil(data.length / rowsPerPage);
  const [paginatedData, setPaginatedData] = useState([]);

  const [openChangePassword, setOpenChangePassword] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState(null);
  const [selectedStaffName, setSelectedStaffName] = useState(null);

  const handleOpenChangePassword = (staffId, staffName) => {
    setSelectedStaffId(staffId);
    setSelectedStaffName(staffName);
    setOpenChangePassword(true);
  };

  const handleCloseChangePassword = () => {
    setOpenChangePassword(false);
    setSelectedStaffId(null);
    setSelectedStaffName(null);
  };

  const handleChangePasswordSubmit = async (value) => {
    if (onChangePassword && selectedStaffId) {
      await onChangePassword(selectedStaffId, value.password, value.cpassword);
      handleCloseChangePassword();
    }
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

  return (
    <Box
      sx={{
        maxHeight: '100%',
        overflow: 'hidden',
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
            No staff available
          </Typography>
        </Box>
      ) : (
        <>
          <Stack spacing={1.5}>
            {paginatedData.map((row, index) => (
              <Paper
                key={row._id || row.id}
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
                      sx={{ width: '100%', pr: 4 }}
                    >
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Stack
                          direction="column"
                          spacing={0.5}
                          sx={{ borderRight: '1px solid #ccc', paddingRight: 1, minWidth: '30px' }}
                        >
                          <Typography variant="subtitle2">{index + 1 + (page - 1) * rowsPerPage}.</Typography>
                        </Stack>

                        <Stack
                          direction="column"
                          spacing={0.5}
                          sx={{ borderRight: '1px solid #ccc', paddingRight: 1, minWidth: '120px' }}
                        >
                          <Typography variant="subtitle1">
                            {row.name || '—'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {row.mobileNumber || row.mobile || '—'}
                          </Typography>
                        </Stack>

                        <Stack direction="column" spacing={0.5}>
                          <Typography variant="caption" color="text.secondary">Role:</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {row.roleName || row.designation || row.roleId?.roleName || 'N/A'}
                          </Typography>
                        </Stack>
                      </Box>

                      <Typography
                        variant="caption"
                        color={row.status === 'Active' || (typeof row.status === 'boolean' && row.status) ? 'success.main' : 'error.main'}
                        sx={{ fontWeight: 600 }}
                      >
                        {typeof row.status === 'boolean' ? (row.status ? 'Active' : 'InActive') : row.status || '—'}
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
                    <Stack spacing={1.5}>
                      {/* Staff Details */}
                      <Box>
                        <Typography variant="body2" sx={{ mb: 0.5 }}>
                          <strong>Email:</strong> {row.email || '—'}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 0.5 }}>
                          <strong>Mobile:</strong> {row.mobileNumber || row.mobile || '—'}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 0.5 }}>
                          <strong>Role/Designation:</strong>{' '}
                          {row.roleName || row.designation || row.roleId?.roleName || 'N/A'}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Created At:</strong>{' '}
                          {row.createdAt ? new Date(row.createdAt).toLocaleString() : '—'}
                        </Typography>
                      </Box>

                      <Divider sx={{ my: 1 }} />

                      {/* Action Buttons */}
                      <Stack spacing={1}>
                        <Button
                          variant="outlined"
                          onClick={() => handleOpenChangePassword(row._id || row.id, row.name)}
                          fullWidth
                        >
                          <Typography variant="body2">Change Password</Typography>
                        </Button>
                      </Stack>

                      <Divider sx={{ my: 1 }} />

                      {/* Action Icons */}
                      <Stack direction="row" justifyContent="space-between" spacing={1}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <StatusToggleCell
                            id={row._id || row.id}
                            status={typeof row.status === 'boolean' ? row.status : row.status === 'Active' || row.status === 'active'}
                            onStatusChange={onStatusChange}
                          />
                        </Box>

                        <Stack direction="row" spacing={0.5}>
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditRow(row._id || row.id);
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteRow(row._id || row.id);
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Stack>
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

      <ChangePasswordDialog
        open={openChangePassword}
        onClose={handleCloseChangePassword}
        onSubmit={handleChangePasswordSubmit}
        loading={changePasswordLoading}
        userName={selectedStaffName}
      />
    </Box>
  );
}

StaffMobileViewLayout.propTypes = {
  data: PropTypes.array,
  onEditRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onStatusChange: PropTypes.func,
  onChangePassword: PropTypes.func,
  changePasswordLoading: PropTypes.bool,
};

export default StaffMobileViewLayout;
