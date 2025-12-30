import { Container } from '@mui/material';
import { useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../../components/settings';
import { useSnackbar } from '../../../components/snackbar';
import { PATH_DASHBOARD } from '../../../routes/paths';
import FaqForm from '../components/FaqForm';

export default function FaqFormHandle() {
  const { themeStretch } = useSettingsContext();
  const { id } = useParams();
  const { pathname = '', state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
//   const { currentFAQ } = useSelector((body) => body.faq);

  const viewMode = useMemo(() => {
    if (id && /view/i?.test(pathname)) {
      return {
        title: 'FAQ: View | Rupa999',
        heading: 'View FAQ',
        isView: true,
      };
    }
    return {
      title: 'FAQ: Create | Rupa999',
      heading: 'Create FAQ',
      isView: false,
    };
  }, [pathname, id]);

  // Fetch notification data if viewing
  useEffect(() => {
    if (viewMode.isView && id && !state) {
    //   dispatch(getFAQByIdAsync(id));
    }
  }, [id, viewMode.isView, dispatch, state]);

  // Use state data if available, otherwise use currentFAQ from Redux
//   const initialData = useMemo(() => {
//     if (state) return state;
//     if (currentFAQ) return currentFAQ;
//     return {};
//   }, [state, currentFAQ]);

  const handleSubmit = async (values) => {
    try {
    //   await dispatch(createFAQAsync(values)).unwrap();
      enqueueSnackbar('FAQ created successfully', { variant: 'success' });
      navigate(PATH_DASHBOARD.faq.list);
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || error?.message || 'Failed to create FAQ';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    }
  };

  return (
    <>
      <Helmet>
        <title>{viewMode.title}</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading={viewMode.heading}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'FAQ', href: PATH_DASHBOARD.faq.list },
            { name: viewMode.heading },
          ]}
        />

        <FaqForm isView={viewMode.isView} 
        // initialData={initialData}
         onSubmit={handleSubmit} />
      </Container>
    </>
  );
}
