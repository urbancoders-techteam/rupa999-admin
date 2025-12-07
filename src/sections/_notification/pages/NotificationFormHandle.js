import { Container } from '@mui/material';
import { useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../../components/settings';
import { useSnackbar } from '../../../components/snackbar';
import { createNotificationAsync, getNotificationByIdAsync } from '../../../redux/services/notification_services';
import { PATH_DASHBOARD } from '../../../routes/paths';
import NotificationForm from '../components/NotificationForm';

export default function NotificationFormHandle() {
  const { themeStretch } = useSettingsContext();
  const { id } = useParams();
  const { pathname = '', state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { currentNotification } = useSelector((body) => body.notification);

  const viewMode = useMemo(() => {
    if (id && /view/i?.test(pathname)) {
      return {
        title: 'Notification: View | Rupa999',
        heading: 'View Notification',
        isView: true,
      };
    }
    return {
      title: 'Notification: Create | Rupa999',
      heading: 'Create Notification',
      isView: false,
    };
  }, [pathname, id]);

  // Fetch notification data if viewing
  useEffect(() => {
    if (viewMode.isView && id && !state) {
      dispatch(getNotificationByIdAsync(id));
    }
  }, [id, viewMode.isView, dispatch, state]);

  // Use state data if available, otherwise use currentNotification from Redux
  const initialData = useMemo(() => {
    if (state) return state;
    if (currentNotification) return currentNotification;
    return {};
  }, [state, currentNotification]);

  const handleSubmit = async (values) => {
    try {
      await dispatch(createNotificationAsync(values)).unwrap();
      enqueueSnackbar('Notification created successfully', { variant: 'success' });
      navigate(PATH_DASHBOARD.notifications.list);
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to create notification';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    }
  };

  return (
    <>
      <Helmet>
        <title>{viewMode.title}</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs heading={viewMode.heading} links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'Notifications', href: PATH_DASHBOARD.notifications.list }, { name: viewMode.heading }]} />

        <NotificationForm
          isView={viewMode.isView}
          initialData={initialData}
          onSubmit={handleSubmit}
        />
      </Container>
    </>
  );
}
