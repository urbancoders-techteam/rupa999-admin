import { useEffect, useRef } from 'react';
import { Autocomplete, Button, Grid, InputAdornment, TextField } from '@mui/material';
import PropTypes from 'prop-types';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import Iconify from '../../../../components/iconify';
import { gameTypes } from '../../../../assets/data/gameTypeEnum';
import { bidStatuses } from '../../../../assets/data/bidStatusEnum';

// ----------------------------------------------------------------------

UserBidHistoryTableToolbar.propTypes = {
  isFiltered: PropTypes.bool,
  filterName: PropTypes.string,
  selectedGameType: PropTypes.object,
  selectedStatus: PropTypes.object,
  onFilterName: PropTypes.func,
  onGameTypeChange: PropTypes.func,
  onStatusChange: PropTypes.func,
  onResetFilter: PropTypes.func,
};

export default function UserBidHistoryTableToolbar({
  isFiltered,
  filterName,
  selectedGameType,
  selectedStatus,
  onFilterName,
  onGameTypeChange,
  onStatusChange,
  onResetFilter,
}) {
  const methods = useForm({
    defaultValues: {
      gameType: selectedGameType || null,
      status: selectedStatus || null,
    },
  });

  const { control, setValue } = methods;
  const isInternalUpdateRef = useRef(false);
  const isInternalStatusUpdateRef = useRef(false);

  // Update form value when selectedGameType prop changes (from parent reset)
  useEffect(() => {
    if (selectedGameType !== methods.getValues('gameType')) {
      isInternalUpdateRef.current = true;
      setValue('gameType', selectedGameType || null);
      isInternalUpdateRef.current = false;
    }
  }, [selectedGameType, setValue, methods]);

  // Update form value when selectedStatus prop changes (from parent reset)
  useEffect(() => {
    if (selectedStatus !== methods.getValues('status')) {
      isInternalStatusUpdateRef.current = true;
      setValue('status', selectedStatus || null);
      isInternalStatusUpdateRef.current = false;
    }
  }, [selectedStatus, setValue, methods]);

  return (
    <FormProvider {...methods}>
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
        <Grid item xs={12} sm={6} md={4}>
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

        {/* Game Type Autocomplete */}
        <Grid item xs={12} sm={6} md={3}>
          <Controller
            name="gameType"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Autocomplete
                {...field}
                options={gameTypes}
                getOptionLabel={(option) => (option?.name ? option.name : '')}
                isOptionEqualToValue={(option, value) => option?.value === value?.value}
                onChange={(event, newValue) => {
                  field.onChange(newValue);
                  if (!isInternalUpdateRef.current && onGameTypeChange) {
                    onGameTypeChange(newValue);
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Game Type"
                    error={!!error}
                    helperText={error?.message}
                    size="small"
                  />
                )}
              />
            )}
          />
        </Grid>

        {/* Status Autocomplete */}
        <Grid item xs={12} sm={6} md={3}>
          <Controller
            name="status"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Autocomplete
                {...field}
                options={bidStatuses}
                getOptionLabel={(option) => (option?.name ? option.name : '')}
                isOptionEqualToValue={(option, value) => option?.value === value?.value}
                onChange={(event, newValue) => {
                  field.onChange(newValue);
                  if (!isInternalStatusUpdateRef.current && onStatusChange) {
                    onStatusChange(newValue);
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Status"
                    error={!!error}
                    helperText={error?.message}
                    size="small"
                  />
                )}
              />
            )}
          />
        </Grid>

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
    </FormProvider>
  );
}

