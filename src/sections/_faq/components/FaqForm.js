import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Card, Grid, Stack } from '@mui/material';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import FormProvider, { RHFTextField } from '../../../components/hook-form';

// ✅ Yup Validation Schema
const FaqSchema = Yup.object().shape({
  question: Yup.string()
    .required('Question is required')
    .min(3, 'Question must be at least 3 characters')
    .max(100, 'Question cannot exceed 100 characters'),
  answer: Yup.string()
    .required('Answer is required')
    .min(5, 'Answer must be at least 5 characters')
    .max(500, 'Answer cannot exceed 500 characters'),
});

FaqForm.propTypes = {
  isView: PropTypes.bool,
  initialData: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  isEdit: PropTypes.bool,
};

export default function FaqForm({ isView = false, initialData = {}, onSubmit, isEdit = false }) {
  const defaultValues = useMemo(
    () => ({
      question: initialData?.question || '',
      answer: initialData?.answer || '',
    }),
    [initialData]
  );

  const methods = useForm({
    resolver: yupResolver(FaqSchema),
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
              name="question"
              label="Question"
              placeholder="Enter question"
              disabled={isView}
              multiline={false}
            />
          </Grid>

          <Grid item xs={12}>
            <RHFTextField
              name="answer"
              label="Answer"
              placeholder="Enter answer"
              multiline
              minRows={4}
              disabled={isView}
            />
          </Grid>

          {!isView && (
            <Grid item xs={12}>
              <Stack direction="row" spacing={2}>
                <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                  {isEdit ? 'Update FAQ' : 'Create FAQ'}
                </LoadingButton>
              </Stack>
            </Grid>
          )}
        </Grid>
      </FormProvider>
    </Card>
  );
}