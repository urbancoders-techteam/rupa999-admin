/* eslint-disable no-nested-ternary */
import React, { useState, useRef, useEffect } from 'react';
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
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CircularProgress from '@mui/material/CircularProgress';
import Label from '../../../components/label';
import { fDateTime } from '../../../utils/formatTime';
import { fNumber } from '../../../utils/formatNumber';

function GeneralMarketRecordMVCLayout({ data = [], onEditRow, onDeleteRow, onSelectRow, selected = [] }) {
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
        borderRadius: 2,
        boxShadow: 1,
        bgcolor: 'background.paper',
      }}
    >
      <Stack spacing={2}>
        {visibleData?.map((row) => (
          <Accordion key={row.id} sx={{ borderRadius: 2, boxShadow: 'none', border: '1px solid', borderColor: 'divider' }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 2, py: 1 }}>
              <Box sx={{ width: '100%' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  {row.marketName || '—'}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  User: {row.userName || '—'}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Phone: {row.userPhone || '—'}
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={1.5}>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                    Session
                  </Typography>
                  <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                    {row.session || '—'}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                    Number
                  </Typography>
                  <Typography variant="body2">
                    {row.number || '—'}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                    Amount
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    ₹{fNumber(row.amount || 0)}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                    Win Amount
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    ₹{fNumber(row.winAmount || 0)}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
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
                    sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}
                  >
                    {row.status === 'WON' ? 'SUCCESS' : row.status === 'LOST' ? 'FAILED' : row.status || 'PENDING'}
                  </Label>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                    Created At
                  </Typography>
                  <Typography variant="body2">
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
                  <Typography variant="caption" sx={{ color: 'primary.main' }}>
                    Selected
                  </Typography>
                )}
              </Stack>
            </AccordionDetails>
          </Accordion>
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
        {visibleData.length === 0 && (
          <Typography align="center" variant="body2" sx={{ color: 'text.secondary', py: 4 }}>
            No records found
          </Typography>
        )}
      </Stack>
    </Box>
  );
}

GeneralMarketRecordMVCLayout.propTypes = {
  data: PropTypes.array,
  onEditRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  selected: PropTypes.array,
};

export default GeneralMarketRecordMVCLayout;
