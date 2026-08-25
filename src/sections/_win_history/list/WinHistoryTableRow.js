/* eslint-disable no-nested-ternary */
import { IconButton, Link, MenuItem, TableCell, TableRow, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useState } from 'react';
import Iconify from '../../../components/iconify';
import MenuPopover from '../../../components/menu-popover';

// ----------------------------------------------------------------------

WinHistoryTableRow.propTypes = {
  index: PropTypes.number,
  row: PropTypes.object,
  onEditRow: PropTypes.func,
  onViewUser: PropTypes.func,
};

export default function WinHistoryTableRow({ index, row, onEditRow, onViewUser }) {
  const { marketName, userName, contactNumber, session, number, amount, winAmount, createdAt, userId } =
    row;

  const [openPopover, setOpenPopover] = useState(null);

  const handleOpenPopover = (event) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  const handlePhoneClick = () => {
    if (!userId || !onViewUser) return;
    onViewUser(userId, userName);
  };

  return (
    <>
      <TableRow hover>
        <TableCell align="left">
          <IconButton color={openPopover ? 'inherit' : 'default'} onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
        <TableCell align="left">{index}</TableCell>

        <TableCell align="left">
          <Typography variant="subtitle2" noWrap>
            {marketName}
          </Typography>
        </TableCell>

        <TableCell align="left">{userName}</TableCell>
        <TableCell align="left">
          {userId && onViewUser && contactNumber && contactNumber !== 'N/A' ? (
            <Link
              component="button"
              type="button"
              underline="hover"
              onClick={handlePhoneClick}
              sx={{
                color: 'primary.main',
                fontWeight: 600,
                cursor: 'pointer',
                border: 'none',
                background: 'none',
                p: 0,
                font: 'inherit',
              }}
            >
              {contactNumber}
            </Link>
          ) : (
            contactNumber || '—'
          )}
        </TableCell>

        <TableCell align="left">{number}</TableCell>

        <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
          {session}
        </TableCell>

        <TableCell align="left">₹{amount?.toLocaleString('en-IN') || 0}</TableCell>

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
