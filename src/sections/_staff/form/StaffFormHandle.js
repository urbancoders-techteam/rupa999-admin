import { Container } from '@mui/material';
import { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch } from 'react-redux';
import { useLocation, useParams } from 'react-router';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs/CustomBreadcrumbs';
import { useSettingsContext } from '../../../components/settings';
import { PATH_DASHBOARD } from '../../../routes/paths';
import StaffForm from './StaffForm';

export default function StaffFormHandle() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const { id } = useParams();
  const { pathname = '', state } = useLocation();

  // TODO: Uncomment and implement when API is ready
  // const { staffById, isLoading } = useSelector((sliceState) => sliceState.staff);

  const editView = useMemo(() => {
    if (id && /edit/i?.test(pathname)) {
      return {
        title: 'Staff: Edit | Rupa999',
        heading: 'Edit Staff',
        staff: state?.name ?? '',
        isEdit: true,
        isView: false,
      };
    }
    if (id && /view/i?.test(pathname)) {
      return {
        title: 'Staff: View | Rupa999',
        heading: 'View Staff',
        staff: state?.name ?? '',
        isEdit: false,
        isView: true,
      };
    }
    return {
      title: 'Staff: Create | Rupa999',
      heading: 'Create Staff',
      staff: 'New',
      isEdit: false,
      isView: false,
    };
  }, [pathname, id, state]);

  // TODO: Uncomment when API is ready
  // useEffect(() => {
  //   if (id) dispatch(getStaffByIdAsync(id));
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
            {
              name: 'Staff List',
              href: PATH_DASHBOARD.staff.list,
            },
            {
              name: editView?.heading,
              href: PATH_DASHBOARD.staff.list,
            },
          ]}
        />
        {/* TODO: Uncomment when API is ready */}
        {/* {isLoading ? (
          <LoadingScreen />
        ) : ( */}
        <StaffForm
          isEdit={editView?.isEdit}
          isView={editView?.isView}
          currentStaff={editView?.isView || editView?.isEdit ? state || {} : {}}
        />
        {/* )} */}
      </Container>
    </>
  );
}

