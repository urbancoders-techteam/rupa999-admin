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
  Typography,
} from '@mui/material';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useSnackbar } from '../../components/snackbar';
import FormProvider, { RHFEditor } from '../../components/hook-form';
import { useSettingsContext } from '../../components/settings';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { PATH_DASHBOARD } from '../../routes/paths';

// ----------------------------------------------------------------------

StaticDataForm.propTypes = {
  currentData: PropTypes.object,
};

export default function StaticDataForm({ currentData }) {
  const { enqueueSnackbar } = useSnackbar();
  const { themeStretch } = useSettingsContext();

  // Validation Schema
  const StaticDataSchema = Yup.object().shape({
    rulesNotice: Yup.string(),
    withdrawalCondition: Yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
      rulesNotice: currentData?.rulesNotice || '',
      withdrawalCondition: currentData?.withdrawalCondition || '',
    }),
    [currentData]
  );

  const methods = useForm({
    resolver: yupResolver(StaticDataSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (currentData) {
      reset(defaultValues);
    }
  }, [currentData, reset, defaultValues]);

  const onSubmit = async (data) => {
    try {
      console.log('Form Data:', data);
      // TODO: Replace with actual API call
      // await dispatch(updateStaticDataAsync(data)).unwrap();
      
      enqueueSnackbar('Static data saved successfully!', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar(error?.message || 'Failed to save static data', { variant: 'error' });
    }
  };

  return (
    <>
      <Helmet>
        <title> Static Data | Rupa999 </title>
      </Helmet>

      <Container 
        maxWidth={themeStretch ? false : 'xl'}
        sx={{ 
          px: { xs: 1, sm: 2, md: 3 },
          pb: { xs: 2, sm: 3 },
        }}
      >
        <CustomBreadcrumbs
          heading="Static Data"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Settings', href: PATH_DASHBOARD.settings.root },
            { name: 'Static Data', href: PATH_DASHBOARD.staticdata.form },
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
                {/* Left Column: Rules Notice */}
                <Grid item xs={12} md={6}>
                  <Box>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        mb: { xs: 1.5, sm: 2 },
                        fontSize: { xs: '1rem', sm: '1.25rem' },
                      }}
                    >
                      Rules Notice
                    </Typography>
                    <RHFEditor
                      name="rulesNotice"
                      id="rules-notice-editor"
                      simple={false}
                    />
                  </Box>
                </Grid>

                {/* Right Column: Withdrawal Condition */}
                <Grid item xs={12} md={6}>
                  <Box>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        mb: { xs: 1.5, sm: 2 },
                        fontSize: { xs: '1rem', sm: '1.25rem' },
                      }}
                    >
                      Withdrawal Condition
                    </Typography>
                    <RHFEditor
                      name="withdrawalCondition"
                      id="withdrawal-condition-editor"
                      simple={false}
                    />
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

