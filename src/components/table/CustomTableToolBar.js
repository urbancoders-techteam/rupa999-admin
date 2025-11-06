import PropTypes from 'prop-types';
// @mui
import { Stack, InputAdornment, TextField, MenuItem, Button } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { useState } from 'react';
import Iconify from '../iconify';
// components

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
    <Stack
      spacing={2}
      alignItems="center"
      direction={{
        xs: 'column',
        sm: 'row',
      }}
      sx={{ px: { xs: 1.5, md: 2.5 }, py: { xs: 1, md: 3 } }}
    >
    

      <TextField
        fullWidth
        size="small"
        maxWidth={{ sm: 240 }}
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
        {fileterOptions && (
        <TextField
          size="small"
          fullWidth
          select
          label="Select Market"
          value={selectedDropDown}
          onChange={onselectedDropDown}
          SelectProps={{
            MenuProps: {
              PaperProps: {
                sx: {
                  maxHeight: 260,
                },
              },
            },
          }}
          sx={{
            maxWidth: { sm: 240 },
            textTransform: 'capitalize',
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
      )}

     {selectedDate && <DatePicker
        size="small"
        label="Selecte date"
        format="DD/MM/YYYY"
        value={selectedDate}
        onChange={onDateFilter}
        renderInput={(params) => <TextField size="small" {...params} />}
      />}

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
