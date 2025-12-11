/* eslint-disable no-nested-ternary */
import React, { useState, useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  Typography,
  Stack,
  Box,
  CircularProgress,
  Card,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useTheme } from '@mui/material/styles';
import Label from '../../../components/label';

function WithdrawDetailsMobileViewLayoutPage({
  data = [],
  onAccept,
  onReject,
  acceptLoading = {},
  rejectLoading = {},
  loading = false,
}) {
  const theme = useTheme();
  const [visibleData, setVisibleData] = useState(data.slice(0, 10));
  const [scrollLoading, setScrollLoading] = useState(false);
  const [hasMore, setHasMore] = useState(data.length > 10);
  const containerRef = useRef(null);

  // Infinite Scroll Logic
  const handleScroll = useCallback(() => {
    if (!containerRef.current || scrollLoading || !hasMore) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    if (scrollHeight - scrollTop - clientHeight < 50) {
      setScrollLoading(true);
      setTimeout(() => {
        const nextLength = visibleData.length + 10;
        const newData = data.slice(0, nextLength);
        setVisibleData(newData);
        setHasMore(newData.length < data.length);
        setScrollLoading(false);
      }, 1200);
    }
  }, [scrollLoading, hasMore, visibleData.length, data]);

  useEffect(() => {
    const ref = containerRef.current;
    if (!ref) return undefined;
    ref.addEventListener('scroll', handleScroll);
    return () => ref.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    setVisibleData(data.slice(0, 10));
    setHasMore(data.length > 10);
  }, [data]);

  const getRowId = (row) => row._id || row.id;

  return (
    <Box
      ref={containerRef}
      sx={{
        maxHeight: 600,
        overflowY: 'auto',
        p: 2,
        borderRadius: 2,
        boxShadow: 1,
        bgcolor: 'background.paper',
      }}
    >
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress size={40} color="primary" />
        </Box>
      ) : (
        <Stack spacing={2}>
          {visibleData.map((row) => {
            const userId = row.userId || {};
            const userName = userId?.name || 'N/A';
            const userNumber = userId?.number || 'N/A';
            const amount = row.amount || 0;
            const method = row.method || 'N/A';
            const status = row.status || 'pending';
            const createdAt = row.createdAt
              ? new Date(row.createdAt).toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })
              : 'N/A';
            const rowId = getRowId(row);
            const isAcceptLoading = acceptLoading[rowId] || false;
            const isRejectLoading = rejectLoading[rowId] || false;

            return (
              <Card
                key={rowId}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 2,
                  border: `1px solid ${theme.palette.divider}`,
                  p: 2,
                  mb: 1,
                  boxShadow: theme.shadows[1],
                }}
              >
                {/* Header */}
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={1.5}
                >
                  <Typography variant="subtitle1" fontWeight={600}>
                    {userName}
                  </Typography>
                  <Label
                    variant="soft"
                    color={
                      (status === 'rejected' && 'error') ||
                      (status === 'approved' && 'success') ||
                      'warning'
                    }
                    sx={{ textTransform: 'capitalize' }}
                  >
                    {status}
                  </Label>
                </Stack>

                {/* Basic Info */}
                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Phone:
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {userNumber}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Amount:
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      ₹{amount.toLocaleString('en-IN')}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Method:
                    </Typography>
                    <Typography
                      variant="body2"
                      fontWeight={500}
                      sx={{ textTransform: 'capitalize' }}
                    >
                      {method}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Created At:
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {createdAt}
                    </Typography>
                  </Box>
                </Stack>

                {/* Action Buttons - Only show for pending status */}
                {status === 'pending' && (
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ mt: 2, pt: 2, borderTop: `1px solid ${theme.palette.divider}` }}
                  >
                    <LoadingButton
                      fullWidth
                      variant="contained"
                      color="success"
                      size="small"
                      onClick={() => onAccept && onAccept(rowId)}
                      loading={isAcceptLoading}
                      disabled={isAcceptLoading || isRejectLoading}
                      sx={{ flex: 1 }}
                    >
                      Accept
                    </LoadingButton>
                    <LoadingButton
                      fullWidth
                      variant="contained"
                      color="error"
                      size="small"
                      onClick={() => onReject && onReject(rowId)}
                      loading={isRejectLoading}
                      disabled={isAcceptLoading || isRejectLoading}
                      sx={{ flex: 1 }}
                    >
                      Reject
                    </LoadingButton>
                  </Stack>
                )}

                {/* Status Display for non-pending */}
                {status !== 'pending' && (
                  <Box
                    sx={{
                      mt: 2,
                      pt: 2,
                      borderTop: `1px solid ${theme.palette.divider}`,
                      textAlign: 'center',
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        color:
                          status === 'approved'
                            ? theme.palette.success.main
                            : theme.palette.error.main,
                        fontWeight: 600,
                      }}
                    >
                      {status === 'approved' ? '✓ Approved' : '✗ Rejected'}
                    </Typography>
                  </Box>
                )}
              </Card>
            );
          })}

          {scrollLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
              <CircularProgress size={32} color="primary" />
            </Box>
          )}

          {!hasMore && !scrollLoading && visibleData.length > 0 && (
            <Typography
              align="center"
              variant="body2"
              sx={{ color: 'text.secondary', py: 2 }}
            >
              No more data
            </Typography>
          )}

          {visibleData.length === 0 && !loading && (
            <Typography
              align="center"
              variant="body2"
              sx={{ color: 'text.secondary', py: 4 }}
            >
              No withdrawal details found
            </Typography>
          )}
        </Stack>
      )}
    </Box>
  );
}

WithdrawDetailsMobileViewLayoutPage.propTypes = {
  data: PropTypes.array,
  onAccept: PropTypes.func,
  onReject: PropTypes.func,
  acceptLoading: PropTypes.object,
  rejectLoading: PropTypes.object,
  loading: PropTypes.bool,
};

export default WithdrawDetailsMobileViewLayoutPage;

