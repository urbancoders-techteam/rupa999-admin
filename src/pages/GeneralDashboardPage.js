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

      <Container maxWidth={themeStretch ? false : 'xl'} sx={{mt:2}}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box
              display="grid"
              rowGap={3}
              columnGap={3}
              gridTemplateColumns={{ xs: '1fr', sm: 'repeat(4, 1fr)' }}
            >
              <DashboardSummaryCard
                leftTitle="Total Market"
                leftValue="1200"
                rightTitle="Today Market"
                rightValue="320"
                color="primary"
              />
             
              <DashboardSummaryCard
                leftTitle="Total Users"
                leftValue="1200"
                rightTitle="Today New Users"
                rightValue="320"
                color="primary"
              />
           
              <DashboardSummaryCard
                leftTitle="Total Bid Amount"
                leftValue="1200"
                rightTitle="Today Bid Amount"
                rightValue="320"
                color="primary"
              />
           
              <DashboardSummaryCard
                leftTitle="Total Win Amount"
                leftValue="1200"
                rightTitle="Today Win Amount"
                rightValue="320"
                color="primary"
              />
           
              <DashboardSummaryCard
                leftTitle="Total Deposit"
                leftValue="1200"
                rightTitle="Today Deposit"
                rightValue="320"
                color="primary"
              />
              
              <DashboardSummaryCard
                leftTitle="Total Withdraw"
                leftValue="1200"
                rightTitle="Today Withdraw"
                rightValue="320"
                color="primary"
              />
           
              <DashboardSummaryCard
                leftTitle="Total Wallet Balance"
                leftValue="1200"
              />

            </Box>
          </Grid>
        </Grid>

        <SingleAnkBidsTable />
      </Container>
    </>
  );
}
