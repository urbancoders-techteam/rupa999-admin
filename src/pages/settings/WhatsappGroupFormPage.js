import { useCallback, useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Card,
  Container,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  Stack,
} from '@mui/material';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useSnackbar } from '../../components/snackbar';
import FormProvider, { RHFTextField } from '../../components/hook-form';
import { useSettingsContext } from '../../components/settings';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { PATH_DASHBOARD } from '../../routes/paths';
import {
  getWhatsappGroupAsync,
  updateWhatsappGroupAsync,
} from '../../redux/services/whatsapp_group_services';

// ----------------------------------------------------------------------

export default function WhatsappGroupFormPage() {
  const { enqueueSnackbar } = useSnackbar();
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const [currentSettings, setCurrentSettings] = useState(null);

  // An empty link is allowed, so it must not trip Yup's url() check.
  const WhatsappGroupSchema = Yup.object().shape({
    groupLink: Yup.string()
      .trim()
      .transform((value) => (value === '' ? undefined : value))
      .url('Must be a valid URL (e.g. https://chat.whatsapp.com/xxxxx)'),
    groupEnable: Yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
      groupLink: currentSettings?.groupLink || '',
      groupEnable: currentSettings?.groupEnable || 'Enable',
    }),
    [currentSettings]
  );

  const methods = useForm({
    resolver: yupResolver(WhatsappGroupSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = methods;

  const values = watch();

  const fetchWhatsappGroup = useCallback(async () => {
    try {
      const result = await dispatch(getWhatsappGroupAsync()).unwrap();
      if (result?.data) {
        setCurrentSettings(result.data);
      }
    } catch (error) {
      console.error('Error fetching WhatsApp group settings:', error);
      enqueueSnackbar(error?.message || 'Failed to load WhatsApp group settings', {
        variant: 'error',
      });
    }
  }, [dispatch, enqueueSnackbar]);

  useEffect(() => {
    fetchWhatsappGroup();
  }, [fetchWhatsappGroup]);

  useEffect(() => {
    if (currentSettings) {
      reset({
        groupLink: currentSettings?.groupLink || '',
        groupEnable: currentSettings?.groupEnable || 'Enable',
      });
    }
  }, [currentSettings, reset]);

  const onSubmit = async (data) => {
    try {
      const result = await dispatch(updateWhatsappGroupAsync(data)).unwrap();
      if (result?.data) {
        setCurrentSettings(result.data);
        enqueueSnackbar('WhatsApp group settings saved successfully!', { variant: 'success' });
      }
    } catch (error) {
      enqueueSnackbar(error?.message || 'Failed to save WhatsApp group settings', {
        variant: 'error',
      });
    }
  };

  return (
    <>
      <Helmet>
        <title> WhatsApp Group | Rupa999 </title>
      </Helmet>

      <Container
        maxWidth={themeStretch ? false : 'xl'}
        sx={{
          px: { xs: 1, sm: 2, md: 3 },
          pb: { xs: 2, sm: 3 },
        }}
      >
        <CustomBreadcrumbs
          heading="WhatsApp Group"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Settings', href: PATH_DASHBOARD.settings.root },
            { name: 'WhatsApp Group', href: PATH_DASHBOARD.whatsappgroup.form },
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
              <Grid container spacing={{ xs: 2, sm: 3 }}>
                <Grid item xs={12} md={6}>
                  <Box display="grid" gridTemplateColumns="repeat(1, 1fr)" gap={{ xs: 2, sm: 3 }}>
                    <RHFTextField
                      name="groupLink"
                      label="WhatsApp Group Link"
                      placeholder="https://chat.whatsapp.com/xxxxxxxxxxxxxxxxx"
                      helperText="Opened by the Whatsapp Group button in the app and website"
                    />

                    <FormControl component="fieldset" error={!!errors.groupEnable}>
                      <FormLabel component="legend">WhatsApp Group Enable</FormLabel>
                      <RadioGroup
                        row
                        name="groupEnable"
                        value={values.groupEnable || 'Enable'}
                        onChange={(e) => setValue('groupEnable', e.target.value)}
                        sx={{
                          flexDirection: { xs: 'column', sm: 'row' },
                          gap: { xs: 1, sm: 0 },
                        }}
                      >
                        <FormControlLabel value="Enable" control={<Radio />} label="Enable" />
                        <FormControlLabel value="Disable" control={<Radio />} label="Disable" />
                      </RadioGroup>
                      {errors.groupEnable && (
                        <FormHelperText>{errors.groupEnable.message}</FormHelperText>
                      )}
                    </FormControl>
                  </Box>
                </Grid>
              </Grid>

              <Stack
                alignItems={{ xs: 'stretch', sm: 'flex-end' }}
                sx={{ mt: { xs: 2, sm: 3 } }}
              >
                <LoadingButton
                  type="submit"
                  variant="contained"
                  loading={isSubmitting}
                  sx={{
                    bgcolor: 'primary.lighter',
                    color: 'primary.main',
                    '&:hover': {
                      bgcolor: 'primary.light',
                    },
                    minWidth: { xs: '100%', sm: 120 },
                  }}
                >
                  Save
                </LoadingButton>
              </Stack>
            </Card>
          </Grid>
        </FormProvider>
      </Container>
    </>
  );
}
