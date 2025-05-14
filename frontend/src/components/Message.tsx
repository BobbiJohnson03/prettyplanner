import { Box, Typography } from "@mui/material";
import React from "react";

const Message: React.FC = () => {
  return (
    <Box textAlign="center">
      <Typography
        sx={{
          fontWeight: 400,
          fontSize: { xs: "1rem", md: "2rem" },
          color: "#f5f5f5",
        }}
      >
        more info coming soon
      </Typography>
    </Box>
  );
};

export default Message;
