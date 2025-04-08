import { Box, Typography } from "@mui/material";
import React from "react";

const About: React.FC = () => {
  return (
    <Box textAlign="center">
      <Typography
        variant="h5"
        sx={{ fontWeight: 500, fontSize: { xs: "1.5rem", md: "2rem" }, mb: 2 }}
      >
        Przykładowy Tekst
      </Typography>

      <Typography
        sx={{
          color: "#666",
          fontSize: "1rem",
          maxWidth: "600px",
          mx: "auto",
          lineHeight: 1.6,
        }}
      >
        więcej tekstu
      </Typography>
    </Box>
  );
};

export default About;
