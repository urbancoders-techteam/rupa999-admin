import { Container } from '@mui/material';
import { useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../../components/settings';
import { useSnackbar } from '../../../components/snackbar';
import { createFaqAsync, getFaqByIdAsync, updateFaqAsync } from '../../../redux/services/faq_services';
import { PATH_DASHBOARD } from '../../../routes/paths';
import FaqForm from '../components/FaqForm';

export default function FaqFormHandle() {
  const { themeStretch } = useSettingsContext();
  const { id } = useParams();
  const { pathname = '' } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { currentFaq } = useSelector((rootState) => rootState.faq);

  const mode = useMemo(() => {
    if (id && /view/i?.test(pathname)) {
      return {
        title: 'FAQ: View | Rupa999',
        heading: 'View FAQ',
        isView: true,
        isEdit: false,
      };
    }
    if (id && /edit/i?.test(pathname)) {
      return {
        title: 'FAQ: Edit | Rupa999',
        heading: 'Edit FAQ',
        isView: false,
        isEdit: true,
      };
    }
    return {
      title: 'FAQ: Create | Rupa999',
      heading: 'Create FAQ',
      isView: false,
      isEdit: false,
    };
  }, [pathname, id]);

  // Fetch FAQ data if viewing or editing
  useEffect(() => {
    if ((mode.isView || id) && !currentFaq) {
      dispatch(getFaqByIdAsync(id));
    }
  }, [id, dispatch, mode.isView, currentFaq]);

  // Use currentFaq from Redux
  const initialData = useMemo(() => {
    if (currentFaq) return currentFaq;
    return {};
  }, [currentFaq]);

  const handleSubmit = async (values) => {
    try {
      if (id && !mode.isView) {
        // Update existing FAQ
        await dispatch(updateFaqAsync({ id, data: values })).unwrap();
        enqueueSnackbar('FAQ updated successfully', { variant: 'success' });
      } else {
        // Create new FAQ
        await dispatch(createFaqAsync(values)).unwrap();
        enqueueSnackbar('FAQ created successfully', { variant: 'success' });
      }
      navigate(PATH_DASHBOARD.faq.list);
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || error?.message || 'Failed to save FAQ';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    }
  };

  const handleCancel = () => {
    navigate(PATH_DASHBOARD.faq.list);
  };

  return (
    <>
      <Helmet>
        <title>{mode.title}</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading={mode.heading}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'FAQ', href: PATH_DASHBOARD.faq.list },
            { name: mode.heading },
          ]}
        />

        <FaqForm
          isView={mode.isView}
          initialData={initialData}
          onSubmit={handleSubmit}
          isEdit={!!id && !mode.isView}
          onCancel={handleCancel}
        />
      </Container >
    </>
  );
}
