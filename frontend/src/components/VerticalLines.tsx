import { Box } from "@mui/material";
import React from "react";

const VerticalLines: React.FC = () => {
  return (
    <>
      <Box
        sx={{
          position: "fixed",
          top: 0,
          bottom: 0,
          left: "calc((100% - 1490px) / 2)",
          width: "1px",
          bgcolor: "#eaeaea",
          zIndex: 1200,
        }}
      />
      <Box
        sx={{
          position: "fixed",
          top: 0,
          bottom: 0,
          right: "calc((100% - 1490px) / 2)",
          width: "1px",
          bgcolor: "#eaeaea",
          zIndex: 1200,
        }}
      />
      <Box
        sx={{
          position: "fixed",
          top: 0,
          bottom: 0,
          left: "50%",
          transform: "translateX(-0.5px)",
          width: "1px",
          bgcolor: "#eaeaea",
          zIndex: 1200,
        }}
      />
    </>
  );
};

export default VerticalLines;
