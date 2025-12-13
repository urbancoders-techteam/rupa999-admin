import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Grid, TextField } from '@mui/material';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';

import { RHFTextField } from '../../components/hook-form';
import { useSnackbar } from '../../components/snackbar';
import { bulkUpdateGameTypeRatesAsync } from '../../redux/services/game_type_rate_services';

// ✅ Validation Schema
const GameTypeSchema = Yup.object().shape({
  multiplyBy: Yup.number()
    .typeError('Multiply By must be a number')
    .required('Multiply By is required')
    .positive('Value must be positive')
    .min(1, 'Value must be at least 1'),
});

export default function GameTypeRowForm({ game, onUpdate, formRef }) {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const methods = useForm({
    resolver: yupResolver(GameTypeSchema),
    defaultValues: { multiplyBy: game.multiplyBy || '' },
    mode: 'onChange',
  });

  const { handleSubmit, reset } = methods;

  useEffect(() => {
    reset({ multiplyBy: game.multiplyBy || '' });
  }, [game.multiplyBy, reset]);

  // Expose form methods to parent via ref
  useEffect(() => {
    if (formRef) {
      formRef(methods);
    }
  }, [formRef, methods]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = {
        name: game.name,
        gameType: game.gameType,
        type: game.type,
        multiplyBy: Number(data.multiplyBy),
      };

      // Use bulk update which handles both create and update
      await dispatch(bulkUpdateGameTypeRatesAsync({ rates: [payload] })).unwrap();

      enqueueSnackbar('Game type rate saved successfully!', { variant: 'success' });

      if (onUpdate) {
        onUpdate({ ...game, multiplyBy: payload.multiplyBy });
      }
    } catch (error) {
      console.error('Error saving game type rate:', error);
      enqueueSnackbar(
        error?.response?.data?.message || error?.message || 'Failed to save game type rate',
        { variant: 'error' }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid
          container
          spacing={{ xs: 1, sm: 2.5, md: 3 }}
          alignItems="center"
          sx={{ mb: { md: 3, xs: 2 } }}
        >
          <Grid item xs={3.5}>
            <TextField
              size="small"
              label="Name"
              value={game.name}
              fullWidth
              InputProps={{
                readOnly: true,
                sx: { '& .MuiInputBase-input': { fontSize: { xs: 12, sm: 13, md: 14 } } },
              }}
              InputLabelProps={{ sx: { fontSize: { xs: 12, sm: 13, md: 14 } } }}
            />
          </Grid>

          <Grid item xs={3}>
            <TextField
              size="small"
              label="Game Type"
              value={game.type}
              fullWidth
              InputProps={{
                readOnly: true,
                sx: { '& .MuiInputBase-input': { fontSize: { xs: 12, sm: 13, md: 14 } } },
              }}
              InputLabelProps={{ sx: { fontSize: { xs: 12, sm: 13, md: 14 } } }}
            />
          </Grid>

          <Grid item xs={3}>
            <RHFTextField
              name="multiplyBy"
              label="Multiply By"
              type="number"
              InputProps={{ sx: { '& .MuiInputBase-input': { fontSize: { xs: 12, sm: 13, md: 14 } } } }}
              InputLabelProps={{ sx: { fontSize: { xs: 12, sm: 13, md: 14 } } }}
            />
          </Grid>

          <Grid item xs={1}>
            <LoadingButton
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                height: { xs: '34px', md: '100%' },
                minHeight: { xs: '34px', md: 'auto' },
                fontSize: { xs: 12, sm: 13, md: 14 },
              }}
              loading={loading}
            >
              Save
            </LoadingButton>
          </Grid>
        </Grid>
      </form>
    </FormProvider>
  );
}

GameTypeRowForm.propTypes = {
  game: PropTypes.shape({
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    gameType: PropTypes.string.isRequired,
    multiplyBy: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  }).isRequired,
  onUpdate: PropTypes.func,
  formRef: PropTypes.func,
};
