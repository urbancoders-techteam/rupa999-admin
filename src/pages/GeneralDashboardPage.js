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
    { backgroundImage: 'linear-gradient(150deg, rgba(255,245,233,0.95), rgba(255,255,255,0.95))' },
    { backgroundImage: 'linear-gradient(150deg, rgba(236,247,255,0.95), rgba(255,255,255,0.95))' },
    { backgroundImage: 'linear-gradient(150deg, rgba(239,250,242,0.95), rgba(255,255,255,0.95))' },
    { backgroundImage: 'linear-gradient(150deg, rgba(245,241,255,0.95), rgba(255,255,255,0.95))' },
    { backgroundImage: 'linear-gradient(150deg, rgba(255,241,244,0.95), rgba(255,255,255,0.95))' },
    { backgroundImage: 'linear-gradient(150deg, rgba(240,247,255,0.95), rgba(255,255,255,0.95))' },
    { backgroundImage: 'linear-gradient(150deg, rgba(245,248,255,0.95), rgba(255,255,255,0.95))' },
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
                  'linear-gradient(120deg, rgba(255,235,238,0.7) 0%, rgba(227,242,253,0.8) 55%, rgba(232,245,233,0.75) 100%)',
                border: '1px solid rgba(0,0,0,0.06)',
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
                    totalValue={fNumber(dashboardStats?.totalMarkets || 0)}
                    totalLabel="Total Market"
                    gifSrc={marketGif}
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
                    todayLabel="Today's Withdraw"
                    todayValue={fNumber(dashboardStats?.todayWithdraw || 0)}
                    totalValue={fNumber(dashboardStats?.totalWithdraw || 0)}
                    totalLabel="Total Withdraw"
                    gifSrc={withdrawGif}
                    color="primary"
                    sx={cardStyles[5]}
                  />
                  <DashboardSummaryCard
                    totalLabel="Total Wallet Balance"
                    totalValue={fNumber(
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
