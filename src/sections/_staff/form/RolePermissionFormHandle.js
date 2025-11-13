import { Container } from '@mui/material';
import { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, useParams } from 'react-router';
import { useDispatch } from 'react-redux';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs/CustomBreadcrumbs';
import { useSettingsContext } from '../../../components/settings';
import { PATH_DASHBOARD } from '../../../routes/paths';
import RolePermissionForm from './RolePermissionForm';

export default function RolePermissionFormHandle() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const { id } = useParams();
  const { pathname = '', state } = useLocation();

  // TODO: Uncomment and implement when API is ready
  // const { roleById, isLoading } = useSelector((sliceState) => sliceState.role);

  const editView = useMemo(() => {
    if (id && /edit/i?.test(pathname)) {
      return {
        title: 'Designation: Edit | Rupa999',
        heading: 'Edit Designation',
        role: state?.designationName ?? '',
        isEdit: true,
        isView: false,
      };
    }
    if (id && /view/i?.test(pathname)) {
      return {
        title: 'Designation: View | Rupa999',
        heading: 'View Designation',
        role: state?.designationName ?? '',
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
  }, [pathname, id, state]);

  // TODO: Uncomment when API is ready
  // useEffect(() => {
  //   if (id) dispatch(getRoleByIdAsync(id));
  // }, [id, dispatch]);

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
        {/* TODO: Uncomment when API is ready */}
        {/* {isLoading ? (
          <LoadingScreen />
        ) : ( */}
        <RolePermissionForm
          isEdit={editView?.isEdit}
          isView={editView?.isView}
          currentRole={editView?.isView || editView?.isEdit ? state || {} : {}}
        />
        {/* )} */}
      </Container>
    </>
  );
}

