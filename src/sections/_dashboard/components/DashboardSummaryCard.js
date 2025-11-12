import PropTypes from 'prop-types';
import { useTheme, alpha } from '@mui/material/styles';
import { Card, Typography, Box, Stack, useMediaQuery } from '@mui/material';

// ----------------------------------------------------------------------

export default function DashboardSummaryCard({
  todayLabel,
  todayValue = 0,
  totalValue = 0,
  totalLabel ,
  imageSrc = '',
  color = 'success',
  sx,
  ...other
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Card
      sx={{
        p: { xs: 2, sm: 2.5, md: 3 },
        display: 'flex',
        alignItems:'flex-start',
        justifyContent: 'space-between',
        borderRadius: 2,
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        backgroundColor: theme.palette.background.paper,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: '0 6px 16px rgba(0,0,0,0.12)',
        },
        ...sx,
      }}
      {...other}
    >
      {/* LEFT SECTION */}
      <Box
        spacing={isMobile ? 0.8 : 1.2}
        sx={{
          flex: 1,
          pr: { sm: 2, md: 3 },
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{
            color: theme.palette.text.secondary,
            textTransform: 'capitalize',
          }}
        >
          {totalLabel}
        </Typography>

        <Typography
          variant={isMobile ? 'h5' : 'h4'}
          sx={{
            fontWeight: 700,
            color: theme.palette.text.primary,
            lineHeight: 1.3,
          }}
        >
          {totalValue}
        </Typography>

       {todayLabel && <Box sx={{  mt: 1,}}>
          <Typography
            variant="subtitle2"
            sx={{
              color: theme.palette.text.secondary,
            }}
          >
            {todayLabel}
          </Typography>
          <Typography
            variant={isMobile ? 'h5' : 'h4'}
            sx={{
              flexWrap: 'wrap',
              color: theme.palette[color].main,
              fontWeight: 700,
            }}
          >
            {todayValue}&nbsp;
          </Typography>
        </Box>}
      </Box>

      {/* RIGHT SECTION (IMAGE) */}
      <Box
        sx={{
          width: { xs: '50%', sm: 120, md: 80 },
          height: { xs: 100, sm: 100, md: 80 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          borderRadius: 2,
          bgcolor: alpha(theme.palette.primary.main, 0.04),
        }}
      >
        {imageSrc ? (
          <Box
            component="img"
            src={imageSrc}
            alt={todayLabel}
            sx={{
              width: '50%',
              height: 'auto',
              objectFit: 'contain',
            }}
          />
        ) : (
          <Typography
            variant="caption"
            sx={{
              color: theme.palette.text.disabled,
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
  color: PropTypes.string,
  sx: PropTypes.object,
};
