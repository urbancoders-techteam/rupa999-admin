import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Divider,
  Link,
  Stack,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import Label from '../../../components/label/Label';
import { fBidDigit } from '../../../utils/formatText';
import { fDateTime } from '../../../utils/formatTime';

function DetailRow({ label, value }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1.5, py: 0.15 }}>
      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, flexShrink: 0 }}>
        {label}
      </Typography>
      <Box sx={{ textAlign: 'right', minWidth: 0, '& .MuiTypography-root': { lineHeight: 1.3 } }}>{value}</Box>
    </Box>
  );
}

DetailRow.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.node,
};

function formatText(text) {
  if (!text || text === '-') return '—';
  return text
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function getMarketTypeLabel(row) {
  const t = (row.marketType || '').toLowerCase();
  if (t === 'starline') return 'STARLINE';
  if (t === 'main' || t === 'regular') return 'MAIN';
  return row.starlineMarketId ? 'STARLINE' : 'MAIN';
}

function getMarketTypeColor(row) {
  const t = (row.marketType || '').toLowerCase();
  if (t === 'starline') return 'secondary';
  return 'default';
}

function getStatusColor(status) {
  const statusLower = status?.toLowerCase();
  if (statusLower === 'won') return 'success';
  if (statusLower === 'lost') return 'error';
  return 'warning';
}

function getStatusLabel(status) {
  const statusLower = status?.toLowerCase();
  if (statusLower === 'won') return 'WON';
  if (statusLower === 'lost') return 'LOST';
  return status || '—';
}

function getTypeLabel(type) {
  const typeLower = type?.toLowerCase();
  if (typeLower === 'open') return 'OPEN';
  if (typeLower === 'close') return 'CLOSE';
  return type || '—';
}

function getTypeColor(type) {
  const typeLower = type?.toLowerCase();
  if (typeLower === 'open') return 'info';
  if (typeLower === 'close') return 'primary';
  return 'default';
}

function getDisplayDate(row) {
  if (row.date) return fDateTime(row.date);
  if (row.createdAt) return fDateTime(row.createdAt);
  return '—';
}

function getUserId(row) {
  if (!row?.userId) return null;
  if (typeof row.userId === 'object') return row.userId._id || row.userId.id || null;
  return row.userId;
}

export default function MainBidHistoryMobileCardLayout({
  data = [],
  loading = false,
  onViewUser,
}) {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200, p: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Loading...
        </Typography>
      </Box>
    );
  }

  if (!data.length) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200, p: 2 }}>
        <Typography variant="body2" color="text.secondary">
          No bid history found
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'background.paper' }}>
      <Stack spacing={1}>
        {data.map((row, index) => {
          const userId = getUserId(row);
          const userName = row.userId?.name || row.userName || '—';
          const phone = row.userId?.number || row.phoneNumber || '—';
          const marketName = row.marketId?.name || row.starlineMarketId?.name || row.marketName || '—';
          const digit = row.bidTable?.digit || row.digit;
          const points = row.totalPoints || row.point || '—';

          return (
            <Accordion
              key={row._id || row.id || index}
              sx={{
                borderRadius: 2,
                boxShadow: 'none',
                border: '1px solid',
                borderColor: 'divider',
                '&:before': { display: 'none' },
                overflow: 'hidden',
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                  minHeight: 44,
                  px: 1.5,
                  py: 0,
                  '& .MuiAccordionSummary-content': { my: 0.25, mr: 1, width: '100%' },
                }}
              >
                <Box sx={{ width: '100%', minWidth: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', minWidth: 18 }}>
                      {row.sno || index + 1}.
                    </Typography>
                    <Typography variant="subtitle2" sx={{ flex: 1, fontWeight: 700, minWidth: 0 }} noWrap>
                      {userName}
                    </Typography>
                    <Label
                      variant="soft"
                      color={getStatusColor(row.status)}
                      sx={{ textTransform: 'uppercase', fontSize: '0.7rem', flexShrink: 0 }}
                    >
                      {getStatusLabel(row.status)}
                    </Label>
                  </Box>
                  <Typography variant="caption" sx={{ pl: 2.75, color: 'text.secondary' }} noWrap>
                    {marketName} · Digit {digit ? fBidDigit(digit) : '—'} · {points} pts
                  </Typography>
                </Box>
              </AccordionSummary>

              <AccordionDetails sx={{ pt: 0, px: 1.5, pb: 1 }}>
                <Stack spacing={0.4}>
                  <Divider />
                  <DetailRow
                    label="User Name"
                    value={<Typography variant="body2">{userName}</Typography>}
                  />
                  <DetailRow
                    label="Phone"
                    value={
                      userId && phone && phone !== '—' ? (
                        <Link
                          component="button"
                          type="button"
                          variant="body2"
                          underline="hover"
                          onClick={(event) => {
                            event.stopPropagation();
                            onViewUser?.(userId, userName);
                          }}
                          sx={{ cursor: 'pointer', fontWeight: 600, textAlign: 'right' }}
                        >
                          {phone}
                        </Link>
                      ) : (
                        <Typography variant="body2">{phone}</Typography>
                      )
                    }
                  />
                  <DetailRow
                    label="Market Name"
                    value={<Typography variant="body2">{marketName}</Typography>}
                  />
                  <DetailRow
                    label="Market Type"
                    value={
                      <Label variant="soft" color={getMarketTypeColor(row)} sx={{ textTransform: 'uppercase' }}>
                        {getMarketTypeLabel(row)}
                      </Label>
                    }
                  />
                  <DetailRow
                    label="Game Name"
                    value={
                      <Typography variant="body2">
                        {formatText(row.name) || formatText(row.gameType) || '—'}
                      </Typography>
                    }
                  />
                  <DetailRow
                    label="Type"
                    value={
                      <Label variant="soft" color={getTypeColor(row.type)} sx={{ textTransform: 'uppercase' }}>
                        {getTypeLabel(row.type)}
                      </Label>
                    }
                  />
                  <DetailRow
                    label="Digit"
                    value={<Typography variant="body2">{digit ? fBidDigit(digit) : '—'}</Typography>}
                  />
                  <DetailRow
                    label="Point"
                    value={<Typography variant="body2">{points}</Typography>}
                  />
                  <DetailRow
                    label="Status"
                    value={
                      <Label variant="soft" color={getStatusColor(row.status)} sx={{ textTransform: 'uppercase' }}>
                        {getStatusLabel(row.status)}
                      </Label>
                    }
                  />
                  <DetailRow
                    label="Date"
                    value={<Typography variant="body2">{getDisplayDate(row)}</Typography>}
                  />
                </Stack>
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Stack>
    </Box>
  );
}

MainBidHistoryMobileCardLayout.propTypes = {
  data: PropTypes.array,
  loading: PropTypes.bool,
  onViewUser: PropTypes.func,
};
