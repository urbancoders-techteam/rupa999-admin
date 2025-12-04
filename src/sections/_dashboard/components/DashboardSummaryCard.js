import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import { Card, Typography, Box } from '@mui/material';

// ----------------------------------------------------------------------

export default function DashboardSummaryCard({
  todayLabel,
  todayValue = 0,
  totalValue = 0,
  totalLabel,
  imageSrc = '',
  gifSrc = '',
  color = 'success',
  sx,
  ...other
}) {
  const theme = useTheme();

  return (
    <Card
      sx={{
        p: { 
          xs: 1.5, 
          sm: 2, 
          md: 2.5, 
          lg: 2.5 
        },
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        borderRadius: { xs: 1.5, sm: 2 },
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        backgroundColor: theme.palette.background.paper,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        minHeight: { xs: 110, sm: 120, md: 130, lg: 130 },
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          transform: { xs: 'translateY(-2px)', sm: 'translateY(-3px)' },
          boxShadow: '0 6px 16px rgba(0,0,0,0.12)',
        },
        ...sx,
      }}
      {...other}
    >
      {/* LEFT SECTION */}
      <Box
        sx={{
          flex: '1 1 auto',
          pr: { xs: 1, sm: 1.5, md: 2, lg: 2.5 },
          minWidth: 0, // Prevents overflow
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          gap: { xs: 0.5, sm: 0.75, md: 0.85 },
          overflow: 'hidden',
          width: { xs: 'calc(100% - 50px)', sm: 'calc(100% - 70px)', md: 'calc(100% - 80px)', lg: 'calc(100% - 90px)' },
        }}
      >
        <Typography
          sx={{
            fontSize: { 
              xs: '0.6875rem',  // 11px
              sm: '0.75rem',    // 12px
              md: '0.8125rem',  // 13px
              lg: '0.875rem'    // 14px
            },
            lineHeight: { xs: 1.3, sm: 1.4, md: 1.5 },
            color: theme.palette.text.secondary,
            textTransform: 'capitalize',
            fontWeight: { xs: 400, sm: 500 },
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: '100%',
          }}
        >
          {totalLabel}
        </Typography>

        <Typography
          sx={{
            fontSize: { 
              xs: '1.125rem',  // 18px
              sm: '1.375rem',  // 22px
              md: '1.625rem',  // 26px
              lg: '1.875rem'   // 30px
            },
            fontWeight: 700,
            color: theme.palette.text.primary,
            lineHeight: { xs: 1.2, sm: 1.25, md: 1.3 },
            letterSpacing: { xs: '-0.01em', sm: '-0.02em' },
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: '100%',
            wordBreak: 'break-word',
          }}
        >
          {totalValue}
        </Typography>

        {todayLabel && (
          <Box 
            sx={{ 
              mt: { xs: 0.5, sm: 0.75, md: 1 },
              display: 'flex',
              flexDirection: 'column',
              gap: { xs: 0.25, sm: 0.5 },
              overflow: 'hidden',
            }}
          >
            <Typography
              sx={{
                fontSize: { 
                  xs: '0.625rem',  // 10px
                  sm: '0.6875rem', // 11px
                  md: '0.75rem',   // 12px
                  lg: '0.8125rem'  // 13px
                },
                lineHeight: { xs: 1.3, sm: 1.4, md: 1.5 },
                color: theme.palette.text.secondary,
                fontWeight: { xs: 400, sm: 500 },
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: '100%',
              }}
            >
              {todayLabel}
            </Typography>
            <Typography
              sx={{
                fontSize: { 
                  xs: '0.875rem',   // 14px
                  sm: '1.125rem',   // 18px
                  md: '1.375rem',   // 22px
                  lg: '1.625rem'    // 26px
                },
                lineHeight: { xs: 1.2, sm: 1.25, md: 1.3 },
                color: theme.palette[color]?.main || theme.palette.success.main,
                fontWeight: 700,
                letterSpacing: { xs: '-0.01em', sm: '-0.02em' },
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: '100%',
                wordBreak: 'break-word',
              }}
            >
              {todayValue}
            </Typography>
          </Box>
        )}
      </Box>

      {/* RIGHT SECTION (GIF/IMAGE) */}
      <Box
        sx={{
          width: { 
            xs: '50px',   // Smaller on mobile
            sm: '70px',   // Tablet
            md: '80px',   // Small desktop
            lg: '90px'    // Large desktop
          },
          height: { 
            xs: '50px',
            sm: '70px',
            md: '80px',
            lg: '90px'
          },
          minWidth: { xs: '50px', sm: '70px', md: '80px', lg: '90px' },
          maxWidth: { xs: '50px', sm: '70px', md: '80px', lg: '90px' },
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          alignSelf: 'flex-start',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {gifSrc || imageSrc ? (
          <Box
            component="img"
            src={gifSrc || imageSrc}
            alt={todayLabel || totalLabel || 'Dashboard icon'}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              objectPosition: 'center',
              transition: 'transform 0.3s ease',
              display: 'block',
              maxWidth: '100%',
              maxHeight: '100%',
              '&:hover': {
                transform: { xs: 'scale(1.05)', sm: 'scale(1.1)' },
              },
            }}
          />
        ) : (
          <Typography
            sx={{
              fontSize: { xs: '0.5rem', sm: '0.625rem', md: '0.75rem' },
              color: theme.palette.text.disabled,
              textAlign: 'center',
              lineHeight: 1.2,
            }}
          >
            No Image
          </Typography>
        )}
      </Box>
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
