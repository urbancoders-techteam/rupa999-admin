import PropTypes from 'prop-types';
import { alpha, useTheme } from '@mui/material/styles';
import { Card, Typography, Stack, Divider, Box } from '@mui/material';

// ----------------------------------------------------------------------

export default function DashboardSummaryCard({
  leftTitle,
  leftValue,
  rightTitle,
  rightValue,
  color = 'primary',
  enableHoverEffect = true,
  sx,
  ...other
}) {
  const theme = useTheme();

  return (
    <Card
      sx={{
        px: 2.5,
        py: 2,
        display: 'flex',
        // alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 2,
        boxShadow: theme.shadows[4],
        background: alpha(theme.palette.background.paper, 0.9),
        transition: enableHoverEffect ? 'all 0.3s ease' : 'none',
        ...(enableHoverEffect && {
          '&:hover': {
            transform: 'translateY(-6px)',
            boxShadow: theme.shadows[8],
            bgcolor: alpha(theme.palette[color].lighter || theme.palette.primary.light, 0.25),
          },
        }),
        ...sx,
      }}
      {...other}
    >
      {/* Left Section */}
      <Box flex={0.5} textAlign="start" sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Typography variant="subtitle2" sx={{ color: theme.palette.text.secondary, mb: 0.5 }}>
          {leftTitle}
        </Typography>
        <Typography variant="h3" sx={{ color: theme.palette.text.primary }}>
          {leftValue}
        </Typography>
      </Box>

      {/* Vertical Divider */}
      {rightTitle && (
        <>
          {' '}
          <Divider
            orientation="vertical"
            flexItem
            sx={{
              mx: 1,
              borderColor: alpha(theme.palette.text.primary, 0.2),
            }}
          />
          {/* Right Section */}
          <Box flex={0.5} textAlign="end" sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Typography variant="subtitle2" sx={{ color: theme.palette.text.secondary, mb: 0.5 }}>
              {rightTitle}
            </Typography>
            <Typography variant="h3" sx={{ color: theme.palette.text.primary }}>
              {rightValue}
            </Typography>
          </Box>{' '}
        </>
      )}
    </Card>
  );
}

// ----------------------------------------------------------------------

DashboardSummaryCard.propTypes = {
  leftTitle: PropTypes.string.isRequired,
  leftValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  rightTitle: PropTypes.string.isRequired,
  rightValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  color: PropTypes.string,
  enableHoverEffect: PropTypes.bool,
  sx: PropTypes.object,
};
