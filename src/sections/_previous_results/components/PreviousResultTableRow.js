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
  useMediaQuery,
  Box,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Iconify from '../../../components/iconify';
import MenuPopover from '../../../components/menu-popover';
import ConfirmDialog from '../../../components/confirm-dialog';
import Label from '../../../components/label';

// ----------------------------------------------------------------------

PreviousResultTableRow.propTypes = {
  row: PropTypes.shape({
    id: PropTypes.number,
    gameName: PropTypes.string,
    resultDate: PropTypes.string,
    result: PropTypes.string,
    openPana: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    closePana: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    action: PropTypes.string,
    createdAt: PropTypes.string,
  }),
  onRevert: PropTypes.func,
};

export default function PreviousResultTableRow({ row, onRevert }) {
  const {
    id,
    gameName,
    resultDate,
    result,
    openPana,
    closePana,
    createdAt,
  } = row;

  const [openPopover, setOpenPopover] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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

  // Mobile layout (Card style)
  if (isMobile) {
    return (
      <>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 2,
            border: `1px solid ${theme.palette.divider}`,
            p: 2,
            mb: 2,
            boxShadow: theme.shadows[1],
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mb={1}
          >
            <Typography variant="subtitle1" fontWeight={600}>
              {gameName}
            </Typography>
            <IconButton size="small" onClick={handleOpenPopover}>
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          </Stack>

          <Typography variant="body2" color="text.secondary">
            Date: <strong>{resultDate}</strong>
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.5 }}>
            Result: <strong>{result}</strong>
          </Typography>

          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
            <Label variant="soft" color="info" sx={{ px: 1.5 }}>
              {openPana ?? '-'}
            </Label>
            <Label
              variant="soft"
              color={closePana ? 'success' : 'warning'}
              sx={{ px: 1.5 }}
            >
              {closePana ?? 'NULL'}
            </Label>
          </Stack>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 1, display: 'block' }}
          >
            Created: {createdAt}
          </Typography>

          <Button
            variant="outlined"
            color="primary"
            size="small"
            sx={{ mt: 1 }}
            onClick={handleOpenConfirm}
          >
            Revert
          </Button>
        </Box>

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

  // Desktop layout (TableRow)
  return (
    <>
      <StyledTableRow hover>
        <TableCell align="left">{id}</TableCell>

        <TableCell align="left">
          <Typography variant="subtitle2" noWrap>
            {gameName}
          </Typography>
        </TableCell>

        <TableCell align="center">{resultDate}</TableCell>

        <TableCell align="center">
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {result}
          </Typography>
        </TableCell>

        <TableCell align="center">
          <Label variant="soft" color="info" sx={{ px: 2, fontWeight: 500 }}>
            {openPana ?? '-'}
          </Label>
        </TableCell>

        <TableCell align="center">
          <Label
            variant="soft"
            color={closePana ? 'success' : 'warning'}
            sx={{ px: 2, fontWeight: 500 }}
          >
            {closePana ?? 'NULL'}
          </Label>
        </TableCell>

        <TableCell align="center">
          <Button
            variant="outlined"
            size="small"
            color="primary"
            onClick={handleOpenConfirm}
          >
            Revert
          </Button>
        </TableCell>

        <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
          <Typography variant="body2" color="text.secondary">
            {createdAt}
          </Typography>
        </TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
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
