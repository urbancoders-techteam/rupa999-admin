import PropTypes from 'prop-types';
import { useState } from 'react';
import {
  Button,
  IconButton,
  MenuItem,
  TableCell,
  TableRow,
  Typography,
  Tooltip,
  Stack,
} from '@mui/material';
import dayjs from 'dayjs';
import ConfirmDialog from '../../../components/confirm-dialog';
import Iconify from '../../../components/iconify';
import MenuPopover from '../../../components/menu-popover';

export default function FaqTableRow({ row, index, selected, onViewRow, onEditRow, onDeleteRow }) {
  const { question, answer, createdAt, updatedAt } = row;

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
      <TableRow hover selected={selected}>
        <TableCell align="left">{index}</TableCell>

        <TableCell align="left" >
          <Tooltip title={question || ''} placement="top" arrow>
            <Typography
              variant="subtitle2"
              noWrap
              color="text.secondary"
              sx={{ maxWidth: 300, display: 'block' }}
            >
              {question}
            </Typography>
          </Tooltip>
        </TableCell>

        <TableCell align="left" sx={{ maxWidth: 260 }}>
          <Tooltip title={answer || ''} placement="top" arrow>
            <Typography
              variant="body2"
              color="text.secondary"
              noWrap
              sx={{ maxWidth: 260, display: 'block' }}
            >
              {answer}
            </Typography>
          </Tooltip>
        </TableCell>

        <TableCell align="left">
          <Stack spacing={0.5}>
            <Typography variant="body2" color="text.secondary" noWrap>
              {createdAt ? dayjs(createdAt).format('DD/MM/YYYY hh:mm A') : '-'}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell align="left">
          <Stack spacing={0.5}>
            <Typography variant="body2" color="text.secondary" noWrap>
              {updatedAt ? dayjs(updatedAt).format('DD/MM/YYYY hh:mm A') : '-'}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell align="right">
          <IconButton
            color={anchorEl ? 'inherit' : 'default'}
            onClick={handleOpenPopover}
            size="small"
          >
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <MenuPopover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ horizontal: 'right' }}
      >
        <MenuItem
          onClick={() => {
            onViewRow?.();
            handleClosePopover();
          }}
        >
          <Iconify icon="eva:eye-fill" />
          View
        </MenuItem>

        <MenuItem
          onClick={() => {
            onEditRow?.();
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
        title="Delete FAQ"
        content="Are you sure you want to delete this FAQ? This action cannot be undone."
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

FaqTableRow.propTypes = {
  row: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  selected: PropTypes.bool,
  onViewRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onDeleteRow: PropTypes.func.isRequired,
};
