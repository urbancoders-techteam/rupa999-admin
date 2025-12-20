import React from 'react'
import PropTypes from 'prop-types'
import { Controller, useFormContext } from 'react-hook-form'
import { Box, TextField } from '@mui/material'
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'

const RHFDatePicker = ({
  name,
  label,
  size = 'medium',
  disableFuture = false,
  minDate,
  maxDate,
  format = 'DD/MM/YYYY',
  width = '100%',
  required = false,
  errorMessage,
}) => {
  const { control } = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      rules={{ required: required ? 'Date is required' : false }}
      render={({ field, fieldState }) => {
        const errorText = fieldState.error?.message || errorMessage

        return (
          <Box sx={{ width }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label={label}
                format={format}
                value={field.value ? dayjs(field.value) : null}
                onChange={(newValue) => {
                  field.onChange(newValue)
                }}
                disableFuture={disableFuture}
                minDate={minDate ? dayjs(minDate) : undefined}
                maxDate={maxDate ? dayjs(maxDate) : undefined}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    size={size}
                    error={!!errorText}
                    helperText={errorText}
                  />
                )}
              />
            </LocalizationProvider>
          </Box>
        )
      }}
    />
  )
}

/* -------------------------------------------------------------------------- */
/*                                   PROP TYPES                                */
/* -------------------------------------------------------------------------- */

RHFDatePicker.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium']),
  disableFuture: PropTypes.bool,
  minDate: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  maxDate: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  format: PropTypes.string,
  width: PropTypes.string,
  required: PropTypes.bool,
  errorMessage: PropTypes.string,
}

export default RHFDatePicker
