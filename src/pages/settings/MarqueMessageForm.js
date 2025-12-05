import { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Card,
  Grid,
  Stack,
  Container,
  Alert,
} from '@mui/material';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import FormProvider, { RHFTextField } from '../../components/hook-form';
import { useSettingsContext } from '../../components/settings';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { PATH_DASHBOARD } from '../../routes/paths';

// ----------------------------------------------------------------------

export default function MarqueMessageForm() {
  const { themeStretch } = useSettingsContext();

  // Validation Schema
  const MarqueMessageSchema = Yup.object().shape({
    message1: Yup.string().required('Message 1 is required'),
    message2: Yup.string().required('Message 2 is required'),
    message3: Yup.string().required('Message 3 is required'),
  });

  const defaultValues = useMemo(
    () => ({
      message1: '',
      message2: '',
      message3: '',
    }),
    []
  );

  const methods = useForm({
    resolver: yupResolver(MarqueMessageSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      console.log('Marque Message Data:', data);
      // TODO: Replace with actual API call
      // await dispatch(updateMarqueMessageAsync(data)).unwrap();

      toast.success('Marque messages saved successfully!');
    } catch (error) {
      toast.error(error?.message || 'Failed to save marque messages');
    }
  };

  return (
    <>
      <Helmet>
        <title> Mobile App Marque | Rupa999 </title>
      </Helmet>

      <Container
        maxWidth={themeStretch ? false : 'xl'}
        sx={{
          px: { xs: 1, sm: 2, md: 3 },
          pb: { xs: 2, sm: 3 },
        }}
      >
        <CustomBreadcrumbs
          heading="Mobile App Marque"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Settings', href: PATH_DASHBOARD.settings.root },
            { name: 'Mobile App Marque', href: PATH_DASHBOARD.marquemessage.form },
          ]}
          sx={{ mb: { xs: 1, sm: 2 } }}
        />

        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mt: { xs: 1, sm: 2 } }}>
            <Card
              sx={{
                p: { xs: 2, sm: 3 },
                width: '100%',
                boxShadow: 3,
                borderRadius: 2,
                overflow: 'hidden',
                maxWidth: '100%',
              }}
            >
              <Stack spacing={3}>
                {!!errors.afterSubmit && (
                  <Alert severity="error">{errors.afterSubmit.message}</Alert>
                )}

                <Grid container spacing={{ xs: 2, sm: 3 }}>
                  <Grid item xs={12}>
                    <RHFTextField
                      name="message1"
                      label="Message 1"
                      placeholder="Enter first marque message"
                     
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <RHFTextField
                      name="message2"
                      label="Message 2"
                      placeholder="Enter second marque message"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <RHFTextField
                      name="message3"
                      label="Message 3"
                      placeholder="Enter third marque message"
                    />
                  </Grid>
                </Grid>

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: 2,
                    pt: 2,
                  }}
                >
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    size="large"
                    loading={isSubmitting}
                    sx={{
                      minWidth: { xs: '100%', sm: 120 },
                      textTransform: 'none',
                      fontWeight: 600,
                    }}
                  >
                    Save Changes
                  </LoadingButton>
                </Box>
              </Stack>
            </Card>
          </Grid>
        </FormProvider>
      </Container>
    </>
  );
}

