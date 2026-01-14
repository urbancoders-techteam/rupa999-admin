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
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Iconify from '../../components/iconify';
import MenuPopover from '../../components/menu-popover';
import ConfirmDialog from '../../components/confirm-dialog';
import Label from '../../components/label';

// ----------------------------------------------------------------------

StarLineMarketResultsTableRow.propTypes = {
  index: PropTypes.number,
  row: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    _id: PropTypes.string,
    name: PropTypes.string,
    gameName: PropTypes.string,
    resultDate: PropTypes.string,
    date: PropTypes.string,
    openPana: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    openDigit: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    digit: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    createdAt: PropTypes.string,
  }),
  selected: PropTypes.bool,
  onSelectRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onRevert: PropTypes.func,
};

export default function StarLineMarketResultsTableRow({
  row,
  index,
  selected,
  onSelectRow,
  onEditRow,
  onRevert,
}) {
  const {
    id,
    _id,
    name,
    gameName,
    resultDate,
    date,
    openPana,
    openDigit,
    digit,
    createdAt,
  } = row;

  const displayName = name || gameName || '-';
  const displayDate = resultDate || date || '-';
  const displayDigit = openDigit || digit || '-';

  const theme = useTheme();
  const [openPopover, setOpenPopover] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);

  const handleOpenPopover = (event) => setOpenPopover(event.currentTarget);
  const handleClosePopover = () => setOpenPopover(null);
  const handleOpenConfirm = () => setOpenConfirm(true);
  const handleCloseConfirm = () => setOpenConfirm(false);

  const StyledTableRow = styled(TableRow)(() => ({
    '&:nth-of-type(even)': {
      backgroundColor: theme.palette.action.hover,
    },
    '&:last-child td, &:last-child th': {
      borderBottom: 0,
    },
  }));
  // Desktop layout (TableRow)
  return (
    <>
      <StyledTableRow hover>
         <TableCell align="left">
          <IconButton onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>

        <TableCell align="left">{index}</TableCell>

        <TableCell align="left">
          <Typography variant="subtitle2" noWrap>
            {displayName}
          </Typography>
        </TableCell>

        <TableCell align="left">{displayDate}</TableCell>

        <TableCell align="center">
          <Label variant="soft" color="info" sx={{ px: 2, fontWeight: 500 }}>
            {openPana ?? '-'}
          </Label>
        </TableCell>

        <TableCell align="center">
          <Label variant="soft" color="success" sx={{ px: 2, fontWeight: 500 }}>
            {displayDigit}
          </Label>
        </TableCell>

        <TableCell align="left">
          <Button
            variant="outlined"
            size="small"
            color="primary"
            onClick={handleOpenConfirm}
          >
            Revert
          </Button>
        </TableCell>

        <TableCell align="left" sx={{ whiteSpace: 'nowrap' }}>
          <Typography variant="body2" color="text.secondary">
            {createdAt}
          </Typography>
        </TableCell>

       
      </StyledTableRow>

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
              onRevert?.(row);
              handleCloseConfirm();
            }}
          >
            Revert
          </Button>
        }
      />
    </>
  );
}
