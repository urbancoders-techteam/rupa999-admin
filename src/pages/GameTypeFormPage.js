import { Box, Card, Container } from '@mui/material';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch } from 'react-redux';
import CustomBreadcrumbs from '../components/custom-breadcrumbs';
import { useSettingsContext } from '../components/settings';
import { getAllGameTypeRatesAsync } from '../redux/services/game_type_rate_services';
import { PATH_DASHBOARD } from '../routes/paths';
import GameTypeRowForm from '../sections/_game_types/GameTypesForm';

const GameTypeFormPage = () => {
  const themeStretch = useSettingsContext();
  const dispatch = useDispatch();
  const [gameTypesList, setGameTypesList] = useState([
    { name: 'Single Digit', gameType: 'single_digit', type: 'General' },
    { name: 'Jodi Digit', gameType: 'jodi_digit', type: 'General' },
    { name: 'Single Pana', gameType: 'single_pana', type: 'General' },
    { name: 'Double Pana', gameType: 'double_pana', type: 'General' },
    { name: 'Triple Pana', gameType: 'triple_pana', type: 'General' },
    { name: 'Half Sangam A', gameType: 'half_sangam_a', type: 'General' },
    { name: 'Half Sangam B', gameType: 'half_sangam_b', type: 'General' },
    { name: 'Full Sangam', gameType: 'full_sangam', type: 'General' },
  ]);

  const [loading, setLoading] = useState(false);
  const formRefs = useRef({});

  const fetchGameTypeRates = useCallback(async () => {
    try {
      setLoading(true);
      const result = await dispatch(getAllGameTypeRatesAsync()).unwrap();
      if (result?.data) {
        // Merge API data with default list
        const ratesMap = {};
        result.data.forEach((rate) => {
          ratesMap[rate.name] = rate.multiplyBy;
        });

        setGameTypesList((prevList) =>
          prevList.map((game) => ({
            ...game,
            multiplyBy: ratesMap[game.name] || '',
          }))
        );
      }
    } catch (error) {
      console.error('Error fetching game type rates:', error);
      // Continue with default list if API fails
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchGameTypeRates();
  }, [fetchGameTypeRates]);

  return (
    <>
      <Helmet>
        <title>Rate Card : Form | Rupa999</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        {/* ✅ Breadcrumb Section */}
        <Box sx={{ position: 'sticky', top: 0, zIndex: 10, bgcolor: 'background.paper' }}>
          <CustomBreadcrumbs
            heading="Rate Card"
            links={[
              { name: 'Dashboard', href: PATH_DASHBOARD.root },
              { name: 'Rate Card', href: PATH_DASHBOARD.gametypes.root },
            ]}
          />
        </Box>

        {/* ✅ Main Content */}
        <Card sx={{ p: 3, mt: 2 }}>
          {gameTypesList?.map((game, index) => {
            const key = `${game.name}-${game.type}`;
            return (
              <GameTypeRowForm
                key={key}
                game={game}
                formRef={(ref) => {
                  formRefs.current[key] = ref;
                }}
                onUpdate={(updatedGame) => {
                  setGameTypesList((prevList) =>
                    prevList.map((g, i) => (i === index ? updatedGame : g))
                  );
                }}
              />
            );
          })}
        </Card>
      </Container>
    </>
  );
};

export default GameTypeFormPage;
