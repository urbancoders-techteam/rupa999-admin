import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
// @mui
import FilterListIcon from '@mui/icons-material/FilterList';
import MenuIcon from '@mui/icons-material/Menu';
import {
  Box,
  Card,
  Container,
  Drawer,
  IconButton,
  Paper,
  Stack,
  Typography,
  alpha,
  useMediaQuery,
  useTheme,
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
// sections
import JodiResultTable from '../../sections/_charts/JodiResultTable';
import SinglePanaChartTable from '../../sections/_charts/SinglePanaChartTable';
import PanaChartToolBar from '../../sections/_panaChart/components/PanaChartToolBar';

// ----------------------------------------------------------------------

export default function PanaChartsListPage() {
  const { themeStretch } = useSettingsContext();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedMarketType, setSelectedMarketType] = useState('Main Market');
  const [selectedGame, setSelectedGame] = useState('Single Pana');
  const [selectedMarket, setSelectedMarket] = useState(null);

  const handleDrawerOpen = () => setDrawerOpen(true);
  const handleDrawerClose = () => setDrawerOpen(false);

  // Update market type only - don't reset market (let user control it through form)
  const handleMarketTypeChange = (marketType) => {
    setSelectedMarketType(marketType);
    // Don't reset market - let the form handle it when user clicks Submit
  };

  // Auto-select first market when markets are loaded and no market is selected
  // useEffect(() => {
  //   if (selectedMarketType && marketList && marketList.length > 0 && !selectedMarket) {
  //     const firstMarket = marketList[0];
  //     setSelectedMarket(firstMarket);
  //   }
  // }, [marketList, selectedMarketType, selectedMarket]);

  return (
    <>
      <Helmet>
        <title> Pana Chart : Tables | Rupa999 </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        {/* Sticky Header */}
        <Paper
          elevation={0}
          sx={{
            position: 'sticky',
            top: 60,
            zIndex: 10,
            py: { xs: 1.5, sm: 2 },
            px: { xs: 2, sm: 3 },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: alpha(theme.palette.background.paper, 0.95),
            backdropFilter: 'blur(8px)',
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
            mb: { xs: 2, sm: 3 },
          }}
        >
          <CustomBreadcrumbs
            heading="Chart Tables"
            links={[
              { name: 'Dashboard', href: PATH_DASHBOARD.root },
              { name: 'Chart Tables', href: PATH_DASHBOARD.markets.charts.list },
            ]}
          />
          {isMobile && (
            <IconButton
              color="primary"
              onClick={handleDrawerOpen}
              sx={{
                ml: 1,
                bgcolor: alpha(theme.palette.primary.main, 0.08),
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.16),
                },
              }}
            >
              <FilterListIcon />
            </IconButton>
          )}
        </Paper>

        {/* Filter Toolbar - Desktop */}
        {!isMobile && (
          <Card
            elevation={0}
            sx={{
              mb: { xs: 2, sm: 3 },
              p: { xs: 2, sm: 2.5 },
              backgroundColor: alpha(theme.palette.background.paper, 0.6),
              border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
              borderRadius: 2,
            }}
          >
            <PanaChartToolBar
              selectedMarketType={selectedMarketType}
              onMarketTypeChange={handleMarketTypeChange}
              selectedGame={selectedGame}
              onGameChange={setSelectedGame}
              selectedMarket={selectedMarket}
              onMarketChange={setSelectedMarket}
            />
          </Card>
        )}

        {/* Mobile Drawer */}
        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={handleDrawerClose}
          PaperProps={{
            sx: {
              width: { xs: '85%', sm: 360 },
              p: 2.5,
            },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 3,
              pb: 2,
              borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Filter Options
            </Typography>
            <IconButton
              size="small"
              onClick={handleDrawerClose}
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  bgcolor: alpha(theme.palette.error.main, 0.08),
                  color: 'error.main',
                },
              }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
          <PanaChartToolBar
            handleDrawerClose={handleDrawerClose}
            selectedMarketType={selectedMarketType}
            onMarketTypeChange={handleMarketTypeChange}
            selectedGame={selectedGame}
            onGameChange={setSelectedGame}
            selectedMarket={selectedMarket}
            onMarketChange={setSelectedMarket}
          />
        </Drawer>

        {/* Chart Tables - Only show when market type is selected */}
        {selectedMarketType && (
          <Stack spacing={{ xs: 2, sm: 3 }} sx={{ mb: 3 }}>
            {selectedGame === 'Jodi' && <JodiResultTable selectedMarket={selectedMarket} />}
            {selectedGame === 'Single Pana' && <SinglePanaChartTable selectedMarket={selectedMarket} />}
          </Stack>
        )}
      </Container>
    </>
  );
}
