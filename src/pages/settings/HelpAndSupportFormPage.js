import { useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Card,
  Grid,
  Stack,
  Container,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormHelperText,
} from '@mui/material';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useSnackbar } from '../../components/snackbar';
import FormProvider, { RHFTextField } from '../../components/hook-form';
import { useSettingsContext } from '../../components/settings';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { PATH_DASHBOARD } from '../../routes/paths';

// ----------------------------------------------------------------------

HelpAndSupportFormPage.propTypes = {
  currentSettings: PropTypes.object,
};

export default function HelpAndSupportFormPage({ currentSettings }) {
  const { enqueueSnackbar } = useSnackbar();
  const { themeStretch } = useSettingsContext();

  // Validation Schema
  const HelpAndSupportSchema = Yup.object().shape({
    supportNumber: Yup.string(),
    telegramLink: Yup.string().url('Must be a valid URL'),
    whatsappEnable: Yup.string(),
    maintainanceModeEnable: Yup.string(),
    supportTime: Yup.string(),
    whatsappNumber: Yup.string(),
    telegramEnable: Yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
      supportNumber: currentSettings?.supportNumber || '+91 9827690565',
      telegramLink: currentSettings?.telegramLink || 'https://t.me/Ridhigame',
      whatsappEnable: currentSettings?.whatsappEnable || 'Enable',
      maintainanceModeEnable: currentSettings?.maintainanceModeEnable || 'Disable',
      supportTime: currentSettings?.supportTime || '10:00 AM - 10:00 PM',
      whatsappNumber: currentSettings?.whatsappNumber || '9827690565',
      telegramEnable: currentSettings?.telegramEnable || 'Enable',
    }),
    [currentSettings]
  );

  const methods = useForm({
    resolver: yupResolver(HelpAndSupportSchema),
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

  useEffect(() => {
    if (currentSettings) {
      reset(defaultValues);
    }
  }, [currentSettings, reset, defaultValues]);

  const onSubmit = async (data) => {
    try {
      console.log('Form Data:', data);
      // TODO: Replace with actual API call
      // await dispatch(updateHelpAndSupportSettingsAsync(data)).unwrap();

      enqueueSnackbar('Help and Support settings saved successfully!', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar(error?.message || 'Failed to save help and support settings', { variant: 'error' });
    }
  };

  return (
    <>
      <Helmet>
        <title> Help and Support | Rupa999 </title>
      </Helmet>

      <Container 
        maxWidth={themeStretch ? false : 'xl'}
        sx={{ 
          px: { xs: 1, sm: 2, md: 3 },
          pb: { xs: 2, sm: 3 },
        }}
      >
        <CustomBreadcrumbs
          heading="Help and Support"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Settings', href: PATH_DASHBOARD.settings.root },
            { name: 'Help and Support', href: PATH_DASHBOARD.helpsupport.form },
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
                {/* Left Column */}
                <Grid item xs={12} md={6}>
                  <Box
                    display="grid"
                    gridTemplateColumns="repeat(1, 1fr)"
                    gap={{ xs: 2, sm: 3 }}
                  >
                    <RHFTextField name="supportNumber" label="Support Number" />

                    <RHFTextField name="telegramLink" label="Telegram Link" placeholder="Enter Telegram URL" />

                    <FormControl component="fieldset" error={!!errors.whatsappEnable}>
                      <FormLabel component="legend">WhatsApp Enable</FormLabel>
                      <RadioGroup
                        row
                        name="whatsappEnable"
                        value={values.whatsappEnable || 'Enable'}
                        onChange={(e) => setValue('whatsappEnable', e.target.value)}
                        sx={{
                          flexDirection: { xs: 'column', sm: 'row' },
                          gap: { xs: 1, sm: 0 },
                        }}
                      >
                        <FormControlLabel
                          value="Enable"
                          control={<Radio />}
                          label="Enable"
                        />
                        <FormControlLabel
                          value="Disable"
                          control={<Radio />}
                          label="Disable"
                        />
                      </RadioGroup>
                      {errors.whatsappEnable && (
                        <FormHelperText>{errors.whatsappEnable.message}</FormHelperText>
                      )}
                    </FormControl>

                    <FormControl component="fieldset" error={!!errors.maintainanceModeEnable}>
                      <FormLabel component="legend">Maintainance Mode Enable?</FormLabel>
                      <RadioGroup
                        row
                        name="maintainanceModeEnable"
                        value={values.maintainanceModeEnable || 'Disable'}
                        onChange={(e) => setValue('maintainanceModeEnable', e.target.value)}
                        sx={{
                          flexDirection: { xs: 'column', sm: 'row' },
                          gap: { xs: 1, sm: 0 },
                        }}
                      >
                        <FormControlLabel
                          value="Enable"
                          control={<Radio />}
                          label="Enable"
                        />
                        <FormControlLabel
                          value="Disable"
                          control={<Radio />}
                          label="Disable"
                        />
                      </RadioGroup>
                      {errors.maintainanceModeEnable && (
                        <FormHelperText>{errors.maintainanceModeEnable.message}</FormHelperText>
                      )}
                    </FormControl>
                  </Box>
                </Grid>

                {/* Right Column */}
                <Grid item xs={12} md={6}>
                  <Box
                    display="grid"
                    gridTemplateColumns="repeat(1, 1fr)"
                    gap={{ xs: 2, sm: 3 }}
                  >
                    <RHFTextField name="supportTime" label="Support Time" placeholder="e.g., 10:00 AM - 10:00 PM" />

                    <RHFTextField name="whatsappNumber" label="WhatsApp Number" />

                    <FormControl component="fieldset" error={!!errors.telegramEnable}>
                      <FormLabel component="legend">Telegram Enable</FormLabel>
                      <RadioGroup
                        row
                        name="telegramEnable"
                        value={values.telegramEnable || 'Enable'}
                        onChange={(e) => setValue('telegramEnable', e.target.value)}
                        sx={{
                          flexDirection: { xs: 'column', sm: 'row' },
                          gap: { xs: 1, sm: 0 },
                        }}
                      >
                        <FormControlLabel
                          value="Enable"
                          control={<Radio />}
                          label="Enable"
                        />
                        <FormControlLabel
                          value="Disable"
                          control={<Radio />}
                          label="Disable"
                        />
                      </RadioGroup>
                      {errors.telegramEnable && (
                        <FormHelperText>{errors.telegramEnable.message}</FormHelperText>
                      )}
                    </FormControl>
                  </Box>
                </Grid>
              </Grid>

              {/* Save Button */}
              <Stack 
                alignItems={{ xs: 'stretch', sm: 'flex-end' }} 
                sx={{ mt: { xs: 2, sm: 3 } }}
              >
                <LoadingButton
                  type="submit"
                  variant="contained"
                  loading={isSubmitting}
                  fullWidth={{ xs: true, sm: false }}
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

