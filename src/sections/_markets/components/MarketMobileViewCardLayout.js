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
  Box,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CircularProgress from '@mui/material/CircularProgress';
import dayjs from 'dayjs';
import Label from '../../../components/label';
import { fDateTimeOrdinal } from '../../../utils/formatTime';

function MarketMobileViewCardLayout({
  data = [],
  onEditRow,
  onDeleteRow,
  onSelectRow,
  selected = [],
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
      <Stack spacing={0.5}>
        {visibleData?.map((row, index) => (
          <Accordion
            key={row.id}
            sx={{ borderRadius: 2, boxShadow: 'none',  }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 2, py: 1 }}>
              <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body1" sx={{ fontWeight: 700, borderRight: '1px solid', pr: 1, mr: 1 }}>
                  {index + 1 || '—'}
                </Typography>
                <Typography variant="body1" sx={{flex:1 , flexWrap:'nowrap', fontWeight: 700, borderRight: '1px solid', pr: 1, mr: 1 }}>
                  {row.name || '—'}
                </Typography>
                <Label
                  variant="soft"
                  color={
                    row.currentStatus === 'enable'
                      ? 'success'
                      : row.currentStatus === 'disable'
                      ? 'error'
                      : 'default'
                  }
                  sx={{ textTransform: 'capitalize' }}
                >
                  {row.hideOpen}
                </Label>
              </Box>
            </AccordionSummary>

            <AccordionDetails>
              <Stack spacing={0.5}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Open Time:
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.primary', textAlign: 'right' }}>
                    {dayjs(row.openTime).format("hh:mm A") || '—'}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Close Time:
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.primary', textAlign: 'right' }}>
                    {dayjs(row.closeTime).format("hh:mm A") || '—'}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Active Days:
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.primary', textAlign: 'right' }}>
                    {Array.isArray(row.activeDays) && row.activeDays.length
                      ? row.activeDays.map((d) => (typeof d === 'string' ? d.charAt(0).toUpperCase() + d.slice(1) : d)).join(', ')
                      : '—'}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Created At:
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.primary', textAlign: 'right' }}>
                    {row.createdAt ? fDateTimeOrdinal(row.createdAt) : '—'}
                  </Typography>
                </Box>

                <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end', pt: 1 }}>
                  <IconButton size="small" color="primary" onClick={() => onEditRow(row.name)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" color="error" onClick={() => onDeleteRow && onDeleteRow(row.id)}>
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
