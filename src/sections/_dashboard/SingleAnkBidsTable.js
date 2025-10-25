import React from 'react';
import {
  Grid,
  Card,
  Typography,
  Button,
  Autocomplete,
  TextField,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import AnkBidSummaryCard from './AnkBidSummaryCard';

const SingleAnkBidsTable = () => {
  const { control } = useForm({
    defaultValues: {
      gameType: '',
      marketTime: 'Open'
    }
  });

  const ankData = Array.from({ length: 10 }, (_, i) => ({
    ank: i,
    totalBids: 0,
    totalBidAmount: 0,
  }));

  return (
    <Card sx={{ mt: 5, p: { xs: 2, sm: 4 }, maxWidth: '1300px', mx: 'auto' }}>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
        Today Bids on Single Ank of Date 21 Oct, 2025
      </Typography>

      <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={5}>
          <Controller
            name="gameType"
            control={control}
            render={({ field }) => (
              <Autocomplete
                {...field}
                options={optionsData}
                onChange={(_, newValue) => field.onChange(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Type"
                    size="small"
                    fullWidth
                  />
                )}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={5}>
          <Controller
            name="marketTime"
            control={control}
            render={({ field }) => (
              <Autocomplete
                {...field}
                options={['Open', 'Close']}
                onChange={(_, newValue) => field.onChange(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Market Time"
                    size="small"
                    fullWidth
                  />
                )}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={12} md={2}>
          <Button
            fullWidth
            variant="contained"
            sx={{
              bgcolor: '#4b57d2',
              color: '#fff',
              textTransform: 'uppercase',
              py: 1.2,
              '&:hover': { bgcolor: '#3b48b5' },
            }}
          >
            Get
          </Button>
        </Grid>
      </Grid>

      {/* Cards Section */}
      <Grid container spacing={2}>
        {ankData.map((item) => (
          <Grid item xs={12} sm={6} md={3} lg={2.4} key={item.ank}>
            {/* <Card
              sx={{
                border: "2px solid #1976d2",
                borderRadius: 2,
                textAlign: "center",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                boxShadow: 2,
                transition: "0.3s",
                "&:hover": {
                  boxShadow: 5,
                  transform: "translateY(-3px)",
                },
              }}
            >
              <CardContent>
                <Typography variant="subtitle1" color="text.secondary">
                  Total Bids {item.totalBids}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 600, my: 1 }}>
                  {item.totalBids}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Bid Amount
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    mt: 1,
                    color: "#1976d2",
                    fontWeight: 600,
                    textDecoration: "underline",
                  }}
                >
                  Ank {item.ank}
                </Typography>
              </CardContent>
            </Card> */}
            <AnkBidSummaryCard
              title="Total Bids 9"
              total={305}
              subTitle="Total Bid Amount"
              ankValue={`Ank ${item.ank}`}
              borderColor="#2196f3"
              enableHoverEffect
            />
          </Grid>
        ))}
      </Grid>
    </Card>
  );
};

export default SingleAnkBidsTable;

const optionsData = [
  'SRIDEVI DAY',
  'TIME BAZAR',
  'MADHUR DAY',
  'MILAN DAY',
  'RAJDHANI DAY',
  'SUPREME DAY',
  'KALIYAN',
  'SRIDEVI NIGHT',
  'MADHUR NIGHT',
  'MILAN NIGHT',
  'KALIYAN NIGHT',
  'MAIN BAZAR',
  'RAJDHANI NIGHT',
  'KARNATAKA DAY',
  'KARNATAKA NIGHT',
];
