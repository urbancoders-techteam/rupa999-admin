import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
// import { useTheme } from '@mui/material/styles';
import { Box, CircularProgress, Container, Grid, Typography } from '@mui/material';
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
import DashboardSummaryCard from '../sections/_dashboard/components/DashboardSummaryCard';
import { fNumber } from '../utils/formatNumber';

// ----------------------------------------------------------------------

export default function GeneralDashboardPage() {
  // const { user } = useAuthContext();
  // const theme = useTheme();
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const { dashboardStats, dashboardLoading } = useSelector((state) => state.staff);
  const cardStyles = [
    {
      backgroundImage: 'linear-gradient(135deg, #FFFFFF 0%, #FFFFFF 78%, #FFEAC6 100%)',
      borderColor: 'rgba(224, 154, 48, 0.46)',
    },
    {
      backgroundImage: 'linear-gradient(135deg, #FFFFFF 0%, #FFFFFF 78%, #D9EFFF 100%)',
      borderColor: 'rgba(55, 145, 209, 0.43)',
    },
    {
      backgroundImage: 'linear-gradient(135deg, #FFFFFF 0%, #FFFFFF 78%, #DDF4E4 100%)',
      borderColor: 'rgba(54, 155, 84, 0.42)',
    },
    {
      backgroundImage: 'linear-gradient(135deg, #FFFFFF 0%, #FFFFFF 78%, #E8DCFF 100%)',
      borderColor: 'rgba(126, 82, 201, 0.42)',
    },
    {
      backgroundImage: 'linear-gradient(135deg, #FFFFFF 0%, #FFFFFF 78%, #FFE0E7 100%)',
      borderColor: 'rgba(204, 74, 103, 0.42)',
    },
    {
      backgroundImage: 'linear-gradient(135deg, #FFFFFF 0%, #FFFFFF 78%, #DEE7FF 100%)',
      borderColor: 'rgba(65, 105, 190, 0.42)',
    },
    {
      backgroundImage: 'linear-gradient(135deg, #FFFFFF 0%, #FFFFFF 78%, #FFEAB3 100%)',
      borderColor: 'rgba(207, 157, 31, 0.44)',
    },
  ];

  useEffect(() => {
    dispatch(getDashboardStatsAsync());
  }, [dispatch]);

  return (
    <>
      <Helmet>
        <title> General: Dashboard | Rupa999 </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'} sx={{ mt: { xs: 1.5, sm: 2.5 }, pb: 2 }}>
        {dashboardLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Box
              sx={{
                mb: { xs: 2, sm: 3 },
                p: { xs: 2, sm: 2.5, md: 3 },
                borderRadius: 2.5,
                background:
                  'linear-gradient(120deg, #FFFFFF 0%, #F4F8FF 58%, #E3F3FF 100%)',
                border: '1px solid rgba(53, 99, 144, 0.2)',
                boxShadow: '0 8px 24px rgba(53, 99, 144, 0.1)',
              }}
            >
              <Typography
                sx={{
                  fontSize: { xs: '1.1rem', sm: '1.35rem', md: '1.55rem' },
                  fontWeight: 700,
                  color: 'text.primary',
                }}
              >
                Dashboard Overview
              </Typography>
              <Typography
                sx={{
                  mt: 0.5,
                  fontSize: { xs: '0.78rem', sm: '0.86rem', md: '0.92rem' },
                  color: 'text.secondary',
                }}
              >
                Track daily performance and total platform stats in one place.
              </Typography>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Box
                  display="grid"
                  rowGap={{ xs: 2, sm: 2.5, md: 3 }}
                  columnGap={{ xs: 2, sm: 2.5, md: 3 }}
                  gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)',
                    sm: 'repeat(2, 1fr)',
                    md: 'repeat(3, 1fr)',
                    lg: 'repeat(4, 1fr)'
                  }}
                >
                  <DashboardSummaryCard
                    todayValue={fNumber(dashboardStats?.totalMarkets || 0)}
                    todayLabel="Total Market"
                    gifSrc={marketGif}
                    color="warning"
                    sx={cardStyles[0]}
                  />
                  <DashboardSummaryCard
                    todayLabel="Today's New Users"
                    todayValue={fNumber(dashboardStats?.todayNewUsers || 0)}
                    totalValue={fNumber(dashboardStats?.totalUsers || 0)}
                    totalLabel="Total Users"
                    gifSrc={totalUsersGif}
                    color="info"
                    sx={cardStyles[1]}
                  />
                  <DashboardSummaryCard
                    todayLabel="Today's Bid Amt"
                    todayValue={fNumber(dashboardStats?.todayBidAmount || 0)}
                    // todayValue={fNumber(dashboardStats?.totalBidAmount || 0)}
                    // todayLabel="Total Bid Amt"
                    gifSrc={bidAmtGif}
                    color="success"
                    sx={cardStyles[2]}
                  />
                  <DashboardSummaryCard
                    todayLabel="Today's Win Amt"
                    todayValue={fNumber(dashboardStats?.todayWinAmount || 0)}
                    totalValue={fNumber(dashboardStats?.totalWinAmount || 0)}
                    totalLabel="Total Win Amt"
                    gifSrc={winAmtGif}
                    color="secondary"
                    sx={cardStyles[3]}
                  />
                  <DashboardSummaryCard
                    todayLabel="Today's Deposit"
                    todayValue={fNumber(dashboardStats?.todayDeposit || 0)}
                    totalValue={fNumber(dashboardStats?.totalDeposit || 0)}
                    totalLabel="Total Deposit"
                    gifSrc={depositGif}
                    color="error"
                    sx={cardStyles[4]}
                  />
                  <DashboardSummaryCard
                    todayLabel="Manual Deposit"
                    todayValue={fNumber(dashboardStats?.totalDeposit || 0)}
                    totalValue={fNumber(dashboardStats?.totalManualDeposit || 0)}
                    totalLabel="Online Deposit"
                    gifSrc={depositGif}
                    color="error"
                    sx={cardStyles[5]}
                  />
                  <DashboardSummaryCard
                    todayLabel="Today's Withdraw"
                    todayValue={fNumber(dashboardStats?.todayWithdraw || 0)}
                    totalValue={fNumber(dashboardStats?.totalWithdraw || 0)}
                    totalLabel="Total Withdraw"
                    gifSrc={withdrawGif}
                    color="primary"
                    sx={cardStyles[5]}
                  />
                  <DashboardSummaryCard
                    todayLabel="Total User's Wallet Balance"
                    todayValue={fNumber(
                      dashboardStats?.totalWalletBalance ?? dashboardStats?.todayWalletBalance ?? 0
                    )}
                    gifSrc={walletBalanceGif}
                    color="warning"
                    sx={cardStyles[6]}
                  />
                </Box>
              </Grid>
            </Grid>
          </>
        )}
      </Container>
    </>
  );
}
