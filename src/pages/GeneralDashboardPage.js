import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
// import { useTheme } from '@mui/material/styles';
import { Box, CircularProgress, Container, Grid } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
// import { useAuthContext } from '../../auth/useAuthContext';
import bidAmtGif from '../assets/gifs/bidAmt.gif';
import depositGif from '../assets/gifs/deposit.gif';
import marketGif from '../assets/gifs/market.gif';
import totalUsersGif from '../assets/gifs/user.gif';
import walletBalanceGif from '../assets/gifs/walletBalance.gif';
import winAmtGif from '../assets/gifs/winAmt.gif';
import withdrawGif from '../assets/gifs/withdraw.gif';
import { useSettingsContext } from '../components/settings';
import { getDashboardStatsAsync } from '../redux/services/staff_services';
import SingleAnkBidsTable from '../sections/_dashboard/SingleAnkBidsTable';
import DashboardSummaryCard from '../sections/_dashboard/components/DashboardSummaryCard';
import { fNumber } from '../utils/formatNumber';

// ----------------------------------------------------------------------

export default function GeneralDashboardPage() {
  // const { user } = useAuthContext();
  // const theme = useTheme();
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const { dashboardStats, dashboardLoading } = useSelector((state) => state.staff);

  useEffect(() => {
    dispatch(getDashboardStatsAsync());
  }, [dispatch]);

  return (
    <>
      <Helmet>
        <title> General: Dashboard | Rupa999 </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'} sx={{ mt: 2 }}>
        {dashboardLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <CircularProgress />
          </Box>
        ) : (
          <>
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
                    totalValue={fNumber(dashboardStats?.totalMarkets || 0)}
                    totalLabel="Total Market"
                    gifSrc={marketGif}
                  />
                  <DashboardSummaryCard
                    todayLabel="Today's New Users"
                    todayValue={fNumber(dashboardStats?.todayNewUsers || 0)}
                    totalValue={fNumber(dashboardStats?.totalUsers || 0)}
                    totalLabel="Total Users"
                    gifSrc={totalUsersGif}
                  />
                  <DashboardSummaryCard
                    todayLabel="Today's Bid Amt"
                    todayValue={fNumber(dashboardStats?.todayBidAmount || 0)}
                    // todayValue={fNumber(dashboardStats?.totalBidAmount || 0)}
                    // todayLabel="Total Bid Amt"
                    gifSrc={bidAmtGif}
                  />
                  <DashboardSummaryCard
                    todayLabel="Today's Win Amt"
                    todayValue={fNumber(dashboardStats?.todayWinAmount || 0)}
                    totalValue={fNumber(dashboardStats?.totalWinAmount || 0)}
                    totalLabel="Total Win Amt"
                    gifSrc={winAmtGif}
                  />
                  <DashboardSummaryCard
                    todayLabel="Today's Deposit"
                    todayValue={fNumber(dashboardStats?.todayDeposit || 0)}
                    totalValue={fNumber(dashboardStats?.totalDeposit || 0)}
                    totalLabel="Total Deposit"
                    gifSrc={depositGif}
                  />
                  <DashboardSummaryCard
                    todayLabel="Today's Withdraw"
                    todayValue={fNumber(dashboardStats?.todayWithdraw || 0)}
                    totalValue={fNumber(dashboardStats?.totalWithdraw || 0)}
                    totalLabel="Total Withdraw"
                    gifSrc={withdrawGif}
                  />
                  <DashboardSummaryCard
                    totalLabel="Total Wallet Balance"
                    totalValue={fNumber(
                      dashboardStats?.totalWalletBalance ?? dashboardStats?.todayWalletBalance ?? 0
                    )}
                    gifSrc={walletBalanceGif}
                  />
                </Box>
              </Grid>
            </Grid>

            {/* <SingleAnkBidsTable /> */}
          </>
        )}
      </Container>
    </>
  );
}
