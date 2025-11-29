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
  InputAdornment,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormHelperText,
} from '@mui/material';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import dayjs from 'dayjs';
import { useSnackbar } from '../../components/snackbar';
import FormProvider, {
  RHFTextField,
  RHFSelect,
  RHFUpload,
} from '../../components/hook-form';
import RHFTimePicker from '../../components/hook-form/RHFTimePicker';
import { useSettingsContext } from '../../components/settings';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { PATH_DASHBOARD } from '../../routes/paths';

// ----------------------------------------------------------------------

GatewaySettingFormPage.propTypes = {
  currentSettings: PropTypes.object,
};

export default function GatewaySettingFormPage({ currentSettings }) {
  const { enqueueSnackbar } = useSnackbar();
  const { themeStretch } = useSettingsContext();

  // Validation Schema
  const GatewaySettingSchema = Yup.object().shape({
    adminUpi: Yup.string(),
    withdrawalFee: Yup.number().min(0, 'Withdrawal fee must be positive'),
    minimumDeposit: Yup.number().min(0, 'Minimum deposit must be positive'),
    autoResultApi: Yup.string().url('Must be a valid URL'),
    withdrawCloseTime: Yup.string(),
    paymentMethod: Yup.string(),
    upiGatewayKey: Yup.string(),
    smsApiKey: Yup.string(),
    withdrawEnable: Yup.string(),
    payFromUpiApiKey: Yup.string(),
    minimumWithdraw: Yup.number().min(0, 'Minimum withdraw must be positive'),
    upiImage: Yup.mixed(),
    withdrawOpenTime: Yup.string(),
    payoutMethod: Yup.string(),
    fcmKey: Yup.string(),
    upiWithdrawEnable: Yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
      adminUpi: currentSettings?.adminUpi || 'upi@ybl',
      withdrawalFee: currentSettings?.withdrawalFee || '',
      minimumDeposit: currentSettings?.minimumDeposit || '300',
      autoResultApi: currentSettings?.autoResultApi || '',
      withdrawCloseTime: currentSettings?.withdrawCloseTime
        ? dayjs(currentSettings.withdrawCloseTime, 'HH:mm')
        : dayjs('19:00', 'HH:mm'),
      paymentMethod: currentSettings?.paymentMethod || 'PayFromUpi',
      upiGatewayKey: currentSettings?.upiGatewayKey || '',
      smsApiKey:
        currentSettings?.smsApiKey ||
        '4da3882d084156e9d96a5cd0efd244656d58d478a21e6ca999a008d56dda52ae',
      withdrawEnable: currentSettings?.withdrawEnable || 'Enable',
      payFromUpiApiKey:
        currentSettings?.payFromUpiApiKey ||
        '89|sKtZpn3sekOCLQgNFv5Kpj5rpTK1BsKID4VGkOQm639b9e76',
      minimumWithdraw: currentSettings?.minimumWithdraw || '500',
      upiImage: currentSettings?.upiImage || null,
      withdrawOpenTime: currentSettings?.withdrawOpenTime
        ? dayjs(currentSettings.withdrawOpenTime, 'HH:mm')
        : dayjs('10:00', 'HH:mm'),
      payoutMethod: currentSettings?.payoutMethod || 'Manual',
      fcmKey: currentSettings?.fcmKey || 'fcm_key',
      upiWithdrawEnable: currentSettings?.upiWithdrawEnable || 'Enable',
    }),
    [currentSettings]
  );

  const methods = useForm({
    resolver: yupResolver(GatewaySettingSchema),
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
        setValue('upiImage', fileWithPreview, { shouldValidate: true });
      }
    },
    [setValue]
  );

  const handleRemoveFile = () => {
    setValue('upiImage', null);
  };

  const onSubmit = async (data) => {
    try {
      // Format time values
      const formattedData = {
        ...data,
        withdrawCloseTime: dayjs(data.withdrawCloseTime).format('HH:mm'),
        withdrawOpenTime: dayjs(data.withdrawOpenTime).format('HH:mm'),
      };

      console.log('Form Data:', formattedData);
      // TODO: Replace with actual API call
      // await dispatch(updateGatewaySettingsAsync(formattedData)).unwrap();
      
      enqueueSnackbar('Gateway settings saved successfully!', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar(error?.message || 'Failed to save gateway settings', { variant: 'error' });
    }
  };

  return (
    <>
      <Helmet>
        <title> Gateway Setting | Rupa999 </title>
      </Helmet>

      <Container 
        maxWidth={themeStretch ? false : 'xl'}
        sx={{ 
          px: { xs: 1, sm: 2, md: 3 },
          pb: { xs: 2, sm: 3 },
        }}
      >
        <CustomBreadcrumbs
          heading="Gateway Setting"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Settings', href: PATH_DASHBOARD.settings.root },
            { name: 'Gateway Setting', href: PATH_DASHBOARD.gateway.form },
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
                    <RHFTextField name="adminUpi" label="Admin UPI" />

                    <RHFTextField
                      name="withdrawalFee"
                      label="Withdrawal Fee"
                      type="number"
                    />

                    <RHFTextField
                      name="minimumDeposit"
                      label="Minimum Deposit"
                      type="number"
                    />

                    <RHFTextField
                      name="autoResultApi"
                      label="Auto Result API"
                      placeholder="Enter API URL"
                    />

                    <RHFTimePicker
                      name="withdrawCloseTime"
                      label="Withdraw Close Time"
                    />

                    <RHFSelect name="paymentMethod" label="Payment Method">
                      <option value="PayFromUpi">PayFromUpi</option>
                      <option value="Other">Other</option>
                    </RHFSelect>

                    <RHFTextField
                      name="upiGatewayKey"
                      label="UPI Gateway KEY"
                    />

                    <RHFTextField name="smsApiKey" label="SMS API Key" />

                    <FormControl component="fieldset" error={!!errors.withdrawEnable}>
                      <FormLabel component="legend">Withdraw Enable</FormLabel>
                      <RadioGroup
                        row
                        name="withdrawEnable"
                        value={values.withdrawEnable || 'Enable'}
                        onChange={(e) => setValue('withdrawEnable', e.target.value)}
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
                      {errors.withdrawEnable && (
                        <FormHelperText>{errors.withdrawEnable.message}</FormHelperText>
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
                      name="payFromUpiApiKey"
                      label="PayFromUPI API Key"
                    />

                    <RHFTextField
                      name="minimumWithdraw"
                      label="Minimum Withdraw"
                      type="number"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <CurrencyRupeeIcon fontSize="small" />
                          </InputAdornment>
                        ),
                      }}
                    />

                    <Box>
                      <FormLabel sx={{ mb: { xs: 0.5, sm: 1 }, display: 'block', fontSize: { xs: '0.875rem', sm: '1rem' } }}>UPI Image</FormLabel>
                      <RHFUpload
                        name="upiImage"
                        onDrop={handleDrop}
                        onDelete={handleRemoveFile}
                        helperText="Choose File"
                      />
                    </Box>

                    <RHFTimePicker
                      name="withdrawOpenTime"
                      label="Withdraw Open Time"
                    />

                    <RHFSelect name="payoutMethod" label="PayOut Method">
                      <option value="Manual">Manual</option>
                      <option value="Automatic">Automatic</option>
                    </RHFSelect>

                    <RHFTextField name="fcmKey" label="Fcm Key" />

                    <FormControl component="fieldset" error={!!errors.upiWithdrawEnable}>
                      <FormLabel component="legend">UPI Withdraw Enable</FormLabel>
                      <RadioGroup
                        row
                        name="upiWithdrawEnable"
                        value={values.upiWithdrawEnable || 'Enable'}
                        onChange={(e) => setValue('upiWithdrawEnable', e.target.value)}
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
                      {errors.upiWithdrawEnable && (
                        <FormHelperText>{errors.upiWithdrawEnable.message}</FormHelperText>
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

