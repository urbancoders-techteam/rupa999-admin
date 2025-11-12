import React from "react";
import PropTypes from "prop-types";
import { Box, Stack, Typography, Avatar } from "@mui/material";
// import WorkOutlineIcon from "@mui/icons-material";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
// import TwitterIcon from "@mui/icons-material/Twitter";

export default function MobileViewCards({
  title = "Manager - Business Development",
  salary = "$3000 - $3500 per month",
  location = "Pasadena Oklahoma",
  jobType = "Full Time or remote",
  experience = "5 - 6 years",
  company = "Twitter",
//   companyIcon = <TwitterIcon sx={{ color: "#1DA1F2" }} />,
  hoverEffect = true,
  borderColor = "#9C6BFF",
}) {
  return (
    <Box
      sx={(theme) => ({
        border: `2px solid ${borderColor}`,
        borderRadius: theme.shape.borderRadius * 2,
        p: 3,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[1],
        transition: hoverEffect ? theme.transitions.create(['transform', 'box-shadow', 'border-color']) : 'none',
        "&:hover": hoverEffect
          ? {
              transform: "translateY(-6px)",
              boxShadow: theme.shadows[4],
              borderColor: theme.palette.primary.main,
            }
          : {},
        maxWidth: 400,
        mx: "auto",
      })}
    >
      {/* Job Title */}
      <Typography
        variant="subtitle1"
        fontWeight={700}
        sx={(theme) => ({ 
          color: theme.palette.text.primary, 
          mb: 1 
        })}
      >
        {title}
      </Typography>

      {/* Salary */}
      <Stack direction="row" alignItems="center" spacing={1} mb={1}>
        {/* <WorkOutlineIcon fontSize="small" sx={(theme) => ({ color: theme.palette.text.secondary })} /> */}
        <Typography variant="body2" sx={(theme) => ({ color: theme.palette.text.secondary })}>
          {salary}
        </Typography>
      </Stack>

      {/* Location + Job Type */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={1.5}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <LocationOnOutlinedIcon fontSize="small" sx={(theme) => ({ color: theme.palette.text.secondary })} />
          <Typography variant="body2" sx={(theme) => ({ color: theme.palette.text.secondary })}>
            {location}
          </Typography>
        </Stack>

        <Typography
          variant="body2"
          sx={(theme) => ({ 
            color: theme.palette.warning.main, 
            fontWeight: theme.typography.fontWeightMedium 
          })}
        >
          {jobType}
        </Typography>
      </Stack>

      <Box
        sx={(theme) => ({
          height: "1px",
          backgroundColor: theme.palette.divider,
          my: 1.5,
        })}
      />

      {/* Experience + Company */}
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack direction="row" alignItems="center" spacing={1}>
          {/* <CalendarMonthOutlinedIcon fontSize="small" sx={(theme) => ({ color: theme.palette.text.secondary })} /> */}
          <Typography variant="body2" sx={(theme) => ({ color: theme.palette.text.secondary })}>
            {experience}
          </Typography>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="body2" sx={(theme) => ({ fontWeight: theme.typography.fontWeightMedium })}>
            {company}
          </Typography>
          <Avatar
            sx={(theme) => ({
              bgcolor: 'transparent',
              width: 26,
              height: 26,
              borderRadius: theme.shape.borderRadius,
            })}
          >
            {/* {companyIcon} */}
          </Avatar>
        </Stack>
      </Stack>
    </Box>
  );
}

MobileViewCards.propTypes = {
  title: PropTypes.string,
  salary: PropTypes.string,
  location: PropTypes.string,
  jobType: PropTypes.string,
  experience: PropTypes.string,
  company: PropTypes.string,
//   companyIcon: PropTypes.node,
  hoverEffect: PropTypes.bool,
  borderColor: PropTypes.string,
};
