import { Box, Typography, Link } from "@mui/material";
import React from "react";

const Footer: React.FC = () => {
  return (
    <Box textAlign="center" py={4}>
      <Typography variant="body2" sx={{ fontSize: "0.8rem", color: "#aaaaaa" }}>
        Let’s talk →{" "}
        <Link
          href="mailto:luiza.a.lukasik@outlook.com"
          underline="hover"
          sx={{ color: "#90caf9" }}
        >
          luiza.a.lukasik@outlook.com
        </Link>
      </Typography>
    </Box>
  );
};

export default Footer;
