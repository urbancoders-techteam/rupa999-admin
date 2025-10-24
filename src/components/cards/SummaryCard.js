import PropTypes from 'prop-types';
import { alpha, useTheme } from '@mui/material/styles';
import { Box, Card, Typography, Stack } from '@mui/material';
import { fNumber, fPercent } from '../../utils/formatNumber';
import Chart from '../chart';
import Iconify from '../iconify';

// ----------------------------------------------------------------------

SummaryCard.propTypes = {
  sx: PropTypes.object,
  chart: PropTypes.object,
  title: PropTypes.string,
  total: PropTypes.number,
  percent: PropTypes.number,
  color: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  colors: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  enableHoverEffect: PropTypes.bool, // 👈 new prop added
};

export default function SummaryCard({
  title,
  percent,
  total,
  chart = {},
  color = 'primary',
  colors,
  sx,
  enableHoverEffect = false, // 👈 default is false
  ...other
}) {
  const theme = useTheme();
  const { series = [], options = {} } = chart;

  const trendColor =
    percent < 0 ? theme.palette.error.main : theme.palette.success.main;

  const chartOptions = {
    colors: [trendColor],
    chart: { sparkline: { enabled: true } },
    plotOptions: {
      bar: {
        columnWidth: '68%',
        borderRadius: 2,
      },
    },
    tooltip: {
      x: { show: false },
      y: {
        formatter: (value) => fNumber(value),
        title: { formatter: () => '' },
      },
      marker: { show: false },
    },
    ...options,
  };

  return (
    <Card
      sx={{
        px: 3,
        py: 3,
        textAlign: 'center',
        color: theme.palette[color].darker,
        bgcolor: theme.palette[color].lighter,
        transition: enableHoverEffect ? 'all 0.3s ease' : 'none',
        boxShadow: 0,
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
      {/* Header: Title + Trending Arrow */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 3 }}
      >
        <Typography variant="subtitle2" sx={{ opacity: 0.72, textAlign: 'left' }}>
          {title}
        </Typography>

        {percent && <TrendingInfo percent={percent} />}
      </Stack>

      {/* Content: Value + Chart */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h3">{fNumber(total)}</Typography>

        <Chart
          type="bar"
          series={[{ data: series }]}
          options={chartOptions}
          width={60}
          height={36}
        />
      </Box>
    </Card>
  );
}

// ----------------------------------------------------------------------
// Subcomponent: Trending Info (arrow + percent)
// ----------------------------------------------------------------------

TrendingInfo.propTypes = {
  percent: PropTypes.number,
};

function TrendingInfo({ percent }) {
  return (
    <Stack direction="row" alignItems="center" sx={{ mb: 1 }}>
      <Iconify
        icon={percent < 0 ? 'eva:trending-down-fill' : 'eva:trending-up-fill'}
        sx={{
          mr: 1,
          p: 0.5,
          width: 24,
          height: 24,
          borderRadius: '50%',
          color: (theme) =>
            percent < 0
              ? theme.palette.error.main
              : theme.palette.success.main,
          bgcolor: (theme) =>
            alpha(
              percent < 0
                ? theme.palette.error.main
                : theme.palette.success.main,
              0.16
            ),
        }}
      />

      <Typography component="div" variant="subtitle2">
        {percent > 0 && '+'}
        {fPercent(percent)}
      </Typography>
    </Stack>
  );
}
