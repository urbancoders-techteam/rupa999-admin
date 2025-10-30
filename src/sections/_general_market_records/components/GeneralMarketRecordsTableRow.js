/* eslint-disable no-nested-ternary */
import PropTypes from 'prop-types';
import { useState } from 'react';
import { TableRow, MenuItem, TableCell, IconButton, Typography } from '@mui/material';
import Label from '../../../components/label';
import Iconify from '../../../components/iconify';
import MenuPopover from '../../../components/menu-popover';

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
        <TableCell align="right">
          <IconButton color={openPopover ? 'inherit' : 'default'} onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
        <TableCell align="center">{id}</TableCell>

        <TableCell align="left">
          <Typography variant="subtitle2" noWrap>
            {marketName}
          </Typography>
        </TableCell>

        <TableCell align="left">{userName}</TableCell>

        <TableCell align="left">{userPhone}</TableCell>

        <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
          {session}
        </TableCell>

        <TableCell align="left">{number}</TableCell>

        <TableCell align="left">{amount}</TableCell>

        <TableCell align="left">{winAmount}</TableCell>

        <TableCell align="left">
          <Label
            variant="soft"
            color={status === 'FAILED' ? 'error' : status === 'SUCCESS' ? 'success' : 'warning'}
            sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}
          >
            {status}
          </Label>
        </TableCell>

        <TableCell align="left">{createdAt}</TableCell>
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
