import { TableCell, Switch, Stack, Typography, CircularProgress } from '@mui/material';
import { useState } from 'react';
import PropTypes from 'prop-types';

StatusToggleCell.propTypes = {
  id: PropTypes.number.isRequired,
  status: PropTypes.string,
//   apiUrl: PropTypes.string.isRequired,
};

export default function StatusToggleCell({ id, status }) {
  // false = Active (green), true = Blocked (red)
  const [isBlocked, setIsBlocked] = useState(status === 'Blocked');
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    const newStatus = isBlocked ? 'Active' : 'Blocked';
    setIsBlocked(!isBlocked);
    // setLoading(true);

    // try {
    //   const response = await axios.put(`${apiUrl}/${id}`, { status: newStatus });
    //   if (response.status === 200) {
    //     console.log(`✅ Status updated to ${newStatus}`);
    //   } else {
    //     console.error('❌ Failed to update status');
    //     setIsBlocked(isBlocked); // revert
    //   }
    // } catch (error) {
    //   console.error('🚨 API error:', error);
    //   setIsBlocked(isBlocked); // revert
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
      <TableCell align="center" sx={{ minWidth: 160 }}>
      <Stack direction="row" alignItems="center" justifyContent="center" spacing={1.5}>
        {/* Status Label */}
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            color: isBlocked ? 'error.main' : 'success.main',
            transition: 'color 0.3s ease',
          }}
        >
          {isBlocked ? 'Blocked' : 'Active'}
        </Typography>

        {/* Switch with subtle animation */}
        {loading ? (
          <CircularProgress size={20} thickness={5} />
        ) : (
          <Switch
            checked={isBlocked}
            onChange={handleToggle}
            inputProps={{ 'aria-label': 'Status Toggle' }}
            sx={{
              '& .MuiSwitch-switchBase.Mui-checked': {
                color: 'error.main',
                transform: 'translateX(12px)',
              },
              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                backgroundColor: '#ffb3b3',
                opacity: 1,
              },
              '& .MuiSwitch-track': {
                backgroundColor: '#b9f6ca',
                opacity: 1,
                transition: 'background-color 0.3s ease',
              },
              '& .MuiSwitch-thumb': {
                backgroundColor: isBlocked ? '#d32f2f' : '#2e7d32',
                transition: 'background-color 0.3s ease',
              },
            }}
          />
        )}
      </Stack>
    </TableCell>
  );
}


