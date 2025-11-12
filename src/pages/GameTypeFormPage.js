import React from 'react';
import { Box, Card, Container } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { useSettingsContext } from '../components/settings';
import CustomBreadcrumbs from '../components/custom-breadcrumbs';
import { PATH_DASHBOARD } from '../routes/paths';
import GameTypeRowForm from '../sections/_game_types/GameTypesForm'; // ✅ Ensure file name matches actual export

const GameTypeFormPage = () => {
  const themeStretch = useSettingsContext();

  const gameTypesList = [
    { name: 'Single Digit', type: 'General' },
    { name: 'Jodi Digit', type: 'General' },
    { name: 'Triple Pana', type: 'General' },
    { name: 'Half Sangam A', type: 'General' },
    { name: 'Half Sangam B', type: 'General' },
    { name: 'Full Sangam', type: 'General' },
    { name: 'Single Digit', type: 'Start Line' },
    { name: 'Single Pana', type: 'Start Line' },
    { name: 'Double Pana', type: 'Start Line' },
  ];

  return (
    <>
      <Helmet>
        <title>Game Types : Form | Rupa999</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        {/* ✅ Breadcrumb Section */}
        <Box sx={{ position: 'sticky', top: 0, zIndex: 10, bgcolor: 'background.paper' }}>
          <CustomBreadcrumbs
            heading="Game Types"
            links={[
              { name: 'Dashboard', href: PATH_DASHBOARD.root },
              { name: 'Game Types', href: PATH_DASHBOARD.gametypes.root },
            ]}
          />
        </Box>

        {/* ✅ Main Content */}
        <Card sx={{ p: 3, mt: 2 }}>
          {gameTypesList?.map((game, index ) => (
            <GameTypeRowForm key={index} game={game} />
          ))}
        </Card>
      </Container>
    </>
  );
};

export default GameTypeFormPage;
