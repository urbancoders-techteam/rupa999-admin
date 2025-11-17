import { Container } from '@mui/material';
import { useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import LoadingScreen from '../../../components/loading-screen/LoadingScreen';
import { getStaffByIdAsync } from '../../../redux/services/staff_services';
import { clearstaffById } from '../../../redux/slices/staff_slices';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs/CustomBreadcrumbs';
import { useSettingsContext } from '../../../components/settings';
import { PATH_DASHBOARD } from '../../../routes/paths';
import StaffForm from './StaffForm';

export default function StaffFormHandle() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { pathname = '', state } = useLocation();

  const { staffById, loading: isLoading, error } = useSelector((sliceState) => sliceState.staff);

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

  // Fetch staff by ID when editing/viewing
  useEffect(() => {
    if (id) {
      dispatch(getStaffByIdAsync(id));
    } else {
      // Clear staff data when creating new staff
      dispatch(clearstaffById());
    }

    // Cleanup: Clear staff data when component unmounts or when navigating away
    return () => {
      if (!id) {
        dispatch(clearstaffById());
      }
    };
  }, [id, dispatch]);

  // Handle error - redirect if staff not found
  useEffect(() => {
    if (error && id && !isLoading) {
      console.error('Error fetching staff:', error);
      // You can add error handling here, e.g., redirect or show error message
    }
  }, [error, id, isLoading]);

  // Render content based on state
  const renderContent = () => {
    if (isLoading && id) {
      return <LoadingScreen />;
    }

    if (error && id) {
      return (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p style={{ color: 'error.main', marginBottom: '1rem' }}>
            {error || 'Failed to load staff data'}
          </p>
          <button type="button" onClick={() => navigate(PATH_DASHBOARD.staff.list)}>
            Back to Staff List
          </button>
        </div>
      );
    }

    return (
      <StaffForm
        isEdit={editView?.isEdit}
        isView={editView?.isView}
        currentStaff={
          editView?.isView || editView?.isEdit
            ? staffById || state || {}
            : {}
        }
      />
    );
  };

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
        {renderContent()} 
      </Container>
    </>
  );
}

