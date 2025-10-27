import { Container } from '@mui/material';
import { useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { useSettingsContext } from '../../../components/settings';
import { PATH_DASHBOARD } from '../../../routes/paths';
// import { getBannerByIdAsync } from '../../../redux/services/banner';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs/CustomBreadcrumbs';
import LoadingScreen from '../../../components/loading-screen/LoadingScreen';
import GiftForm from '../components/GiftForm';
// import BannerForm from '../components/BannerForm';

export default function GiftFormHandlePage() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const { id } = useParams();
  const { pathname = '', state } = useLocation();

  // const { bannerById, isLoading } = useSelector((sliceState) => sliceState.banner);

  const editView = useMemo(() => {
    if (id && /edit/i?.test(pathname)) {
      return {
        title: 'Banner: Edit | Tied',
        heading: 'Edit Banner',
        user: state?.name ?? '',
        isEdit: true,
        isView: false,
      };
    }
    if (id && /view/i?.test(pathname)) {
      return {
        title: 'Banner: View | Tied',
        heading: 'View Banner',
        user: state?.name ?? '',
        isEdit: false,
        isView: true,
      };
    }
    return {
      title: 'Banner: Create | Tied',
      heading: 'Create Banner',
      user: 'New',
      isEdit: false,
      isView: false,
    };
  }, [pathname, id, state]);

  //   useEffect(() => {
  //     if (id) dispatch(getBannerByIdAsync(id));
  //   }, [id, dispatch]);

  return (
    <>
      <Helmet>
        <title>{editView?.title ?? ''}</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading={editView?.heading ?? ''}
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Banner',
              href: PATH_DASHBOARD.banner?.list,
            },
            {
              name: editView?.heading,
              href: PATH_DASHBOARD.banner?.list,
            },
          ]}
        />
        {/* {isLoading ? (
        <LoadingScreen />
      ) : ( */}
        <GiftForm
          isEdit={editView?.isEdit}
          isView={editView?.isView}
          // currentBanner={editView?.isView || editView?.isEdit ? bannerById : {}}
        />
        {/* )} */}
      </Container>
    </>
  );
}
