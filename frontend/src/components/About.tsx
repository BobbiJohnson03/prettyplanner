import { Box, Typography } from "@mui/material";
import React from "react";

const About: React.FC = () => {
  return (
    <Box textAlign="center" px={2} py={5}>
      <Typography
        variant="h4"
        sx={{
          fontWeight: 600,
          fontSize: { xs: "1.75rem", md: "2.5rem" },
          mb: 3,
          color: "#f5f5f5",
        }}
      >
        About Pretty Planner
      </Typography>

      <Typography
        sx={{
          color: "#cccccc",
          fontSize: "1.1rem",
          maxWidth: "700px",
          mx: "auto",
          lineHeight: 1.8,
        }}
      >
        <strong>Pretty Planner is where beauty meets productivity</strong> — a
        tool designed to help you better organize your day, set goals, and track
        your progress. <br />
        <br />
        With its aesthetic interface, Kanban board, goal tracking system, and
        smart notifications, your daily tasks become clearer and more enjoyable
        to accomplish. <br />
        <br />
        This app was created for those who value both{" "}
        <strong>functionality and design</strong> — because planning your life
        should feel as good as it looks ♡.
      </Typography>
    </Box>
  );
};

export default About;
