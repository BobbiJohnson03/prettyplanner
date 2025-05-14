import React from "react";
import { Container, Box, Typography } from "@mui/material";
import Hero from "../components/Hero";
import About from "../components/About";
import Message from "../components/Message";
import Footer from "../components/Footer";

const LandingPage: React.FC = () => {
  return (
    <>
      {/* 🌀 ANIMACJA + TEKST W TLE */}
      <Box
        sx={{
          position: "relative",
          backgroundColor: "#181818",
          height: "1200px",
          overflow: "hidden",
        }}
      >
        {/* TEKST Z TYŁU */}
        <Box
          sx={{
            position: "absolute",
            top: "10%",
            width: "100%",
            textAlign: "center",
            zIndex: 1,
            px: 2,
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
            variant="h5"
            sx={{
              color: "#ccc",
              mt: 2,
              maxWidth: "700px",
              mx: "auto",
              lineHeight: 1.6,
              fontWeight: 400,
            }}
          >
            Enjoy us and get into zen mode 🧘‍♀️: less stress, more flow.
          </Typography>

          <Typography
            variant="subtitle1"
            sx={{
              color: "#bbb",
              mt: 1,
              maxWidth: "700px",
              mx: "auto",
              fontSize: "1.2rem",
              lineHeight: 1.6,
            }}
          >
            Plan your time with clarity, ease, and a little bit of beauty.
          </Typography>
        </Box>

        {/* KULKA Z PRZODU */}
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: "100%",
            zIndex: 2,
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
