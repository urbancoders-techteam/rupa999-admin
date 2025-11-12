import React from 'react';
import PropTypes from 'prop-types';
import { Button, Grid, TextField } from '@mui/material';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { RHFTextField } from '../../components/hook-form';

// ✅ Validation Schema
const GameTypeSchema = Yup.object().shape({
  multiplyBy: Yup.number()
    .typeError('Multiply By must be a number')
    .required('Multiply By is required')
    .positive('Value must be positive')
    .integer('Value must be an integer'),
});

export default function GameTypeRowForm({ game }) {
  const methods = useForm({
    resolver: yupResolver(GameTypeSchema),
    defaultValues: { multiplyBy: '' },
    mode: 'onChange', // instant validation feedback
  });

  const { handleSubmit } = methods;

  const onSubmit = (data) => {
    console.log('✅ Saved Game Type:', {
      name: game.name,
      type: game.type,
      multiplyBy: data.multiplyBy,
    });
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3} alignItems="center" sx={{ mb: 3 }}>
          <Grid item xs={3.5}>
            <TextField
              size="small"
              label="Name"
              value={game.name}
              fullWidth
              InputProps={{ readOnly: true }}
            />
          </Grid>

          <Grid item xs={3.5}>
            <TextField
              size="small"
              label="Game Type"
              value={game.type}
              fullWidth
              InputProps={{ readOnly: true }}
            />
          </Grid>

          <Grid item xs={3.5}>
            <RHFTextField name="multiplyBy" label="Multiply By" type="number" />
          </Grid>

          <Grid item xs={1.5}>
            <Button type="submit" variant="contained" fullWidth sx={{ height: '100%' }}>
              Save
            </Button>
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
  }).isRequired,
};
