import {
  Box,
  Card,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import PropTypes from 'prop-types';
import Label from '../../../components/label';
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

InactiveUserMobileCardLayout.propTypes = {
  data: PropTypes.array,
  loading: PropTypes.bool,
  activatingId: PropTypes.string,
  onActivate: PropTypes.func,
};

export default function InactiveUserMobileCardLayout({
  data = [],
  loading = false,
  activatingId,
  onActivate,
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
          No inactive users found
        </Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={1.5}>
      {data.map((row, index) => {
        const userId = row._id || row.id;
        return (
          <Card key={userId || index} sx={{ p: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="subtitle1">{row.name || '—'}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {row.number || row.whatsappNumber || '—'}
                </Typography>
              </Box>
              <Label color="error">Inactive</Label>
            </Stack>

            <Divider sx={{ my: 1.5 }} />

            <Stack spacing={1}>
              <DetailRow
                label="Inactive Date/Time"
                value={fDateTime(row.inactiveAt || row.updatedAt) || '—'}
              />
            </Stack>

            <LoadingButton
              fullWidth
              variant="contained"
              color="success"
              sx={{ mt: 2 }}
              loading={activatingId === userId}
              onClick={() => onActivate?.(userId)}
            >
              Activate
            </LoadingButton>
          </Card>
        );
      })}
    </Stack>
  );
}
