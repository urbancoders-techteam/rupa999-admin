/* eslint-disable no-nested-ternary */
import React, { useState, useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  Typography,
  Stack,
  IconButton,
  Box,
  CircularProgress,
  MenuItem,
  Button,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Iconify from '../../../../components/iconify';
import MenuPopover from '../../../../components/menu-popover';
import ConfirmDialog from '../../../../components/confirm-dialog';

function WithdrawalRequestMobileViewLayout({
  data = [],
  onEditRow,
  onDeleteRow,
  onSelectRow,
  selected = [],
}) {
  const theme = useTheme();
  const [visibleData, setVisibleData] = useState(data.slice(0, 10));
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(data.length > 10);
  const containerRef = useRef(null);

  // Popover and Confirm
  const [openPopover, setOpenPopover] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleOpenPopover = (event, row) => {
    setSelectedRow(row);
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => setOpenPopover(null);
  const handleOpenConfirm = () => setOpenConfirm(true);
  const handleCloseConfirm = () => setOpenConfirm(false);

  // Infinite Scroll Logic
  const handleScroll = useCallback(() => {
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
  }, [loading, hasMore, visibleData.length, data]);

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
          <Box
            key={row.id}
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
              mb={1}
            >
              <Typography variant="subtitle1" fontWeight={600}>
                {row.name || 'SUPREME NIGHT'}
              </Typography>
              <IconButton
                size="small"
                onClick={(e) => handleOpenPopover(e, row)}
              >
                <Iconify icon="eva:more-vertical-fill" />
              </IconButton>
            </Stack>

            {/* Basic Info */}
            <Typography variant="body2" color="text.secondary">
              Phone. : <strong>{row.phone || '—'}</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              	Amount : <strong>{row.resultDate || '—'}</strong>
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5 }}>
              Request Type : <strong>{row.digits || '—'}</strong>
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5 }}>
              Date: <strong>{row.points || '—'}</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Status: <strong>{row.date || '—'}</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Created At: <strong>{row.createdAt || '—'}</strong>
            </Typography>

            {selected.includes(row.id) && (
              <Typography
                variant="caption"
                sx={{ color: 'text.secondary', mt: 0.5 }}
              >
                Selected
              </Typography>
            )}
          </Box>
        ))}

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <CircularProgress size={32} color="primary" />
          </Box>
        )}

        {!hasMore && !loading && (
          <Typography
            align="center"
            variant="body2"
            sx={{ color: 'text.secondary', py: 2 }}
          >
            No more data
          </Typography>
        )}
      </Stack>

      {/* Popover */}
      <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            handleOpenConfirm();
            handleClosePopover();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="eva:refresh-outline" />
          Revert
        </MenuItem>
      </MenuPopover>

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Revert Result"
        content="Are you sure you want to revert this result?"
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              onSelectRow?.(selectedRow);
              handleCloseConfirm();
            }}
          >
            Revert
          </Button>
        }
      />
    </Box>
  );
}

WithdrawalRequestMobileViewLayout.propTypes = {
  data: PropTypes.array,
  onEditRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  selected: PropTypes.array,
};

export default WithdrawalRequestMobileViewLayout;
