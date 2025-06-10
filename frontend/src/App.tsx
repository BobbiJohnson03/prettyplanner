import React from "react";
import { CssBaseline, ThemeProvider, createTheme, Box } from "@mui/material";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import VerticalLines from "./components/VerticalLines";
import PrivateRoute from "./components/PrivateRoute"; // <-- IMPORT PrivateRoute
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/700.css";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import LandingPage from "./pages/LandingPage";
import MyProfile from "./pages/MyProfile";
import DashboardPage from "./pages/DashboardPage";
import About from "./components/About";

// Define custom theme for Material-UI
const theme = createTheme({
  typography: {
    fontFamily: "Inter, sans-serif", // Set Inter as default font
  },
  palette: {
    mode: "dark", // Dark mode
    background: {
      default: "#181818", // Main background color
      paper: "#1c1c1c", // Card/Paper background color
    },
    text: {
      primary: "#f5f5f5", // Primary text color (light)
      secondary: "#aaaaaa", // Secondary text color (greyish)
    },
    primary: {
      main: "#90caf9", // Light blue for primary actions (buttons, links)
    },
    error: {
      main: "#ef5350", // Red for error messages
    }
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          // General styling for text fields in dark mode
          "& .MuiInputBase-input": {
            color: "#f5f5f5", // Input text color
          },
          "& .MuiInputLabel-root": {
            color: "#ccc", // Label color
          },
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#555", // Border color
            },
            "&:hover fieldset": {
              borderColor: "#888", // Border on hover
            },
            "&.Mui-focused fieldset": {
              borderColor: "#90caf9", // Border when focused
            },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px', // Rounded buttons
          textTransform: 'none', // No uppercase text by default
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '12px', // More rounded paper/card elements
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: '12px', // Rounded dialogs
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          color: '#f5f5f5', // Ensure menu item text is visible
        },
      },
    },
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <VerticalLines />
      <Box sx={{ borderBottom: "1px solid #eaeaea" }}>
        <Navbar />
      </Box>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/about" element={<About />} />

        {/* Protected Routes - Wrap in PrivateRoute */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile" element={<MyProfile />} /> {/* Assuming MyProfile also needs protection */}
          {/* Add any other routes that should only be accessible when logged in as children here */}
        </Route>
      </Routes>
    </ThemeProvider>
  );
};

export default App;
