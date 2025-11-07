import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
// @mui
import {
  Container,
  Box,
  Stack,
  Paper,
  IconButton,
  Drawer,
  useMediaQuery,
  Typography,
  Grid,
  Autocomplete,
  TextField,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// _mock_
// components
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
// sections
import DoublePanaTable from '../../sections/_panaChart/components/DoublePanaTable';
import PanaChartToolBar from '../../sections/_panaChart/components/PanaChartToolBar';
import JodiResultTable from '../../sections/_charts/JodiResultTable';
import SinglePanaChart from '../../sections/_charts/SinglePanaChart';
import { RHFAutocomplete } from '../../components/hook-form';

// ----------------------------------------------------------------------

export default function PanaChartsListPage() {
  const { themeStretch } = useSettingsContext();
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState('Jodi')

  const handleDrawerOpen = () => setDrawerOpen(true);
  const handleDrawerClose = () => setDrawerOpen(false);

  return (
    <>
      <Helmet>
        <title> Pana Chart : Tables | Rupa999 </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Paper
          sx={{
            position: 'sticky',
            top: 60,
            zIndex: 10,
            py: 0.2,
            px: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <CustomBreadcrumbs
            heading="Pana Chart Tables"
            links={[
              { name: 'Dashboard', href: PATH_DASHBOARD.root },
              { name: 'Pana Chart Tables', href: PATH_DASHBOARD.withdrawdetails.root },
            ]}
          />
          {isMobile ? (
            <>
              <IconButton color="primary" onClick={handleDrawerOpen} sx={{ ml: 1 }}>
                <MenuIcon />
              </IconButton>
              <Drawer anchor="right" open={drawerOpen} onClose={handleDrawerClose}>
                <Typography variant="h6" sx={{ p: 2 }}>
                  Tool Bar
                </Typography>
                <Box sx={{ width: 280, p: 2 }}>
                  <PanaChartToolBar handleDrawerClose={handleDrawerClose} />
                </Box>
              </Drawer>
            </>
          ) : (
            <Box sx={{ minWidth: 320 }}>
              <PanaChartToolBar />
            </Box>
          )}
        </Paper>
        <Grid container spacing={2} alignItems="center" sx={{ my: 2 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Autocomplete
              size="small"
              fullWidth
              options={['Jodi', 'Single Pana']}
              value={selectedGame}
              onChange={(_, newValue) => setSelectedGame(newValue)}
              renderInput={(params) => <TextField {...params} label="Select Game" fullWidth />}
            />
          </Grid>
        </Grid>
        <Stack spacing={3} mb={3}>
          {selectedGame === 'Jodi' && <JodiResultTable />}
          {selectedGame === 'Single Pana' && <SinglePanaChart />}
        </Stack>
      </Container>
    </>
  );
}
