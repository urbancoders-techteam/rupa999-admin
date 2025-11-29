import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  Typography,
  Stack,
  Box,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import CircularProgress from '@mui/material/CircularProgress';

function WithdrawDetailsMobileViewCardLayout({ 
  data = [], 
  onAccept, 
  onReject,
  acceptLoading = false,
  rejectLoading = false,
}) {
  const [visibleData, setVisibleData] = useState(data.slice(0, 10));
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(data.length > 10);
  const containerRef = useRef(null);

  useEffect(() => {
    setVisibleData(data.slice(0, 10));
    setHasMore(data.length > 10);
  }, [data]);

  const handleScroll = React.useCallback(() => {
    if (!containerRef.current || loading || !hasMore) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    if (scrollHeight - scrollTop - clientHeight < 50) {
      setLoading(true);
      setTimeout(() => {
        const nextLength = visibleData.length + 10;
        const newData = data.slice(0, nextLength);
        setVisibleData(newData);
        setHasMore(newData.length < data.length);
        setLoading(false);
      }, 1200); // Simulate network delay
    }
  }, [containerRef, loading, hasMore, visibleData.length, data]);

  useEffect(() => {
    const ref = containerRef.current;
    if (ref) {
      ref.addEventListener('scroll', handleScroll);
      return () => ref.removeEventListener('scroll', handleScroll);
    }
    return undefined;
  }, [handleScroll]);

  return (
    <Box
      ref={containerRef}
      sx={{
        maxHeight: 600,
        overflowY: 'auto',
        p: 2,
      }}
    >
      <Stack spacing={2}>
        {visibleData.map((row) => (
          <Card
            key={row.id || row.ID || row._id}
            sx={{
              p: 2,
              borderRadius: 2,
              boxShadow: 2,
            }}
          >
            <Stack spacing={1.5}>
              {/* Name */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                  Name:
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 500 }}>
                  {row.userId?.name || row.name || row.Name || row.marketName || '—'}
                </Typography>
              </Box>

              {/* Phone Number */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                  Phone No:
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 500 }}>
                  {row.userId?.number || row.phone || row.Phone || row.userPhone || row.phoneNumber || '—'}
                </Typography>
              </Box>

              {/* Method */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                  Method:
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 500, textTransform: 'capitalize' }}>
                  {row.method || '—'}
                </Typography>
              </Box>

              {/* Status */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                  Status:
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 500, textTransform: 'capitalize' }}>
                  {row.status || 'pending'}
                </Typography>
              </Box>

              {/* Amount */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                  Amount:
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 500 }}>
                  {(() => {
                    const amount = row.amount || row.Amount || 0;
                    return amount ? `₹${Number(amount).toLocaleString('en-IN')}` : '—';
                  })()}
                </Typography>
              </Box>

              {/* Request Date */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                  Request Date:
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 500 }}>
                  {row.createdAt || row.CreatedAt || row.requestDate
                    ? new Date(row.createdAt || row.CreatedAt || row.requestDate).toLocaleString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : '—'}
                </Typography>
              </Box>

              {/* Accept / Reject Buttons - Only show for pending requests */}
              {row.status === 'pending' && (
                <Stack direction="row" spacing={1} sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                  <LoadingButton
                    fullWidth
                    variant="contained"
                    color="success"
                    onClick={() => onAccept && onAccept(row._id || row.id || row.ID, row)}
                    loading={acceptLoading && (acceptLoading[row._id || row.id || row.ID] || false)}
                    disabled={rejectLoading && (rejectLoading[row._id || row.id || row.ID] || false)}
                    sx={{ flex: 1 }}
                  >
                    Accept
                  </LoadingButton>
                  <LoadingButton
                    fullWidth
                    variant="contained"
                    color="error"
                    onClick={() => onReject && onReject(row._id || row.id || row.ID, row)}
                    loading={rejectLoading && (rejectLoading[row._id || row.id || row.ID] || false)}
                    disabled={acceptLoading && (acceptLoading[row._id || row.id || row.ID] || false)}
                    sx={{ flex: 1 }}
                  >
                    Reject
                  </LoadingButton>
                </Stack>
              )}
              {row.status !== 'pending' && (
                <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider', textAlign: 'center' }}>
                  <Typography variant="body2" sx={{ color: row.status === 'approved' ? 'success.main' : 'error.main', fontWeight: 600 }}>
                    {row.status === 'approved' ? '✓ Approved' : '✗ Rejected'}
                  </Typography>
                </Box>
              )}
            </Stack>
          </Card>
        ))}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <CircularProgress size={32} color="primary" />
          </Box>
        )}
        {!hasMore && visibleData.length > 0 && (
          <Typography align="center" variant="body2" sx={{ color: 'text.secondary', py: 2 }}>
            No more data
          </Typography>
        )}
      </Stack>
    </Box>
  );
}

WithdrawDetailsMobileViewCardLayout.propTypes = {
  data: PropTypes.array,
  onAccept: PropTypes.func,
  onReject: PropTypes.func,
  acceptLoading: PropTypes.bool,
  rejectLoading: PropTypes.bool,
};

export default WithdrawDetailsMobileViewCardLayout;
