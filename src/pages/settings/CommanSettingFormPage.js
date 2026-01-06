import { useEffect, useMemo, useCallback } from 'react';
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
import FormProvider, {
  RHFTextField,
  RHFUpload,
} from '../../components/hook-form';
import { useSettingsContext } from '../../components/settings';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { PATH_DASHBOARD } from '../../routes/paths';

// ----------------------------------------------------------------------

CommonSettingFormPage.propTypes = {
  currentSettings: PropTypes.object,
};

export default function CommonSettingFormPage({ currentSettings }) {
  const { enqueueSnackbar } = useSnackbar();
  const { themeStretch } = useSettingsContext();

  // Validation Schema
  const CommonSettingSchema = Yup.object().shape({
    sliderImageApp: Yup.mixed(),
    version: Yup.string(),
    homeMessage: Yup.string(),
    minimumBidAmount: Yup.number().min(0, 'Minimum bid amount must be positive'),
    inviteSystemEnable: Yup.string(),
    enableDesawar: Yup.string(),
    playStoreEnable: Yup.string(),
    homepageSliderUrl: Yup.string().url('Must be a valid URL'),
    appUpdateLink: Yup.string().url('Must be a valid URL'),
    maxBidAmount: Yup.number().min(0, 'Max bid amount must be positive'),
    enableDesawarOnly: Yup.string(),
    showOnlyResults: Yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
      sliderImageApp: currentSettings?.sliderImageApp || null,
      version: currentSettings?.version || '1',
      homeMessage:
        currentSettings?.homeMessage ||
        "Welcome to Ridhi Game. India's Best Matka App for online Gaming.",
      minimumBidAmount: currentSettings?.minimumBidAmount || '5',
      inviteSystemEnable: currentSettings?.inviteSystemEnable || 'Disable',
      enableDesawar: currentSettings?.enableDesawar || 'Enable',
      playStoreEnable: currentSettings?.playStoreEnable || 'Disable',
      homepageSliderUrl: currentSettings?.homepageSliderUrl || '',
      appUpdateLink:
        currentSettings?.appUpdateLink || 'https://ridhigame.com/download',
      maxBidAmount: currentSettings?.maxBidAmount || '5000',
      enableDesawarOnly: currentSettings?.enableDesawarOnly || 'Disable',
      showOnlyResults: currentSettings?.showOnlyResults || 'Disable',
    }),
    [currentSettings]
  );

  const methods = useForm({
    resolver: yupResolver(CommonSettingSchema),
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

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        const fileWithPreview = Object.assign(file, {
          preview: URL.createObjectURL(file),
        });
        setValue('sliderImageApp', fileWithPreview, { shouldValidate: true });
      }
    },
    [setValue]
  );

  const handleRemoveFile = () => {
    setValue('sliderImageApp', null);
  };

  const onSubmit = async (data) => {
    try {
      // TODO: Replace with actual API call
      // await dispatch(updateCommonSettingsAsync(data)).unwrap();

      enqueueSnackbar('Common settings saved successfully!', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar(error?.message || 'Failed to save common settings', { variant: 'error' });
    }
  };

  return (
    <>
      <Helmet>
        <title> Common Setting | Rupa999 </title>
      </Helmet>

      <Container 
        maxWidth={themeStretch ? false : 'xl'}
        sx={{ 
          px: { xs: 1, sm: 2, md: 3 },
          pb: { xs: 2, sm: 3 },
        }}
      >
        <CustomBreadcrumbs
          heading="Common Setting"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Settings', href: PATH_DASHBOARD.settings.root },
            { name: 'Common Setting', href: PATH_DASHBOARD.commonsetting.form },
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
                    <Box>
                      <FormLabel sx={{ mb: { xs: 0.5, sm: 1 }, display: 'block', fontSize: { xs: '0.875rem', sm: '1rem' } }}>Slider Image App</FormLabel>
                      <RHFUpload
                        name="sliderImageApp"
                        onDrop={handleDrop}
                        onDelete={handleRemoveFile}
                        helperText="Choose File"
                      />
                    </Box>

                    <RHFTextField name="version" label="Version" type="number" />

                    <RHFTextField
                      name="homeMessage"
                      label="Home Message"
                      multiline
                      rows={4}
                    />

                    <RHFTextField
                      name="minimumBidAmount"
                      label="Minimum Bid Amount"
                      type="number"
                    />

                    <FormControl component="fieldset" error={!!errors.inviteSystemEnable}>
                      <FormLabel component="legend">Invite System Enable</FormLabel>
                      <RadioGroup
                        row
                        name="inviteSystemEnable"
                        value={values.inviteSystemEnable || 'Disable'}
                        onChange={(e) => setValue('inviteSystemEnable', e.target.value)}
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
                      {errors.inviteSystemEnable && (
                        <FormHelperText>{errors.inviteSystemEnable.message}</FormHelperText>
                      )}
                    </FormControl>

                    <FormControl component="fieldset" error={!!errors.enableDesawar}>
                      <FormLabel component="legend">Enable Desawar</FormLabel>
                      <RadioGroup
                        row
                        name="enableDesawar"
                        value={values.enableDesawar || 'Enable'}
                        onChange={(e) => setValue('enableDesawar', e.target.value)}
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
                      {errors.enableDesawar && (
                        <FormHelperText>{errors.enableDesawar.message}</FormHelperText>
                      )}
                    </FormControl>

                    <FormControl component="fieldset" error={!!errors.playStoreEnable}>
                      <FormLabel component="legend">Play Store Enable?</FormLabel>
                      <RadioGroup
                        row
                        name="playStoreEnable"
                        value={values.playStoreEnable || 'Disable'}
                        onChange={(e) => setValue('playStoreEnable', e.target.value)}
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
                      {errors.playStoreEnable && (
                        <FormHelperText>{errors.playStoreEnable.message}</FormHelperText>
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
                    <RHFTextField
                      name="homepageSliderUrl"
                      label="HomePage Slider URL"
                      placeholder="Enter URL"
                    />

                    <RHFTextField
                      name="appUpdateLink"
                      label="App Update Link"
                      placeholder="Enter URL"
                    />

                    <RHFTextField
                      name="maxBidAmount"
                      label="Max Bid Amount"
                      type="number"
                    />

                    <FormControl component="fieldset" error={!!errors.enableDesawarOnly}>
                      <FormLabel component="legend">Enable Desawar Only</FormLabel>
                      <RadioGroup
                        row
                        name="enableDesawarOnly"
                        value={values.enableDesawarOnly || 'Disable'}
                        onChange={(e) => setValue('enableDesawarOnly', e.target.value)}
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
                      {errors.enableDesawarOnly && (
                        <FormHelperText>{errors.enableDesawarOnly.message}</FormHelperText>
                      )}
                    </FormControl>

                    <FormControl component="fieldset" error={!!errors.showOnlyResults}>
                      <FormLabel component="legend">Show Only Results?</FormLabel>
                      <RadioGroup
                        row
                        name="showOnlyResults"
                        value={values.showOnlyResults || 'Disable'}
                        onChange={(e) => setValue('showOnlyResults', e.target.value)}
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
                      {errors.showOnlyResults && (
                        <FormHelperText>{errors.showOnlyResults.message}</FormHelperText>
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

