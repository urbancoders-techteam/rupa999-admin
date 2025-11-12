import React from 'react';
import PropTypes from 'prop-types';
import { useFormContext, Controller } from 'react-hook-form';
import { TextField, Box, Typography } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const RHFDatePicker = ({
  label,
  name,
  size,
  value,
  onChange,
  disableFuture = false,
  minDate,
  maxDate,
  format,
  width = '100%',
  height = 'auto',
  required = false,
  errorMessage,
}) => {
  const { control } = useFormContext();

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Controller
        name={name}
        control={control}
        defaultValue={value || null}
        rules={{ required: required ? 'Date is required' : false }}
        render={({ field }) => (
          <Box sx={{ width, height }}>
            <DatePicker
              {...field}
              label={label}
              // format={format || 'DD/MM/YYYY'}
              format='DD/MM/YYYY'
              value={field.value ? dayjs(field.value) : null}
              sx={{ width }}
              onChange={(newDate) => {
                field.onChange(newDate);
                if (onChange) {
                  onChange(newDate);
                }
              }}
              disableFuture={disableFuture}
              //   minDate={minDate ? dayjs(minDate) : null}
              minDate={minDate || null}
              maxDate={maxDate || null}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  size={size || 'medium'}
                  error={!!errorMessage}
                  helperText={errorMessage}
                />
              )}
            />
            <Typography variant="caption" ml={1.5} color="error">
              {errorMessage}
            </Typography>
          </Box>
        )}
      />
    </LocalizationProvider>
  );
};

// Prop Types
RHFDatePicker.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  size: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  onChange: PropTypes.func,
  disableFuture: PropTypes.bool,
  minDate: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  maxDate: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  format: PropTypes.string,
  width: PropTypes.string,
  height: PropTypes.string,
  required: PropTypes.bool,
  errorMessage: PropTypes.string,
};

export default RHFDatePicker;
