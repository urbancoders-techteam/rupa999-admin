import { Button, Grid, InputAdornment, MenuItem, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import PropTypes from 'prop-types';
import Iconify from '../iconify';

// ----------------------------------------------------------------------

CustomTableToolbar.propTypes = {
  isFiltered: PropTypes.bool,
  filterName: PropTypes.string,
  selectedDate: PropTypes.object,
  selectedDropDown: PropTypes.string,
  onFilterName: PropTypes.func,
  onSearch: PropTypes.func,
  onselectedDropDown: PropTypes.func,
  onResetFilter: PropTypes.func,
  onDateFilter: PropTypes.func,
  fileterOptions: PropTypes.arrayOf(PropTypes.string),
  marketOptions: PropTypes.array,
};

export default function CustomTableToolbar({
  isFiltered,
  filterName,
  selectedDate,
  selectedDropDown,
  fileterOptions,
  marketOptions,
  onFilterName,
  onSearch,
  onDateFilter,
  onselectedDropDown,
  onResetFilter,
}) {
  const handleSearchClick = () => {
    if (onSearch) {
      onSearch();
    }
  };

  // Use marketOptions if provided, otherwise fall back to fileterOptions
  const dropdownOptions = marketOptions || fileterOptions || [];

  return (
    <Grid
      container
      spacing={2}
      alignItems="center"
      justifyContent="flex-start"
      sx={{
        px: { xs: 1.5, md: 2.5 },
        py: { xs: 1.5, md: 2.5 },
      }}
    >
      {/* Search Field */}
      <Grid item xs={12} sm={6} md={3}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search..."
          value={filterName}
          onChange={onFilterName}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />
      </Grid>

      {/* Dropdown Field */}
      {dropdownOptions.length > 0 && (
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            select
            fullWidth
            size="small"
            label="Select Market"
            value={selectedDropDown || ''}
            onChange={(e) => {
              if (onselectedDropDown) {
                onselectedDropDown(e);
              }
            }}
            SelectProps={{
              MenuProps: {
                PaperProps: {
                  sx: { maxHeight: 260 },
                },
              },
            }}
          >
            <MenuItem value="">
              <em>All Markets</em>
            </MenuItem>
            {dropdownOptions.map((option) => {
              // Handle both string options and object options with id/name
              const value = typeof option === 'object' ? option.id || option._id : option;
              const label = typeof option === 'object' ? option.name : option;
              return (
                <MenuItem
                  key={value}
                  value={value}
                  sx={{
                    mx: 1,
                    borderRadius: 0.75,
                    typography: 'body2',
                    textTransform: 'capitalize',
                  }}
                >
                  {label}
                </MenuItem>
              );
            })}
          </TextField>
        </Grid>
      )}

      {/* Date Picker */}
      {selectedDate && (
        <Grid item xs={12} sm={6} md={3}>
          <DatePicker
            label="Select Date"
            format="DD/MM/YYYY"
            value={selectedDate}
            onChange={onDateFilter}
            slotProps={{
              textField: { size: 'small', fullWidth: true },
            }}
          />
        </Grid>
      )}

      {/* Search Button */}
      {onSearch && (
        <Grid item xs={12} sm={6} md={2}>
          <Button
            variant="contained"
            onClick={handleSearchClick}
            startIcon={<Iconify icon="eva:search-fill" />}
            sx={{ height: '40px' }}
          >
            Search
          </Button>
        </Grid>
      )}

      {/* Clear Filter Button */}
      {isFiltered && (
        <Grid item xs={12} sm={6} md={2}>
          <Button
            fullWidth
            color="error"
            onClick={onResetFilter}
            startIcon={<Iconify icon="eva:trash-2-outline" />}
            sx={{ height: '40px' }}
          >
            Clear
          </Button>
        </Grid>
      )}
    </Grid>
  );
}
