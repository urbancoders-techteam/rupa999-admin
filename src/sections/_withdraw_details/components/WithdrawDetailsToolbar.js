import PropTypes from 'prop-types';
// @mui
import { Stack, InputAdornment, TextField, Button } from '@mui/material';
// components
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------

WithdrawDetailsToolbar.propTypes = {
  isFiltered: PropTypes.bool,
  filterName: PropTypes.string,
  filterUserId: PropTypes.string,
  onFilterName: PropTypes.func,
  onFilterUserId: PropTypes.func,
  onSearch: PropTypes.func,
  onResetFilter: PropTypes.func,
};

export default function WithdrawDetailsToolbar({
  isFiltered,
  filterName,
  filterUserId,
  onFilterName,
  onFilterUserId,
  onSearch,
  onResetFilter,
}) {
  return (
    <Stack
      spacing={2}
      alignItems="center"
      direction={{
        xs: 'column',
        sm: 'row',
      }}
      sx={{ px: {xs: 0.5, md: 2.5}, py: {xs: 0, md: 3 }}}
    >
      <TextField
        fullWidth
        value={filterName}
        onChange={onFilterName}
        placeholder="Search..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          ),
        }}
      />

      {onFilterUserId && (
        <TextField
          fullWidth
          value={filterUserId}
          onChange={onFilterUserId}
          placeholder="Filter by User ID..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:person-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />
      )}

      {onSearch && (
        <Button
          variant="contained"
          onClick={onSearch}
          startIcon={<Iconify icon="eva:search-fill" />}
          sx={{ flexShrink: 0 }}
        >
          Search
        </Button>
      )}

      {isFiltered && (
        <Button
          color="error"
          sx={{ flexShrink: 0 }}
          onClick={onResetFilter}
          startIcon={<Iconify icon="eva:trash-2-outline" />}
        >
          Clear
        </Button>
      )}
    </Stack>
  );
}
