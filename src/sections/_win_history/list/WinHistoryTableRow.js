/* eslint-disable no-nested-ternary */
import { IconButton, MenuItem, TableCell, TableRow, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useState } from 'react';
import Iconify from '../../../components/iconify';
import MenuPopover from '../../../components/menu-popover';
import { fDateTime } from '../../../utils/formatTime';

// ----------------------------------------------------------------------

WinHistoryTableRow.propTypes = {
  index: PropTypes.number,
  row: PropTypes.object,
  onEditRow: PropTypes.func,
};

export default function WinHistoryTableRow({ index, row, onEditRow }) {
  const { id, marketName, userName, contactNumber, session, number, amount, winAmount, createdAt } =
    row;

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
        <TableCell align="left">
          <IconButton color={openPopover ? 'inherit' : 'default'} onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
        <TableCell align="left">{index + 1}</TableCell>

        <TableCell align="left">
          <Typography variant="subtitle2" noWrap>
            {marketName}
          </Typography>
        </TableCell>

        <TableCell align="left">{userName}</TableCell>
        <TableCell align="left">{contactNumber || '—'}</TableCell>

        <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
          {session}
        </TableCell>

        <TableCell align="left">₹{amount?.toLocaleString('en-IN') || 0}</TableCell>

        <TableCell align="left">{number}</TableCell>

        <TableCell align="left">₹{winAmount?.toLocaleString('en-IN') || 0}</TableCell>

        <TableCell align="left" maxWidth="190px">
          {createdAt || 'N/A'}
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
