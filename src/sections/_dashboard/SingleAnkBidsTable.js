import React from 'react';
import {
  Grid,
  Card,
  Typography,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import AnkBidSummaryCard from './AnkBidSummaryCard';

const SingleAnkBidsTable = () => {
  const [gameType, setGameType] = React.useState('');
  const [marketTime, setMarketTime] = React.useState('Open');

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
          <FormControl fullWidth size="small">
            <InputLabel>Select Type</InputLabel>
            <Select
              value={gameType}
              label="Select Type"
              onChange={(e) => setGameType(e.target.value)}
            >
              <MenuItem value="Game 1">Game 1</MenuItem>
              <MenuItem value="Game 2">Game 2</MenuItem>
              <MenuItem value="Game 3">Game 3</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={5}>
          <FormControl fullWidth size="small">
            <InputLabel>Market Time</InputLabel>
            <Select
              value={marketTime}
              label="Market Time"
              onChange={(e) => setMarketTime(e.target.value)}
            >
              <MenuItem value="Open">Open</MenuItem>
              <MenuItem value="Close">Close</MenuItem>
            </Select>
          </FormControl>
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
