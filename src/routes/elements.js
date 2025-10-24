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
export const UserListPage = Loadable(lazy(() => import('../pages/user/UserListPage')));
export const WithdrawDetailsPage = Loadable(lazy(() => import('../pages/WithdrawDetailsPage')));

// DASHBOARD: Profit
export const ProfitPage = Loadable(lazy(() => import('../pages/ProfitPage')));

// BASIC PAGES
export const Page500 = Loadable(lazy(() => import('../pages/Page500')));
export const Page403 = Loadable(lazy(() => import('../pages/Page403')));
export const Page404 = Loadable(lazy(() => import('../pages/Page404')));



