/* eslint-disable no-nested-ternary */
import { IconButton, MenuItem, TableCell, TableRow, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useState } from 'react';
import Iconify from '../../../components/iconify';
import Label from '../../../components/label';
import MenuPopover from '../../../components/menu-popover';
import { fNumber } from '../../../utils/formatNumber';
import { fDateTime } from '../../../utils/formatTime';

// ----------------------------------------------------------------------

GeneralMarketRecordTableRow.propTypes = {
  index: PropTypes.number,
  row: PropTypes.object,
  onEditRow: PropTypes.func,
};

export default function GeneralMarketRecordTableRow({ index, row, onEditRow }) {
  const {
    id,
    marketName,
    userName,
    userPhone,
    session,
    number,
    amount,
    winAmount,
    status,
    createdAt,
    marketType,
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
      <TableRow hover>
        <TableCell align="right">
          <IconButton color={openPopover ? 'inherit' : 'default'} onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
        <TableCell align="center">{index}</TableCell>

        <TableCell align="left">
          <Typography variant="subtitle2" noWrap>
            {marketName}
          </Typography>
        </TableCell>

        <TableCell align="left">{userName}</TableCell>

        <TableCell align="left">{userPhone}</TableCell>

        {marketType?.toLowerCase() !== 'starline' && (
          <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
            {session}
          </TableCell>
        )}

        <TableCell align="left">{number}</TableCell>

        <TableCell align="left">₹{fNumber(amount || 0)}</TableCell>

        <TableCell align="left">₹{fNumber(winAmount || 0)}</TableCell>

        <TableCell align="left">
          <Label
            variant="soft"
            color={
              status.toLowerCase() === 'won'
                ? 'success'
                : status.toLowerCase() === 'lost'
                  ? 'error'
                  : 'warning'
            }
            sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}
          >
            {status.toLowerCase() === 'won' ? "SUCCESS" : status.toLowerCase() === 'lost' ? "FAILED" : status}
          </Label>
        </TableCell>

        <TableCell align="left">
          <Typography variant="body2">
            {createdAt ? fDateTime(createdAt) : '—'}
          </Typography>
        </TableCell>
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
      </MenuPopover>
    </>
  );
}
