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
import MarketForm from './MarketForm';

export default function GiftFormHandlePage() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const { id } = useParams();
  const { pathname = '', state } = useLocation();

  // const { bannerById, isLoading } = useSelector((sliceState) => sliceState.banner);

  const editView = useMemo(() => {
    if (id && /edit/i?.test(pathname)) {
      return {
        title: 'Market: Edit | Rupa999',
        heading: 'Edit Market',
        user: state?.name ?? '',
        isEdit: true,
        isView: false,
      };
    }
    if (id && /view/i?.test(pathname)) {
      return {
        title: 'Market: View | Rupa999',
        heading: 'View Market',
        user: state?.name ?? '',
        isEdit: false,
        isView: true,
      };
    }
    return {
      title: 'Market: Create | Rupa999',
      heading: 'Create Market',
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
              name: 'Market List',
              href: PATH_DASHBOARD.marketlist.list,
            },
            {
              name: editView?.heading,
              href: PATH_DASHBOARD.marketlist.list,
            },
          ]}
        />
        {/* {isLoading ? (
        <LoadingScreen />
      ) : ( */}
        <MarketForm
          isEdit={editView?.isEdit}
          isView={editView?.isView}
          // currentBanner={editView?.isView || editView?.isEdit ? bannerById : {}}
        />
        {/* )} */}
      </Container>
    </>
  );
}
