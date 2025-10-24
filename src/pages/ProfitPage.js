import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Button, Card, Container } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { PATH_DASHBOARD } from '../routes/paths';
import { useSettingsContext } from '../components/settings';
import Iconify from '../components/iconify';
import CustomBreadcrumbs from '../components/custom-breadcrumbs';
import ProfitCheckingForms from '../sections/_profit/ProfitCheckingFilters';

const ProfitPage = () => {
  const { themeStretch } = useSettingsContext();
  return (
    <>
      <Helmet>
        <title> Admin : Profit | Rupa999 </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="User List"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Profit', href: PATH_DASHBOARD.root },
            { name: 'Filters' },
          ]}
        />

        <ProfitCheckingForms />
      </Container>
    </>
  );
};

export default ProfitPage;
