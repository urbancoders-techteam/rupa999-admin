import { Button, Grid, InputAdornment, MenuItem, TextField, Typography, Box } from '@mui/material';
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
  userName: PropTypes.string,
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
  userName,
}) {
  const handleSearchClick = () => {
    if (onSearch) {
      onSearch();
    }
  };

  // Use marketOptions if provided, otherwise fall back to fileterOptions
  const dropdownOptions = marketOptions || fileterOptions || [];

  return (
    <>
      {/* User Name Display - Only visible when userName is provided */}
      {userName && (
        <Box
          sx={{
            px: { xs: 1, sm: 1.5, md: 2.5 },
            pt: { xs: 1.5, sm: 2, md: 2.5 },
            pb: { xs: 0.5, sm: 1 },
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              color: 'text.primary',
              fontSize: { xs: '0.9375rem', sm: '1rem', md: '1.0625rem' },
            }}
          >
            User: {userName}
          </Typography>
        </Box>
      )}
      <Grid
        container
        spacing={{ xs: 1.5, sm: 2 }}
        alignItems="center"
        justifyContent="flex-start"
        sx={{
          px: { xs: 0, sm: 1.5, md: 2.5 },
          py: { xs: 1, sm: 1.5, md: 2.5 },
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
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', fontSize: { xs: 18, sm: 20 } }} />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiInputBase-root': {
              fontSize: { xs: '0.875rem', sm: '1rem' },
            },
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
                  sx: { 
                    maxHeight: { xs: 200, sm: 260 },
                    '& .MuiMenuItem-root': {
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                    },
                  },
                },
              },
            }}
            sx={{
              '& .MuiInputBase-root': {
                fontSize: { xs: '0.875rem', sm: '1rem' },
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
                    fontSize: { xs: '0.875rem', sm: '1rem' },
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
            inputFormat="dd/MM/yyyy"
            value={selectedDate}
            onChange={onDateFilter}
            renderInput={(params) => (
              <TextField
                {...params}
                size="small"
                fullWidth
                sx={{
                  '& .MuiInputBase-root': {
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                  },
                }}
              />
            )}
          />
        </Grid>
      )}

      {/* Search Button */}
      {onSearch && (
        <Grid item xs={12} sm={6} md={2}>
          <Button
            variant="contained"
            onClick={handleSearchClick}
            startIcon={<Iconify icon="eva:search-fill" sx={{ fontSize: { xs: 18, sm: 20 } }} />}
            fullWidth
            sx={{ 
              height: { xs: '36px', sm: '40px' },
              fontSize: { xs: '0.8125rem', sm: '0.875rem' },
            }}
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
            startIcon={<Iconify icon="eva:trash-2-outline" sx={{ fontSize: { xs: 18, sm: 20 } }} />}
            sx={{ 
              height: { xs: '36px', sm: '40px' },
              fontSize: { xs: '0.8125rem', sm: '0.875rem' },
            }}
          >
            Clear
          </Button>
        </Grid>
      )}
    </Grid>
    </>
  );
}
