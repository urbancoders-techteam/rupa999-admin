/* eslint-disable no-nested-ternary */
import React, { useState, useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  Typography,
  Stack,
  Box,
  CircularProgress,
  MenuItem,
  Button,
  IconButton,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Iconify from '../../../components/iconify';
import MenuPopover from '../../../components/menu-popover';
import ConfirmDialog from '../../../components/confirm-dialog';
import Label from '../../../components/label';
import { fDateTime } from '../../../utils/formatTime';

function StarlineMarketResultMobileViewCardLayout({
  data = [],
  onEditRow,
  onSelectRow,
  onRevert,
  selected = [],
  page = 0,
  rowsPerPage = 10,
}) {
  const theme = useTheme();
  const [visibleData, setVisibleData] = useState(data.slice(0, 10));
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(data.length > 10);
  const containerRef = useRef(null);

  // Popover + Confirm
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

  // Infinite Scroll
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

  if (!data || data.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 200,
          p: 2,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          No Data Available
        </Typography>
      </Box>
    );
  }

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
        {visibleData.map((row, index) => {
          const serialNumber = (page * rowsPerPage) + index + 1;
          const market = row.marketsId || {};
          const displayName = row.name || market?.name || row.gameName || '-';
          const displayDate = row.resultDate || row.date || '-';
          const displayPana = row.openPana ?? '-';
          const displayDigit = row.openDigit || row.digit || '-';

          return (
            <Box
              key={row.id || row._id}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 2,
                border: `1px solid ${theme.palette.divider}`,
                p: 2,
                mb: 2,
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
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                    #{serialNumber}
                  </Typography>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {displayName}
                  </Typography>
                </Stack>
                <IconButton
                  size="small"
                  onClick={(e) => handleOpenPopover(e, row)}
                >
                  <Iconify icon="eva:more-vertical-fill" />
                </IconButton>
              </Stack>

              {/* Details */}
              <Typography variant="body2" color="text.secondary">
                Date: <strong>{displayDate ? (typeof displayDate === 'string' ? displayDate : fDateTime(displayDate)) : '-'}</strong>
              </Typography>

              <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                <Label variant="soft" color="info" sx={{ px: 1.5 }}>
                  Pana: {displayPana}
                </Label>
                <Label variant="soft" color="success" sx={{ px: 1.5 }}>
                  Digit: {displayDigit}
                </Label>
              </Stack>

              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 1, display: 'block' }}
              >
                Created: {row.createdAt ? fDateTime(row.createdAt) : '-'}
              </Typography>

              {onRevert && (
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  sx={{ mt: 1 }}
                  onClick={() => {
                    setSelectedRow(row);
                    handleOpenConfirm();
                  }}
                >
                  Revert
                </Button>
              )}
            </Box>
          );
        })}

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <CircularProgress size={32} color="primary" />
          </Box>
        )}

        {!hasMore && !loading && data.length > 0 && (
          <Typography
            align="center"
            variant="body2"
            sx={{ color: 'text.secondary', py: 2 }}
          >
            No more data
          </Typography>
        )}
      </Stack>

      {/* Popover Menu */}
      <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        {onRevert && (
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
        )}
      </MenuPopover>

      {/* Confirm Dialog */}
      {onRevert && (
        <ConfirmDialog
          open={openConfirm}
          onClose={handleCloseConfirm}
          title="Revert Result"
          content="Are you sure you want to revert this result?"
          action={
            <Button
              variant="contained"
              color="error"
              onClick={async () => {
                if (selectedRow && onRevert) {
                  const rowId = selectedRow._id || selectedRow.id;
                  await onRevert(rowId);
                }
                handleCloseConfirm();
              }}
            >
              Revert
            </Button>
          }
        />
      )}
    </Box>
  );
}

StarlineMarketResultMobileViewCardLayout.propTypes = {
  data: PropTypes.array,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onRevert: PropTypes.func,
  selected: PropTypes.array,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
};

export default StarlineMarketResultMobileViewCardLayout;
