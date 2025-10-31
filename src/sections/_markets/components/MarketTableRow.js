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
import Label from '../../../components/label';
import Iconify from '../../../components/iconify';
import MenuPopover from '../../../components/menu-popover';

// ----------------------------------------------------------------------

MarketTableRow.propTypes = {
  index: PropTypes.number,
  row: PropTypes.object,
  onEditRow: PropTypes.func,
};

export default function MarketTableRow({ index, row, onEditRow }) {
  const {
    id,
    name,
    currentStatus,
    gameDisabled,
    saturdayOpen,
    sundayOpen,
    autoResult,
    openTime,
    closeTime,
    openResultTime,
    closeResultTime,
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
        <TableCell align="center">{id}</TableCell>

        <TableCell align="left">
          <Typography variant="subtitle2" noWrap>
            {name}
          </Typography>
        </TableCell>

        <TableCell align="left" sx={{minWidth:'100px'}}>
          <Label
            variant="soft"
            color={(() => {
              if (currentStatus === 'OPEN NOW') return 'success';
              if (currentStatus === 'CLOSED NOW') return 'error';
              return 'default';
            })()}
            sx={{ textTransform: 'capitalize', fontSize: '0.75rem' }}
          >
            {currentStatus}
          </Label>
        </TableCell>

        <TableCell align="left" sx={{minWidth:'100px'}}>{gameDisabled}</TableCell>
        <TableCell align="left" sx={{minWidth:'100px'}}>{saturdayOpen}</TableCell>
        <TableCell align="left" sx={{minWidth:'100px'}}>{sundayOpen}</TableCell>
        <TableCell align="left" sx={{minWidth:'100px'}}>{autoResult}</TableCell>
        <TableCell align="left" sx={{minWidth:'100px'}}>{openTime}</TableCell>
        <TableCell align="left" sx={{minWidth:'100px'}}>{closeTime}</TableCell>
        <TableCell align="left" sx={{minWidth:'100px'}}>{openResultTime}</TableCell>
        <TableCell align="left" sx={{minWidth:'100px'}}>{closeResultTime}</TableCell>
        <TableCell align="left" sx={{minWidth:'150px'}}>{createdAt}</TableCell>

       
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
