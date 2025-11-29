import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import {
  TableRow,
  MenuItem,
  TableCell,
  IconButton,
  Typography,
} from '@mui/material';
// components
import dayjs from 'dayjs';
import Label from '../../../components/label';
import Iconify from '../../../components/iconify';
import MenuPopover from '../../../components/menu-popover';
import { fDateTime } from '../../../utils/formatTime';

// ----------------------------------------------------------------------

MarketTableRow.propTypes = {
  index: PropTypes.number,
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onSelectRow: PropTypes.func,
};

export default function MarketTableRow({ index, row, selected, onEditRow, onDeleteRow, onSelectRow }) {
  const {
    name,
    openTime,
    closeTime,
    activeDays,
    disableGame,
    hideOpen,
    createdAt,
  } = row;

  const [openPopover, setOpenPopover] = useState(null);

  const handleOpenPopover = (event) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  return (
    <>
      <TableRow hover sx={{ '&:last-child td, &:last-child th': { border: 0.5 } }}>
         <TableCell align="left">
          <IconButton
            color={openPopover ? 'inherit' : 'default'}
            onClick={handleOpenPopover}
          >
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
        <TableCell align="center">{index || ''}</TableCell>

        <TableCell align="left">
          <Typography variant="subtitle2" noWrap>
            {name}
          </Typography>
        </TableCell>

        <TableCell align="left" sx={{ minWidth: '100px' }}>
          {openTime ? dayjs(openTime).format('hh:mm A') : '-'}
        </TableCell>
        <TableCell align="left" sx={{ minWidth: '100px' }}>
          {closeTime ? dayjs(closeTime).format('hh:mm A') : '-'}
        </TableCell>
        <TableCell align="left" sx={{minWidth:'150px'}}>
          <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
            {activeDays.join(', ')}
          </Typography>
        </TableCell>
        <TableCell align="left" sx={{minWidth:'100px'}}>
          <Label
            variant="soft"
            color={disableGame === 'yes' ? 'error' : 'success'}
            sx={{ textTransform: 'capitalize', fontSize: '0.75rem' }}
          >
            {disableGame}
          </Label>
        </TableCell>
        <TableCell align="left" sx={{minWidth:'100px'}}>
          <Label
            variant="soft"
            color={hideOpen === 'enable' ? 'warning' : 'info'}
            sx={{ textTransform: 'capitalize', fontSize: '0.75rem' }}
          >
            {hideOpen}
          </Label>
        </TableCell>
        <TableCell align="left" sx={{minWidth:'150px'}}>{fDateTime(createdAt)}</TableCell>

       
      </TableRow>

      <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            onEditRow();
            handleClosePopover();
          }}
        >
          <Iconify icon="eva:edit-fill" />
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => {
            onDeleteRow();
            handleClosePopover();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="eva:trash-2-outline" />
          Delete
        </MenuItem>
      </MenuPopover>
    </>
  );
}
