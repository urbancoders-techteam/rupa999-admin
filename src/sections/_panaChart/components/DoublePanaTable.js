import React from "react";
import {
  Box,
  Card,
  Typography,
  Grid,
  Divider,
  Paper,
} from "@mui/material";

const DoublePanaData = [
  ["128", "129", "120", "130", "140", "123", "124", "125", "126", "127"],
  ["137", "138", "139", "149", "159", "150", "160", "134", "135", "136"],
  ["146", "147", "148", "158", "168", "169", "179", "170", "180", "145"],
  ["236", "156", "157", "167", "230", "178", "250", "189", "234", "190"],
  ["245", "237", "238", "239", "249", "240", "269", "260", "270", "235"],
  ["290", "246", "247", "248", "258", "259", "278", "279", "289", "280"],
  ["380", "345", "256", "257", "267", "268", "340", "350", "360", "370"],
  ["470", "390", "346", "347", "348", "349", "359", "369", "379", "389"],
  ["489", "480", "490", "356", "357", "358", "368", "378", "450", "460"],
  ["560", "570", "580", "590", "456", "367", "458", "459", "469", "479"],
  ["579", "589", "670", "680", "690", "457", "467", "468", "478", "569"],
  ["678", "679", "689", "789", "780", "790", "890", "567", "568", "578"],
];

export default function DoublePanaTable() {
  return (
    <Card
      elevation={3}
      sx={{
        borderRadius: 2,
        overflow: "hidden",
        p: 2.5,
        mt: 2,
      }}
    >
      <Typography
        variant="h6"
        sx={{ fontWeight: 700, mb: 2, color: "grey.800" }}
      >
        Double Pana
      </Typography>

      <Box sx={{ width: '100%', overflowX: 'auto', pb: 1 }}>
        {DoublePanaData.map((row, rowIndex) => (
          <Paper
            key={rowIndex}
            variant="outlined"
            sx={{
              p: { xs: 1, sm: 1.5 },
              mb: { xs: 1, sm: 1.5 },
              bgcolor: "background.paper",
              borderRadius: 1.5,
              minWidth:{xs:300, sm: 500},
              boxShadow: 0,
            }}
          >
            <Grid container spacing={{ xs: 1, sm: 1.5 }} alignItems="center">
              {row.map((num, colIndex) => (
                <Grid
                  item
                  xs={1.5}
                  sm={12 / (row.length + 1)}
                  key={colIndex}
                  sx={{ textAlign: "center", minWidth: { xs: 75, sm: 85 } }}
                >
                  <Typography
                    variant="body1"
                    sx={{ color: "red", fontWeight: 600, fontSize: { xs: 14, sm: 16 } }}
                  >
                    {num}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "black", fontSize: { xs: 12, sm: 14 } }}>
                    0
                  </Typography>
                </Grid>
              ))}

              {/* Total Column */}
              <Grid item xs={12 / (row.length + 1)} sx={{ textAlign: "center", minWidth: { xs: 55, sm: 75 } }}>
                <Typography
                  variant="body1"
                  sx={{ color: "red", fontWeight: 600, fontSize: { xs: 14, sm: 16 } }}
                >
                  Total
                </Typography>
                <Typography variant="body2" sx={{ color: "black", fontSize: { xs: 12, sm: 14 } }}>
                  0
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        ))}
      </Box>

      <Divider sx={{ my: 2 }} />

      <Typography
        variant="h6"
        sx={{
          textAlign: "center",
          fontWeight: 700,
          color: "red",
        }}
      >
        Grand Total: 0
      </Typography>
    </Card>
  );
}
