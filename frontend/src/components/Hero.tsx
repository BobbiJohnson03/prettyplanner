import { Typography, Box } from "@mui/material";
import React from "react";

const Hero: React.FC = () => {
  return (
    <Box
      sx={{
        height: "80vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        textAlign: "center",
        px: 2,
      }}
    >
      <Typography
        component="h1"
        sx={{
          fontSize: { xs: "2.5rem", md: "4.5rem" },
          fontWeight: 600,
          color: "#f5f5f5",
          mb: 2,
        }}
      >
        Landing Page
      </Typography>
      <Typography sx={{ fontSize: "1rem", color: "#f5f5f5" }}>new york</Typography>
    </Box>
  );
};

export default Hero;
