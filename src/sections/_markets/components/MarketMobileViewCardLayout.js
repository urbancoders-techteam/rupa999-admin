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

function MarketMobileViewCardLayout({ data = [], onEditRow, onDeleteRow, onSelectRow, selected = [] }) {
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
      }, 1200);
    }
  }, [containerRef, loading, hasMore, visibleData.length, data]);

  useEffect(() => {
    const ref = containerRef.current;
    if (!ref) return undefined;
    ref.addEventListener('scroll', handleScroll);
    return () => ref.removeEventListener('scroll', handleScroll);
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
        {visibleData.map((row) => (
          <Accordion
            key={row.id}
            sx={{ borderRadius: 2, boxShadow: 'none', border: '1px solid #e0e0e0' }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 2, py: 1 }}>
              <Box sx={{ width: '100%' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  {row.name || '—'}
                </Typography>
                <Label
                  variant="soft"
                  color={
                    row.currentStatus === 'OPEN NOW'
                      ? 'success'
                      : row.currentStatus === 'CLOSED NOW'
                      ? 'error'
                      : 'default'
                  }
                >
                  {row.currentStatus}
                </Label>
                <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                  Game Disabled: {row.gameDisabled || '—'}
                </Typography>
              </Box>
            </AccordionSummary>

            <AccordionDetails>
              <Stack spacing={0.5}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Saturday: {row.saturdayOpen || '—'}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Sunday: {row.sundayOpen || '—'}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Auto Result: {row.autoResult || '—'}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Open Time: {row.openTime || '—'}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Close Time: {row.closeTime || '—'}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Open Result Time: {row.openResultTime || '—'}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Close Result Time: {row.closeResultTime || '—'}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Created At:{' '}
                  {row.createdAt ? new Date(row.createdAt).toLocaleString() : '—'}
                </Typography>

                <Divider sx={{ my: 1 }} />

                <Stack direction="row" spacing={1}>
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => onEditRow(row.name)}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => onDeleteRow && onDeleteRow(row.id)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Stack>

                {selected.includes(row.id) && (
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
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

        {!hasMore && (
          <Typography align="center" variant="body2" sx={{ color: 'text.secondary', py: 2 }}>
            No more data
          </Typography>
        )}
      </Stack>
    </Box>
  );
}

MarketMobileViewCardLayout.propTypes = {
  data: PropTypes.array,
  onEditRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  selected: PropTypes.array,
};

export default MarketMobileViewCardLayout;
