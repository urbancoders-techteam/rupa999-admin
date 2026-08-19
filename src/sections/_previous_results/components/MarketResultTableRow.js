import PropTypes from 'prop-types';
import { useState } from 'react';
import {
  Button,
  TableRow,
  TableCell,
  IconButton,
  Typography,
  styled,
  MenuItem,
  Stack,
} from '@mui/material';
import { fDateTime } from '../../../utils/formatTime';
import Iconify from '../../../components/iconify';
import MenuPopover from '../../../components/menu-popover';
import ConfirmDialog from '../../../components/confirm-dialog';
import Label from '../../../components/label';

// ----------------------------------------------------------------------

MarketResultTableRow.propTypes = {
  row: PropTypes.shape({
    _id: PropTypes.string,
    market: PropTypes.object,
    resultDate: PropTypes.string,
    result: PropTypes.string,
    openPana: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    closePana: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    action: PropTypes.string,
    createdAt: PropTypes.string,
  }),
  onRevert: PropTypes.func,
};

// ----------------------------------------------------------------------
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(even)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    borderBottom: 0,
  },
}));

// ----------------------------------------------------------------------

export default function MarketResultTableRow({ row, onRevert }) {
  const { _id, market, resultDate, result, openPana, closePana, createdAt } = row;

  const [anchorEl, setAnchorEl] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);

  const handleOpenPopover = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const handleOpenConfirm = () => setOpenConfirm(true);
  const handleCloseConfirm = () => setOpenConfirm(false);

  const handleRevert = async (session) => {
    if (!_id || !onRevert) return;
    await onRevert(_id, session);
    handleCloseConfirm();
  };

  // Desktop layout (TableRow)
  return (
    <>
      <StyledTableRow hover>
        <TableCell align="left">
          <IconButton color={anchorEl ? 'inherit' : 'default'} onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
        
        <TableCell align="left">
          <Typography variant="subtitle2" noWrap>
            {market?.name}
          </Typography>
        </TableCell>

        <TableCell align="center">{fDateTime(resultDate || null)}</TableCell>

        <TableCell align="center">
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {result}
          </Typography>
        </TableCell>

        <TableCell align="center">
          <Label variant="soft" color="info" sx={{ px: 2, fontWeight: 500 }}>
            {openPana ?? '-'}
          </Label>
        </TableCell>

        <TableCell align="center">
          <Label
            variant="soft"
            color={closePana ? 'success' : 'warning'}
            sx={{ px: 2, fontWeight: 500 }}
          >
            {closePana ?? 'NULL'}
          </Label>
        </TableCell>

        <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
          <Typography variant="body2" color="text.secondary">
            {fDateTime(createdAt)}
          </Typography>
        </TableCell>
      </StyledTableRow>

      {/* MenuPopover anchored to the icon button */}
      <MenuPopover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
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

      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Revert Result"
        content="Which part of this result do you want to revert?"
        action={
          <Stack direction="row" spacing={1}>
            <Button variant="contained" color="info" onClick={() => handleRevert('open')}>
              Revert Open
            </Button>
            <Button
              variant="contained"
              color="warning"
              onClick={() => handleRevert('close')}
              disabled={!closePana}
            >
              Revert Close
            </Button>
          </Stack>
        }
      />
    </>
  );
}
