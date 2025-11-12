import { Helmet } from 'react-helmet-async';
// @mui
import { Container, Typography } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// sections
import AuthResetPasswordForm from '../../sections/auth/AuthResetPasswordForm';
// assets
import { useSettingsContext } from '../../components/settings';
import { PasswordIcon } from '../../assets/icons';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';

// ----------------------------------------------------------------------

export default function ResetPasswordPage() {
  const themeStretch = useSettingsContext();
  return (
    <>
      <Helmet>
        <title> Change Password | Rupa999 </title>
      </Helmet>
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="Change Password"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Change Password', href: PATH_DASHBOARD.changepassword.form },
            { name: 'Form' },
          ]}
        />

        {/* <Box sx={{ display: 'flex', alignItems : 'center', my:3, flexDirection: 'column', gap:1 }}> */}
        <PasswordIcon sx={{ height: { xs: 40, sm: 78 }, my: 1 }} />
        {/* </Box> */}
        <Typography variant="h4" gutterBottom>
          Forgot your password?
        </Typography>

        <AuthResetPasswordForm />
      </Container>
    </>
  );
}
