import PropTypes from 'prop-types';
import { alpha, useTheme } from '@mui/material/styles';
import { Box, Card, Typography, Stack, Link } from '@mui/material';

// ----------------------------------------------------------------------

AnkBidSummaryCard.propTypes = {
  sx: PropTypes.object,
  title: PropTypes.string, // e.g., "Total Bids"
  total: PropTypes.number, // e.g., 305
  subTitle: PropTypes.string, // e.g., "Total Bid Amount"
  ankValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), // e.g., "Ank 0"
  borderColor: PropTypes.string, // optional custom border color
  enableHoverEffect: PropTypes.bool,
  color: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  colors: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

export default function AnkBidSummaryCard({
  title = 'Total Bids',
  total = 0,
  color = 'primary',
  colors,
  subTitle = 'Total Bid Amount',
  ankValue,
  borderColor,
  enableHoverEffect = false,
  sx,
  ...other
}) {
  const theme = useTheme();

  return (
    <Card
      sx={{
        px: 2,
        py: 2,
        textAlign: 'center',
        borderRadius: '8px',
        color: theme.palette[color].darker,
        bgcolor: theme.palette[color].lighter,
        transition: enableHoverEffect ? 'all 0.3s ease' : 'none',
        ...(enableHoverEffect && {
          '&:hover': {
            transform: 'translateY(-6px) scale(1.02)',
            boxShadow: theme.shadows[6],
            bgcolor: alpha(theme.palette[color].lighter, 0.95),
          },
        }),
        ...sx,
      }}
      {...other}
    >
      <Stack spacing={1.2} alignItems="center">
        {/* Top Label */}
        <Typography variant="subtitle2" sx={{ fontSize: 14 }}>
          {title}
        </Typography>

        {/* Main Number */}
        <Typography
          variant="h3"
          sx={{
            fontSize: 28,
            fontWeight: 700,
          }}
        >
          {total}
        </Typography>

        {/* Middle Text */}
        <Typography variant="body2" sx={{ fontSize: 14 }}>
          {subTitle}
        </Typography>

        {/* Bottom Link */}
        <Link
          href="#"
          underline="hover"
          sx={{
            fontSize: 14,
            fontWeight: 500,
            color: theme.palette.primary.main,
          }}
        >
          {ankValue}
        </Link>
      </Stack>
    </Card>
  );
}
