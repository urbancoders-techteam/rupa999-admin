import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
// @mui
import { Box, Card, CardHeader } from '@mui/material';
// components
import Chart, { useChart } from '../chart';
import { CustomSmallSelect } from '../custom-input';

// ----------------------------------------------------------------------

YearlySalesGraph.propTypes = {
  chart: PropTypes.object,
  title: PropTypes.string,
  subheader: PropTypes.string,
};

export default function YearlySalesGraph({ title, subheader, chart, ...other }) {
  const { colors, categories, series = [], options } = chart || {};

  // Default to current year or first available year
  const getDefaultYear = () => {
    if (series && series.length > 0) {
      return series[0].year;
    }
    return new Date().getFullYear().toString();
  };

  const [seriesData, setSeriesData] = useState(getDefaultYear());

  // Update seriesData when series changes
  useEffect(() => {
    if (series && series.length > 0) {
      const defaultYear = series[0].year;
      setSeriesData(defaultYear);
    } else {
      setSeriesData(new Date().getFullYear().toString());
    }
  }, [series]);

  const chartOptions = useChart({
    colors,
    legend: {
      position: 'top',
      horizontalAlign: 'right',
    },
    xaxis: {
      categories,
    },
    ...options,
  });

  // Ensure we have valid series data
  const validSeries = series && series.length > 0 ? series : [];

  return (
    <Card {...other}>
      <CardHeader
        title={title}
        subheader={subheader}
        action={
          validSeries.length > 0 && (
            <CustomSmallSelect
              value={seriesData}
              onChange={(event) => setSeriesData(event.target.value)}
            >
              {validSeries.map((option) => (
                <option key={option.year} value={option.year}>
                  {option.year}
                </option>
              ))}
            </CustomSmallSelect>
          )
        }
      />

      {validSeries.length > 0 ? (
        validSeries.map((item) => (
          <Box key={item.year} sx={{ mt: 1.3, mx: 2 }} dir="ltr">
            {item.year === seriesData && (
              <Chart type="area" series={item.data} options={chartOptions} height={200} />
            )}
          </Box>
        ))
      ) : (
        <Box sx={{ mt: 1.3, mx: 2, p: 3, textAlign: 'center' }}>
          No data available
        </Box>
      )}
    </Card>
  );
}
