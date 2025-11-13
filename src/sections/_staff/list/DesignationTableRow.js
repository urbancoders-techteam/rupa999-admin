import PropTypes from 'prop-types';
import { useState } from 'react';
import {
  Stack,
  Button,
  TableRow,
  TableCell,
  IconButton,
  Typography,
  styled,
  MenuItem,
} from '@mui/material';
import Iconify from '../../../components/iconify';
import MenuPopover from '../../../components/menu-popover';
import ConfirmDialog from '../../../components/confirm-dialog';
import StatusToggleCell from '../../_users/list/StatusToggledCell';

// ----------------------------------------------------------------------
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(even)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

// ----------------------------------------------------------------------

DesignationTableRow.propTypes = {
  index: PropTypes.number,
  row: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    designationName: PropTypes.string,
    status: PropTypes.string,
    createdAt: PropTypes.string,
  }),
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};

export default function DesignationTableRow({ index, row, selected, onEditRow, onViewRow, onDeleteRow }) {
  const {
    id,
    designationName,
    status,
    createdAt,
  } = row;

  const [openConfirm, setOpenConfirm] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpenConfirm = () => setOpenConfirm(true);
  const handleCloseConfirm = () => setOpenConfirm(false);

  const handleOpenPopover = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => setAnchorEl(null);

  return (
    <>
      <StyledTableRow hover>
        <TableCell align="left">
          <IconButton color={anchorEl ? 'inherit' : 'default'} onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>

        <TableCell align="left">{index + 1}</TableCell>

        <TableCell align="left">
          <Stack direction="row" alignItems="left" spacing={2}>
            <Typography variant="subtitle2" noWrap>
              {designationName}
            </Typography>
          </Stack>
        </TableCell>

        <StatusToggleCell id={id} status={status} align="left" justifyContent="left" />

        <TableCell align="left" sx={{ minWidth: '140px' }}>
          <Typography variant="body2" color="text.secondary">
            {createdAt}
          </Typography>
        </TableCell>
      </StyledTableRow>

      <MenuPopover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          horizontal: 'right',
        }}
      >
        <MenuItem
          onClick={() => {
            onViewRow();
            handleClosePopover();
          }}
        >
          <Iconify icon="eva:eye-fill" />
          View
        </MenuItem>

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
            handleOpenConfirm();
            handleClosePopover();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="eva:trash-2-outline" />
          Delete
        </MenuItem>
      </MenuPopover>

      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Delete Designation"
        content="Are you sure you want to delete this designation? This action cannot be undone."
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              onDeleteRow();
              handleCloseConfirm();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}

