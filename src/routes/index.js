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
  // Auth
  LoginPage,
  // RegisterPage,
  // VerifyCodePage,
  // NewPasswordPage,
  // ResetPasswordPage,
  // Dashboard: General
  GeneralDashboardPage,

  // Error Handling Pages
  Page500,
  Page403,
  Page404,

  // Dashboard: Components
  SliderImagePage,
  UserListPage,
  ProfitPage,
  WithdrawDetailsPage,
  GiftPage,
  GiftFormHandlePage,
  MarketsListPage,
  MarketFormHandlePage,
  PanaChartsListPage,
  GeneralMarketRecordListPage,
  ResetPasswordPage,
  PreviousResultListPage,
  GeneralPredictionFormPage,
  WinHistoryListPage,
  GeneralWithdrawHistoryListPage,
  DipositHistoryListPage,
  UserFormHandle,
  UserBidHistoryListPage,
  UserTransactionListPage,
  WithdrawalResquestListPage,
  GameTypeFormPage,
  //
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
        // {
        //   path: 'register',
        //   element: (
        //     <GuestGuard>
        //       <RegisterPage />
        //     </GuestGuard>
        //   ),
        // },
        // { path: 'login-unprotected', element: <LoginPage /> },
        // { path: 'register-unprotected', element: <RegisterPage /> },
        // {
        //   element: <CompactLayout />,
        //   children: [
        //     { path: 'reset-password', element: <ResetPasswordPage /> },
        //     { path: 'new-password', element: <NewPasswordPage /> },
        //     { path: 'verify', element: <VerifyCodePage /> },
        //   ],
        // },
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
        {
          path: 'withdrawdetails',
          children: [
            {
              element: <Navigate to="/dashboard/withdrawdetails/list" replace />,
              index: true,
            },
            { path: 'list', element: <WithdrawDetailsPage /> },
          ],
        },

        { path: 'profit', element: <ProfitPage />, index: true },

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
                { element: <Navigate to="/dashboard/settings/helpsupport" replace />, index: true },
                // { path: 'list', element: <PanaChartsListPage /> },
                // { path: 'new', element: <MarketFormHandlePage /> },
                // { path: ':id/edit', element: <MarketFormHandlePage /> },
                // { path: ':id/view', element: <MarketFormHandlePage /> },
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
                // { path: 'new', element: <MarketFormHandlePage /> },
                // { path: ':id/edit', element: <MarketFormHandlePage /> },
                // { path: ':id/view', element: <MarketFormHandlePage /> },
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
              path: 'previousresults',
              children: [
                {
                  element: <Navigate to="/dashboard/markets/previousresults" replace />,
                  index: true,
                },
                { path: 'list', element: <PreviousResultListPage /> },
                // { path: 'new', element: <MarketFormHandlePage /> },
                // { path: ':id/edit', element: <MarketFormHandlePage /> },
                // { path: ':id/view', element: <MarketFormHandlePage /> },
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
