/* eslint-disable no-nested-ternary */
import { MenuItem, TableCell, TableRow, Typography, Link } from '@mui/material';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Iconify from '../../../components/iconify';
import MenuPopover from '../../../components/menu-popover';
import { fDateTime } from '../../../utils/formatTime';
import { PATH_DASHBOARD } from '../../../routes/paths';

// ----------------------------------------------------------------------

BidRecordTableRow.propTypes = {
  index: PropTypes.number,
  row: PropTypes.object,
  onEditRow: PropTypes.func,
};

export default function BidRecordTableRow({ index, row, onEditRow }) {
  const { id, marketName, userName, mobile, session, number, amount, createdAt } =
    row;

  const [openPopover, setOpenPopover] = useState(null);
  const navigate = useNavigate();

  const handleUserClick = () => {
    if (!userName) return;
    navigate(`${PATH_DASHBOARD.user.list}?search=${encodeURIComponent(userName)}`);
  };

  const handleOpenPopover = (event) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  return (
    <>
      <TableRow hover>
        <TableCell align="left">{index + 1}</TableCell>

        <TableCell align="left">
          <Typography variant="subtitle2" noWrap>
            {marketName}
          </Typography>
        </TableCell>

        <TableCell align="left">
          <Link
            component="button"
            type="button"
            onClick={handleUserClick}
            sx={{ fontWeight: 600, textDecoration: 'underline' }}
          >
            {userName}
          </Link>
        </TableCell>
        <TableCell align="left">{mobile || '—'}</TableCell>

        <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
          {session}
        </TableCell>

        <TableCell align="left">₹{amount?.toLocaleString('en-IN') || 0}</TableCell>

        <TableCell align="left">{number}</TableCell>

        <TableCell align="left" maxWidth="190px">{fDateTime(createdAt) || '—'}</TableCell>
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
