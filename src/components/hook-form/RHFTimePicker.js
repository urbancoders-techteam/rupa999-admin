import React from "react";
import PropTypes from "prop-types";
import { Controller } from "react-hook-form";
import { TextField, Box, Typography } from "@mui/material";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const RHFTimePicker = ({
  label,
  name,
  control,
  value,
  onChange,
  width = "100%",
  required = false,
  errorMessage,
}) => (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Controller
        name={name}
        control={control}
        defaultValue={value || null}
        rules={{ required: required ? "Time is required" : false }}
        render={({ field }) => (
          <Box sx={{ width }}>
            <TimePicker
              {...field}
              label={label}
              sx={{width}}
              value={field.value}
              onChange={(newTime) => {
                field.onChange(newTime);
                if (onChange) {
                  onChange(newTime);
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  error={!!errorMessage}
                  helperText={errorMessage}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "10px",
                      "& fieldset": { borderColor: "#00999E" },
                      "&:hover fieldset": { borderColor: "#007B7F" },
                      "&.Mui-focused fieldset": { borderColor: "#005F61" },
                    },
                  }}
                />
              )}
            />
            <Typography variant="caption" ml={1.5} color="error">{errorMessage}</Typography>
          </Box>
        )}
      />
    </LocalizationProvider>
  );

// Prop Types
RHFTimePicker.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  control: PropTypes.object.isRequired,
  value: PropTypes.object,
  onChange: PropTypes.func,
  width: PropTypes.string,
  required: PropTypes.bool,
  errorMessage: PropTypes.string,
};

export default RHFTimePicker;
