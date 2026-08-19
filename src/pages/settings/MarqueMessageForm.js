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
  Typography,
} from '@mui/material';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import FormProvider, { RHFTextField } from '../../components/hook-form';
import { useSettingsContext } from '../../components/settings';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { PATH_DASHBOARD } from '../../routes/paths';

// ----------------------------------------------------------------------

const HEX_COLOR_REGEX = /^#[0-9A-F]{6}$/i;

const MarqueMessageSchema = Yup.object().shape({
  message: Yup.string().trim().required('Message is required'),
  fontColor: Yup.string()
    .required('Font color is required')
    .matches(HEX_COLOR_REGEX, 'Enter a valid HEX color, for example #FF6600'),
});

const defaultValues = {
  message: '',
  fontColor: '#000000',
};

// ----------------------------------------------------------------------

export default function MarqueMessageForm() {
  const { themeStretch } = useSettingsContext();

  const methods = useForm({
    resolver: yupResolver(MarqueMessageSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = methods;

  const message = watch('message');
  const fontColor = watch('fontColor');
  const previewColor = HEX_COLOR_REGEX.test(fontColor || '') ? fontColor : '#000000';

  const onSubmit = async (data) => {
    try {
      // TODO: Replace with actual API call
      // await dispatch(updateMarqueMessageAsync(data)).unwrap();

      toast.success('Marquee message saved successfully!');
    } catch (error) {
      toast.error(error?.message || 'Failed to save marquee message');
    }
  };

  return (
    <>
      <Helmet>
        <title> Mobile Reel | Rupa999 </title>
      </Helmet>

      <Container
        maxWidth={themeStretch ? false : 'xl'}
        sx={{
          px: { xs: 1, sm: 2, md: 3 },
          pb: { xs: 2, sm: 3 },
        }}
      >
        <CustomBreadcrumbs
          heading="Mobile Reel"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Settings', href: PATH_DASHBOARD.settings.root },
            { name: 'Mobile Reel', href: PATH_DASHBOARD.marquemessage.form },
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
                      name="message"
                      label="Message"
                      placeholder="Enter marquee message"
                      multiline
                      minRows={3}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      Font Color
                    </Typography>
                    <Stack
                      direction={{ xs: 'column', sm: 'row' }}
                      spacing={1.5}
                      alignItems={{ xs: 'stretch', sm: 'center' }}
                    >
                      <Box
                        component="input"
                        type="color"
                        aria-label="Choose font color"
                        value={previewColor}
                        onChange={(event) =>
                          setValue('fontColor', event.target.value.toUpperCase(), {
                            shouldDirty: true,
                            shouldValidate: true,
                          })
                        }
                        sx={{
                          width: { xs: '100%', sm: 72 },
                          height: 56,
                          p: 0.5,
                          border: '1px solid',
                          borderColor: 'divider',
                          borderRadius: 1,
                          bgcolor: 'background.paper',
                          cursor: 'pointer',
                        }}
                      />
                      <RHFTextField
                        name="fontColor"
                        label="Font Color Code"
                        placeholder="#000000"
                        helperText="Use a 6-digit HEX code, for example #FF6600"
                        sx={{ flex: 1 }}
                      />
                    </Stack>
                  </Grid>

                  <Grid item xs={12}>
                    <Box
                      sx={{
                        p: { xs: 2, sm: 2.5 },
                        border: '1px dashed',
                        borderColor: 'divider',
                        borderRadius: 1.5,
                        bgcolor: 'action.hover',
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        Preview
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          mt: 0.75,
                          color: previewColor,
                          fontWeight: 600,
                          wordBreak: 'break-word',
                        }}
                      >
                        {message?.trim() || 'Your marquee message will appear here'}
                      </Typography>
                    </Box>
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

