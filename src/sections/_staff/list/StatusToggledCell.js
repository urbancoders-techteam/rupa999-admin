import { CircularProgress, Stack, Switch, TableCell, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';

StatusToggleCell.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  status: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  align: PropTypes.string,
  justifyContent: PropTypes.string,
  onStatusChange: PropTypes.func,
  loading: PropTypes.bool,
};

export default function StatusToggleCell({
  id,
  status,
  align = 'left',
  justifyContent = 'flex-start',
  onStatusChange,
  loading: externalLoading
}) {
  // Normalize status: true/boolean true = Active, false/boolean false = InActive
  // Also handle string values: 'Active' = true, 'InActive' = false
  const normalizeStatus = useCallback((statusValue) => {
    if (typeof statusValue === 'boolean') {
      return statusValue; // true = Active, false = InActive
    }
    if (typeof statusValue === 'string') {
      return statusValue === 'Active'; // 'Active' = true, 'InActive' = false
    }
    return true; // Default to Active if undefined
  }, []);

  const [isActive, setIsActive] = useState(() => normalizeStatus(status));
  const [loading, setLoading] = useState(false);

  // Update local state when status prop changes
  useEffect(() => {
    const normalized = normalizeStatus(status);
    setIsActive(normalized);
    // Clear error when status changes externally
  }, [status, normalizeStatus]);

  const handleToggle = useCallback(async () => {
    const newStatus = !isActive; // Toggle: true = Active, false = InActive
    const previousStatus = isActive;

    // Optimistically update UI immediately for smooth UX
    setIsActive(newStatus);
    setLoading(true);


    try {
      // Call parent's onStatusChange callback if provided
      if (onStatusChange) {
        await onStatusChange(id, newStatus);
      }
    } catch (error) {
      // Revert on error
      setIsActive(previousStatus);
      console.error('🚨 Error updating status:', error);
      // Error will be handled by parent component's snackbar
    } finally {
      setLoading(false);
    }
  }, [id, isActive, onStatusChange]);

  const isLoading = loading || externalLoading;

  return (
    <TableCell align={align} sx={{ minWidth: 160, padding: 0, margin: 0 }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent={justifyContent}
        spacing={0.5}
        sx={{
          opacity: isLoading ? 0.7 : 1,
          transition: 'opacity 0.2s ease',
          padding: 0,
          margin: 0,
        }}
      >
        {/* Switch with smooth animation */}
        {isLoading ? (
          <CircularProgress
            size={20}
            // thickness={5}
            sx={{
              color: isActive ? 'success.main' : 'error.main',
            }}
          />
        ) : (
          <Switch
            checked={!isActive} // Inverted: checked = InActive (red), unchecked = Active (green)
            onChange={handleToggle}
            disabled={isLoading}
            inputProps={{
              'aria-label': `Toggle status to ${isActive ? 'InActive' : 'Active'}`,
              role: 'switch',
            }}
            sx={{
              
              '& .MuiSwitch-switchBase': {
                transition: 'transform 0.2s ease-in-out, color 0.2s ease',
              },
              '& .MuiSwitch-switchBase.Mui-checked': {
                color: 'error.main',
                '&:hover': {
                  backgroundColor: 'rgba(211, 47, 47, 0.08)',
                },
              },
              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                backgroundColor: 'error.main',
                opacity: 1,
              },
              '& .MuiSwitch-switchBase:not(.Mui-checked)': {
                color: 'success.main',
                '&:hover': {
                  backgroundColor: 'rgba(46, 125, 50, 0.08)',
                },
              },
              '& .MuiSwitch-track': {
                backgroundColor: isActive ? 'success.main' : 'rgba(0, 0, 0, 0.26)',
                opacity: 1,
                transition: 'background-color 0.2s ease, opacity 0.2s ease',
              },
              '& .MuiSwitch-thumb': {
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                transition: 'box-shadow 0.2s ease',
              },
              '&:hover .MuiSwitch-thumb': {
                boxShadow: '0 3px 6px rgba(0, 0, 0, 0.3)',
              },
            }}
          />
        )}

        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            color: isActive ? 'success.main' : 'error.main',
            transition: 'color 0.2s ease',
            textAlign: 'left',
          }}
        >
          {isActive ? 'Active' : 'InActive'}
        </Typography>
      </Stack>
    </TableCell>
  );
}


