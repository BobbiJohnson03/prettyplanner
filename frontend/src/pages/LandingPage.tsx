import React from "react";
import { Container, Box } from "@mui/material";
import Hero from "../components/Hero";
import About from "../components/About";
import Message from "../components/Message";
import Footer from "../components/Footer";

const LandingPage: React.FC = () => {
  return (
    <>
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
