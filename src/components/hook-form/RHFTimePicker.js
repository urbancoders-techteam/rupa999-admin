import React from "react";
import PropTypes from "prop-types";
import { Controller, useFormContext } from "react-hook-form";
import { TextField, Box } from "@mui/material";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const RHFTimePicker = ({ name, label, width = "100%", required = false, onChange }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const fieldError = errors?.[name];
  const errorMessage = fieldError?.message || "";

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Controller
        name={name}
        control={control}
        rules={{ required: required ? `${label || "Time"} is required` : false }}
        render={({ field }) => (
          <Box sx={{ width }}>
            <TimePicker
              {...field}
              label={label}
              value={field.value || null}
              onChange={(newValue) => {
                field.onChange(newValue);
                if (onChange) onChange(newValue);
              }}
              // ✅ handle both MUI v5 & v6 APIs safely
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
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!errorMessage,
                  helperText: errorMessage,
                  sx: {
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "10px",
                      "& fieldset": { borderColor: "#00999E" },
                      "&:hover fieldset": { borderColor: "#007B7F" },
                      "&.Mui-focused fieldset": { borderColor: "#005F61" },
                    },
                  },
                },
              }}
            />
          </Box>
        )}
      />
    </LocalizationProvider>
  );
};

// ✅ PropTypes
RHFTimePicker.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  width: PropTypes.string,
  required: PropTypes.bool,
  onChange: PropTypes.func,
};

export default RHFTimePicker;
