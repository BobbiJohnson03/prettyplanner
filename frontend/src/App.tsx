import React from "react";
import { CssBaseline, ThemeProvider, createTheme, Box } from "@mui/material";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import VerticalLines from "./components/VerticalLines";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/700.css";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import LandingPage from "./pages/LandingPage";
import MyProfile from "./pages/MyProfile";
import DashboardPage from "./pages/DashboardPage.tsx";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const theme = createTheme({
  typography: {
    fontFamily: "Inter, sans-serif",
  },
 palette: {
  mode: "dark",
  background: {
    default: "#181818",
    paper: "#1c1c1c",
  },
  text: {
    primary: "#f5f5f5",
    secondary: "#aaaaaa",
  },
}
});

const App: React.FC = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <VerticalLines />
        <Box sx={{ borderBottom: "1px solid #eaeaea" }}>
          <Navbar />
        </Box>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<MyProfile />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </ThemeProvider>
    </LocalizationProvider>
  );
};

export default App;
