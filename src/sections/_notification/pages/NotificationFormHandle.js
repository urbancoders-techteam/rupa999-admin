import { Container } from '@mui/material';
import { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, useParams, useNavigate } from 'react-router';
import { useSettingsContext } from '../../../components/settings';
import { PATH_DASHBOARD } from '../../../routes/paths';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import NotificationForm from '../components/NotificationForm';
import { addNotification, updateNotification } from '../../../utils/notificationService';

export default function NotificationFormHandle() {
  const { themeStretch } = useSettingsContext();
  const { id } = useParams();
  const { pathname = '', state } = useLocation();
  const navigate = useNavigate();

  const editView = useMemo(() => {
    if (id && /edit/i?.test(pathname)) {
      return {
        title: 'Notification: Edit | Rupa999',
        heading: 'Edit Notification',
        isEdit: true,
        isView: false,
      };
    }
    if (id && /view/i?.test(pathname)) {
      return {
        title: 'Notification: View | Rupa999',
        heading: 'View Notification',
        isEdit: false,
        isView: true,
      };
    }
    return {
      title: 'Notification: Create | Rupa999',
      heading: 'Create Notification',
      isEdit: false,
      isView: false,
    };
  }, [pathname, id]);

  const handleSubmit = (values) => {
    if (editView.isEdit && id) {
      updateNotification(id, values);
    } else {
      addNotification(values);
    }
    navigate(PATH_DASHBOARD.notifications.list);
  };

  return (
    <>
      <Helmet>
        <title>{editView.title}</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs heading={editView.heading} links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'Notifications', href: PATH_DASHBOARD.notifications.list }, { name: editView.heading }]} />

        <NotificationForm isEdit={editView.isEdit} isView={editView.isView} initialData={state ?? {}} onSubmit={handleSubmit} />
      </Container>
    </>
  );
}
