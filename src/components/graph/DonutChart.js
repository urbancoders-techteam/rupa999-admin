import PropTypes from 'prop-types';
// @mui
import { styled, useTheme } from '@mui/material/styles';
import { Card, CardHeader } from '@mui/material';
// utils
import { fNumber } from '../../utils/formatNumber';
// components
import Chart, { useChart } from '../chart';

// ----------------------------------------------------------------------

const CHART_HEIGHT = 260;

const LEGEND_HEIGHT = 60;

const StyledChart = styled('div')(({ theme }) => ({
  height: CHART_HEIGHT,
  marginTop: theme.spacing(0),
  '& .apexcharts-canvas svg': {
    height: CHART_HEIGHT,
  },
  '& .apexcharts-canvas svg,.apexcharts-canvas foreignObject': {
    overflow: 'visible',
  },
  '& .apexcharts-legend': {
    height: LEGEND_HEIGHT,
    alignContent: 'center',
    position: 'relative !important',
    borderTop: `solid 1px ${theme.palette.divider}`,
    top: `calc(${CHART_HEIGHT - LEGEND_HEIGHT}px) !important`,
  },
}));

// ----------------------------------------------------------------------

DonutChart.propTypes = {
  chart: PropTypes.object,
  title: PropTypes.string,
  total: PropTypes.number,
  subheader: PropTypes.string,
};

export default function DonutChart({ title, subheader, total, chart, ...other }) {
  const theme = useTheme();

  const { colors, series, options } = chart;

  const chartSeries = series.map((i) => i.value);

  const chartColors = colors || [
    [theme.palette.primary.light, theme.palette.primary.main],
    [theme.palette.warning.light, theme.palette.warning.main],
    [theme.palette.success.light, theme.palette.success.main],
  ];

  const chartOptions = useChart({
    chart: {
      sparkline: {
        enabled: true,
      },
    },
    labels: series.map((i) => i.label),
    legend: {
      floating: true,
      horizontalAlign: 'center',
    },
    fill: {
      type: 'gradient',
      gradient: {
        colorStops: chartColors.map((colr) => [
          { offset: 0, color: colr[0] },
          { offset: 100, color: colr[1] },
        ]),
      },
    },
    plotOptions: {
      radialBar: {
        hollow: { size: '50%' },
        dataLabels: {
          value: { offsetY: 16 },
          total: {
            formatter: () => fNumber(total),
          },
        },
      },
    },
    ...options,
  });

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <StyledChart dir="ltr">
        <Chart type="radialBar" series={chartSeries} options={chartOptions} height={200} />
      </StyledChart>
    </Card>
  );
}
