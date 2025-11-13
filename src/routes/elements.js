import { Suspense, lazy } from 'react';
// components
import LoadingScreen from '../components/loading-screen';

// ----------------------------------------------------------------------

const Loadable = (Component) => (props) =>
  (
    <Suspense fallback={<LoadingScreen />}>
      <Component {...props} />
    </Suspense>
  );

// ----------------------------------------------------------------------

// AUTH
export const LoginPage = Loadable(lazy(() => import('../pages/auth/LoginPage')));
export const RegisterPage = Loadable(lazy(() => import('../pages/auth/RegisterPage')));
export const VerifyCodePage = Loadable(lazy(() => import('../pages/auth/VerifyCodePage')));
export const NewPasswordPage = Loadable(lazy(() => import('../pages/auth/NewPasswordPage')));
// export const ResetPasswordPage = Loadable(lazy(() => import('../pages/auth/ResetPasswordPage')));

// DASHBOARD: Main
export const GeneralDashboardPage = Loadable(lazy(() => import('../pages/GeneralDashboardPage')));
export const SliderImagePage = Loadable(lazy(() => import('../pages/SliderImagePage')));

// DASHBOARD: Staff
export const StaffListPage = Loadable(lazy(() => import('../pages/StaffListPage')));
export const StaffFormHandle = Loadable(lazy(() => import('../sections/_staff/form/StaffFormHandle')));
export const RolePermissionFormHandle = Loadable(lazy(() => import('../sections/_staff/form/RolePermissionFormHandle')));

// DASHBOARD: Designation
export const DesignationListPage = Loadable(lazy(() => import('../pages/DesignationListPage')));

// DASHBOARD: User 
export const UserListPage = Loadable(lazy(() => import('../pages/UserListPage')));
export const UserFormHandle = Loadable(lazy(() => import('../sections/_users/form/UserFormHandle')));
export const UserBidHistoryListPage = Loadable(lazy(() => import('../pages/UserBidHistoryListPage')));
export const UserTransactionListPage = Loadable(lazy(() => import('../pages/UserTransactionListPage')));
export const WithdrawalResquestListPage = Loadable(lazy(() => import('../pages/WithdrawalResquestListPage')));

// DASHBOARD: Withdraw Details
export const WithdrawDetailsPage = Loadable(lazy(() => import('../pages/WithdrawDetailsPage')));

// DASHBOARD: Profit
export const ProfitPage = Loadable(lazy(() => import('../pages/ProfitPage')));

// DASHBOARD: General Settings | Change Password
export const ResetPasswordPage = Loadable(lazy(() => import('../pages/auth/ResetPasswordPage')));

// DASHBOARD: Gift
export const GiftPage = Loadable(lazy(() => import('../pages/GiftListPage')));
export const GiftFormHandlePage = Loadable(lazy(() => import('../sections/_gift/pages/GiftFormHandlePage')));

// -------------------DASHBOARD: Markets-------------------------------
export const MarketsListPage = Loadable(lazy(() => import('../pages/markets/MarketsListPage')));
export const MarketFormHandlePage = Loadable(lazy(() => import('../sections/_markets/pages/MarketFormHandle')));

// DASHBOARD: Markets | Pana Charts
export const PanaChartsListPage = Loadable(lazy(() => import('../pages/markets/PanaChartsListPage')));

// DASHBOARD: Markets | Records
export const GeneralMarketRecordListPage = Loadable(lazy(() => import('../pages/markets/GeneralMarketRecordListPage')));

// DASHBOARD: Markets | Market Results
export const MarketResultListPage = Loadable(lazy(() => import('../pages/markets/MarketResultListPage')));

// DASHBOARD: Markets | Predictions Form
export const GeneralPredictionFormPage = Loadable(lazy(() => import('../pages/markets/GeneralPredictionFormPage')));

// DASHBOARD: Markets | Win History List
export const WinHistoryListPage = Loadable(lazy(() => import('../pages/markets/WinHistoryListPage')));

// -----------------------DASHBOARD: Starline | Markets -------------------------------------------------- 
export const StarLineMarketsListPage = Loadable(lazy(() => import('../pages/startlineMarkets/StarLineMarketsListPage')));
export const StarlineMarketFormHandle = Loadable(lazy(() => import('../sections/_starline_market/pages/StarlineMarketFormHandle')));

// DASHBOARD: Starline Market | Records
export const StarLineMarketsRecordListPage = Loadable(lazy(() => import('../pages/startlineMarkets/StarLineMarketsRecordListPage')));

// DASHBOARD: Starline Market | Result
export const StarLineMarketResultListPage = Loadable(lazy(() => import('../pages/startlineMarkets/StarLineMarketResult')));

// DASHBOARD: Starline Market | Win History
export const StarLineWinHistoryListPage = Loadable(lazy(() => import('../pages/startlineMarkets/StarLineWinHistoryListPage')));

// DASHBOARD: Withdraw History
export const GeneralWithdrawHistoryListPage = Loadable(lazy(() => import('../pages/GeneralWithdrawHistoryListPage')));

// DASHBOARD: Diposit History
export const DipositHistoryListPage = Loadable(lazy(() => import('../pages/DipositHistoryListPage')));

// DASHBOARD: Game Types
export const GameTypeFormPage = Loadable(lazy(() => import('../pages/GameTypeFormPage')));

// BASIC PAGES
export const Page500 = Loadable(lazy(() => import('../pages/errorHandlingPage/Page500')));
export const Page403 = Loadable(lazy(() => import('../pages/errorHandlingPage/Page403')));
export const Page404 = Loadable(lazy(() => import('../pages/errorHandlingPage/Page404')));



