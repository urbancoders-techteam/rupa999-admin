import PropTypes from 'prop-types';
// @mui
import { Card, CardHeader, Typography, Stack, LinearProgress, alpha } from '@mui/material';
// utils
import { fCurrency } from '../../utils/formatNumber';
import Iconify from '../iconify';

// ----------------------------------------------------------------------

HorizontalProgressGraph.propTypes = {
  data: PropTypes.array,
  title: PropTypes.string,
  subheader: PropTypes.string,
};

export default function HorizontalProgressGraph({ title, subheader, data, ...other }) {
  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Stack spacing={5} sx={{ p: 3 }}>
        {data.map((progress) => (
          <ProgressItem key={progress.label} progress={progress} />
        ))}
      </Stack>
    </Card>
  );
}

// ----------------------------------------------------------------------

ProgressItem.propTypes = {
  progress: PropTypes.shape({
    amount: PropTypes.number,
    label: PropTypes.string,
    value: PropTypes.number,
  }),
};

function ProgressItem({ progress }) {
  return (
    <Stack spacing={.5}>
      <Stack direction="row" alignItems="center">
        <Typography variant="subtitle2" sx={{ flexGrow: 1, mb: 0.5 }}>
          {progress.label}
        </Typography>
        {progress.label === "Profit" && <Iconify
                icon={progress.amount < 0 ? 'eva:trending-down-fill' : 'eva:trending-up-fill'}
                sx={{
                  m: 1,
                  p: 0.5,
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  color: 'success.main',
                  bgcolor: (theme) => alpha(theme.palette.success.main, 0.16),
                  ...(progress.amount < 0 && {
                    color: 'error.main',
                    bgcolor: (theme) => alpha(theme.palette.error.main, 0.16),
                  }),
                }}
              />}
        <Typography variant="subtitle2" >{fCurrency(progress.amount)}</Typography>
      </Stack>

      <LinearProgress
        variant="determinate"
        value={progress.value}
        color={
          (progress.label === 'Total Amount' && 'info') ||
          (progress.label === 'Total Profit' && 'warning') ||
          (progress.label === 'Profit' && 'success') ||
          'primary'
        }
        sx={{ height: 9, borderRadius: 5 }}
      />
    </Stack>
  );
}
