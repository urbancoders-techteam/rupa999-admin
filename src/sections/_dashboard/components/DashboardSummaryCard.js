import PropTypes from 'prop-types';
import { useTheme, alpha } from '@mui/material/styles';
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
          lg: 3 
        },
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        borderRadius: { xs: 1.5, sm: 2 },
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        backgroundColor: theme.palette.background.paper,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        minHeight: { xs: 100, sm: 110, md: 120, lg: 130 },
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
          flex: 1,
          pr: { xs: 1, sm: 1.5, md: 2, lg: 3 },
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: { xs: 0.5, sm: 0.75, md: 1 },
          minWidth: 0, // Prevents overflow
        }}
      >
        <Typography
          sx={{
            fontSize: { 
              xs: '0.75rem',   // 12px
              sm: '0.8125rem',  // 13px
              md: '0.875rem',   // 14px
              lg: '0.9375rem'   // 15px
            },
            lineHeight: { xs: 1.4, sm: 1.5 },
            color: theme.palette.text.secondary,
            textTransform: 'capitalize',
            fontWeight: { xs: 400, sm: 500 },
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {totalLabel}
        </Typography>

        <Typography
          sx={{
            fontSize: { 
              xs: '1.25rem',   // 20px
              sm: '1.5rem',    // 24px
              md: '1.75rem',   // 28px
              lg: '2rem'       // 32px
            },
            fontWeight: 700,
            color: theme.palette.text.primary,
            lineHeight: { xs: 1.2, sm: 1.3, md: 1.4 },
            letterSpacing: { xs: '-0.01em', sm: '-0.02em' },
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
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
                lineHeight: { xs: 1.4, sm: 1.5 },
                color: theme.palette.text.secondary,
                fontWeight: { xs: 400, sm: 500 },
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {todayLabel}
            </Typography>
            <Typography
              sx={{
                fontSize: { 
                  xs: '1rem',      // 16px
                  sm: '1.25rem',   // 20px
                  md: '1.5rem',    // 24px
                  lg: '1.75rem'    // 28px
                },
                lineHeight: { xs: 1.2, sm: 1.3 },
                color: theme.palette[color]?.main || theme.palette.success.main,
                fontWeight: 700,
                letterSpacing: { xs: '-0.01em', sm: '-0.02em' },
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
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
            xs: '60px',   // Fixed small size on mobile
            sm: '80px',   // Tablet
            md: '90px',   // Small desktop
            lg: '100px'   // Large desktop
          },
          height: { 
            xs: '60px',
            sm: '80px',
            md: '90px',
            lg: '100px'
          },
          minWidth: { xs: '60px', sm: '80px', md: '90px', lg: '100px' },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          // borderRadius: { xs: 1, sm: 1.5, md: 2 },
          // bgcolor: alpha(theme.palette.primary.main, 0.04),
          overflow: 'hidden',
        }}
      >
        {gifSrc || imageSrc ? (
          <Box
            component="img"
            src={gifSrc || imageSrc}
            alt={todayLabel || totalLabel || 'Dashboard icon'}
            sx={{
              width: { 
                xs: '85%',   // Slightly smaller on mobile
                sm: '90%',   // Tablet
                md: '95%',   // Desktop
                lg: '100%'   // Large desktop
              },
              height: { 
                xs: '85%',
                sm: '90%',
                md: '95%',
                lg: '100%'
              },
              objectFit: 'contain',
              objectPosition: 'center',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: { xs: 'scale(1.05)', sm: 'scale(1.1)' },
              },
            }}
          />
        ) : (
          <Typography
            sx={{
              fontSize: { xs: '0.625rem', sm: '0.75rem', md: '0.8125rem' },
              color: theme.palette.text.disabled,
              textAlign: 'center',
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
