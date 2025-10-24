import { Helmet } from 'react-helmet-async';
// import { useTheme } from '@mui/material/styles';
import { Container, Grid, Box } from '@mui/material';
import SummaryCard from '../components/cards/SummaryCard';
// import { useAuthContext } from '../../auth/useAuthContext';
import { useSettingsContext } from '../components/settings';
import SingleAnkBidsTable from '../sections/_dashboard/SingleAnkBidsTable';

// ----------------------------------------------------------------------

export default function GeneralDashboardPage() {
  // const { user } = useAuthContext();
  // const theme = useTheme();
  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Helmet>
        <title> General: Dashboard | Rupa999 </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box
              display="grid"
              rowGap={3}
              columnGap={3}
              gridTemplateColumns={{ xs: '1fr', sm: 'repeat(4, 1fr)' }}
            >
                <SummaryCard
                  title="Total Markets"
                  percent={2.6}
                  total={18765}
                  color="primary"
                  chart={{
                    series: [5, 18, 12, 51, 68, 11, 39, 37, 27, 20],
                  }}
                />

                <SummaryCard
                  title="Active Traders"
                  percent={-1.8}
                  total={8923}
                  color="info"
                  chart={{
                    series: [15, 8, 25, 40, 28, 19, 12, 31, 18, 10],
                  }}
                />

                <SummaryCard
                  title="Today Bid Amount"
                  percent={1.2}
                  total={12500}
                  color="warning"
                  chart={{
                    series: [15, 30, 45, 20, 40, 60, 35, 50, 25, 55],
                  }}
                />

                <SummaryCard
                  title="Today Win Amount"
                  percent={4.8}
                  total={15200}
                  color="success"
                  chart={{
                    series: [10, 20, 30, 40, 60, 80, 70, 90, 100, 120],
                  }}
                />

                <SummaryCard
                  title="Today Deposit"
                  percent={2.6}
                  total={18765}
                  color="secondary"
                  chart={{
                    series: [5, 15, 25, 20, 35, 50, 65, 55, 45, 60],
                  }}
                />

                <SummaryCard
                  title="Today Withdraw"
                  percent={-0.5}
                  total={8938}
                  color="error"
                  chart={{
                    series: [30, 20, 10, 15, 25, 35, 45, 30, 40, 50],
                  }}
                />

                <SummaryCard
                  title="Total Wallet Balance"
                  percent={1.1}
                  total={8938}
                  color="secondary"
                  chart={{
                    series: [8, 16, 24, 52, 40, 28, 16, 34, 72, 80],
                  }}
                />

                <SummaryCard
                  title="Total Manually Added Wallet Balance"
                  percent={-1}
                  total={285013}
                  color="info"
                  chart={{
                    series: [10, 35, 25, 45, 39, 65, 42, 45, 59, 25],
                  }}
                />
            </Box>
          </Grid>
        </Grid>

        <SingleAnkBidsTable/>
      </Container>
    </>
  );
}
