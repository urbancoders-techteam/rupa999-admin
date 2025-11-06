import PropTypes from 'prop-types';
// @mui
import { Stack, InputAdornment, TextField, Button, Autocomplete } from '@mui/material';
// components
import { useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers';
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------

PreviousResultToolbar.propTypes = {
  isFiltered: PropTypes.bool,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  onResetFilter: PropTypes.func,
};

export default function PreviousResultToolbar({
  isFiltered,
  filterName,
  onFilterName,
  onResetFilter,
}) {
  const [startDate, setStartDate] = useState(new Date());
  const [subMenuValue, setSubMenuValue] = useState('');

  const onChangeStartDate = (newValue) => {
    setStartDate(newValue);
  };
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
        size="small"
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

      <Autocomplete
        size="small"
        fullWidth
        options={optionsData}
        value={subMenuValue}
        onChange={(_, newValue) => setSubMenuValue(newValue)}
        renderInput={(params) => <TextField {...params} label="Choose Markets" fullWidth />}
      />

      {/* <Grid item xs={12} sm={6} md={3}> */}
                  <DatePicker
                    size="small"
                    label="Start date"
                    format="DD/MM/YYYY"
                    value={startDate}
                    onChange={onChangeStartDate}
                    renderInput={(params) => <TextField size="small" {...params} />}
                  />
                {/* </Grid> */}

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

const optionsData = [
  'SRIDEVI DAY',
  'TIME BAZAR',
  'MADHUR DAY',
  'MILAN DAY',
  'RAJDHANI DAY',
  'SUPREME DAY',
  'KALIYAN',
  'SRIDEVI NIGHT',
  'MADHUR NIGHT',
  'MILAN NIGHT',
  'KALIYAN NIGHT',
  'MAIN BAZAR',
  'RAJDHANI NIGHT',
  'KARNATAKA DAY',
  'KARNATAKA NIGHT',
];
