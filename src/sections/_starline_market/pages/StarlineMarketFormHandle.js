import { Container } from '@mui/material';
import { useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { useSettingsContext } from '../../../components/settings';
import { PATH_DASHBOARD } from '../../../routes/paths';
import { getStarlineMarketByIdAsync } from '../../../redux/services/starline_market_services';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs/CustomBreadcrumbs';
import LoadingScreen from '../../../components/loading-screen/LoadingScreen';
import MarketForm from './StarlineMarketForm';

export default function StarlineMarketFormHandle() {
  const dispatch = useDispatch();
  const { themeStretch } = useSettingsContext();
  const { id } = useParams();
  const { pathname = '', state } = useLocation();

  const { currentMarket, loading } = useSelector((sliceState) => sliceState.starlineMarket);

  const editView = useMemo(() => {
    if (id && /edit/i?.test(pathname)) {
      return {
        title: 'Starline Market: Edit | Rupa999',
        heading: 'Edit Market',
        user: state?.name || currentMarket?.name || '',
        isEdit: true,
        isView: false,
      };
    }
    if (id && /view/i?.test(pathname)) {
      return {
        title: 'Starline Market: View | Rupa999',
        heading: 'View Market',
        user: state?.name || currentMarket?.name || '',
        isEdit: false,
        isView: true,
      };
    }
    return {
      title: 'Starline Market: Create | Rupa999',
      heading: 'Create Market',
      user: 'New',
      isEdit: false,
      isView: false,
    };
  }, [pathname, id, state, currentMarket]);

  useEffect(() => {
    if (id) {
      dispatch(getStarlineMarketByIdAsync(id));
    }
  }, [id, dispatch]);

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
              name: 'Starline Market List',
              href: PATH_DASHBOARD.starline.market.list,
            },
            {
              name: editView?.heading,
              href: PATH_DASHBOARD.starline.market.list,
            },
          ]}
        />
        {loading ? (
          <LoadingScreen />
        ) : (
          <MarketForm
            isEdit={editView?.isEdit}
            isView={editView?.isView}
            currentUser={editView?.isView || editView?.isEdit ? (currentMarket || state?.market) : null}
          />
        )}
      </Container>
    </>
  );
}
