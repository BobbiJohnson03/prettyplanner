import { Box, Typography } from "@mui/material";
import React from "react";

const Message: React.FC = () => {
  return (
    <Box textAlign="center">
      <Typography
        sx={{
          fontWeight: 400,
          fontSize: { xs: "1.5rem", md: "2rem" },
          color: "#f5f5f5",
        }}
      >
        text text text
      </Typography>
    </Box>
  );
};

export default Message;
