import { Navigate, useRoutes } from 'react-router-dom';
// auth
import AuthGuard from '../auth/AuthGuard';
import GuestGuard from '../auth/GuestGuard';
// layouts
import CompactLayout from '../layouts/compact';
import DashboardLayout from '../layouts/dashboard';
// config
import { PATH_AFTER_LOGIN } from '../config-global';
//
import {
  BidRecordListPage,
  DesignationListPage,
  DipositHistoryListPage,
  GameTypeFormPage,
  GeneralDashboardPage,
  GeneralMarketRecordListPage,
  GeneralPredictionFormPage,
  GeneralWithdrawHistoryListPage,
  GiftFormHandlePage,
  GiftPage,
  // Auth
  LoginPage,
  MainBidHistoryListPage,
  MainTransactionListPage,
  MarketDataListPage,
  MarketFormHandlePage,
  MarketResultListPage,
  MarketsListPage,
  NotificationFormHandlePage,
  NotificationListPage,
  Page403,
  Page404,
  // Error Handling Pages
  Page500,
  PanaChartsListPage,
  ProfitPage,
  ResetPasswordPage,
  RolePermissionFormHandle,
  SliderImagePage,
  StaffFormHandle,
  GatewaySettingFormPage,
  StaticDataFormPage,
  CommonSettingFormPage,
  HelpAndSupportFormPage,
  //
  StaffListPage,
  StarlineMarketFormHandle,
  StarLineMarketResultListPage,
  StarLineMarketsListPage,
  StarLineMarketsRecordListPage,
  StarLineWinHistoryListPage,
  UserBidHistoryListPage,
  UserFormHandle,
  UserListPage,
  UserTransactionListPage,
  WinHistoryListPage,
  WithdrawalResquestListPage,
} from './elements';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/',
      element: <Navigate to="/auth/login" replace />,
    },
    // Auth
    {
      path: 'auth',
      children: [
        {
          path: 'login',
          element: (
            <GuestGuard>
              <LoginPage />
            </GuestGuard>
          ),
        },

      ],
    },

    // Dashboard
    {
      path: '/dashboard',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        { element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true },
        { path: 'home', element: <GeneralDashboardPage />, index: true },
        {
          path: 'staff',
          children: [
            { element: <Navigate to="/dashboard/staff/list" replace />, index: true },
            { path: 'list', element: <StaffListPage /> },
            { path: 'new', element: <StaffFormHandle /> },
            { path: ':id/edit', element: <StaffFormHandle /> },
            { path: ':id/view', element: <StaffFormHandle /> },
          ],
        },
        {
          path: 'designation',
          children: [
            { element: <Navigate to="/dashboard/designation/list" replace />, index: true },
            { path: 'list', element: <DesignationListPage /> },
            { path: 'new', element: <RolePermissionFormHandle /> },
            { path: ':id/edit', element: <RolePermissionFormHandle /> },
            { path: ':id/view', element: <RolePermissionFormHandle /> },
          ],
        },
        {
          path: 'user',
          children: [
            { element: <Navigate to="/dashboard/user/list" replace />, index: true },
            { path: 'list', element: <UserListPage /> },
            { path: 'new', element: <UserFormHandle /> },
            { path: ':id/edit', element: <UserFormHandle /> },
            { path: ':id/view', element: <UserFormHandle /> },
            { path: ':id/transactions', element: <UserTransactionListPage /> },
            { path: ':id/bidhistory', element: <UserBidHistoryListPage /> },
            { path: ':id/withdrawalrequest', element: <WithdrawalResquestListPage /> },
          ],
        },

        { path: 'profit', element: <ProfitPage />, index: true },

        {
          path: 'maintransaction',
          children: [
            {
              element: <Navigate to="/dashboard/maintransaction/list" replace />,
              index: true,
            },
            { path: 'list', element: <MainTransactionListPage /> },
          ],
        },

        {
          path: 'mainbidhistory',
          children: [
            { element: <Navigate to="/dashboard/mainbidhistory/list" replace />, index: true },
            { path: 'list', element: <MainBidHistoryListPage /> },
          ],
        },

        // General Settings
        {
          path: 'settings',
          children: [
            {
              path: 'changepassword',
              children: [
                {
                  element: <Navigate to="/dashboard/settings/changepassword" replace />,
                  index: true,
                },
                { path: 'form', element: <ResetPasswordPage /> },
              ],
            },
            {
              path: 'sliderimage',
              children: [
                {
                  element: <Navigate to="/dashboard/settings/sliderimage/form" replace />,
                  index: true,
                },
                { path: 'form', element: <SliderImagePage /> },
              ],
            },
            {
              path: 'helpsupport',
              children: [
                { element: <Navigate to="/dashboard/settings/helpsupport/form" replace />, index: true },
                { path: 'form', element: <HelpAndSupportFormPage /> },
              ],
            },
            {
              path: 'marketrecords',
              children: [
                {
                  element: <Navigate to="/dashboard/markets/marketrecords" replace />,
                  index: true,
                },
                { path: 'list', element: <GeneralMarketRecordListPage /> },
                // { path: 'new', element: <MarketFormHandlePage /> },
                // { path: ':id/edit', element: <MarketFormHandlePage /> },
                // { path: ':id/view', element: <MarketFormHandlePage /> },
              ],
            },
            {
              path: 'marketdata',
              children: [
                {
                  element: <Navigate to="/dashboard/markets/marketdata/list" replace />,
                  index: true,
                },
                { path: 'list', element: <MarketDataListPage /> },
                // { path: ':id/view', element: <MarketFormHandlePage /> },
              ],
            },
            {
              path: 'notifications',
              children: [
                { element: <Navigate to="/dashboard/settings/notifications/list" replace />, index: true },
                { path: 'list', element: <NotificationListPage /> },
                { path: 'new', element: <NotificationFormHandlePage /> },
                { path: ':id/edit', element: <NotificationFormHandlePage /> },
                { path: ':id/view', element: <NotificationFormHandlePage /> },
              ],
            },
            {
              path: 'gateway',
              children: [
                { element: <Navigate to="/dashboard/settings/gateway" replace />, index: true },
                { path: 'form', element: <GatewaySettingFormPage /> },
              ],
            },
            {
              path: 'staticdata',
              children: [
                { element: <Navigate to="/dashboard/settings/staticdata/form" replace />, index: true },
                { path: 'form', element: <StaticDataFormPage /> },
              ],
            },
            {
              path: 'commonsetting',
              children: [
                { element: <Navigate to="/dashboard/settings/commonsetting/form" replace />, index: true },
                { path: 'form', element: <CommonSettingFormPage /> },
              ],
            },
          ],
        },

        // Gift
        {
          path: 'gift',
          children: [
            { element: <Navigate to="/dashboard/gift/list" replace />, index: true },
            { path: 'list', element: <GiftPage /> },
            { path: 'new', element: <GiftFormHandlePage /> },
            { path: ':id/edit', element: <GiftFormHandlePage /> },
            { path: ':id/view', element: <GiftFormHandlePage /> },
          ],
        },

        { path: 'gametypes', element: <GameTypeFormPage />, index: true },

        // Markets
        {
          path: 'markets',
          children: [
            {
              path: 'marketlist',
              children: [
                { element: <Navigate to="/dashboard/markets/marketlist" replace />, index: true },
                { path: 'list', element: <MarketsListPage /> },
                { path: 'new', element: <MarketFormHandlePage /> },
                { path: ':id/edit', element: <MarketFormHandlePage /> },
                { path: ':id/view', element: <MarketFormHandlePage /> },
              ],
            },
            {
              path: 'panacharts',
              children: [
                { element: <Navigate to="/dashboard/markets/panacharts" replace />, index: true },
                { path: 'list', element: <PanaChartsListPage /> },
              ],
            },
            {
              path: 'marketrecords',
              children: [
                {
                  element: <Navigate to="/dashboard/markets/marketrecords" replace />,
                  index: true,
                },
                { path: 'list', element: <GeneralMarketRecordListPage /> },
              ],
            },
            {
              path: 'marketresults',
              children: [
                {
                  element: <Navigate to="/dashboard/markets/marketresults/list" replace />,
                  index: true,
                },
                { path: 'list', element: <MarketResultListPage /> },
              ],
            },
            {
              path: 'predictionform',
              children: [
                {
                  element: <Navigate to="/dashboard/markets/predictionform" replace />,
                  index: true,
                },
                { path: 'form', element: <GeneralPredictionFormPage /> },
              ],
            },
            {
              path: 'winhistory',
              children: [
                {
                  element: <Navigate to="/dashboard/markets/winhistory" replace />,
                  index: true,
                },
                { path: 'list', element: <WinHistoryListPage /> },
              ],
            },
            {
              path: 'marketdata',
              children: [
                {
                  element: <Navigate to="/dashboard/markets/marketdata/list" replace />,
                  index: true,
                },
                { path: 'list', element: <MarketDataListPage /> },
                { path: ':id/bidrecord', element: <BidRecordListPage /> },
              ],
            },
          ],
        },

        // Markets
        {
          path: 'starline',
          children: [
            {
              path: 'market',
              children: [
                { element: <Navigate to="/dashboard/starline/market/list" replace />, index: true },
                { path: 'list', element: <StarLineMarketsListPage /> },
                { path: 'new', element: <StarlineMarketFormHandle /> },
                { path: ':id/edit', element: <StarlineMarketFormHandle /> },
                { path: ':id/view', element: <StarlineMarketFormHandle /> },
              ],
            },
            {
              path: 'marketrecords',
              children: [
                {
                  element: <Navigate to="/dashboard/starline/marketrecords" replace />,
                  index: true,
                },
                { path: 'list', element: <StarLineMarketsRecordListPage /> },
                // { path: 'new', element: <MarketFormHandlePage /> },
                // { path: ':id/edit', element: <MarketFormHandlePage /> },
                // { path: ':id/view', element: <MarketFormHandlePage /> },
              ],
            },
            {
              path: 'marketresults',
              children: [
                {
                  element: <Navigate to="/dashboard/starline/marketresults" replace />,
                  index: true,
                },
                { path: 'list', element: <StarLineMarketResultListPage /> },
                // { path: 'new', element: <MarketFormHandlePage /> },
                // { path: ':id/edit', element: <MarketFormHandlePage /> },
                // { path: ':id/view', element: <MarketFormHandlePage /> },
              ],
            },
            {
              path: 'winhistory',
              children: [
                {
                  element: <Navigate to="/dashboard/starline/winhistory" replace />,
                  index: true,
                },
                { path: 'list', element: <StarLineWinHistoryListPage /> },
              ],
            },
          ],
        },

        {
          path: 'generalwithdrawhistory',
          children: [
            {
              element: <Navigate to="/dashboard/generalwithdrawhistory/list" replace />,
              index: true,
            },
            { path: 'list', element: <GeneralWithdrawHistoryListPage /> },
          ],
        },
        {
          path: 'diposithistory',
          children: [
            { element: <Navigate to="/dashboard/diposithistory/list" replace />, index: true },
            { path: 'list', element: <DipositHistoryListPage /> },
          ],
        },
      ],
    },

    // Basic Routes
    {
      element: <CompactLayout />,
      children: [
        { path: '500', element: <Page500 /> },
        { path: '404', element: <Page404 /> },
        { path: '403', element: <Page403 /> },
      ],
    },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
