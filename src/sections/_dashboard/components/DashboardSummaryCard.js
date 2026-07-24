import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import { Card, Typography, Box } from '@mui/material';

// ----------------------------------------------------------------------

export default function DashboardSummaryCard({
  todayLabel,
  todayValue = 0,
  totalValue,
  totalLabel,
  imageSrc = '',
  gifSrc = '',
  color = 'success',
  sx,
  ...other
}) {
  const theme = useTheme();
  const accentColor = theme.palette[color]?.main || theme.palette.primary.main;
  const hasTodaySection = Boolean(todayLabel);
  const hasTotalValue = totalValue !== undefined && totalValue !== null && totalValue !== '';
  const hasTotalSection = Boolean(totalLabel) || hasTotalValue;
  const mediaSource = gifSrc || imageSrc;
  const hasMedia = Boolean(mediaSource);

  return (
    <Card
      sx={{
        p: { 
          xs: 1.5,
          sm: 2.25,
          md: 2.5,
          lg: 2.5
        },
        display: 'flex',
        alignItems: { xs: 'flex-start', sm: 'center' },
        justifyContent: 'space-between',
        borderRadius: { xs: 2, sm: 2.5 },
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: '0 10px 28px rgba(0,0,0,0.08)',
        backgroundColor: theme.palette.background.paper,
        backgroundImage:
          'linear-gradient(160deg, rgba(255,255,255,0.9) 0%, rgba(245,248,255,0.75) 65%, rgba(237,242,255,0.55) 100%)',
        backdropFilter: 'blur(6px)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        minHeight: { xs: 152, sm: 152, md: 146, lg: 146 },
        height: { xs: 152, sm: 152, md: 146, lg: 146 },
        maxHeight: { xs: 152, sm: 152, md: 146, lg: 146 },
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 5,
          borderRadius: '0 6px 6px 0',
          background: `linear-gradient(180deg, ${accentColor} 0%, ${theme.palette.primary.light} 100%)`,
        },
        '&:hover': {
          transform: { xs: 'translateY(-2px)', sm: 'translateY(-4px)' },
          boxShadow: '0 16px 30px rgba(0,0,0,0.14)',
        },
        ...sx,
      }}
      {...other}
    >
      {/* LEFT SECTION */}
      <Box
        sx={{
          flex: '1 1 auto',
          pr: { xs: 1, sm: 1.25, md: 1.5, lg: 2 },
          pl: { xs: 0.5, sm: 0.75 },
          minWidth: 0, // Prevents overflow
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          gap: { xs: 0.5, sm: 0.75, md: 0.85 },
          overflow: 'hidden',
          width: '100%',
          pt: { xs: 0.5, sm: 0 },
        }}
      >
        {todayLabel && (
          <Box 
            sx={{ 
              mt: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: { xs: 0.65, sm: 0.6 },
              overflow: 'hidden',
            }}
          >
            <Typography
              sx={{
                fontSize: { 
                  xs: '0.95rem',
                  sm: '1rem',
                  md: '1.05rem',
                  lg: '1.1rem'
                },
                lineHeight: 1.35,
                whiteSpace: 'normal',
                wordBreak: 'break-word',
                display: '-webkit-box',
                WebkitLineClamp: { xs: 2, sm: 1 },
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                maxWidth: '100%',
                px: { xs: 0.7, sm: 0 },
                py: { xs: 0.25, sm: 0 },
                borderRadius: { xs: 1, sm: 0 },
                bgcolor: { xs: 'rgba(25,118,210,0.1)', sm: 'transparent' },
                color: { xs: 'primary.dark', sm: theme.palette.text.secondary },
                fontWeight: 700,
              }}
            >
              {todayLabel}
            </Typography>
            <Typography
              sx={{
                fontSize: { 
                  xs: '1.05rem',
                  sm: '1.4rem',
                  md: '1.55rem',
                  lg: '1.7rem'
                },
                lineHeight: { xs: 1.2, sm: 1.25, md: 1.3 },
                fontWeight: 700,
                letterSpacing: { xs: '-0.01em', sm: '-0.02em' },
                whiteSpace: 'normal',
                maxWidth: '100%',
                wordBreak: 'break-word',
              }}
            >
              {todayValue}
            </Typography>
          </Box>
        )}

        {hasTotalSection && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: { xs: 0.55, sm: 0.5 },
              opacity: hasTodaySection ? 0.65 : 1,
              mt: hasTodaySection ? { xs: 1.5, sm: 1.25 } : 0,
            }}
          >
            <Typography
              sx={{
                fontSize: hasTodaySection
                  ? {
                      xs: '0.78rem',   // 12px
                      sm: '0.8125rem', // 13px
                      md: '0.875rem',  // 14px
                      lg: '0.9375rem'  // 15px
                    }
                  : {
                      xs: '0.8rem',
                      sm: '0.9rem',
                      md: '0.98rem',
                      lg: '1rem'
                    },
                lineHeight: { xs: 1.3, sm: 1.4, md: 1.5 },
                textTransform: 'capitalize',
                fontWeight: hasTodaySection ? 600 : 700,
                whiteSpace: 'normal',
                wordBreak: 'break-word',
                display: '-webkit-box',
                WebkitLineClamp: { xs: 2, sm: 1 },
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                maxWidth: '100%',
                px: { xs: 0.7, sm: 0 },
                py: { xs: 0.25, sm: 0 },
                borderRadius: { xs: 1, sm: 0 },
                bgcolor: { xs: 'rgba(25,118,210,0.1)', sm: 'transparent' },
                color: { xs: 'primary.dark', sm: 'inherit' },
              }}
            >
              {totalLabel}
            </Typography>

            <Typography
              sx={{
                fontSize: hasTodaySection
                  ? {
                      xs: '0.98rem',    // 16px
                      sm: '1.125rem',   // 18px
                      md: '1.375rem',   // 22px
                      lg: '1.625rem'    // 26px
                    }
                  : {
                      xs: '1.15rem',
                      sm: '1.4rem',
                      md: '1.55rem',
                      lg: '1.7rem'
                    },
                fontWeight: hasTodaySection ? 700 : 800,
                color: theme.palette.text.primary,
                lineHeight: { xs: 1.2, sm: 1.25, md: 1.3 },
                letterSpacing: { xs: '-0.01em', sm: '-0.02em' },
                whiteSpace: 'normal',
                maxWidth: '100%',
                wordBreak: 'break-word',
              }}
            >
              {hasTotalValue ? totalValue : '—'}
            </Typography>
          </Box>
        )}
      </Box>

      {/* RIGHT SECTION (GIF/IMAGE) */}
      {hasMedia && (
        <Box
        sx={{
          width: {
            xs: '48px',
            sm: '62px',
            md: '72px',
            lg: '76px'
          },
          height: {
            xs: '48px',
            sm: '62px',
            md: '72px',
            lg: '76px'
          },
          minWidth: { xs: '48px', sm: '62px', md: '72px', lg: '76px' },
          maxWidth: { xs: '48px', sm: '62px', md: '72px', lg: '76px' },
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          alignSelf: 'center',
          overflow: 'hidden',
          position: 'relative',
          borderRadius: '50%',
          border: `1px solid ${theme.palette.divider}`,
          background: 'linear-gradient(160deg, rgba(255,255,255,0.9), rgba(243,246,255,0.8))',
          boxShadow: '0 6px 16px rgba(0,0,0,0.12)',
        }}
      >
          <Box
            component="img"
            src={mediaSource}
            alt={todayLabel || totalLabel || 'Dashboard icon'}
            sx={{
              width: '84%',
              height: '84%',
              objectFit: 'contain',
              objectPosition: 'center',
              transition: 'transform 0.25s ease',
              display: 'block',
              maxWidth: '100%',
              maxHeight: '100%',
              '.MuiCard-root:hover &': {
                transform: 'scale(1.08)',
              },
            }}
          />
        </Box>
      )}
    </Card>
  );
}

// ----------------------------------------------------------------------

DashboardSummaryCard.propTypes = {
  todayLabel: PropTypes.string,
  todayValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  totalValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  totalLabel: PropTypes.string,
  imageSrc: PropTypes.string,
  gifSrc: PropTypes.string,
  color: PropTypes.string,
  sx: PropTypes.object,
};
