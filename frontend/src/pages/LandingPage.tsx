import React from "react";
import { Container, Box, Typography } from "@mui/material";
import Hero from "../components/Hero";
import About from "../components/About";
import Message from "../components/Message";
import Footer from "../components/Footer";

const LandingPage: React.FC = () => {
  return (
    <>
      {/* 🗽 TYTUŁ PRZED ANIMACJĄ */}
      <Box
        sx={{
          backgroundColor: "#181818",
          pt: 8, // zmniejszony padding top
          pb: 4, // zmniejszony padding bottom
          textAlign: "center",
        }}
      >
        <Typography
          variant="h2"
          sx={{
            fontWeight: "bold",
            color: "#f5f5f5",
          }}
        >
          Welcome to Pretty Planner
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            color: "#ccc",
            mt: 2,
            maxWidth: "600px",
            mx: "auto",
          }}
        >
          Where productivity meets beauty — and your day finds its rhythm.
        </Typography>
      </Box>

      {/* 🌀 ANIMACJA SANDBALL */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#181818",
          py: 6,
        }}
      >
        <Box
          sx={{
            width: "100vw", // pełna szerokość ekranu
            height: "1000px", // lub np. "100vh" jeśli chcesz pełen ekran
            borderRadius: 0, // bez zaokrągleń jeśli chcesz pełne dopasowanie
            overflow: "hidden",
            boxShadow: 5,
          }}
        >
          <iframe
            src="https://my.spline.design/untitled-GkvjT8yftlQbDqFb1zBEwLY3/"
            frameBorder="0"
            width="100%"
            height="100%"
            style={{ display: "block" }}
          ></iframe>
        </Box>
      </Box>

      {/* POZOSTAŁE SEKCJE */}
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
