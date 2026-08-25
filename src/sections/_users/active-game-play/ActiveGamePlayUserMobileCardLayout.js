import {
  Box,
  Card,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import Label from '../../../components/label';
import { fCurrency } from '../../../utils/formatNumber';
import { fDateTime } from '../../../utils/formatTime';

DetailRow.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.node,
};

function DetailRow({ label, value }) {
  return (
    <Stack direction="row" justifyContent="space-between" spacing={2}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={500} textAlign="right">
        {value ?? '—'}
      </Typography>
    </Stack>
  );
}

ActiveGamePlayUserMobileCardLayout.propTypes = {
  data: PropTypes.array,
  loading: PropTypes.bool,
};

export default function ActiveGamePlayUserMobileCardLayout({
  data = [],
  loading = false,
}) {
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={6}>
        <CircularProgress />
      </Box>
    );
  }

  if (!data.length) {
    return (
      <Box display="flex" justifyContent="center" py={6}>
        <Typography variant="body2" color="text.secondary">
          No active game play users found
        </Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={1.5}>
      {data.map((row, index) => (
        <Card key={row._id || row.id || index} sx={{ p: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="subtitle1">{row.name || '—'}</Typography>
              <Typography variant="body2" color="text.secondary">
                {row.number || row.whatsappNumber || '—'}
              </Typography>
            </Box>
            <Label color={row.status === 'active' ? 'success' : 'error'}>
              {row.status === 'active' ? 'Active' : 'Inactive'}
            </Label>
          </Stack>

          <Divider sx={{ my: 1.5 }} />

          <Stack spacing={1}>
            <DetailRow label="Balance" value={fCurrency(row.balance) || '₹ 0'} />
            <DetailRow label="Games Played (24h)" value={row.gamePlays24h || 0} />
            <DetailRow
              label="Game Amount (24h)"
              value={fCurrency(row.gameAmount24h) || '₹ 0'}
            />
            <DetailRow label="Last Login" value={fDateTime(row.lastLoginAt) || '—'} />
            <DetailRow label="Last Played" value={fDateTime(row.lastPlayedAt) || '—'} />
          </Stack>
        </Card>
      ))}
    </Stack>
  );
}
