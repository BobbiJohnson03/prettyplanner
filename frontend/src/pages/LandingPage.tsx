import React, { useEffect } from "react";
import { Container, Box } from "@mui/material";
import Hero from "../components/Hero";
import About from "../components/About";
import Message from "../components/Message";
import Footer from "../components/Footer";

const LandingPage: React.FC = () => {


  return (
    <>
     {/* ANIMACJA SANDBALL */}
<Box
  sx={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#181818",
    py: 10,
  }}
>
  <Container maxWidth="lg">
    <Box
      sx={{
        width: "1300px",
        height: "1400px",
        borderRadius: "10px",
        overflow: "hidden",
        boxShadow: 3,
      }}
    >
      <iframe
        src="https://my.spline.design/untitled-GkvjT8yftlQbDqFb1zBEwLY3/"
        frameBorder="0"
        width="100%"
        height="100%"
        style={{ borderRadius: "20px" }}
      ></iframe>
    </Box>
  </Container>
</Box>


      <Box sx={{ borderBottom: "1px solid #eaeaea", py: 10 }}>
        <Container maxWidth="md">
          <Hero />
        </Container>
      </Box>
      <Box sx={{ borderBottom: "1px solid #eaeaea", py: 10 }}>
        <Container maxWidth="md">
          <About />
        </Container>
      </Box>
      <Box sx={{ borderBottom: "1px solid #eaeaea", py: 10 }}>
        <Container maxWidth="md">
          <Message />
        </Container>
      </Box>
      <Box sx={{ py: 10 }}>
        <Container maxWidth="md">
          <Footer />
        </Container>
      </Box>
    </>
  );
};

export default LandingPage;
