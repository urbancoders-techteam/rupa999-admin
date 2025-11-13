import { Container } from '@mui/material';
import { useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { useSettingsContext } from '../../../components/settings';
import { PATH_DASHBOARD } from '../../../routes/paths';
import { getMarketByIdAsync } from '../../../redux/services/market_services';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs/CustomBreadcrumbs';
import LoadingScreen from '../../../components/loading-screen/LoadingScreen';
import MarketForm from './MarketForm';

export default function MarketFormHandle() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const { id } = useParams();
  const { pathname = '', state } = useLocation();

  const { currentMarket, loading } = useSelector((sliceState) => sliceState.market);

  const editView = useMemo(() => {
    if (id && /edit/i?.test(pathname)) {
      return {
        title: 'Market: Edit | Rupa999',
        heading: 'Edit Market',
        user: state?.market?.name || currentMarket?.name || '',
        isEdit: true,
        isView: false,
      };
    }
    if (id && /view/i?.test(pathname)) {
      return {
        title: 'Market: View | Rupa999',
        heading: 'View Market',
        user: state?.market?.name || currentMarket?.name || '',
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
  }, [pathname, id, state, currentMarket]);

  useEffect(() => {
    if (id) {
      dispatch(getMarketByIdAsync(id));
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
              name: 'Market List',
              href: PATH_DASHBOARD.markets.marketlist.list,
            },
            {
              name: editView?.heading,
              href: PATH_DASHBOARD.markets.marketlist.list,
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
