import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Container } from '@mui/material';
import { PATH_DASHBOARD } from '../routes/paths';
// components
import { useSettingsContext } from '../components/settings';
import CustomBreadcrumbs from '../components/custom-breadcrumbs';
// sections
import SliderImageUploadForm from '../sections/_sliderImage/SliderImageUploadForm';

const SliderImagePage = () => {
  const { themeStretch } = useSettingsContext();

  return (
    <div>
      <Helmet>
        <title> Slider Image Upload | Minimal UI</title>
      </Helmet>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Slider Image Upload"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            // {
            //   name: 'Invoices',
            //   href: PATH_DASHBOARD.general.sliderImage,
            // },
            {
              name: 'Slider Image Upload',
            },
          ]}
        />

        <SliderImageUploadForm />
      </Container>
    </div>
  );
};

export default SliderImagePage;
