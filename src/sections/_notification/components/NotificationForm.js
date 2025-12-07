import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Card, Grid, Stack } from '@mui/material';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import FormProvider, { RHFTextField } from '../../../components/hook-form';

// ✅ Yup Validation Schema
const NotificationSchema = Yup.object().shape({
  title: Yup.string()
    .required('Title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title cannot exceed 100 characters'),
  description: Yup.string()
    .required('Description is required')
    .min(5, 'Description must be at least 5 characters')
    .max(500, 'Description cannot exceed 500 characters'),
});

NotificationForm.propTypes = {
  isView: PropTypes.bool,
  initialData: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
};

export default function NotificationForm({ isView = false, initialData = {}, onSubmit }) {
  const defaultValues = useMemo(
    () => ({
      title: initialData?.title || '',
      description: initialData?.description || '',
    }),
    [initialData]
  );

  const methods = useForm({
    resolver: yupResolver(NotificationSchema),
    defaultValues,
    mode: 'onBlur',
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (isView && initialData) {
      reset(defaultValues);
    }
  }, [isView, initialData, reset, defaultValues]);

  const handleFormSubmit = async (data) => {
    try {
      if (onSubmit) {
        await onSubmit(data);
      }
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <Card sx={{ p: 3 }}>
      <FormProvider methods={methods} onSubmit={handleSubmit(handleFormSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <RHFTextField
              name="title"
              label="Title"
              placeholder="Enter notification title"
              disabled={isView}
              multiline={false}
            />
          </Grid>

          <Grid item xs={12}>
            <RHFTextField
              name="description"
              label="Description"
              placeholder="Enter notification description"
              multiline
              minRows={4}
              disabled={isView}
            />
          </Grid>

          {!isView && (
            <Grid item xs={12}>
              <Stack direction="row" spacing={2}>
                <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                  Create Notification
                </LoadingButton>
              </Stack>
            </Grid>
          )}
        </Grid>
      </FormProvider>
    </Card>
  );
}