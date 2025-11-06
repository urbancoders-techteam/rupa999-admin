import PropTypes from 'prop-types';
import { Grid, InputAdornment, TextField, MenuItem, Button } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import Iconify from '../iconify';

// ----------------------------------------------------------------------

CustomTableToolbar.propTypes = {
  isFiltered: PropTypes.bool,
  filterName: PropTypes.string,
  selectedDate: PropTypes.object,
  selectedDropDown: PropTypes.string,
  onFilterName: PropTypes.func,
  onselectedDropDown: PropTypes.func,
  onResetFilter: PropTypes.func,
  onDateFilter: PropTypes.func,
  fileterOptions: PropTypes.arrayOf(PropTypes.string),
};

export default function CustomTableToolbar({
  isFiltered,
  filterName,
  selectedDate,
  selectedDropDown,
  fileterOptions,
  onFilterName,
  onDateFilter,
  onselectedDropDown,
  onResetFilter,
}) {
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
      {fileterOptions && (
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            select
            fullWidth
            size="small"
            label="Select Market"
            value={selectedDropDown}
            onChange={onselectedDropDown}
            SelectProps={{
              MenuProps: {
                PaperProps: {
                  sx: { maxHeight: 260 },
                },
              },
            }}
          >
            {fileterOptions.map((option) => (
              <MenuItem
                key={option}
                value={option}
                sx={{
                  mx: 1,
                  borderRadius: 0.75,
                  typography: 'body2',
                  textTransform: 'capitalize',
                }}
              >
                {option}
              </MenuItem>
            ))}
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
