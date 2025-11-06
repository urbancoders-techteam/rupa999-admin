import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  InputAdornment,
  useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { RHFTextField } from '../../../components/hook-form';

// ----------------------------------------------------------------------

AddDeductBalanceModal.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  currentBalance: PropTypes.number,
  onSubmit: PropTypes.func,
};

export default function AddDeductBalanceModal({
  open,
  handleClose,
  currentBalance = 0,
  onSubmit,
}) {
  const theme = useTheme();
  const [action, setAction] = useState('add');

  // ✅ Yup validation schema
  const validationSchema = Yup.object().shape({
    amount: Yup.number()
      .typeError('Amount must be a number')
      .positive('Amount must be greater than 0')
      .required('Amount is required'),
  });

  // ✅ React Hook Form setup
  const methods = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      amount: '',
    },
  });

  const {
    handleSubmit,
    reset,
  } = methods;

  const handleActionChange = (_, newAction) => {
    if (newAction !== null) setAction(newAction);
  };

  const onFormSubmit = (data) => {
    const payload = { ...data, action };
    onSubmit?.(payload);
    reset();
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
        },
      }}
    >
      {/* HEADER */}
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 1,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Add | Deduct Balance
        </Typography>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* CONTENT */}
      <DialogContent sx={{ pt: 0 }}>
        <Typography
          variant="h5"
          sx={{
            color: theme.palette.success.main,
            fontWeight: 700,
            mb: 3,
          }}
        >
          Balance {Number(currentBalance).toFixed(2)}
        </Typography>

        <FormProvider {...methods}>
          <Box component="form" noValidate onSubmit={handleSubmit(onFormSubmit)}>
            {/* CURRENCY FIELD */}
            <Typography
              variant="subtitle2"
              sx={{ color: theme.palette.text.secondary, mb: 1 }}
            >
              Currency
            </Typography>

            <RHFTextField
              name="amount"
              placeholder="Enter amount"
              type="number"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AttachMoneyIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5,
                  backgroundColor: theme.palette.background.paper,
                },
              }}
            />

            {/* ACTION TOGGLE */}
            <Typography
              variant="subtitle2"
              sx={{ color: theme.palette.text.secondary, mb: 1 }}
            >
              Choose Action
            </Typography>

            <ToggleButtonGroup
              color="primary"
              value={action}
              exclusive
              onChange={handleActionChange}
              fullWidth
              sx={{
                mb: 3,
                borderRadius: 1.5,
                overflow: 'hidden',
                '& .MuiToggleButton-root': {
                  textTransform: 'none',
                  fontWeight: 500,
                  flex: 1,
                  border: '1px solid',
                  borderColor: theme.palette.divider,
                  borderRadius: 0,
                  '&.Mui-selected': {
                    backgroundColor: theme.palette.primary.main,
                    color: '#fff',
                    borderColor: theme.palette.primary.main,
                    '&:hover': {
                      backgroundColor: theme.palette.primary.dark,
                    },
                  },
                },
              }}
            >
              <ToggleButton value="add">Add</ToggleButton>
              <ToggleButton value="deduct">Deduct</ToggleButton>
            </ToggleButtonGroup>

            {/* SUBMIT BUTTON */}
            <Button
              type="submit"
              variant="outlined"
              size="medium"
              sx={{
                textTransform: 'none',
                borderRadius: 1.5,
                px: 3,
              }}
            >
              Submit
            </Button>
          </Box>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
