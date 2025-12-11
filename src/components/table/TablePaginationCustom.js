import PropTypes from 'prop-types';
// @mui
import { Box, FormControlLabel, Switch, TablePagination } from '@mui/material';

// ----------------------------------------------------------------------

TablePaginationCustom.propTypes = {
  dense: PropTypes.bool,
  onChangeDense: PropTypes.func,
  rowsPerPageOptions: PropTypes.arrayOf(PropTypes.number),
  sx: PropTypes.object,
};

export default function TablePaginationCustom({
  dense,
  onChangeDense,
  rowsPerPageOptions = [10, 25, 50, 100, 200],
  sx,
  ...other
}) {
  return (
    <Box sx={{ position: 'relative', ...sx }}>
      <TablePagination
        rowsPerPageOptions={rowsPerPageOptions}
        component="div"
        showFirstButton
        showLastButton
        {...other}
      />

      {onChangeDense && (
        <FormControlLabel
          label="Dense"
          control={<Switch checked={dense} onChange={onChangeDense} />}
          sx={{
            pl: 2,
            py: 1.5,
            top: 0,
            position: {
              md: 'absolute',
            },
          }}
        />
      )}
    </Box>
  );
}
