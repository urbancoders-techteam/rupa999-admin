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
export const ResetPasswordPage = Loadable(lazy(() => import('../pages/auth/ResetPasswordPage')));

// DASHBOARD: Main
export const GeneralDashboardPage = Loadable(lazy(() => import('../pages/GeneralDashboardPage')));
export const SliderImagePage = Loadable(lazy(() => import('../pages/SliderImagePage')));

// DASHBOARD: User 
export const UserListPage = Loadable(lazy(() => import('../pages/UserListPage')));
export const WithdrawDetailsPage = Loadable(lazy(() => import('../pages/WithdrawDetailsPage')));

// DASHBOARD: Profit
export const ProfitPage = Loadable(lazy(() => import('../pages/ProfitPage')));

// DASHBOARD: Gift
export const GiftPage = Loadable(lazy(() => import('../pages/GiftPage')));
export const GiftFormHandlePage = Loadable(lazy(() => import('../sections/_gift/pages/GiftFormHandlePage')));

// DASHBOARD: Markets
export const MarketsListPage = Loadable(lazy(() => import('../pages/markets/MarketsListPage')));


// BASIC PAGES
export const Page500 = Loadable(lazy(() => import('../pages/ErrorHandlingPages/Page500')));
export const Page403 = Loadable(lazy(() => import('../pages/ErrorHandlingPages/Page403')));
export const Page404 = Loadable(lazy(() => import('../pages/ErrorHandlingPages/Page404')));



