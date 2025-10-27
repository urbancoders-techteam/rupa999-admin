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
        { path: 'slider-image', element: <SliderImagePage />, index: true },
        {
          path: 'users',
          children: [
            {
              path: 'userlist',
              children: [
                { element: <Navigate to="/dashboard/users/userlist" replace />, index: true },
                { path: 'list', element: <UserListPage /> },
                // { path: 'new', element: <User /> },
                // { path: ':id/edit', element: <User /> },
                // { path: ':id/view', element: <User /> },
              ],
            },
            {
              path: 'withdrawdetails',
              children: [
                {
                  element: <Navigate to="/dashboard/users/withdrawdetails/list" replace />,
                  index: true,
                },
                { path: 'list', element: <WithdrawDetailsPage /> },
              ],
            },
          ],
        },
        { path: 'profit', element: <ProfitPage />, index: true },

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
