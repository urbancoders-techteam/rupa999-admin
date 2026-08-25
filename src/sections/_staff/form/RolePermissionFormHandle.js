import { Container } from '@mui/material';
import { useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs/CustomBreadcrumbs';
import LoadingScreen from '../../../components/loading-screen';
import { useSettingsContext } from '../../../components/settings';
import { getRoleByIdAsync } from '../../../redux/services/role_services';
import { PATH_DASHBOARD } from '../../../routes/paths';
import RolePermissionForm from './RolePermissionForm';

export default function RolePermissionFormHandle() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const { id } = useParams();
  const { pathname = '', state } = useLocation();

  const { currentRole, loading: isLoading } = useSelector((sliceState) => sliceState.role);

  // Only trust currentRole once it matches the id in the URL - the store is
  // shared, so it can still hold a previously-viewed role while this one is
  // being fetched.
  const fetchedRole = currentRole?._id === id ? currentRole : null;
  const roleName = fetchedRole?.roleName ?? state?.designationName ?? '';

  const editView = useMemo(() => {
    if (id && /edit/i?.test(pathname)) {
      return {
        title: 'Designation: Edit | Rupa999',
        heading: 'Edit Designation',
        role: roleName,
        isEdit: true,
        isView: false,
      };
    }
    if (id && /view/i?.test(pathname)) {
      return {
        title: 'Designation: View | Rupa999',
        heading: 'View Designation',
        role: roleName,
        isEdit: false,
        isView: true,
      };
    }
    return {
      title: 'Designation: Create | Rupa999',
      heading: 'Create Designation',
      role: 'New',
      isEdit: false,
      isView: false,
    };
  }, [pathname, id, roleName]);

  // Fetch the role from the API so edit/view pages work on a direct visit or
  // refresh, not just when navigated to from the list row (which passed the
  // data via router state). Relying on router state alone meant a refresh
  // lost currentRole, and submitting would then create a duplicate role
  // instead of updating.
  useEffect(() => {
    if (id) dispatch(getRoleByIdAsync(id));
  }, [id, dispatch]);

  const showLoadingScreen =
    (editView.isEdit || editView.isView) && isLoading && !fetchedRole && !state;

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
            { name: 'Staff List', href: PATH_DASHBOARD.staff.list },
            {
              name: 'Designation',
              href: PATH_DASHBOARD.designation.list,
            },
            {
              name: editView?.role,
              href: PATH_DASHBOARD.designation.list,
            },
          ]}
        />
        {showLoadingScreen ? (
          <LoadingScreen />
        ) : (
          <RolePermissionForm
            isEdit={editView?.isEdit}
            isView={editView?.isView}
            currentRole={editView?.isView || editView?.isEdit ? fetchedRole || state || {} : {}}
          />
        )}
      </Container>
    </>
  );
}

