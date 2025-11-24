import { Helmet } from 'react-helmet-async';
// import { useTheme } from '@mui/material/styles';
import { Container, Grid, Box } from '@mui/material';
// import { useAuthContext } from '../../auth/useAuthContext';
import { useSettingsContext } from '../components/settings';
import SingleAnkBidsTable from '../sections/_dashboard/SingleAnkBidsTable';
import DashboardSummaryCard from '../sections/_dashboard/components/DashboardSummaryCard';
import marketGif from '../assets/gifs/market.gif';
import totalUsersGif from '../assets/gifs/user.gif';
import bidAmtGif from '../assets/gifs/bidAmt.gif';
import walletBalanceGif from '../assets/gifs/walletBalance.gif';
import depositGif from '../assets/gifs/deposit.gif';
import withdrawGif from '../assets/gifs/withdraw.gif';
import winAmtGif from '../assets/gifs/winAmt.gif';

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
              rowGap={{ xs: 2, sm: 2.5, md: 3 }}
              columnGap={{ xs: 2, sm: 2.5, md: 3 }}
              gridTemplateColumns={{ 
                xs: 'repeat(2, 1fr)', 
                sm: 'repeat(2, 1fr)', 
                md: 'repeat(3, 1fr)', 
                lg: 'repeat(4, 1fr)' 
              }}
            >
              <DashboardSummaryCard
                totalValue={32120}
                totalLabel="Total Market"
                gifSrc={marketGif}
              />
              <DashboardSummaryCard
                todayLabel="Total Users"
                todayValue={8230}
                totalValue={32120}
                totalLabel="Today New Users"
                gifSrc={totalUsersGif}
              />
              <DashboardSummaryCard
                todayLabel="Today Bid Amt"
                todayValue={8230}
                totalValue={32120}
                totalLabel="Total Bid Amt"
                gifSrc={bidAmtGif}
              />
              <DashboardSummaryCard
                todayLabel="Today Win Amt"
                todayValue={8230}
                totalValue={32120}
                totalLabel="Total Win Amt"
                gifSrc={winAmtGif}
                />
              <DashboardSummaryCard
                todayLabel="Today Deposit"
                todayValue={8230}
                totalValue={32120}
                totalLabel="Total Deposit"
                gifSrc={depositGif}
              />
              <DashboardSummaryCard
                todayLabel="Today Withdraw"
                todayValue={8230}
                totalValue={32120}
                totalLabel="Total Withdraw"
                gifSrc={withdrawGif}
              />
              <DashboardSummaryCard
                totalLabel="Today Wallet Balance"
                totalValue={32120}
                gifSrc={walletBalanceGif}
              />
            
            </Box>
          </Grid>
        </Grid>

        <SingleAnkBidsTable />
      </Container>
    </>
  );
}
