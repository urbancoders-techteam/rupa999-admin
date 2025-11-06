import { Helmet } from 'react-helmet-async';
// import { useTheme } from '@mui/material/styles';
import { Container, Grid, Box } from '@mui/material';
// import { useAuthContext } from '../../auth/useAuthContext';
import { useSettingsContext } from '../components/settings';
import SingleAnkBidsTable from '../sections/_dashboard/SingleAnkBidsTable';
import DashboardSummaryCard from '../sections/_dashboard/components/DashboardSummaryCard';

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

      <Container maxWidth={themeStretch ? false : 'xl'} sx={{ mt: 2 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box
              display="grid"
              rowGap={3}
              columnGap={3}
              gridTemplateColumns={{ xs: '1fr', sm: 'repeat(4, 1fr)' }}
            >
              <DashboardSummaryCard
                todayLabel="Today Market"
                todayValue={8230}
                totalValue={32120}
                totalLabel="Total Market"
                // imageSrc="/assets/illustrations/deposit.svg" // your image path here
              />
              <DashboardSummaryCard
                todayLabel="Total Users"
                todayValue={8230}
                totalValue={32120}
                totalLabel="Today New Users"
                // imageSrc="/assets/illustrations/deposit.svg" // your image path here
              />
              <DashboardSummaryCard
                todayLabel="Today Bid Amount"
                todayValue={8230}
                totalValue={32120}
                totalLabel="Total Bid Amount"
                // imageSrc="/assets/illustrations/deposit.svg" // your image path here
              />
              <DashboardSummaryCard
                todayLabel="Today Win Amount"
                todayValue={8230}
                totalValue={32120}
                totalLabel="Total Win Amount"
                // imageSrc="/assets/illustrations/deposit.svg" // your image path here
              />
              <DashboardSummaryCard
                todayLabel="Today Deposit"
                todayValue={8230}
                totalValue={32120}
                totalLabel="Total Deposit"
                // imageSrc="/assets/illustrations/deposit.svg" // your image path here
              />
              <DashboardSummaryCard
                todayLabel="Today Withdraw"
                todayValue={8230}
                totalValue={32120}
                totalLabel="Total Withdraw"
                // imageSrc="/assets/illustrations/deposit.svg" // your image path here
              />
              <DashboardSummaryCard
                totalLabel="Today Wallet Balance"
                totalValue={32120}
                // imageSrc="/assets/illustrations/deposit.svg" // your image path here
              />
            
            </Box>
          </Grid>
        </Grid>

        <SingleAnkBidsTable />
      </Container>
    </>
  );
}
