import { Helmet } from 'react-helmet-async';
// @mui
import { Container, Stack, Typography } from '@mui/material';
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
  const themeStretch = useSettingsContext()
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

        <Stack sx={{ display: 'flex', mt: {xs:2, sm:0} }}>
          <PasswordIcon sx={{ height:{xs:60 ,sm: 96} }} />

          <Typography variant="h3" paragraph align="center">
            Forgot your password?
          </Typography>
        </Stack>

        <AuthResetPasswordForm />
      </Container>
    </>
  );
}
